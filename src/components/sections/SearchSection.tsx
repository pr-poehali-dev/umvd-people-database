import { useState } from "react";
import { CurrentUser } from "@/App";
import Icon from "@/components/ui/icon";

interface SearchSectionProps {
  user: CurrentUser;
}

const INITIAL_DATABASE = [
  { id: "ФС-001", name: "Смирнов Алексей Владимирович", dob: "12.03.1985", region: "Москва", status: "Активный", category: "Гражданский", lastUpdate: "15.01.2026" },
  { id: "ФС-002", name: "Козлова Елена Петровна", dob: "07.11.1990", region: "Санкт-Петербург", status: "Архив", category: "Гражданский", lastUpdate: "03.12.2025" },
  { id: "ФС-003", name: "Морозов Дмитрий Игоревич", dob: "22.06.1978", region: "Екатеринбург", status: "Активный", category: "Под наблюдением", lastUpdate: "20.01.2026" },
  { id: "ФС-004", name: "Волкова Наталья Сергеевна", dob: "14.09.1995", region: "Казань", status: "Активный", category: "Гражданский", lastUpdate: "10.01.2026" },
  { id: "ФС-005", name: "Новиков Павел Андреевич", dob: "31.01.1982", region: "Москва", status: "Ограничен", category: "Под наблюдением", lastUpdate: "05.02.2026" },
  { id: "ФС-006", name: "Захарова Ирина Дмитриевна", dob: "18.04.1988", region: "Новосибирск", status: "Активный", category: "Гражданский", lastUpdate: "12.02.2026" },
];

type DbRecord = typeof INITIAL_DATABASE[0];

const STATUS_STYLE: Record<string, string> = {
  "Активный": "text-green-400 bg-green-400/10 border-green-400/20",
  "Архив": "text-muted-foreground bg-secondary border-border",
  "Ограничен": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

const CATEGORY_STYLE: Record<string, string> = {
  "Гражданский": "text-muted-foreground",
  "Под наблюдением": "text-yellow-400",
};

const EMPTY_FORM = { name: "", dob: "", region: "", status: "Активный", category: "Гражданский" };

export default function SearchSection({ user }: SearchSectionProps) {
  const [database, setDatabase] = useState<DbRecord[]>(INITIAL_DATABASE);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Все");
  const [selectedRecord, setSelectedRecord] = useState<DbRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState(EMPTY_FORM);
  const [addSuccess, setAddSuccess] = useState(false);

  const filtered = database.filter((r) => {
    const matchQuery =
      !query ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.region.toLowerCase().includes(query.toLowerCase());
    const matchStatus = filterStatus === "Все" || r.status === filterStatus;
    return matchQuery && matchStatus;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString("ru-RU");
    const newId = `ФС-${String(database.length + 1).padStart(3, "0")}`;
    const record: DbRecord = { id: newId, ...newPerson, lastUpdate: today };
    setDatabase([record, ...database]);
    setNewPerson(EMPTY_FORM);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddForm(false);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Search bar */}
      <div className="glass-card rounded-xl p-5">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="Search" size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по ФИО, ID записи, региону..."
              className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option>Все</option>
            <option>Активный</option>
            <option>Архив</option>
            <option>Ограничен</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            <Icon name="Search" size={15} />
            Найти
          </button>
        </form>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">Найдено записей: <span className="text-foreground">{filtered.length}</span></span>
            <span className="text-border">|</span>
            <span>Всего в базе: <span className="text-foreground font-mono">{database.length}</span></span>
          </div>
          {user.role === "admin" && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Icon name="UserPlus" size={15} />
              Добавить человека
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Результаты поиска</h3>
          {searched && (
            <span className="text-xs text-muted-foreground font-mono">
              Запрос выполнен: {new Date().toLocaleTimeString("ru-RU")}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "ФИО", "Дата рождения", "Регион", "Категория", "Статус", "Обновлено", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => (
                <tr
                  key={record.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => setSelectedRecord(record)}
                >
                  <td className="px-4 py-3 text-xs font-mono text-primary">{record.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{record.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{record.dob}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{record.region}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${CATEGORY_STYLE[record.category]}`}>
                    {record.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${STATUS_STYLE[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{record.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="Eye" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Icon name="SearchX" size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Записи не найдены</p>
              <p className="text-xs mt-1">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>

      {/* Add person modal */}
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
              <div>
                <h3 className="text-base font-semibold text-foreground">Добавить человека</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Новая запись в базе данных</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            {addSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-3">
                  <Icon name="CheckCircle" size={24} className="text-green-400" />
                </div>
                <p className="text-sm font-medium text-foreground">Запись успешно добавлена</p>
              </div>
            ) : (
              <form onSubmit={handleAddPerson} className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">ФИО <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                    placeholder="Иванов Иван Иванович"
                    required
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Дата рождения <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={newPerson.dob}
                      onChange={(e) => setNewPerson({ ...newPerson, dob: e.target.value })}
                      placeholder="ДД.ММ.ГГГГ"
                      required
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Регион <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={newPerson.region}
                      onChange={(e) => setNewPerson({ ...newPerson, region: e.target.value })}
                      placeholder="Москва"
                      required
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Категория</label>
                    <select
                      value={newPerson.category}
                      onChange={(e) => setNewPerson({ ...newPerson, category: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option>Гражданский</option>
                      <option>Под наблюдением</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Статус</label>
                    <select
                      value={newPerson.status}
                      onChange={(e) => setNewPerson({ ...newPerson, status: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option>Активный</option>
                      <option>Ограничен</option>
                      <option>Архив</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 text-sm rounded-lg bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-sm rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="UserPlus" size={14} />
                    Добавить
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="glass-card rounded-xl w-full max-w-lg p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-mono text-primary mb-1">{selectedRecord.id}</div>
                <h3 className="text-lg font-semibold text-foreground">{selectedRecord.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: "Дата рождения", value: selectedRecord.dob },
                { label: "Регион", value: selectedRecord.region },
                { label: "Категория", value: selectedRecord.category },
                { label: "Последнее обновление", value: selectedRecord.lastUpdate },
              ].map((f) => (
                <div key={f.label} className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[11px] text-muted-foreground mb-1">{f.label}</div>
                  <div className="text-sm font-medium text-foreground">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg border ${STATUS_STYLE[selectedRecord.status]}`}>
                {selectedRecord.status}
              </span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all">
                  <Icon name="Printer" size={13} />
                  Распечатать
                </button>
                <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all">
                  <Icon name="FileDown" size={13} />
                  Экспорт
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}