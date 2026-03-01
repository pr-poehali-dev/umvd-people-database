import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface HomeSectionProps {
  user: CurrentUser;
  onNavigate: (section: string) => void;
}

const STATS = [
  { label: "Записей в базе", value: "14 832", icon: "Database", trend: "+48 за неделю", color: "text-primary" },
  { label: "Активных дел", value: "237", icon: "Folder", trend: "+12 за месяц", color: "text-yellow-400" },
  { label: "Сотрудников", value: "56", icon: "Users", trend: "3 не активны", color: "text-green-400" },
  { label: "Запросов сегодня", value: "1 204", icon: "Activity", trend: "↑ 18% к вчера", color: "text-purple-400" },
];

const RECENT_EVENTS = [
  { time: "10:42", text: "Добавлена запись: Смирнов А.В.", type: "add", user: "Петрова О.Н." },
  { time: "09:15", text: "Обновлены данные: дело №2024-1183", type: "edit", user: "Козлов В.П." },
  { time: "08:57", text: "Поиск: запрос по базе данных", type: "search", user: "Иванова М.С." },
  { time: "08:30", text: "Архивировано 12 старых записей", type: "archive", user: "Система" },
  { time: "07:44", text: "Новый сотрудник добавлен в систему", type: "add", user: "Администратор" },
];

const EVENT_ICONS: Record<string, string> = {
  add: "UserPlus",
  edit: "PenLine",
  search: "Search",
  archive: "Archive",
};
const EVENT_COLORS: Record<string, string> = {
  add: "text-green-400 bg-green-400/10",
  edit: "text-yellow-400 bg-yellow-400/10",
  search: "text-primary bg-primary/10",
  archive: "text-purple-400 bg-purple-400/10",
};

const QUICK_ACTIONS = [
  { label: "Поиск человека", icon: "Search", section: "search", desc: "По базе данных" },
  { label: "Добавить запись", icon: "UserPlus", section: "users", desc: "Новый субъект" },
  { label: "Создать отчёт", icon: "FileText", section: "reports", desc: "Аналитика" },
  { label: "Личный кабинет", icon: "UserCircle", section: "profile", desc: "Мой профиль" },
];

export default function HomeSection({ user, onNavigate }: HomeSectionProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-mono mb-1 tracking-wide">
            Добро пожаловать в систему
          </div>
          <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm text-muted-foreground">{user.rank}</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-sm text-muted-foreground">{user.department}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={13} />
          Последний вход: сегодня, 08:30
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-secondary`}>
                <Icon name={stat.icon} size={16} className={stat.color} />
              </div>
            </div>
            <div className={`text-2xl font-semibold font-mono ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-foreground font-medium mt-1">{stat.label}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent events */}
        <div className="md:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Последние события
            </h3>
            <span className="text-[10px] text-muted-foreground font-mono">сегодня</span>
          </div>
          <div className="space-y-3">
            {RECENT_EVENTS.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-mono text-muted-foreground w-10 flex-shrink-0 mt-0.5">
                  {event.time}
                </span>
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    EVENT_COLORS[event.type]
                  }`}
                >
                  <Icon name={EVENT_ICONS[event.type]} size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{event.text}</div>
                  <div className="text-[11px] text-muted-foreground">{event.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Быстрые действия
          </h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.filter(
              (a) => user.role === "admin" || a.section !== "users"
            ).map((action) => (
              <button
                key={action.section}
                onClick={() => onNavigate(action.section)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon name={action.icon} size={15} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {action.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {action.desc}
                  </div>
                </div>
                <Icon
                  name="ChevronRight"
                  size={14}
                  className="ml-auto text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
