import { useState, useEffect, type ChangeEvent } from "react"
import { useNavigate, useLocation, type Location } from "react-router-dom"
import MainButton from "@/components/ui/MainButton"
import UnderlineField from "@/components/ui/UnderlineField"
import { signIn } from "@/lib/auth"
import { ROUTES } from "@/constants/routes"

const AUTH_CONTAINER_CLASS =
  "w-full max-w-[1000px] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 bg-spora-primary-light border border-spora-primary"
const AUTH_LAYOUT_CLASS = "flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 md:gap-16"
const SUCCESS_MESSAGE_CLASS = "mb-4 text-sm text-lime-700 font-supply-mono"
const ERROR_MESSAGE_CLASS = "mb-4 text-sm text-rose-600 font-supply-mono"
const DISALLOWED_REDIRECT_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
])

export default function SignInForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const stateMessage = (location.state as { message?: string })?.message
    if (stateMessage) {
      setMessage(stateMessage)
      window.history.replaceState({}, "", location.pathname)
    }
  }, [location.state, location.pathname])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn(username, password)
      const fromState = (location.state as { from?: Location; message?: string })?.from
      const fromPath = fromState?.pathname
      const avoidLoop = !fromPath || DISALLOWED_REDIRECT_ROUTES.has(fromPath)
      navigate(avoidLoop ? ROUTES.GARDEN : fromPath, { replace: true })
    } catch (err: unknown) {
      const res = err as { response?: { data?: { code?: string; error?: string } } }
      if (res?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email before signing in.")
      } else {
        setError(res?.response?.data?.error || "Invalid credentials or server error.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={AUTH_CONTAINER_CLASS}>
        <div className={AUTH_LAYOUT_CLASS}>
          <div className="min-w-0 sm:min-w-[200px] shrink-0">
            <h1 className="text-2xl sm:text-3xl text-spora-text-primary font-bold leading-tight mb-2 font-bizud-mincho-bold">
              Enter SPORA
            </h1>
            <p className="text-[14px] font-supply-mono leading-relaxed text-spora-text-primary">
              Welcome back,
              <br />
              cultivator
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex-1 min-w-0">
            {message ? (
              <p className={SUCCESS_MESSAGE_CLASS} aria-live="polite">
                {message}
              </p>
            ) : null}
            {error ? (
              <div className={ERROR_MESSAGE_CLASS} role="alert">
                <p>{error}</p>
                {error.includes("verify your email") && (
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.VERIFY_EMAIL)}
                    className="mt-2 underline hover:no-underline"
                  >
                    Request new verification link
                  </button>
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <UnderlineField
                  label="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="e.g. cultivator_01"
                  required
                />
                <UnderlineField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <MainButton
                  type="submit"
                  variant="compact"
                  size="sm"
                  className="w-full sm:w-auto border-spora-primary text-spora-primary hover:bg-spora-primary hover:text-spora-primary-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "LOGGING IN..." : "LOGIN"}
                </MainButton>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 font-supply-mono text-sm text-spora-text-primary">
          Don't have account?{" "}
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGN_UP)}
            className="hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
  )
}
