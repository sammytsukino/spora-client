import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import MainButton from "@/components/ui/MainButton"
import UnderlineField from "@/components/ui/UnderlineField"
import { signUp } from "@/lib/auth"
import { ROUTES } from "@/constants/routes"

const AUTH_CONTAINER_CLASS =
  "w-full max-w-[1000px] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 bg-spora-primary-light border border-spora-primary"
const AUTH_LAYOUT_CLASS = "flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 md:gap-16"
const FORM_ERROR_CLASS = "mb-6 text-sm text-rose-600 font-supply-mono"
const MIN_USERNAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 8
const USERNAME_ALLOWED_PATTERN = /^[a-zA-Z0-9_]+$/

export default function SignUpForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.trim().length < MIN_USERNAME_LENGTH) {
      setError("Username must be at least 3 characters.")
      return
    }

    if (!USERNAME_ALLOWED_PATTERN.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.")
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signUp({
        username,
        displayName: name,
        email,
        password,
      })
      if (result.emailSent) {
        navigate(ROUTES.SIGN_IN, {
          state: {
            message:
              "Check your email and click the verification link to activate your account.",
          },
        })
      } else if (result.token && result.user) {
        navigate(ROUTES.GARDEN)
      } else {
        navigate(ROUTES.SIGN_IN)
      }
    } catch {
      setError("Could not create account. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={AUTH_CONTAINER_CLASS}>
        <div className={AUTH_LAYOUT_CLASS}>
          <div className="min-w-0 sm:min-w-[200px] shrink-0">
            <h1 className="text-2xl sm:text-3xl text-spora-text-primary font-bold leading-tight mb-2 font-bizud-mincho-bold">
              Join SPORA
            </h1>
            <p className="text-[14px] font-supply-mono leading-relaxed text-spora-text-primary">
              Start cultivating
              <br />
              with us
            </p>
          </div>

          <form onSubmit={handleSignUp} className="flex-1 min-w-0">
            {error ? (
              <p className={FORM_ERROR_CLASS} role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex flex-col gap-6 sm:gap-8">
                  <UnderlineField
                    label="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="e.g. cultivator_01"
                    hint="3+ chars. Letters, numbers, underscores."
                    hintVisibleOnFocus
                    required
                  />
                  <UnderlineField
                    label="Name"
                    autoComplete="name"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="e.g. Dawn"
                    required
                  />
                  <UnderlineField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="e.g. dawn@example.com"
                    hint="Use a valid email (e.g. dawn@domain.com)."
                    hintVisibleOnFocus
                    required
                  />
                </div>
                <div className="flex flex-col gap-6 sm:gap-8">
                  <UnderlineField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    hint="Minimum 8 characters."
                    hintVisibleOnFocus
                    required
                  />
                  <UnderlineField
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    hint="Must match the password above."
                    hintVisibleOnFocus
                    required
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <MainButton
                  type="submit"
                  variant="compact"
                  size="sm"
                  className="w-full sm:w-auto border-spora-primary text-spora-primary hover:bg-spora-primary hover:text-spora-primary-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
                </MainButton>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 font-supply-mono text-sm text-spora-primary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
  )
}
