let activePrefix = null
const migrationKey = 'cc-auth-legacy-migrated'
const legacyKeys = [
  'cc-tasks', 'cc-discovery-count', 'cc-saved-careers', 'cc-saved-opportunities',
  'cc-last-discovery', 'cc-last-quiz', 'cc-study-plan', 'cc-plan-goal',
  'cc-plan-skills', 'cc-companion-v2', 'cc-name', 'cc-reminders', 'cc-language',
]

export function activateUserStorage(userId) {
  activePrefix = `cc-user-${userId}:`
  if (localStorage.getItem(migrationKey)) return
  for (const key of legacyKeys) {
    const value = localStorage.getItem(key)
    if (value !== null && localStorage.getItem(`${activePrefix}${key}`) === null) {
      localStorage.setItem(`${activePrefix}${key}`, value)
    }
  }
  localStorage.setItem(migrationKey, String(userId))
}

export function deactivateUserStorage() {
  activePrefix = null
}

export function getUserItem(key) {
  return activePrefix ? localStorage.getItem(`${activePrefix}${key}`) : null
}

export function setUserItem(key, value) {
  if (activePrefix) localStorage.setItem(`${activePrefix}${key}`, value)
}

export function clearUserStorage() {
  if (!activePrefix) return
  const keys = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith(activePrefix)) keys.push(key)
  }
  keys.forEach(key => localStorage.removeItem(key))
}
