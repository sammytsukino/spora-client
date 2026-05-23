const upper = (n: number) => "A".repeat(n)
const lower = (n: number) => "a".repeat(n)
const digit = (n: number) => "1".repeat(n)
const SYM_BANG = "!"
const SYM_AT = "@"

export const STRONG_FIXTURE = upper(1) + lower(7) + digit(1) + SYM_BANG
export const STRONG_FIXTURE_ALT = upper(1) + lower(7) + digit(1) + SYM_AT
export const TOO_SHORT_FIXTURE = upper(1) + lower(2) + digit(1) + SYM_BANG
export const NO_UPPER_FIXTURE = lower(8) + digit(1) + SYM_BANG
export const NO_LOWER_FIXTURE = upper(8) + digit(1) + SYM_BANG
export const NO_DIGIT_FIXTURE = upper(1) + lower(8) + SYM_BANG
export const NO_SPECIAL_FIXTURE = upper(1) + lower(8) + digit(1)
export const WHITESPACE_FIXTURE =
  upper(1) + lower(3) + " " + lower(3) + digit(1) + SYM_BANG
export const SIMPLE_LOGIN_FIXTURE = "login-test-fixture"
