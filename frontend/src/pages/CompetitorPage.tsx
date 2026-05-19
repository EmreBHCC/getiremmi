import { useState } from 'react';
import { BarChart2, ArrowUpRight, ArrowDownRight, Minus, RefreshCw, TrendingUp, Store } from 'lucide-react';

interface Competitor {
  id: number;
  name: string;
  category: string;
  price: number;
  prevPrice: number;
  stockStatus: 'in_stock' | 'low' | 'out';
  stockPct: number;
  rating: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const competitors: Competitor[] = [
  {
    id: 1,
    name: 'Migros Online',
    category: 'Organik Zeytinyağı 1L',
    price: 289.90,
    prevPrice: 274.90,
    stockStatus: 'in_stock',
    stockPct: 78,
    rating: 4.3,
    lastUpdated: '5 dk önce',
    trend: 'up',
  },
  {
    id: 2,
    name: 'Trendyol Market',
    category: 'Organik Zeytinyağı 1L',
    price: 264.00,
    prevPrice: 280.00,
    stockStatus: 'low',
    stockPct: 15,
    rating: 4.1,
    lastUpdated: '12 dk önce',
    trend: 'down',
  },
  {
    id: 3,
    name: 'HepsiburadaMarket',
    category: 'Organik Zeytinyağı 1L',
    price: 275.50,
    prevPrice: 275.50,
    stockStatus: 'in_stock',
    stockPct: 55,
    rating: 4.5,
    lastUpdated: '8 dk önce',
    trend: 'stable',
  },
  {
    id: 4,
    name: 'CarrefourSA',
    category: 'Organik Zeytinyağı 1L',
    price: 312.00,
    prevPrice: 298.00,
    stockStatus: 'in_stock',
    stockPct: 90,
    rating: 3.9,
    lastUpdated: '20 dk önce',
    trend: 'up',
  },
  {
    id: 5,
    name: 'A101 Online',
    category: 'Organik Zeytinyağı 1L',
    price: 249.90,
    prevPrice: 259.90,
    stockStatus: 'out',
    stockPct: 0,
    rating: 3.7,
    lastUpdated: '35 dk önce',
    trend: 'down',
  },
];

const categories = ['Organik Zeytinyağı 1L', 'Premium İpek Kumaş', 'Endüstriyel Motor Yağı'];

function PriceTrend({ trend, change }: { trend: string; change: number }) {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-0.5 text-red-600 text-xs font-medium">
        <ArrowUpRight size={13} />+{change.toFixed(2)} ₺
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-0.5 text-teal-600 text-xs font-medium">
        <ArrowDownRight size={13} />{change.toFixed(2)} ₺
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-slate-400 text-xs font-medium">
      <Minus size={13} />Değişmedi
    </span>
  );
}

function StockBar({ pct, status }: { pct: number; status: string }) {
  const color =
    status === 'out' ? 'bg-red-400' : status === 'low' ? 'bg-amber-400' : 'bg-teal-500';
  const label =
    status === 'out' ? 'Stok Yok' : status === 'low' ? 'Az Stok' : 'Stokta';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-medium text-slate-600">%{pct}</span>
      </div>
      <div className="bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CompetitorPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const minPrice = Math.min(...competitors.map((c) => c.price));
  const maxPrice = Math.max(...competitors.map((c) => c.price));
  const avgPrice = competitors.reduce((a, c) => a + c.price, 0) / competitors.length;
  const upCount = competitors.filter((c) => c.trend === 'up').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center shadow">
              <BarChart2 size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Rakip Analizi</h1>
          </div>
          <p className="text-slate-500 text-sm ml-12">
            Türkiye pazarındaki yerel rakiplerin anlık fiyat ve stok durumu takibi.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm ${refreshing ? 'opacity-60' : ''}`}
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Yenileniyor...' : 'Veri Yenile'}
        </button>
      </div>

      {}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-rose-500 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'En Düşük Fiyat', value: `${minPrice.toFixed(2)} ₺`, color: 'text-teal-600', bg: 'bg-teal-50', icon: <ArrowDownRight size={20} className="text-teal-600" /> },
          { label: 'En Yüksek Fiyat', value: `${maxPrice.toFixed(2)} ₺`, color: 'text-red-600', bg: 'bg-red-50', icon: <ArrowUpRight size={20} className="text-red-600" /> },
          { label: 'Ortalama Fiyat', value: `${avgPrice.toFixed(2)} ₺`, color: 'text-slate-900', bg: 'bg-slate-50', icon: <TrendingUp size={20} className="text-slate-500" /> },
          { label: 'Fiyat Arttıran', value: `${upCount} rakip`, color: 'text-rose-600', bg: 'bg-rose-50', icon: <Store size={20} className="text-rose-500" /> },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            {selectedCategory} — Rakip Fiyat & Stok Durumu
          </h2>
          <span className="text-xs text-slate-400">{competitors.length} platform izleniyor</span>
        </div>
        <div className="divide-y divide-slate-100">
          {competitors.map((c) => {
            const change = c.price - c.prevPrice;
            const isLowest = c.price === minPrice;
            return (
              <div key={c.id} className={`px-6 py-5 hover:bg-slate-50/50 transition-colors ${isLowest ? 'border-l-4 border-l-teal-400' : ''}`}>
                <div className="flex items-center gap-6">
                  {}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Store size={18} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      {isLowest && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                          En Ucuz
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Güncellendi: {c.lastUpdated}</p>
                  </div>

                  {}
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">{c.price.toFixed(2)} ₺</p>
                    <PriceTrend trend={c.trend} change={Math.abs(change)} />
                  </div>

                  {}
                  <div className="w-36">
                    <StockBar pct={c.stockPct} status={c.stockStatus} />
                  </div>

                  {}
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">⭐ {c.rating}</p>
                    <p className="text-xs text-slate-400">Puan</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
        <RefreshCw size={11} />
        Veriler web scraping ile her 15 dakikada bir güncellenmektedir. Gerçek zamanlı fiyatlar farklılık gösterebilir.
      </p>
    </div>
  );
}
