import { Filter, Globe, Tag, Monitor, Calendar } from 'lucide-react';

const filterItems = [
  { icon: Globe, label: 'Menşei', active: true },
  { icon: Tag, label: 'Kategori', active: false },
  { icon: Monitor, label: 'Fiyatlandırma', active: false },
  { icon: Monitor, label: 'Platformlar', active: false },
  { icon: Calendar, label: 'Zaman Dilimi', active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-[calc(100vh-56px)] bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-semibold">Gelişmiş Filtreler</p>
            <p className="text-xs text-slate-400">Piyasa parametreleri</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2">
        {filterItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={16} className={item.active ? 'text-teal-600' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
          Filtreleri Uygula
        </button>
      </div>

      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Getiremmi</p>
      </div>
    </aside>
  );
}
