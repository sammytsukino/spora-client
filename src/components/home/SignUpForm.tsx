import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainButton from "@/components/ui/MainButton"
import { signUp } from "@/lib/auth"

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

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.")
      return
    }

    if (password.length < 8) {
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
        navigate("/signin", {
          state: {
            message:
              "Check your email and click the verification link to activate your account.",
          },
        })
      } else if (result.token && result.user) {
        navigate("/garden")
      } else {
        navigate("/signin")
      }
    } catch {
      setError("Could not create account. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[640px] px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 bg-[#E9E9E9] border border-[var(--spora-primary)]">
        <h1 className="text-2xl sm:text-3xl text-[#262626] font-bold text-center mb-2 font-bizud-mincho-bold">
          Join SPORA
        </h1>
        <p className="text-center text-[#262626] mb-8 font-supply-mono text-sm sm:text-base">
          Start cultivating with us
        </p>

        {error ? (
          <p className="mb-6 text-sm text-red-700 font-supply-mono">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSignUp} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              className="peer w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:ring-0 font-supply-mono"
              required
            />
            <p className="mt-2 text-xs text-[#262626] font-supply-mono opacity-0 transition-opacity peer-focus:opacity-100">
              3+ characters, letters, numbers, underscores only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:ring-0 font-supply-mono"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="peer w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:ring-0 font-supply-mono"
              required
            />
            <p className="mt-2 text-xs text-[#262626] font-supply-mono opacity-0 transition-opacity peer-focus:opacity-100">
              Use a valid email address (e.g., name@domain.com).
            </p>
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
              className="peer w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:ring-0 font-supply-mono"
              required
            />
            <p className="mt-2 text-xs text-[#262626] font-supply-mono opacity-0 transition-opacity peer-focus:opacity-100">
              Minimum 8 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-supply-mono mb-2">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=""
              className="peer w-full px-4 py-3 border border-[var(--spora-primary)] bg-transparent focus:outline-none focus:ring-0 font-supply-mono"
              required
            />
            <p className="mt-2 text-xs text-[#262626] font-supply-mono opacity-0 transition-opacity peer-focus:opacity-100">
              Must match the password above.
            </p>
          </div>

          <MainButton
            type="submit"
            className="w-full h-11 sm:h-12 border border-[#262626]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
          </MainButton>
        </form>

        <p className="text-center mt-8 font-supply-mono text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
  )
}
