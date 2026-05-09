export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128
const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/


export function validatePasswordClient(password: string): string | null {
  if (typeof password !== "string") return "Password is required."
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter."
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter."
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number."
  }
  if (!SPECIAL_CHAR_PATTERN.test(password)) {
    return "Password must include at least one special character (e.g. ! @ # $ %)."
  }
  if (/\s/.test(password)) {
    return "Password must not contain spaces."
  }
  return null
}

export const PASSWORD_HINT =
  "8+ chars · upper, lower, number and special character (e.g. ! @ # $)."
