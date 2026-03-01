import { useState } from "react";
import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface SettingsSectionProps {
  user: CurrentUser;
}

export default function SettingsSection({ user }: SettingsSectionProps) {
  const [settings, setSettings] = useState({
    autoLogout: true,
    twoFactor: false,
    emailNotify: true,
    sessionLog: true,
    archiveAuto: false,
    exportPdf: true,
    darkTheme: true,
    compactMode: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  const SECTIONS = [
    {
      title: "Безопасность",
      icon: "Shield",
      items: [
        { key: "autoLogout", label: "Автовыход", desc: "Выходить через 30 минут неактивности" },
        { key: "twoFactor", label: "Двухфакторная аутентификация", desc: "Дополнительная защита аккаунта" },
        { key: "sessionLog", label: "Журнал сессий", desc: "Записывать все входы в систему" },
      ],
    },
    {
      title: "Уведомления",
      icon: "Bell",
      items: [
        { key: "emailNotify", label: "Email-уведомления", desc: "Получать оповещения на почту" },
      ],
    },
    {
      title: "Данные и архив",
      icon: "Database",
      items: [
        { key: "archiveAuto", label: "Автоматическое архивирование", desc: "Архивировать записи старше 3 лет" },
        { key: "exportPdf", label: "Экспорт в PDF", desc: "Разрешить скачивание отчётов" },
      ],
    },
    {
      title: "Интерфейс",
      icon: "Monitor",
      items: [
        { key: "darkTheme", label: "Тёмная тема", desc: "Тёмное оформление системы" },
        { key: "compactMode", label: "Компактный режим", desc: "Уменьшить отступы в таблицах" },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* System info */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={15} className="text-muted-foreground" />
          Информация о системе
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Версия системы", value: "1.0.0" },
            { label: "База данных", value: "PostgreSQL 15" },
            { label: "Последнее обновление", value: "01.03.2026" },
            { label: "Сервер", value: "umvd-prod-01" },
            { label: "Статус", value: "Работает" },
            { label: "Аптайм", value: "99.98%" },
          ].map((item) => (
            <div key={item.label} className="bg-secondary/40 rounded-lg p-3">
              <div className="text-[11px] text-muted-foreground mb-1">{item.label}</div>
              <div className="text-sm font-mono font-medium text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggles */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name={section.icon} size={15} className="text-muted-foreground" />
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.items.map((item) => {
              const isOn = settings[item.key as keyof typeof settings];
              const isAdminOnly = item.key === "archiveAuto" && user.role !== "admin";
              return (
                <div key={item.key} className={`flex items-center justify-between ${isAdminOnly ? "opacity-40 pointer-events-none" : ""}`}>
                  <div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      {item.label}
                      {isAdminOnly && (
                        <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                          Только admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => toggle(item.key as keyof typeof settings)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isOn ? "bg-primary" : "bg-secondary border border-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                        isOn ? "left-[calc(100%-1.375rem)]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Archive/Restore section */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="ArchiveRestore" size={15} className="text-muted-foreground" />
          Архив и восстановление
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all group text-left">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Archive" size={16} className="text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Архивировать старые записи</div>
              <div className="text-xs text-muted-foreground">Переместить в архив за выбранный период</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all group text-left">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="ArchiveRestore" size={16} className="text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Восстановить данные</div>
              <div className="text-xs text-muted-foreground">Вернуть удалённые или архивные записи</div>
            </div>
          </button>
        </div>
        {user.role !== "admin" && (
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <Icon name="Info" size={13} />
            Некоторые действия доступны только администратору
          </div>
        )}
      </div>
    </div>
  );
}
