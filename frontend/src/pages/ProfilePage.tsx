import { User, Mail, Building2, MapPin, CreditCard, Clock, Activity, Settings, Edit3, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Profilim</h1>
        <p className="text-slate-500 text-sm">
          Kişisel bilgilerinizi ve hesap detaylarınızı görüntüleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-50">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Kullanıcı"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-teal-600 transition-colors">
                <Edit3 size={14} />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">Ahmet Yılmaz</h2>
            <p className="text-sm text-slate-500 mb-4">Dış Ticaret Uzmanı</p>
            
            <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-block shadow-sm">
              Premium Üye
            </span>

            <div className="w-full border-t border-slate-100 pt-4 mt-2 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" /> ahmet@getiremmi.com
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Building2 size={16} className="text-slate-400" /> Global Trade A.Ş.
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" /> İstanbul, Türkiye
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-teal-500" /> Aktiviteler
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Piyasa Raporu İncelendi</p>
                  <p className="text-xs text-slate-400">2 saat önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Yeni Ürün Karşılaştırması</p>
                  <p className="text-xs text-slate-400">Dün, 14:30</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Giriş Yapıldı</p>
                  <p className="text-xs text-slate-400">Dün, 09:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Kişisel Bilgiler</h2>
            </div>
            <div className="p-6">
              <form className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ad Soyad</label>
                  <input type="text" defaultValue="Ahmet Yılmaz" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                  <input type="tel" defaultValue="+90 555 123 4567" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">E-posta Adresi</label>
                  <input type="email" defaultValue="ahmet@getiremmi.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-2 pt-4 flex justify-end">
                  <button type="button" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    Bilgileri Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Satın Alımlarım ve Faturalar</h2>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Aktif
              </span>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Premium Plan</h3>
                  <p className="text-sm text-slate-500 mt-1">Sınırsız analiz ve detaylı raporlar.</p>
                  <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1.5">
                    <Clock size={12} /> Yenilenme Tarihi: 15 Haziran 2026
                  </p>
                </div>
              </div>
              <button className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold shadow-sm transition-colors">
                Tüm Faturaları Gör
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
