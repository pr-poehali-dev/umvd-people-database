import { useState } from "react";
import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface UsersSectionProps {
  user: CurrentUser;
}

interface SystemUser {
  id: string;
  name: string;
  login: string;
  role: "admin" | "employee";
  rank: string;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const INITIAL_USERS: SystemUser[] = [
  { id: "U001", name: "Иванов Андрей Сергеевич", login: "admin", role: "admin", rank: "Подполковник", department: "ОИТ", status: "active", lastLogin: "01.03.2026, 08:30" },
  { id: "U002", name: "Петрова Ольга Николаевна", login: "employee", role: "employee", rank: "Лейтенант", department: "ОУР", status: "active", lastLogin: "01.03.2026, 09:14" },
  { id: "U003", name: "Козлов Виктор Павлович", login: "kozlov", role: "employee", rank: "Капитан", department: "Следственный отдел", status: "active", lastLogin: "28.02.2026, 17:22" },
  { id: "U004", name: "Носова Марина Алексеевна", login: "nosova", role: "employee", rank: "Сержант", department: "ОУР", status: "inactive", lastLogin: "15.01.2026, 11:00" },
];

const ROLE_LABELS = { admin: "Администратор", employee: "Сотрудник" };
const ROLE_STYLE = {
  admin: "text-primary bg-primary/10 border-primary/20",
  employee: "text-secondary-foreground bg-secondary border-border",
};

export default function UsersSection({ user }: UsersSectionProps) {
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", login: "", role: "employee" as "admin" | "employee", rank: "", department: "", password: "" });

  if (user.role !== "admin") {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <Icon name="Lock" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Доступ ограничен</p>
          <p className="text-xs mt-1">Только для администраторов</p>
        </div>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const added: SystemUser = {
      id: `U${String(users.length + 1).padStart(3, "0")}`,
      ...newUser,
      status: "active",
      lastLogin: "—",
    };
    setUsers([...users, added]);
    setNewUser({ name: "", login: "", role: "employee", rank: "", department: "", password: "" });
    setShowAddForm(false);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-semibold font-mono text-foreground">{users.length}</div>
            <div className="text-xs text-muted-foreground">Всего</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-xl font-semibold font-mono text-green-400">{users.filter((u) => u.status === "active").length}</div>
            <div className="text-xs text-muted-foreground">Активных</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-xl font-semibold font-mono text-primary">{users.filter((u) => u.role === "admin").length}</div>
            <div className="text-xs text-muted-foreground">Админов</div>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          <Icon name="UserPlus" size={15} />
          Добавить сотрудника
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Сотрудники системы</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "ФИО", "Логин", "Роль", "Звание / Отдел", "Последний вход", "Статус", ""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-primary">{u.login}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded border ${ROLE_STYLE[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">{u.rank}</div>
                    <div className="text-xs text-muted-foreground">{u.department}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${u.status === "active" ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-muted-foreground bg-secondary border-border"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-green-400" : "bg-muted-foreground"}`} />
                      {u.status === "active" ? "Активен" : "Отключён"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="p-1.5 rounded text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                        title={u.status === "active" ? "Деактивировать" : "Активировать"}
                      >
                        <Icon name={u.status === "active" ? "UserX" : "UserCheck"} size={14} />
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="glass-card rounded-xl w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Новый сотрудник</h3>
              <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { label: "ФИО", key: "name", placeholder: "Иванов Иван Иванович", type: "text" },
                { label: "Логин", key: "login", placeholder: "ivanov", type: "text" },
                { label: "Пароль", key: "password", placeholder: "Минимум 6 символов", type: "password" },
                { label: "Звание", key: "rank", placeholder: "Лейтенант", type: "text" },
                { label: "Отдел", key: "department", placeholder: "ОУР", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{f.label}</label>
                  <input
                    type={f.type}
                    value={newUser[f.key as keyof typeof newUser]}
                    onChange={(e) => setNewUser({ ...newUser, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    required
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Роль</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "employee" })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="employee">Сотрудник</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <div className="flex gap-2 mt-5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
