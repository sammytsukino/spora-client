import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import MainButton from "@/components/ui/MainButton"
import UnderlineField from "@/components/ui/UnderlineField"
import { signIn } from "@/lib/auth"

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
      navigate("/garden")
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
    <div className="w-full max-w-[1000px] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 bg-[#E9E9E9] border border-[var(--spora-primary)]">
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 md:gap-16">
          <div className="min-w-0 sm:min-w-[200px] shrink-0">
            <h1 className="text-2xl sm:text-3xl text-[#262626] font-bold leading-tight mb-2 font-bizud-mincho-bold">
              Enter SPORA
            </h1>
            <p className="text-[14px] font-supply-mono leading-relaxed text-[#262626]">
              Welcome back,
              <br />
              cultivator
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex-1 min-w-0">
            {message ? (
              <p className="mb-4 text-sm text-lime-700 font-supply-mono">
                {message}
              </p>
            ) : null}
            {error ? (
              <div className="mb-4 text-sm text-red-700 font-supply-mono">
                <p>{error}</p>
                {error.includes("verify your email") && (
                  <button
                    type="button"
                    onClick={() => navigate("/verify-email")}
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. cultivator_01"
                  required
                />
                <UnderlineField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <MainButton
                  type="submit"
                  variant="compact"
                  size="sm"
                  className="w-full sm:w-auto border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-[#E9E9E9]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "LOGGING IN..." : "LOGIN"}
                </MainButton>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 font-supply-mono text-sm text-[#262626]">
          Don't have account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
  )
}
