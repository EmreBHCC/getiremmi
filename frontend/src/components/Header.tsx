import { Bell, Settings, Search } from 'lucide-react';
import type { Page } from '../App';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { label: string; key: Page }[] = [
  { label: 'Gösterge Paneli', key: 'dashboard' },
  { label: 'Karşılaştırmalar', key: 'comparisons' },
  { label: 'Piyasalar', key: 'markets' },
  { label: 'Raporlar', key: 'reports' },
];

export default function Header({ activePage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center h-14 px-6 gap-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Getiremmi Logo" className="h-8 w-auto object-contain" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Getiremmi
          </span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors relative ${
                activePage === item.key
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.label}
              {activePage === item.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />
              )}
            </button>
          ))}
        </nav>

        {activePage === 'markets' && (
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-56">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Piyasa ara..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Bildirimler">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Ayarlar">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden ring-2 ring-slate-200">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="Kullanıcı"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
