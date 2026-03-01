import { useState } from "react";
import { CurrentUser, UserRole } from "@/App";
import Icon from "@/components/ui/icon";

interface LoginPageProps {
  onLogin: (user: CurrentUser) => void;
}

const MOCK_USERS = [
  {
    login: "admin",
    password: "admin123",
    user: {
      id: "1",
      name: "Иванов Андрей Сергеевич",
      role: "admin" as UserRole,
      rank: "Подполковник",
      department: "Отдел информационных технологий",
    },
  },
  {
    login: "employee",
    password: "emp123",
    user: {
      id: "2",
      name: "Петрова Ольга Николаевна",
      role: "employee" as UserRole,
      rank: "Лейтенант",
      department: "Отдел уголовного розыска",
    },
  },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS.find(
      (u) => u.login === login && u.password === password
    );

    if (found) {
      onLogin(found.user);
    } else {
      setError("Неверный логин или пароль");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(210 85% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 85% 55%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md px-6 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Icon name="Shield" size={32} className="text-primary" />
          </div>
          <div className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Министерство внутренних дел
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            АИС УМВД
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Автоматизированная информационная система
          </p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-xl p-8">
          <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-6">
            Вход в систему
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2 font-medium tracking-wide">
                Логин
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2 font-medium tracking-wide">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Lock" size={16} className="text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5 animate-fade-in">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg py-2.5 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Проверка данных...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} />
                  Войти в систему
                </>
              )}
            </button>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-4 glass-card rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Тестовый доступ:</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-muted-foreground/70">
              <span className="text-primary/70">admin</span> / admin123 — Администратор
            </div>
            <div className="text-muted-foreground/70">
              <span className="text-primary/70">employee</span> / emp123 — Сотрудник
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-6 font-mono">
          © 2026 УМВД России · Версия 1.0.0
        </p>
      </div>
    </div>
  );
}
