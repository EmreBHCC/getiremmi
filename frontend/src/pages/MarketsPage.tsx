import { MoreHorizontal, Download, TrendingUp, ShoppingCart, Building2, Globe } from 'lucide-react';

interface Commodity {
  name: string;
  price: string;
  unit: string;
  popularity: number;
  buyers: string;
  flag: string;
  country: string;
  image: string;
}

interface Platform {
  name: string;
  type: string;
  buyers: number;
  icon: string;
  barColor: string;
  barWidth: string;
}

interface TradeMetric {
  country: string;
  flag: string;
  primaryExport: string;
  importTariff: string;
  shippingDays: string;
  satisfaction: number;
  satisfactionColor: string;
}

const commodities: Commodity[] = [
  {
    name: 'Premium İpek',
    price: '$45,00',
    unit: 'yard',
    popularity: 72,
    buyers: '5.200',
    flag: '🇨🇳',
    country: 'ÇİN',
    image: 'https://images.pexels.com/photos/4464484/pexels-photo-4464484.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Sızma Zeytinyağı',
    price: '$18,50',
    unit: 'L',
    popularity: 60,
    buyers: '3.800',
    flag: '🇬🇷',
    country: 'YUN',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Çeşitli Baharatlar',
    price: '$22,00',
    unit: 'kg',
    popularity: 85,
    buyers: '4.100',
    flag: '🇮🇳',
    country: 'HİN',
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
];

const platforms: Platform[] = [
  { name: 'Amazon', type: 'B2C Perakende', buyers: 12450, icon: 'amazon', barColor: 'bg-teal-500', barWidth: 'w-full' },
  { name: 'Alibaba', type: 'Toptan Satış', buyers: 8900, icon: 'alibaba', barColor: 'bg-teal-400', barWidth: 'w-4/5' },
  { name: 'TradeDirect', type: 'Kurumsal', buyers: 3200, icon: 'trade', barColor: 'bg-slate-300', barWidth: 'w-2/5' },
];

const tradeMetrics: TradeMetric[] = [
  {
    country: 'Çin',
    flag: '🇨🇳',
    primaryExport: 'İpek, Elektronik',
    importTariff: '%12,5',
    shippingDays: '14-21',
    satisfaction: 8.4,
    satisfactionColor: 'bg-slate-100 text-slate-600',
  },
  {
    country: 'Yunanistan',
    flag: '🇬🇷',
    primaryExport: 'Zeytinyağı, Tarım',
    importTariff: '%4,2',
    shippingDays: '7-10',
    satisfaction: 9.2,
    satisfactionColor: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  },
  {
    country: 'Hindistan',
    flag: '🇮🇳',
    primaryExport: 'Baharat, Tekstil',
    importTariff: '%8,0',
    shippingDays: '18-25',
    satisfaction: 8.1,
    satisfactionColor: 'bg-slate-100 text-slate-600',
  },
];

function PlatformIcon({ name }: { name: string }) {
  if (name === 'Amazon') return <ShoppingCart size={16} className="text-slate-600" />;
  if (name === 'Alibaba') return <Building2 size={16} className="text-slate-600" />;
  return <Globe size={16} className="text-slate-600" />;
}

export default function MarketsPage() {
  return (
    <div className="p-8 max-w-5xl">
      {/* Sayfa başlığı */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Küresel Ticaret Karşılaştırması</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sınır ötesi ürün metriklerini ve platform dağılımını analiz edin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Raporu Dışa Aktar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
            Yeni Karşılaştırma
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Sol sütun */}
        <div className="flex-1 space-y-5">
          {/* En Çok İşlem Gören Emtialar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">En Çok İşlem Gören Emtialar</h2>
              <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {commodities.map((c) => (
                <div key={c.name} className="border border-slate-100 rounded-xl p-3 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 text-slate-500 font-medium">
                      {c.flag} {c.country}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{c.name}</p>
                  <p className="text-sm text-slate-700 mb-3">
                    <span className="font-medium">{c.price}</span>
                    <span className="text-slate-400 text-xs"> / {c.unit}</span>
                  </p>
                  <div className="h-px bg-slate-100 mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span>Popülerlik</span>
                      <TrendingUp size={10} className="text-teal-500" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{c.buyers}</p>
                      <p className="text-xs text-teal-600 font-medium">Alıcı</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticaret Metrikleri Karşılaştırması */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Ticaret Metrikleri Karşılaştırması</h2>
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-md px-2.5 py-1.5 hover:bg-slate-50 transition-colors">
                <Download size={12} />
                CSV
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Menşe Ülke</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Başlıca İhracat</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Ort. İthalat Tarifesi</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Ort. Kargo (Gün)</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Alıcı Memnuniyeti</th>
                </tr>
              </thead>
              <tbody>
                {tradeMetrics.map((row, i) => (
                  <tr
                    key={row.country}
                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                      i === tradeMetrics.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{row.flag}</span>
                        <span className="text-sm font-medium text-slate-800">{row.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.primaryExport}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 text-right font-medium">{row.importTariff}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 text-right">{row.shippingDays}</td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-flex items-center justify-center text-sm font-semibold rounded-full px-3 py-1 ${row.satisfactionColor}`}
                      >
                        {row.satisfaction}/10
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ sütun - Hangi platform? */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900">Hangi Platform?</h2>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">Platform satış dağılımı</p>
            <div className="space-y-5">
              {platforms.map((platform) => (
                <div key={platform.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <PlatformIcon name={platform.name} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{platform.name}</p>
                        <p className="text-xs text-slate-400">{platform.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{platform.buyers.toLocaleString('tr-TR')}</p>
                      <p className="text-xs text-teal-600 font-medium">Alıcı</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${platform.barColor} ${platform.barWidth} rounded-full transition-all`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alt bilgi */}
      <footer className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            © 2024 Getiremmi. Kurumsal Düzeyde Veri.
          </p>
          <div className="flex items-center gap-6">
            {['Ticaret Mevzuatı', 'Piyasa Analizleri', 'Hukuki Uyum', 'Teknik Destek'].map((link) => (
              <a key={link} href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
