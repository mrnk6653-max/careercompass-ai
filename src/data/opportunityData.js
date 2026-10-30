const opportunitySources = [
  {
    id: 'aicte-internships', title: 'AICTE National Internship Portal', provider: 'All India Council for Technical Education', type: 'Internships',
    eligibility: 'Student eligibility and application terms are shown on each live posting.', deadline: 'Varies by listing', status: 'Official live portal',
    description: 'Search current internship postings by skill, city, company, and domain. Open the portal to check which listings are accepting applications now.',
    url: 'https://internship.aicte-india.org/internships', keywords: ['internship', 'technology', 'engineering', 'computer', 'design', 'business', 'science', 'student', 'course'],
  },
  {
    id: 'ncs-jobs', title: 'National Career Service: Jobs & Internships', provider: 'Ministry of Labour & Employment, Government of India', type: 'Jobs & internships',
    eligibility: 'Search by education, skills, job title, and preferred location; check each vacancy for requirements.', deadline: 'Varies by listing', status: 'Official live portal',
    description: 'Browse current government and private vacancies, internships, job fairs, and career services. Use your course or favorite subject as a search term.',
    url: 'https://www.ncs.gov.in/', keywords: ['jobs', 'internship', 'government', 'private', 'course', 'commerce', 'science', 'arts', 'skills'],
  },
  {
    id: 'ssc-notices', title: 'SSC Recruitment Notices & Exams', provider: 'Staff Selection Commission, Government of India', type: 'Government exams',
    eligibility: 'Qualifications differ by exam and post, from school-level to graduate-level. Confirm age and education rules in the active notice.', deadline: 'Check current notice', status: 'Official notices',
    description: 'Track central-government recruitment exams and official notices. The live notice board includes exam updates; not every notice is accepting applications.',
    url: 'https://ssc.gov.in/', keywords: ['government', 'class 10', 'class 12', 'graduate', 'math', 'reasoning', 'public service', 'exam'],
  },
  {
    id: 'upsc-exams', title: 'UPSC Active & Upcoming Examinations', provider: 'Union Public Service Commission, Government of India', type: 'Government exams',
    eligibility: 'Each examination has different education, age, and other conditions. Many UPSC examinations require graduation; read the official notice.', deadline: 'Varies by examination', status: 'Official exam calendar',
    description: 'Review active and forthcoming national examinations and recruitment notices. Use this to plan future eligibility, and verify every date on the official page.',
    url: 'https://upsc.gov.in/examinations/active-exams', keywords: ['government', 'public service', 'history', 'civics', 'political science', 'engineering', 'science', 'graduate', 'exam'],
  },
  {
    id: 'nsp-renewal-2026', title: 'National Scholarship Portal: 2026–27 Renewal Window', provider: 'Ministry of Education and participating Government of India schemes', type: 'Scholarships',
    eligibility: 'Renewal applicants only for the schemes with an open window; eligibility, category, course, marks, and institute rules vary by scheme. Verify before applying.', deadline: '31 October 2026', deadlineAt: '2026-10-31T23:59:00+05:30', status: 'Open now — renewal only',
    description: 'The official portal lists renewal schemes whose student application window closes on 31 October 2026. This is not a general fresh-application notice; check the scheme page and your eligibility.',
    url: 'https://scholarships.gov.in/All-Scholarships', keywords: ['scholarship', 'college', 'university', 'undergraduate', 'renewal', 'student', 'course'],
  },
]

const tokenize = value => String(value || '').toLowerCase().split(/[^a-z0-9+#]+/).filter(term => term.length > 2 && !['the', 'and', 'class', 'year', 'course', 'from', 'your'].includes(term))
const subjectAliases = {
  biology: ['science', 'health', 'life'], maths: ['mathematics', 'numeracy', 'finance'], mathematics: ['math', 'numeracy', 'finance', 'engineering'],
  physics: ['engineering', 'technology', 'science'], chemistry: ['science', 'health', 'agriculture'], commerce: ['business', 'finance'],
  history: ['public', 'civics', 'government'], civics: ['public', 'history', 'government'], economics: ['business', 'finance'],
  computer: ['technology', 'internship'], technology: ['computer', 'internship'], engineering: ['technology', 'science'],
  arts: ['humanities', 'media', 'communication'], english: ['communication', 'media', 'writing'],
}

export function getPersonalizedOpportunities(profile = []) {
  const profileText = [profile.currentClass, profile.favoriteSubject, profile.course, profile.degree, profile.interests].filter(Boolean).join(' ')
  const terms = [...new Set(tokenize(profileText).flatMap(term => [term, ...(subjectAliases[term] || [])]))]
  const hasCollegeStudy = /college|university|undergraduate|bachelor|b\. ?tech|btech|bsc|bcom|ba\b|semester|degree|year/i.test(profileText)
  const today = new Date()
  return opportunitySources.map(item => {
    const keywords = new Set(tokenize(item.keywords.join(' ')))
    const matchedTerms = terms.filter(term => keywords.has(term))
    let profileScore = matchedTerms.length
    if (item.id === 'nsp-renewal-2026') profileScore += hasCollegeStudy ? 4 : -2
    if (item.id === 'ssc-notices' && /class\s*(10|12)|10th|12th|school/i.test(profileText)) profileScore += 3
    const expired = item.deadlineAt ? today.getTime() > new Date(item.deadlineAt).getTime() : false
    return {
      ...item,
      status: expired ? 'Deadline passed — check for next cycle' : item.status,
      profileScore,
      matchReason: matchedTerms.length ? `Matches your ${[profile.favoriteSubject, profile.course].filter(Boolean).join(' and ') || 'study profile'}` : '',
      isExpired: expired,
    }
  }).sort((a, b) => b.profileScore - a.profileScore)
}
