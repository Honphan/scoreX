import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsAnimating(true);
    setTimeout(() => {
      login(name);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, var(--stripe-purple) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, var(--ruby) 0%, var(--magenta) 40%, transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--deep-navy) 1px, transparent 1px), linear-gradient(90deg, var(--deep-navy) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-[380px] transition-all duration-500 ${
          isAnimating
            ? "translate-y-[-20px] scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        {/* Logo & Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-stripe-3" style={{ background: "var(--stripe-purple)" }}>
            <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
          </div>
          <h1
            className="mb-2 text-[2.5rem] leading-[1.1] tracking-[-1.2px]"
            style={{ color: "var(--deep-navy)" }}
          >
            ScoreX
          </h1>
          <p
            className="text-[1.05rem] font-light leading-relaxed"
            style={{ color: "var(--body-slate)" }}
          >
            Chốt sổ mọi bàn chơi.
            <br />
            Nhanh gọn, chính xác.
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-lg border p-6"
          style={{
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-level-3)",
            background: "#fff",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="host-name"
                className="mb-1.5 block text-[0.8125rem] font-normal"
                style={{ color: "var(--dark-slate)" }}
              >
                Tên chủ phòng
              </label>
              <input
                id="host-name"
                type="text"
                placeholder="VD: Minh, Hùng, Tuấn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="off"
                className="h-10 w-full rounded-[4px] border px-3 text-[15px] font-light outline-none transition-all duration-200 placeholder:text-[#a0aec0] focus:ring-2"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--deep-navy)",
                  fontFeatureSettings: '"ss01"',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--stripe-purple)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(83,58,253,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-default)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="flex h-10 w-full items-center justify-center rounded-[4px] text-[15px] font-normal text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: name.trim() ? "var(--stripe-purple)" : "#c4c4e8",
                fontFeatureSettings: '"ss01"',
              }}
              onMouseEnter={(e) => {
                if (name.trim())
                  (e.target as HTMLElement).style.background =
                    "var(--stripe-purple-hover)";
              }}
              onMouseLeave={(e) => {
                if (name.trim())
                  (e.target as HTMLElement).style.background =
                    "var(--stripe-purple)";
              }}
            >
              Bắt đầu
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p
          className="mt-5 text-center text-[0.75rem] font-light"
          style={{ color: "var(--body-slate)" }}
        >
          Nhập tên bạn để vào sảnh quản lý các bàn chơi
        </p>
      </div>
    </div>
  );
}
