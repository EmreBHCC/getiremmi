import { Shield, Globe, Moon, Bell, Lock, Key, CreditCard, User, LogOut } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Ayarlar</h1>
        <p className="text-slate-500 text-sm">
          Hesap tercihlerinizi ve uygulama ayarlarınızı yönetin.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Sol Menü */}
          <div className="border-r border-slate-100 p-6 bg-slate-50/30">
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-teal-50 text-teal-700">
                <Globe size={18} /> Genel Ayarlar
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                <Shield size={18} /> Güvenlik
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                <Bell size={18} /> Bildirimler
              </button>
            </nav>
          </div>

          {/* Sağ İçerik */}
          <div className="col-span-2 p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Genel Ayarlar</h2>
            
            <div className="space-y-6">
              {/* Dil */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-700">Dil Tercihi</h3>
                  <p className="text-sm text-slate-500 mt-1">Uygulamanın arayüz dilini seçin.</p>
                </div>
                <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Tema */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div>
                  <h3 className="font-semibold text-slate-700">Karanlık Mod</h3>
                  <p className="text-sm text-slate-500 mt-1">Göz yormayan karanlık temayı aktif edin.</p>
                </div>
                <button className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer transition-colors hover:bg-slate-300">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Bölge */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div>
                  <h3 className="font-semibold text-slate-700">Varsayılan Para Birimi</h3>
                  <p className="text-sm text-slate-500 mt-1">Fiyat karşılaştırmalarında kullanılacak ana para birimi.</p>
                </div>
                <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              {/* Kaydet */}
              <div className="pt-8 flex justify-end">
                <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
