import { useState } from 'react';
import { Truck, Ship, Plane, Package, Calculator, ArrowRight, Info } from 'lucide-react';

type Mode = 'sea' | 'air' | 'land';

const modeConfig = {
  sea: {
    label: 'Deniz (Konteyner)',
    icon: Ship,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-600',
    baseRate: 1.4, // USD per kg
    minDays: 18,
    maxDays: 35,
  },
  air: {
    label: 'Hava Kargo',
    icon: Plane,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    activeBg: 'bg-purple-600',
    baseRate: 6.8,
    minDays: 2,
    maxDays: 5,
  },
  land: {
    label: 'Karayolu (TIR)',
    icon: Truck,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-600',
    baseRate: 2.1,
    minDays: 5,
    maxDays: 12,
  },
};

const originOptions = [
  { label: 'Çin (Şanghay)', multiplier: 1.0 },
  { label: 'Hindistan (Mumbai)', multiplier: 0.85 },
  { label: 'Almanya (Hamburg)', multiplier: 0.6 },
  { label: 'ABD (New York)', multiplier: 1.2 },
  { label: 'Vietnam (Ho Chi Minh)', multiplier: 0.9 },
  { label: 'Brezilya (Santos)', multiplier: 1.3 },
];

function ResultCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function LogisticsPage() {
  const [mode, setMode] = useState<Mode>('sea');
  const [weight, setWeight] = useState('1000');
  const [value, setValue] = useState('50000');
  const [originIdx, setOriginIdx] = useState(0);
  const [calculated, setCalculated] = useState(false);

  const origin = originOptions[originIdx];
  const cfg = modeConfig[mode];

  const weightNum = parseFloat(weight) || 0;
  const valueNum = parseFloat(value) || 0;

  const freight = weightNum * cfg.baseRate * origin.multiplier;
  const insurance = valueNum * 0.0035;
  const customs = valueNum * 0.18;
  const total = freight + insurance + customs;
  const perKg = weightNum > 0 ? total / weightNum : 0;

  const handleCalc = () => setCalculated(true);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Başlık */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
            <Calculator size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Lojistik Maliyet Hesaplayıcı</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          Konteyner, hava kargo veya tır bazlı taşıma maliyetini birim fiyatınıza yansıtın.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Sol: Form */}
        <div className="space-y-6">
          {/* Taşıma Modu */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Taşıma Modu</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(modeConfig) as Mode[]).map((m) => {
                const c = modeConfig[m];
                const Icon = c.icon;
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setCalculated(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      active
                        ? `${c.activeBg} border-transparent text-white shadow-md`
                        : `${c.bg} ${c.border} ${c.color} hover:shadow-sm`
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-medium text-center leading-tight">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menşe */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Menşe Ülke / Liman
            </label>
            <select
              value={originIdx}
              onChange={(e) => { setOriginIdx(Number(e.target.value)); setCalculated(false); }}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white"
            >
              {originOptions.map((o, i) => (
                <option key={i} value={i}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Ağırlık & Değer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Ağırlık (kg)
              </label>
              <div className="relative">
                <Package size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setCalculated(false); }}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Mal Değeri (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setCalculated(false); }}
                  className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCalc}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Calculator size={16} />
            Maliyeti Hesapla
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Sağ: Sonuçlar */}
        <div>
          {calculated ? (
            <div className="space-y-4">
              <div className={`rounded-2xl p-6 ${cfg.bg} border ${cfg.border}`}>
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = cfg.icon; return <Icon size={20} className={cfg.color} />; })()}
                  <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label} · {origin.label}</p>
                </div>
                <p className="text-4xl font-bold text-slate-900 mb-1">
                  ${total.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-slate-500">Tahmini Toplam Maliyet</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="Navlun" value={`$${freight.toFixed(0)}`} />
                <ResultCard label="Sigorta" value={`$${insurance.toFixed(0)}`} />
                <ResultCard label="Gümrük (KDV dahil)" value={`$${customs.toFixed(0)}`} />
                <ResultCard label="Birim Maliyet" value={`$${perKg.toFixed(2)}/kg`} />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 mb-2">Tahmini Teslimat Süresi</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className={`${mode === 'sea' ? 'bg-blue-500' : mode === 'air' ? 'bg-purple-500' : 'bg-amber-500'} h-2 rounded-full`}
                      style={{ width: `${(cfg.minDays / 35) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {cfg.minDays}–{cfg.maxDays} gün
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Info size={13} className="mt-0.5 flex-shrink-0" />
                <span>Fiyatlar tahmini navlun endekslerine dayanmaktadır. Gerçek teklif için lojistik firmasıyla iletişime geçin.</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-slate-300 py-16">
              <Calculator size={48} strokeWidth={1} />
              <p className="text-sm">Parametreleri doldurup<br /><span className="font-semibold">Hesapla</span> butonuna basın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
