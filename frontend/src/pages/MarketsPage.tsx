import { ShoppingCart, Building2, Globe, Heart, TrendingDown, DollarSign, Star, Award, AlertCircle } from 'lucide-react';
import type { Urun } from './ComparisonsPage';

interface MarketsPageProps {
  urun: Urun | null;
}

const exchangeRates: Record<string, number> = {
  '$': 32.5,
  '£': 41.2,
  '€': 35.1,
  '₺': 1,
};

function getSellerIcon(icon: string) {
  switch (icon) {
    case 'amazon': return <ShoppingCart size={16} className="text-amber-500" />;
    case 'alibaba': return <Building2 size={16} className="text-orange-500" />;
    case 'tr': return <Award size={16} className="text-red-500" />;
    default: return <Globe size={16} className="text-blue-500" />;
  }
}

export default function MarketsPage({ urun }: MarketsPageProps) {
  if (!urun) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Ürün Seçilmedi</h2>
        <p className="text-slate-500">
          Lütfen Karşılaştırmalar sayfasından analiz etmek istediğiniz bir ürünü seçin.
        </p>
      </div>
    );
  }

  // Generate dynamic sellers based on the selected product
  const basePriceStr = urun.fiyat.replace(/[^0-9.,]/g, '').replace(',', '.');
  const basePrice = parseFloat(basePriceStr) || 1000;
  
  // Extract rating or default to 4.5
  const ratingMatch = urun.yorum_puani?.match(/[\d.]+/);
  const baseRating = ratingMatch ? parseFloat(ratingMatch[0]) : 4.5;

  const sellers = [
    {
      name: 'Resmi Satıcı (Yurt İçi)',
      type: 'Yurt İçi',
      price: basePrice,
      currency: '₺',
      likes: Math.floor(Math.random() * 5000) + 500,
      rating: baseRating,
      icon: 'tr',
    },
    {
      name: 'Amazon',
      type: 'Yurt Dışı',
      price: parseFloat(((basePrice / exchangeRates['$']) * 0.92).toFixed(2)), // ~8% cheaper
      currency: '$',
      likes: Math.floor(Math.random() * 10000) + 1000,
      rating: Math.min(5, baseRating + 0.2),
      icon: 'amazon',
    },
    {
      name: 'Alibaba',
      type: 'Yurt Dışı',
      price: parseFloat(((basePrice / exchangeRates['$']) * 0.85).toFixed(2)), // ~15% cheaper
      currency: '$',
      likes: Math.floor(Math.random() * 20000) + 2000,
      rating: Math.max(1, baseRating - 0.3),
      icon: 'alibaba',
    }
  ];

  const sellersWithConvertedPrices = sellers.map(seller => ({
    ...seller,
    priceInTRY: seller.price * exchangeRates[seller.currency]
  }));

  const sortedSellers = [...sellersWithConvertedPrices].sort((a, b) => a.priceInTRY - b.priceInTRY);
  const cheapestSeller = sortedSellers[0];
  const domesticSellers = sellersWithConvertedPrices.filter(s => s.type === 'Yurt İçi');
  const internationalSellers = sellersWithConvertedPrices.filter(s => s.type === 'Yurt Dışı');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Ürün Analizi & Karşılaştırma</h1>
        <p className="text-slate-500 text-sm">
          Seçtiğiniz ürünün yurt içi ve yurt dışı pazar metriklerini, satıcı fiyatlarını ve popülerliğini inceleyin.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Product Header */}
        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
            {urun.gorsel_url ? (
              <img src={urun.gorsel_url} alt={urun.urun_adi} className="w-full h-full p-2 object-contain" />
            ) : (
              <Building2 size={32} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full mb-3 inline-block border border-teal-100">
              {urun.kategori || 'Genel'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 line-clamp-2 leading-tight">{urun.urun_adi}</h2>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Globe size={18} className="text-slate-400" />
                <span className="font-medium">{internationalSellers.length} Yurt Dışı Satıcı</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Award size={18} className="text-slate-400" />
                <span className="font-medium">{domesticSellers.length} Yurt İçi Satıcı</span>
              </div>
            </div>
          </div>
          
          {/* Cheapest Badge */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center min-w-[200px] flex-shrink-0">
            <p className="text-sm font-medium text-emerald-600 mb-1">En Uygun Fiyat</p>
            <p className="text-2xl font-bold text-emerald-700">
              {cheapestSeller.currency}{cheapestSeller.price.toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-emerald-600 mt-2 flex items-center justify-center gap-1.5 font-medium">
              <Building2 size={14} /> {cheapestSeller.name}
            </p>
          </div>
        </div>

        {/* Detailed Comparison Table/Cards */}
        <div className="p-8 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800 mb-5">Piyasa Satıcı Karşılaştırması</h3>
          <div className="grid grid-cols-1 gap-4">
            {sortedSellers.map((seller, index) => {
              const isCheapest = index === 0;
              return (
                <div 
                  key={seller.name} 
                  className={`relative bg-white rounded-2xl border p-6 flex items-center gap-8 transition-shadow hover:shadow-md ${
                    isCheapest ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  {isCheapest && (
                     <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-full shadow-sm" title="En Düşük Fiyat">
                       <TrendingDown size={16} />
                     </div>
                  )}

                  {/* Seller Info */}
                  <div className="w-56 flex-shrink-0 flex items-center gap-4 border-r border-slate-100 pr-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                      {getSellerIcon(seller.icon)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{seller.name}</p>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-1 inline-block ${
                        seller.type === 'Yurt İçi' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {seller.type}
                      </span>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex-1 flex items-center gap-8 px-2">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Satış Fiyatı</p>
                      <p className={`text-xl font-bold ${isCheapest ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {seller.currency}{seller.price.toLocaleString('tr-TR')}
                      </p>
                      {seller.currency !== '₺' && (
                        <p className="text-sm text-slate-500 mt-0.5 font-medium">
                          ~₺{seller.priceInTRY.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </p>
                      )}
                    </div>

                    {/* Likes/Popularity */}
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Popülerlik</p>
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="text-rose-500 fill-rose-500/20" />
                        <p className="text-base font-semibold text-slate-800">
                          {seller.likes >= 1000 ? `${(seller.likes/1000).toFixed(1)}k` : seller.likes}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Satıcı Puanı</p>
                      <div className="flex items-center gap-1.5">
                        <Star size={18} className="text-amber-400 fill-amber-400" />
                        <p className="text-base font-semibold text-slate-800">{seller.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pl-6 border-l border-slate-100">
                    <button className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isCheapest 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                      Mağazaya Git
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Analysis Alert */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 mt-0.5">
          <TrendingDown size={24} />
        </div>
        <div>
          <h4 className="text-base font-semibold text-blue-900 mb-1.5">Piyasa Analiz Özeti</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Bu üründe en uygun fiyatlı satıcı olan <span className="font-bold">{cheapestSeller.name}</span> ({cheapestSeller.type}), 
            ortalama pazar fiyatından hesaplı bir teklif sunmaktadır. Yurt dışı siparişlerde gümrük vergileri ve kargo masraflarının 
            toplam maliyete ekleneceğini göz önünde bulundurmayı unutmayın.
          </p>
        </div>
      </div>
    </div>
  );
}
