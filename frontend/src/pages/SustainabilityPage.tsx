import { Leaf, Award, AlertTriangle, CheckCircle, Info, TrendingDown } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  carbonKg: number;
  carbonLevel: 'low' | 'medium' | 'high';
  certs: string[];
  score: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Organik Pamuk Kumaş',
    origin: 'Hindistan',
    category: 'Tekstil',
    carbonKg: 1.8,
    carbonLevel: 'low',
    certs: ['GOTS', 'Fair Trade', 'OEKO-TEX'],
    score: 92,
  },
  {
    id: 2,
    name: 'Çelik Profiller',
    origin: 'Çin',
    category: 'İnşaat',
    carbonKg: 18.4,
    carbonLevel: 'high',
    certs: ['ISO 14001'],
    score: 41,
  },
  {
    id: 3,
    name: 'Zeytinyağı (Cam Şişe)',
    origin: 'İspanya',
    category: 'Gıda',
    carbonKg: 3.2,
    carbonLevel: 'medium',
    certs: ['EU Organic', 'PDO'],
    score: 74,
  },
  {
    id: 4,
    name: 'Elektronik Bileşen',
    origin: 'Tayvan',
    category: 'Elektronik',
    carbonKg: 9.7,
    carbonLevel: 'medium',
    certs: ['RoHS', 'CE'],
    score: 58,
  },
  {
    id: 5,
    name: 'Bambu Mobilya Seti',
    origin: 'Vietnam',
    category: 'Mobilya',
    carbonKg: 0.9,
    carbonLevel: 'low',
    certs: ['FSC', 'SA8000'],
    score: 96,
  },
];

const certColors: Record<string, string> = {
  GOTS: 'bg-green-100 text-green-700',
  'Fair Trade': 'bg-amber-100 text-amber-700',
  'OEKO-TEX': 'bg-blue-100 text-blue-700',
  'ISO 14001': 'bg-purple-100 text-purple-700',
  'EU Organic': 'bg-emerald-100 text-emerald-700',
  PDO: 'bg-orange-100 text-orange-700',
  RoHS: 'bg-red-100 text-red-700',
  CE: 'bg-slate-100 text-slate-700',
  FSC: 'bg-teal-100 text-teal-700',
  SA8000: 'bg-indigo-100 text-indigo-700',
};

function CarbonBar({ level, kg }: { level: string; kg: number }) {
  const max = 20;
  const pct = Math.min((kg / max) * 100, 100);
  const color =
    level === 'low' ? 'bg-teal-500' : level === 'medium' ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-14 text-right">{kg} kg CO₂</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-teal-500'
      : score >= 60
        ? 'bg-amber-400'
        : 'bg-red-500';
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
      >
        {score}
      </div>
      <span className="text-xs text-slate-400 mt-1">Puan</span>
    </div>
  );
}

const levelLabel: Record<string, { label: string; icon: JSX.Element; cls: string }> = {
  low: {
    label: 'Düşük Etki',
    icon: <CheckCircle size={13} />,
    cls: 'text-teal-600 bg-teal-50 ring-1 ring-teal-200',
  },
  medium: {
    label: 'Orta Etki',
    icon: <Info size={13} />,
    cls: 'text-amber-600 bg-amber-50 ring-1 ring-amber-200',
  },
  high: {
    label: 'Yüksek Etki',
    icon: <AlertTriangle size={13} />,
    cls: 'text-red-600 bg-red-50 ring-1 ring-red-200',
  },
};

export default function SustainabilityPage() {
  const avgScore = Math.round(products.reduce((a, p) => a + p.score, 0) / products.length);
  const lowCount = products.filter((p) => p.carbonLevel === 'low').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow">
            <Leaf size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sürdürülebilirlik Karnesi</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          İthal edilen ürünlerin karbon ayak izi ve etik üretim sertifikaları.
        </p>
      </div>

      {}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
            <Award size={22} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
            <p className="text-xs text-slate-400">Ortalama Sürdürülebilirlik Puanı</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Leaf size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{lowCount}/{products.length}</p>
            <p className="text-xs text-slate-400">Düşük Karbon Etkili Ürün</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <TrendingDown size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">-12%</p>
            <p className="text-xs text-slate-400">Karbon Azalımı (Bu Çeyrek)</p>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Ürün Karbon & Sertifika Raporu</h2>
          <span className="text-xs text-slate-400">{products.length} ürün listelendi</span>
        </div>
        <div className="divide-y divide-slate-100">
          {products.map((p) => {
            const lvl = levelLabel[p.carbonLevel];
            return (
              <div key={p.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-6">
                  {}
                  <ScoreBadge score={p.score} />

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${lvl.cls}`}>
                        {lvl.icon}
                        {lvl.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      {p.origin} · {p.category}
                    </p>
                    <CarbonBar level={p.carbonLevel} kg={p.carbonKg} />
                  </div>

                  {}
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
                    {p.certs.map((c) => (
                      <span
                        key={c}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${certColors[c] ?? 'bg-slate-100 text-slate-600'}`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="mt-6 flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-5 py-4">
        <Info size={16} className="text-teal-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-teal-700">
          Karbon ayak izi verileri ürün başına kg CO₂ eşdeğeri cinsinden hesaplanmıştır. Sertifika bilgileri
          tedarikçi beyanlarına ve uluslararası veri tabanlarına dayanmaktadır. Güncel doğrulama için tedarikçinizle
          iletişime geçin.
        </p>
      </div>
    </div>
  );
}
