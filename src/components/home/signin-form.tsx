import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainButton from "@/components/ui/main-button"

export default function SignInForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login:", { email, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 font-jetbrains-mono">
          Enter SPORA
        </h1>
        <p className="text-center text-neutral-600 mb-12 font-jetbrains-mono">
          Welcome back, cultivator
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-jetbrains-mono mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border-2 border-neutral-900 bg-transparent focus:outline-none focus:ring-0 font-jetbrains-mono"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-jetbrains-mono mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border-2 border-neutral-900 bg-transparent focus:outline-none focus:ring-0 font-jetbrains-mono"
              required
            />
          </div>

          {/* Login Button */}
          <MainButton
            type="submit"
            className="w-full h-12"
          >
            LOGIN
          </MainButton>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-8 font-jetbrains-mono text-sm">
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
    </div>
  )
}
