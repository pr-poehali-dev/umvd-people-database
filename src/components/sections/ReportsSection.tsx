import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface ReportsSectionProps {
  user: CurrentUser;
}

const MONTHLY_DATA = [
  { month: "Сен", value: 820, max: 1500 },
  { month: "Окт", value: 1100, max: 1500 },
  { month: "Ноя", value: 950, max: 1500 },
  { month: "Дек", value: 1380, max: 1500 },
  { month: "Янв", value: 1050, max: 1500 },
  { month: "Фев", value: 1204, max: 1500 },
];

const REPORT_TYPES = [
  { id: "daily", label: "Ежедневный отчёт", desc: "Активность за сутки", icon: "CalendarDays", color: "text-primary" },
  { id: "weekly", label: "Недельный отчёт", desc: "Итоги за 7 дней", icon: "CalendarRange", color: "text-green-400" },
  { id: "monthly", label: "Месячный отчёт", desc: "Аналитика за месяц", icon: "Calendar", color: "text-yellow-400" },
  { id: "archive", label: "Отчёт по архиву", desc: "Архивированные записи", icon: "Archive", color: "text-purple-400" },
];

const STATUS_DIST = [
  { label: "Активные", count: 11420, pct: 77, color: "bg-primary" },
  { label: "Архив", count: 2804, pct: 19, color: "bg-purple-500" },
  { label: "Ограниченные", count: 608, pct: 4, color: "bg-yellow-500" },
];

export default function ReportsSection({ user: _user }: ReportsSectionProps) {
  return (
    <div className="p-6 space-y-5">
      {/* Summary KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Запросов за месяц", value: "8 412", icon: "Search", delta: "+12%", up: true },
          { label: "Новых записей", value: "204", icon: "UserPlus", delta: "+48", up: true },
          { label: "Архивировано", value: "67", icon: "Archive", delta: "-3%", up: false },
          { label: "Ошибок доступа", value: "14", icon: "ShieldAlert", delta: "-28%", up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <Icon name={kpi.icon} size={16} className="text-muted-foreground" />
              <span className={`text-xs font-mono ${kpi.up ? "text-green-400" : "text-destructive"}`}>
                {kpi.delta}
              </span>
            </div>
            <div className="text-2xl font-semibold font-mono text-foreground">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="md:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Запросы к базе данных</h3>
            <span className="text-xs text-muted-foreground font-mono">Последние 6 месяцев</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_DATA.map((d) => {
              const height = Math.round((d.value / d.max) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{d.value.toLocaleString()}</span>
                  <div className="w-full rounded-t-md bg-primary/20 relative overflow-hidden" style={{ height: "100px" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Распределение записей</h3>
          <div className="space-y-4">
            {STATUS_DIST.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-foreground font-medium">{s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 text-right">{s.pct}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Всего в базе</div>
            <div className="text-2xl font-semibold font-mono text-foreground">14 832</div>
          </div>
        </div>
      </div>

      {/* Report generation */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Создать отчёт</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REPORT_TYPES.map((r) => (
            <button
              key={r.id}
              className="flex flex-col items-start gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                <Icon name={r.icon} size={18} className={r.color} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{r.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                <Icon name="Download" size={12} />
                Скачать PDF
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
