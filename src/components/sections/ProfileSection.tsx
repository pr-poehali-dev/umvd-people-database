import { useState } from "react";
import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface ProfileSectionProps {
  user: CurrentUser;
}

const ACTIVITY_LOG = [
  { time: "01.03.2026, 10:42", action: "Поиск в базе данных", icon: "Search" },
  { time: "01.03.2026, 09:30", action: "Просмотр записи ФС-003", icon: "Eye" },
  { time: "01.03.2026, 08:30", action: "Вход в систему", icon: "LogIn" },
  { time: "28.02.2026, 17:15", action: "Экспорт отчёта", icon: "FileDown" },
  { time: "28.02.2026, 14:00", action: "Обновление данных записи ФС-001", icon: "PenLine" },
];

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, rank: user.rank, department: user.department });

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      {/* Profile card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon name="User" size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border ${user.role === "admin" ? "text-primary bg-primary/10 border-primary/20" : "text-secondary-foreground bg-secondary border-border"}`}>
                  <Icon name={user.role === "admin" ? "ShieldCheck" : "UserCheck"} size={11} />
                  {user.role === "admin" ? "Администратор" : "Сотрудник"}
                </span>
                <span className="text-xs text-muted-foreground">ID: {user.id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all"
          >
            <Icon name={editing ? "X" : "Pencil"} size={13} />
            {editing ? "Отмена" : "Редактировать"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3 animate-fade-in">
            {[
              { label: "ФИО", key: "name" },
              { label: "Звание", key: "rank" },
              { label: "Отдел", key: "department" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-muted-foreground mb-1.5">{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            ))}
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all mt-2"
            >
              <Icon name="Save" size={14} />
              Сохранить изменения
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
            {[
              { label: "Звание", value: user.rank, icon: "Award" },
              { label: "Отдел", value: user.department, icon: "Building2" },
              { label: "Табельный номер", value: `ТН-${user.id.padStart(5, "0")}`, icon: "Hash" },
              { label: "Дата назначения", value: "15.06.2022", icon: "Calendar" },
              { label: "Уровень доступа", value: user.role === "admin" ? "Уровень 3" : "Уровень 2", icon: "ShieldCheck" },
              { label: "Статус", value: "Действующий", icon: "CheckCircle" },
            ].map((f) => (
              <div key={f.label} className="bg-secondary/40 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                  <Icon name={f.icon} size={11} />
                  {f.label}
                </div>
                <div className="text-sm font-medium text-foreground">{f.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lock" size={15} className="text-muted-foreground" />
          Безопасность
        </h3>
        <div className="space-y-3">
          {["Текущий пароль", "Новый пароль", "Подтверждение пароля"].map((label) => (
            <div key={label}>
              <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          ))}
          <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all mt-1">
            <Icon name="Key" size={14} />
            Обновить пароль
          </button>
        </div>
      </div>

      {/* Activity log */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={15} className="text-muted-foreground" />
          Журнал активности
        </h3>
        <div className="space-y-3">
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon name={log.icon} size={13} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground">{log.action}</div>
                <div className="text-xs font-mono text-muted-foreground">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
