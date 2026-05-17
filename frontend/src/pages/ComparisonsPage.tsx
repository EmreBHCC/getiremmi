import { Plus, Download, TrendingUp, Minus } from 'lucide-react';

interface Product {
  name: string;
  category: string;
  image: string;
  price: string;
  unit: string;
  demandIndex: number;
  demandChange: string;
  demandTrend: 'up' | 'neutral' | 'down';
  volatility: 'Yüksek' | 'Orta' | 'Düşük';
  importTariff: string;
}

const products: Product[] = [
  {
    name: 'Premium İpek',
    category: 'TEKSTİL',
    image: 'https://images.pexels.com/photos/4464484/pexels-photo-4464484.jpeg?auto=compress&cs=tinysrgb&w=80',
    price: '$45,00',
    unit: '/yard',
    demandIndex: 82,
    demandChange: '+%4,2',
    demandTrend: 'up',
    volatility: 'Yüksek',
    importTariff: '%12,5',
  },
  {
    name: 'Sızma Zeytinyağı',
    category: 'TARIM',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=80',
    price: '$18,50',
    unit: '/L',
    demandIndex: 65,
    demandChange: '%0,0',
    demandTrend: 'neutral',
    volatility: 'Orta',
    importTariff: '%5,0',
  },
  {
    name: 'Çeşitli Baharatlar',
    category: 'TARIM',
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=80',
    price: '$22,00',
    unit: '/kg',
    demandIndex: 91,
    demandChange: '+%8,5',
    demandTrend: 'up',
    volatility: 'Düşük',
    importTariff: '%8,2',
  },
];

const volatilityStyles: Record<string, string> = {
  'Yüksek': 'bg-red-100 text-red-600',
  'Orta': 'bg-blue-100 text-blue-600',
  'Düşük': 'bg-slate-100 text-slate-600',
};

function TrendBadge({ change, trend }: { change: string; trend: Product['demandTrend'] }) {
  if (trend === 'neutral') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        <Minus size={10} />
        {change}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-600">
      <TrendingUp size={10} />
      {change}
    </span>
  );
}

export default function ComparisonsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Ürün Karşılaştırması</h1>
          <p className="text-slate-500 text-sm">
            {products.length} seçili emtia genelinde temel metrikler analiz ediliyor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Plus size={15} />
            Ürün Ekle
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
            <Download size={15} />
            Raporu Dışa Aktar
          </button>
        </div>
      </div>

      <div className="flex gap-0">
        {/* Satır etiketleri */}
        <div className="w-56 flex-shrink-0 pt-32">
          {[
            { label: 'Güncel Fiyat', height: 'h-28' },
            { label: 'Küresel Talep Endeksi', height: 'h-28' },
            { label: 'Arz Oynaklığı', height: 'h-28' },
            { label: 'Ort. İthalat Tarifesi', height: 'h-28' },
          ].map((row) => (
            <div key={row.label} className={`${row.height} flex items-start pt-2`}>
              <div className="w-full">
                <p className="text-sm text-slate-600 font-medium mb-3">{row.label}</p>
                <div className="h-px bg-slate-200 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Ürün sütunları */}
        <div className="flex gap-4 flex-1">
          {products.map((product) => (
            <div
              key={product.name}
              className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Ürün başlığı */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-base">{product.name}</p>
                    <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">{product.category}</p>
                  </div>
                </div>
              </div>

              {/* Metrikler */}
              <div className="px-5">
                {/* Güncel Fiyat */}
                <div className="h-28 flex items-start pt-5">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">{product.price}</span>
                    <span className="text-sm text-slate-400 ml-1">{product.unit}</span>
                  </div>
                </div>

                {/* Küresel Talep Endeksi */}
                <div className="h-28 flex items-start pt-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{product.demandIndex}</span>
                    <TrendBadge change={product.demandChange} trend={product.demandTrend} />
                  </div>
                </div>

                {/* Arz Oynaklığı */}
                <div className="h-28 flex items-start pt-5">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${volatilityStyles[product.volatility]}`}>
                    {product.volatility}
                  </span>
                </div>

                {/* Ort. İthalat Tarifesi */}
                <div className="h-28 flex items-start pt-5">
                  <span className="text-2xl font-bold text-slate-900">{product.importTariff}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
