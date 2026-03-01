import { useState } from "react";
import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";
import HomeSection from "@/components/sections/HomeSection";
import SearchSection from "@/components/sections/SearchSection";
import UsersSection from "@/components/sections/UsersSection";
import ProfileSection from "@/components/sections/ProfileSection";
import ReportsSection from "@/components/sections/ReportsSection";
import SettingsSection from "@/components/sections/SettingsSection";

interface DashboardProps {
  user: CurrentUser;
  onLogout: () => void;
}

type Section =
  | "home"
  | "search"
  | "users"
  | "profile"
  | "reports"
  | "settings";

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "LayoutDashboard", roles: ["admin", "employee"] },
  { id: "search", label: "Поиск по базе", icon: "Search", roles: ["admin", "employee"] },
  { id: "users", label: "Управление", icon: "Users", roles: ["admin"] },
  { id: "profile", label: "Личный кабинет", icon: "UserCircle", roles: ["admin", "employee"] },
  { id: "reports", label: "Отчёты", icon: "BarChart3", roles: ["admin", "employee"] },
  { id: "settings", label: "Настройки", icon: "Settings", roles: ["admin", "employee"] },
];

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  );

  const sectionComponents: Record<Section, React.ReactNode> = {
    home: <HomeSection user={user} onNavigate={(s) => setActiveSection(s as Section)} />,
    search: <SearchSection user={user} />,
    users: <UsersSection user={user} />,
    profile: <ProfileSection user={user} />,
    reports: <ReportsSection user={user} />,
    settings: <SettingsSection user={user} />,
  };

  const currentNav = visibleNav.find((n) => n.id === activeSection);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-primary" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in overflow-hidden">
              <div className="text-xs font-mono text-primary font-semibold leading-none">
                АИС УМВД
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                v1.0.0
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <Icon
              name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={14}
            />
          </button>
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 animate-fade-in">
            <div
              className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md font-medium ${
                user.role === "admin"
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-secondary text-secondary-foreground border border-border"
              }`}
            >
              <Icon
                name={user.role === "admin" ? "ShieldCheck" : "UserCheck"}
                size={12}
              />
              {user.role === "admin" ? "Администратор" : "Сотрудник"}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {visibleNav.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={isActive ? "text-primary" : ""}
                />
                {!sidebarCollapsed && (
                  <span className="font-medium animate-fade-in">
                    {item.label}
                  </span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-sidebar-border p-3">
          {sidebarCollapsed ? (
            <button
              onClick={onLogout}
              className="w-full flex justify-center text-muted-foreground hover:text-destructive transition-colors p-2"
              title="Выйти"
            >
              <Icon name="LogOut" size={16} />
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-foreground truncate leading-tight">
                    {user.name.split(" ").slice(0, 2).join(" ")}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {user.rank}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
              >
                <Icon name="LogOut" size={13} />
                Выйти из системы
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              {currentNav?.label || "Главная"}
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {new Date().toLocaleDateString("ru-RU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Система активна
            </div>
            <div className="w-px h-4 bg-border" />
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Icon name="Bell" size={18} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto">
          <div key={activeSection} className="animate-fade-in h-full">
            {sectionComponents[activeSection]}
          </div>
        </div>
      </main>
    </div>
  );
}
