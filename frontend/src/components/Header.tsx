import { useState, useRef, useEffect } from 'react';
import { 
  Bell, Settings, Search, Leaf, Inbox, Calculator, BookOpen, 
  BarChart2, Brain, ChevronDown, User, LogOut, CreditCard, 
  Moon, Globe, Shield, Check, X, AlertCircle, CheckCircle2
} from 'lucide-react';
import type { Page } from '../App';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const mainNavItems: { label: string; key: Page }[] = [
  { label: 'Gösterge Paneli', key: 'dashboard' },
  { label: 'Karşılaştırmalar', key: 'comparisons' },
];

const toolNavItems: { label: string; key: Page; icon: React.ElementType; color: string }[] = [
  { label: 'Sürdürülebilirlik', key: 'sustainability', icon: Leaf, color: 'text-teal-600' },
  { label: 'Talep Havuzu', key: 'demand', icon: Inbox, color: 'text-indigo-600' },
  { label: 'Lojistik Hesap.', key: 'logistics', icon: Calculator, color: 'text-blue-600' },
  { label: 'Gümrük Kütüphanesi', key: 'customs', icon: BookOpen, color: 'text-amber-600' },
  { label: 'Rakip Analizi', key: 'competitor', icon: BarChart2, color: 'text-rose-500' },
  { label: 'Trend Tahminleyici', key: 'trend', icon: Brain, color: 'text-violet-600' },
];

export default function Header({ activePage, onNavigate }: HeaderProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null);
  const [expandedNotifId, setExpandedNotifId] = useState<number | null>(null);
  
  const toolsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isToolActive = toolNavItems.some(t => t.key === activePage);

  const toggleDropdown = (dropdown: 'notifications' | 'profile') => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {}
      <div className="flex items-center h-14 px-6 gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Getiremmi Logo" className="h-8 w-auto object-contain" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Getiremmi</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {mainNavItems.map((item) => (
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

          {}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded transition-colors relative ${
                isToolActive || isToolsOpen
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Araçlar
              <ChevronDown size={14} className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
              {isToolActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />
              )}
            </button>
            
            {isToolsOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 overflow-hidden">
                {toolNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onNavigate(item.key);
                        setIsToolsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        isActive 
                          ? 'bg-slate-50 text-slate-900 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        <Icon size={16} className={isActive ? item.color : 'text-slate-500'} />
                      </div>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {activePage === 'markets' && (
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-48">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Piyasa ara..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            />
          </div>
        )}

        {}
        <div className="flex items-center gap-3 flex-shrink-0 relative" ref={actionsRef}>
          
          {}
          <button 
            onClick={() => toggleDropdown('notifications')}
            className={`relative p-2 rounded-lg transition-colors ${openDropdown === 'notifications' ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`} 
            title="Bildirimler"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
          </button>

          {}
          {openDropdown === 'notifications' && (
            <div className="absolute top-full right-16 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Bildirimler</h3>
                <button className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  <Check size={12} /> Tümünü okundu işaretle
                </button>
              </div>
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                <div 
                  onClick={() => setExpandedNotifId(prev => prev === 1 ? null : 1)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 opacity-100 ${expandedNotifId === 1 ? 'bg-slate-50' : ''}`}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-medium leading-snug">Yeni Piyasa Raporu</p>
                    <p className={`text-xs text-slate-500 mt-1 transition-all duration-300 ${expandedNotifId === 1 ? 'line-clamp-none' : 'line-clamp-2'}`}>
                      Nisan ayı Asya pazarı lojistik maliyet raporu yayınlandı. Hemen inceleyin. Bu rapor içerisinde Çin ve Tayvan bölgesi gümrük tarifelerindeki son değişiklikleri ve navlun fiyatlarındaki düşüş trendini bulabilirsiniz.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">10 dk önce</p>
                  </div>
                </div>
                <div 
                  onClick={() => setExpandedNotifId(prev => prev === 2 ? null : 2)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 opacity-70 ${expandedNotifId === 2 ? 'bg-slate-50' : ''}`}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-medium leading-snug">Gümrük Verisi Güncellendi</p>
                    <p className={`text-xs text-slate-500 mt-1 transition-all duration-300 ${expandedNotifId === 2 ? 'line-clamp-none' : 'line-clamp-2'}`}>
                      Avrupa Birliği tekstil ithalat tarifeleri başarıyla senkronize edildi. Artık tüm ürün karşılaştırmalarınızda yeni AB karbon sınır vergisi oranları da hesaplanarak sizlere en doğru fiyat tahminleri sunulacaktır.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">2 saat önce</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                <span className="text-xs font-medium text-slate-600">Tüm Bildirimleri Gör</span>
              </div>
            </div>
          )}

          {}

          {}
          <button 
            onClick={() => toggleDropdown('profile')}
            className={`w-8 h-8 rounded-full overflow-hidden ring-2 transition-all ${activePage === 'profile' || openDropdown === 'profile' ? 'ring-teal-500 ring-offset-2' : 'ring-slate-200 hover:ring-slate-300'}`}
          >
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="Kullanıcı"
              className="w-full h-full object-cover"
            />
          </button>

          {}
          {openDropdown === 'profile' && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-white">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80"
                    alt="Kullanıcı"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Ahmet Yılmaz</p>
                    <p className="text-xs text-slate-500">ahmet@getiremmi.com</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => { onNavigate('profile'); setOpenDropdown(null); }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                >
                  <User size={16} /> <span className="font-medium">Profilimi Görüntüle</span>
                </button>
                <button 
                  onClick={() => { onNavigate('settings'); setOpenDropdown(null); }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                >
                  <Settings size={16} /> <span className="font-medium">Ayarlar</span>
                </button>
                <div className="h-px bg-slate-100 my-1.5 mx-4" />
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                  <LogOut size={16} /> <span className="font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </header>
  );
}
