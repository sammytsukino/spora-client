import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainButton from "@/components/ui/MainButton"
import { signIn } from "@/lib/auth"

export default function SignInForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn(username, password)
      navigate("/garden")
    } catch {
      setError("Invalid credentials or server error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[520px] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 bg-[#E9E9E9] border border-[var(--spora-primary)]">
        <h1 className="text-2xl sm:text-3xl text-[#262626] font-bold text-center mb-2 font-bizud-mincho-bold">
          Enter SPORA
        </h1>
        <p className="text-center text-[#262626] mb-8 font-supply-mono text-sm sm:text-base">
          Welcome back, cultivator
        </p>

        {error ? (
          <p className="mb-4 text-sm text-red-700 font-supply-mono">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:border-[var(--spora-primary)] font-supply-mono"
              required
            />
          </div>

          <MainButton
            type="submit"
            className="w-full h-11 sm:h-12 border border-[#262626]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "LOGGING IN..." : "LOGIN"}
          </MainButton>
        </form>

        <p className="text-center mt-8 font-supply-mono text-sm">
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
