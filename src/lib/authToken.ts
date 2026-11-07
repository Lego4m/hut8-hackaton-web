// Login token kept in this browser. Storage can be unavailable (private mode), so never throw.
const KEY = 'doces-da-lurdes:token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(KEY, token)
  } catch {
    // Ignore: the user stays logged in until the page reloads.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Ignore.
  }
}
