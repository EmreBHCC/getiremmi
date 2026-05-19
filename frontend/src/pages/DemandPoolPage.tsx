import { useState } from 'react';
import { Inbox, Plus, Search, Zap, CheckCircle, Clock, Building2, Package } from 'lucide-react';

interface DemandItem {
  id: number;
  company: string;
  sector: string;
  product: string;
  quantity: string;
  budget: string;
  status: 'matched' | 'searching' | 'pending';
  matchCount: number;
  date: string;
}

const demands: DemandItem[] = [
  {
    id: 1,
    company: 'Arçelik A.Ş.',
    sector: 'Elektronik',
    product: 'Neodimyum Mıknatıs (N45)',
    quantity: '50.000 adet/ay',
    budget: '$80.000',
    status: 'matched',
    matchCount: 3,
    date: '15 May 2026',
  },
  {
    id: 2,
    company: 'Bim Birleşik Mağazalar',
    sector: 'Gıda',
    product: 'Organik Kinoa (Sertifikalı)',
    quantity: '20 ton/ay',
    budget: '$35.000',
    status: 'searching',
    matchCount: 1,
    date: '14 May 2026',
  },
  {
    id: 3,
    company: 'Kordsa Global',
    sector: 'Tekstil',
    product: 'Yüksek Dayanımlı Naylon İplik',
    quantity: '200 ton/yıl',
    budget: '$620.000',
    status: 'matched',
    matchCount: 5,
    date: '12 May 2026',
  },
  {
    id: 4,
    company: 'Eczacıbaşı İlaç',
    sector: 'Kimya / İlaç',
    product: 'API Ham Madde (Paracetamol)',
    quantity: '5 ton/ay',
    budget: '$90.000',
    status: 'pending',
    matchCount: 0,
    date: '10 May 2026',
  },
];

const statusConfig = {
  matched: {
    label: 'Eşleşti',
    icon: <CheckCircle size={13} />,
    cls: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    dot: 'bg-teal-500',
  },
  searching: {
    label: 'Aranıyor',
    icon: <Zap size={13} />,
    cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  },
  pending: {
    label: 'Bekliyor',
    icon: <Clock size={13} />,
    cls: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
  },
};

interface NewDemand {
  company: string;
  product: string;
  quantity: string;
  budget: string;
}

export default function DemandPoolPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewDemand>({ company: '', product: '', quantity: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setForm({ company: '', product: '', quantity: '', budget: '' });
    }, 2000);
  };

  const matchedCount = demands.filter((d) => d.status === 'matched').length;
  const totalMatches = demands.reduce((a, d) => a + d.matchCount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow">
              <Inbox size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Talep Havuzu</h1>
          </div>
          <p className="text-slate-500 text-sm ml-12">
            Şirketlerin aradığı ürün taleplerini girin; sistem yurt dışı piyasalarla otomatik eşleştirsin.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          Yeni Talep Ekle
        </button>
      </div>

      {}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Package size={22} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{demands.length}</p>
            <p className="text-xs text-slate-400">Aktif Talep</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
            <CheckCircle size={22} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{matchedCount}</p>
            <p className="text-xs text-slate-400">Eşleşme Sağlanan</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Zap size={22} className="text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalMatches}</p>
            <p className="text-xs text-slate-400">Toplam Tedarikçi Eşleşmesi</p>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Talep ara (şirket, ürün, sektör...)"
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
          />
        </div>
      </div>

      {}
      <div className="space-y-3">
        {demands.map((d) => {
          const sc = statusConfig[d.status];
          return (
            <div key={d.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{d.company}</p>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{d.sector}</span>
                    <span
                      className={`ml-auto flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.cls}`}
                    >
                      {sc.icon}
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-800 mb-2">{d.product}</p>
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span>📦 {d.quantity}</span>
                    <span>💰 {d.budget}</span>
                    <span>📅 {d.date}</span>
                  </div>
                </div>
                {d.matchCount > 0 && (
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {d.matchCount}
                    </div>
                    <span className="text-xs text-slate-400 text-center leading-tight">Tedarikçi<br />Bulundu</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-teal-600" />
                </div>
                <p className="text-lg font-semibold text-slate-900">Talebiniz Alındı!</p>
                <p className="text-sm text-slate-500 text-center">
                  Sistem yurt dışı piyasaları tarayarak size uygun tedarikçileri bulacak.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-slate-900">Yeni Ürün Talebi</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: 'Şirket Adı', key: 'company', placeholder: 'Örn: Şirketim A.Ş.' },
                    { label: 'Aradığınız Ürün', key: 'product', placeholder: 'Örn: Neodimyum Mıknatıs N45' },
                    { label: 'Miktar / Periyot', key: 'quantity', placeholder: 'Örn: 10.000 adet/ay' },
                    { label: 'Bütçe (USD)', key: 'budget', placeholder: 'Örn: $50.000' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={form[f.key as keyof NewDemand]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
                  >
                    Talebi Gönder & Eşleştir
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
