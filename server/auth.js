const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const db = require("./db");

const SESSION_DAYS = 30;
const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-cc_session" : "cc_session";
const COOKIE_SECURE = process.env.NODE_ENV === "production";
const authAttempts = new Map();
const dummyPasswordHash = bcrypt.hashSync(crypto.randomBytes(24).toString("hex"), 12);
const profileKeys = ["degree", "year", "interests", "skills", "experience", "goals", "currentClass", "favoriteSubject", "course"];
const disposableEmailDomains = new Set([
  "10minutemail.com", "10minutemail.net", "10minutemail.org", "1secmail.com", "1secmail.net", "getnada.com",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "grr.la", "maildrop.cc", "mailinator.com",
  "mohmal.com", "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmailo.com", "tempmail.plus", "tempail.com",
  "throwawaymail.com", "yopmail.com", "yopmail.fr", "fakeinbox.com", "dispostable.com", "mintemail.com",
  "sharklasers.com", "emailondeck.com", "mail.tm", "burnermail.io", "inboxkitten.com", "trashmail.com",
  "trashmail.me", "trashmail.net", "discard.email", "discardmail.com", "mailnesia.com", "mytemp.email",
  "tempr.email", "tempmail.net", "tempmailaddress.com", "emailfake.com", "crazymailing.com", "mailcatch.com",
  "mailsac.com", "harakirimail.com", "jetable.org", "getairmail.com", "tmailor.com", "tmpmail.net",
  "tmpmail.org", "tempinbox.com", "spamgourmet.com", "anonaddy.me",
]);

function passwordIsStrong(password) {
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) return false;
  const variety = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  if (variety.filter(Boolean).length < 3) return false;
  if (/^(.)\1+$/.test(password) || /^(password|qwerty|letmein|welcome|admin)/i.test(password)) return false;
  return true;
}

function isDisposableEmail(email) {
  const domain = email.split("@").pop().toLowerCase().replace(/\.$/, "");
  return /(^|[.-])(temp|temporary|disposable|throwaway|trash|burner|fakeinbox|minute)([.-]|$)/i.test(domain)
    || [...disposableEmailDomains].some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`));
}

function isAllowedEmailDomain(email) {
  const domain = email.split("@").pop().toLowerCase().replace(/\.$/, "");
  return domain === "gmail.com"
    || domain === "outlook.com"
    || domain.endsWith(".in")
    || /\.(edu|gov|mil|ac)$/.test(domain)
    || domain.endsWith(".nic.in");
}

function profileFromRow(row) {
  return {
    degree: row.degree,
    year: row.academic_year,
    interests: row.interests,
    skills: row.technical_skills,
    experience: row.experience_level,
    goals: row.career_goals,
    currentClass: row.current_class,
    favoriteSubject: row.favorite_subject,
    course: row.course,
  };
}

function publicUser(row) {
  return { id: row.id, name: row.display_name, email: row.email, profile: profileFromRow(row), createdAt: row.created_at };
}

function readCookie(req) {
  const pair = (req.headers.cookie || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`));
  if (!pair) return "";
  try { return decodeURIComponent(pair.slice(COOKIE_NAME.length + 1)); } catch { return ""; }
}

function writeCookie(res, token, maxAge) {
  const secure = COOKIE_SECURE ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`);
}

function revokeRequestSession(req) {
  const token = readCookie(req);
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(crypto.createHash("sha256").update(token).digest("hex"));
}

function consumeAuthAttempt(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (authAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 10) return res.status(429).json({ success: false, message: "Too many sign-in attempts. Please wait 15 minutes and try again." });
  recent.push(now);
  authAttempts.set(key, recent);
  next();
}

function requireAllowedOrigin(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.get("origin");
    if (origin && allowedOrigins.has(origin)) return next();
    return res.status(403).json({ success: false, message: "Request origin is not allowed." });
  };
}

function readProfile(source) {
  const values = {};
  for (const key of profileKeys) values[key] = typeof source?.[key] === "string" ? source[key].trim().slice(0, 160) : "";
  return values;
}

function registerSession(userId, req, res) {
  revokeRequestSession(req);
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(tokenHash, userId, expiresAt);
  writeCookie(res, token, SESSION_DAYS * 24 * 60 * 60);
}

function findSessionUser(req) {
  const token = readCookie(req);
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = db.prepare(`SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`).get(tokenHash, Date.now());
  if (!session) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
  return session || null;
}

function requireAuth(req, res, next) {
  const user = findSessionUser(req);
  if (!user) return res.status(401).json({ success: false, message: "Please sign in to continue." });
  req.user = user;
  next();
}

function mountAuthRoutes(app, allowedOrigins) {
  const sameOrigin = requireAllowedOrigin(allowedOrigins);

  app.post("/api/auth/register", sameOrigin, consumeAuthAttempt, async (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (displayName.length < 2 || displayName.length > 80) return res.status(400).json({ success: false, message: "Enter a name between 2 and 80 characters." });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
    if (isDisposableEmail(email)) return res.status(400).json({ success: false, message: "Please use a personal or school email address. Temporary email services are not accepted." });
    if (!isAllowedEmailDomain(email)) return res.status(400).json({ success: false, message: "Use a Gmail or Outlook address, an .in email, or an official education or government email address." });
    if (!passwordIsStrong(password)) return res.status(400).json({ success: false, message: "Use at least 8 characters with at least 3 of these: lowercase, uppercase, number, and symbol. Avoid common or repeated passwords." });

    const profileInput = body.profile && typeof body.profile === "object" && !Array.isArray(body.profile) ? body.profile : body;
    const profile = readProfile(profileInput);
    if (!profile.currentClass || !profile.favoriteSubject || !profile.course) {
      return res.status(400).json({ success: false, message: "Current class, favorite subject, and course are required." });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const insert = db.prepare(`INSERT INTO users (display_name, email, password_hash, degree, academic_year, interests, technical_skills, experience_level, career_goals, current_class, favorite_subject, course)
        VALUES (@displayName, @email, @passwordHash, @degree, @year, @interests, @skills, @experience, @goals, @currentClass, @favoriteSubject, @course)`);
      const result = insert.run({ displayName, email, passwordHash, ...profile });
      registerSession(Number(result.lastInsertRowid), req, res);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(result.lastInsertRowid));
      return res.status(201).json({ success: true, user: publicUser(user) });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return res.status(409).json({ success: false, message: "An account with that email already exists." });
      console.error("Account registration failed:", error.code || "unknown");
      return res.status(500).json({ success: false, message: "Could not create the account. Please try again." });
    }
  });

  app.post("/api/auth/login", sameOrigin, consumeAuthAttempt, async (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || email.length > 254 || Buffer.byteLength(password, "utf8") > 72) return res.status(400).json({ success: false, message: "Enter your email and password." });
    const row = db.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE").get(email);
    const passwordMatches = await bcrypt.compare(password, row ? row.password_hash : dummyPasswordHash);
    if (!passwordMatches) return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    registerSession(row.id, req, res);
    return res.json({ success: true, user: publicUser(row) });
  });

  app.get("/api/auth/me", (req, res) => {
    const user = findSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: "Please sign in." });
    return res.json({ success: true, user: publicUser(user) });
  });

  app.patch("/api/auth/profile", sameOrigin, requireAuth, (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const name = typeof body.displayName === "string" ? body.displayName.trim() : req.user.display_name;
    if (name.length < 2 || name.length > 80) return res.status(400).json({ success: false, message: "Enter a name between 2 and 80 characters." });
    const profileInput = body.profile && typeof body.profile === "object" && !Array.isArray(body.profile) ? body.profile : {};
    const currentProfile = profileFromRow(req.user);
    for (const key of profileKeys) if (typeof profileInput[key] === "string") currentProfile[key] = profileInput[key].trim().slice(0, 160);
    db.prepare(`UPDATE users SET display_name = ?, degree = ?, academic_year = ?, interests = ?, technical_skills = ?, experience_level = ?, career_goals = ?, current_class = ?, favorite_subject = ?, course = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(name, currentProfile.degree, currentProfile.year, currentProfile.interests, currentProfile.skills, currentProfile.experience, currentProfile.goals, currentProfile.currentClass, currentProfile.favoriteSubject, currentProfile.course, req.user.id);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
    return res.json({ success: true, user: publicUser(user) });
  });

  app.post("/api/auth/logout", sameOrigin, (req, res) => {
    revokeRequestSession(req);
    writeCookie(res, "", 0);
    return res.json({ success: true });
  });

  return requireAuth;
}

module.exports = { mountAuthRoutes, requireAuth };
