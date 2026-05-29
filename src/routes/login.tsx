import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Trovin'" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/admin" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) setErr(result.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="min-h-screen bg-cream text-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-script text-3xl text-teal block text-center mb-2">Trovin'</Link>
        <div className="rounded-2xl bg-paper border border-line shadow-brand-lg p-8">
          <h1 className="font-display text-3xl text-center">
            {mode === "signin" ? "Welcome back" : "Make an account"}
          </h1>
          <p className="text-center text-sm text-ink-soft mt-1">
            {mode === "signin"
              ? "Sign in to manage your booth or the market."
              : "First sign-up becomes the admin."}
          </p>

          <button
            onClick={onGoogle}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5 text-sm font-semibold hover:border-teal transition"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-mute">
            <div className="h-px flex-1 bg-line" />or<div className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-teal"
                maxLength={80}
              />
            )}
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-teal"
              maxLength={200}
            />
            <input
              type="password"
              required
              placeholder="Password (min 6)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              maxLength={100}
              className="w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-teal"
            />
            {err && <p className="text-sm text-danger">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-navy text-cream py-2.5 text-sm font-semibold hover:bg-navy-700 transition disabled:opacity-50"
            >
              {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-soft">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-teal hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
