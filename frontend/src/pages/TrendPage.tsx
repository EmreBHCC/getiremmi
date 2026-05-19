import { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles, ChevronRight } from 'lucide-react';

interface ProductGroup {
  id: string;
  name: string;
  emoji: string;
  current: number;
  m1: number;
  m2: number;
  m3: number;
  confidence: number;
  trend: 'rising' | 'falling' | 'stable';
  driver: string;
}

const groups: ProductGroup[] = [
  {
    id: 'textile',
    name: 'Tekstil & Hazır Giyim',
    emoji: '🧵',
    current: 62,
    m1: 71,
    m2: 79,
    m3: 88,
    confidence: 84,
    trend: 'rising',
    driver: 'Sezonsal talep artışı ve AB ihracat kotaları tekstil fiyatlarını yukarı taşıyacak.',
  },
  {
    id: 'food',
    name: 'Gıda & Tarım Ürünleri',
    emoji: '🌾',
    current: 78,
    m1: 82,
    m2: 76,
    m3: 71,
    confidence: 76,
    trend: 'stable',
    driver: 'Akdeniz kuraklığı kısa vadede fiyatları desteklese de hasat sonrası baskı oluşabilir.',
  },
  {
    id: 'electronics',
    name: 'Elektronik & Yarıiletken',
    emoji: '💻',
    current: 55,
    m1: 48,
    m2: 44,
    m3: 40,
    confidence: 71,
    trend: 'falling',
    driver: 'Çip arzının normalleşmesi ve Tayvan üretiminin artışıyla fiyatlar gerilemeye devam edecek.',
  },
  {
    id: 'chemicals',
    name: 'Kimyasal & Plastik',
    emoji: '⚗️',
    current: 45,
    m1: 51,
    m2: 62,
    m3: 74,
    confidence: 79,
    trend: 'rising',
    driver: 'Petrokimya hammadde maliyetleri ve yeni AB CBAM düzenlemeleri baskı yaratacak.',
  },
  {
    id: 'metals',
    name: 'Metaller & Çelik',
    emoji: '🔩',
    current: 70,
    m1: 66,
    m2: 61,
    m3: 58,
    confidence: 68,
    trend: 'falling',
    driver: 'Çin demir çelik fazlası ve küresel inşaat sektöründe yavaşlama baskı oluşturuyor.',
  },
];

const trendConfig = {
  rising: { label: 'Yükseliş', icon: TrendingUp, cls: 'text-teal-600', bg: 'bg-teal-50 border-teal-200', barColor: 'bg-teal-500' },
  falling: { label: 'Düşüş', icon: TrendingDown, cls: 'text-red-500', bg: 'bg-red-50 border-red-200', barColor: 'bg-red-400' },
  stable: { label: 'Yatay', icon: Minus, cls: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', barColor: 'bg-amber-400' },
};

function MiniChart({ values, trend }: { values: number[]; trend: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const width = 120;
  const height = 48;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const color = trend === 'rising' ? '#14b8a6' : trend === 'falling' ? '#ef4444' : '#f59e0b';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-teal-500' : value >= 70 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">AI Güven Skoru</span>
        <span className="text-xs font-semibold text-slate-700">%{value}</span>
      </div>
      <div className="bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function TrendPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const risingCount = groups.filter((g) => g.trend === 'rising').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Başlık */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow">
            <Brain size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Trend Tahminleyici</h1>
          <span className="flex items-center gap-1 text-xs font-medium bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
            <Sparkles size={11} />
            AI Destekli
          </span>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          Geçmiş verilere dayalı önümüzdeki 3 aydaki ürün grubu fiyat tahminleri.
        </p>
      </div>

      {/* Özet Bilgi */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm mb-1">Bu çeyrekte yükseliş beklenen sektör sayısı</p>
            <p className="text-4xl font-bold">{risingCount}<span className="text-xl text-violet-300">/{groups.length}</span></p>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-sm mb-1">En güçlü sinyal</p>
            <p className="text-xl font-semibold">Tekstil 🧵</p>
            <p className="text-violet-300 text-xs">+26 puan bekleniyor</p>
          </div>
          <Brain size={80} strokeWidth={0.5} className="text-white/20 absolute right-10" />
        </div>
      </div>

      {/* Sektör Kartları */}
      <div className="grid grid-cols-1 gap-4">
        {groups.map((g) => {
          const tc = trendConfig[g.trend];
          const TrendIcon = tc.icon;
          const isSelected = selected === g.id;
          const chartValues = [g.current, g.m1, g.m2, g.m3];

          return (
            <div
              key={g.id}
              className={`bg-white rounded-2xl border shadow-sm transition-all cursor-pointer ${
                isSelected ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-200'
              }`}
              onClick={() => setSelected(isSelected ? null : g.id)}
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {/* Emoji & İsim */}
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                    {g.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">{g.name}</p>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${tc.bg} ${tc.cls}`}>
                        <TrendIcon size={11} />
                        {tc.label}
                      </span>
                    </div>
                    <ConfidenceBar value={g.confidence} />
                  </div>

                  {/* Mini Grafik */}
                  <div className="flex-shrink-0">
                    <MiniChart values={chartValues} trend={g.trend} />
                    <div className="flex justify-between text-xs text-slate-400 mt-1" style={{ width: 120 }}>
                      <span>Şimdi</span>
                      <span>3 Ay</span>
                    </div>
                  </div>

                  {/* Değerler */}
                  <div className="text-right flex-shrink-0 w-24">
                    <p className="text-xl font-bold text-slate-900">{g.m3}</p>
                    <p className="text-xs text-slate-400">3. Ay Endeks</p>
                    <p className={`text-xs font-medium mt-0.5 ${tc.cls}`}>
                      {g.m3 > g.current ? '+' : ''}{g.m3 - g.current} puan
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {/* Açılan Detay */}
              {isSelected && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'Mevcut', value: g.current },
                        { label: '1. Ay', value: g.m1 },
                        { label: '2. Ay', value: g.m2 },
                        { label: '3. Ay', value: g.m3 },
                      ].map((item) => (
                        <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                          <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                          <p className="text-lg font-bold text-slate-900">{item.value}</p>
                          <div className={`h-1 rounded-full mt-2 ${tc.barColor}`} style={{ width: `${item.value}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2.5 bg-violet-50 border border-violet-100 rounded-xl p-4">
                      <Sparkles size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-violet-800 mb-1">AI Analiz Özeti</p>
                        <p className="text-xs text-violet-700">{g.driver}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">
        Tahminler makine öğrenmesi modeli tarafından üretilmekte olup yatırım tavsiyesi niteliği taşımamaktadır.
        Güncelleme: Pazar kapanışı sonrası otomatik.
      </p>
    </div>
  );
}
