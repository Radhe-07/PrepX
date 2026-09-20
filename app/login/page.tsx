"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#12131a] px-5 text-[#e3e1ec]">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="mb-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#00f59b]">
            PREPX // SYSTEM ACCESS
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-2 text-sm text-[#8c9b91]">
            Sign in to access your preparation dashboard.
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.05] bg-[#1a1b22] p-5"
        >
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#8c9b91]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vishnu@prepx.com"
                required
                className="w-full rounded-lg border border-white/[0.06] bg-[#12131a] px-3.5 py-3 text-sm text-[#e3e1ec] outline-none transition placeholder:text-[#4f5c54] focus:border-[#00f59b]/40"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#8c9b91]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                required
                className="w-full rounded-lg border border-white/[0.06] bg-[#12131a] px-3.5 py-3 text-sm text-[#e3e1ec] outline-none transition placeholder:text-[#4f5c54] focus:border-[#00f59b]/40"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-[#ffb4ab]/20 bg-[#ffb4ab]/[0.06] px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#ffb4ab]">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00f59b] px-4 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#003920] transition hover:bg-[#00e88f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "ACCESS PREPX"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-[#4f5c54]">
          PRIVATE PREPARATION SYSTEM
        </p>
      </div>
    </main>
  );
}