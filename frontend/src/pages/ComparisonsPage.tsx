import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Star,
  X,
  ChevronDown,
  BarChart3,
  Package,
  ExternalLink,
  Scale,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import type { Page } from '../App';


export interface Urun {
  id: number;
  link: string;
  urun_adi: string;
  fiyat: string;
  yorum_puani: string;
  stok_durumu: string;
  gorsel_url: string | null;
  kategori: string;
}


function parseRating(raw: string): number | null {
  if (!raw || raw === 'Puan bulunamadı') return null;
  const m = raw.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function parsePriceTRY(raw: string): number | null {
  if (!raw || raw === 'Fiyat bulunamadı') return null;
  
  const clean = raw.replace(/[^0-9.,]/g, '').replace(',', '');
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

function StockBadge({ stok }: { stok: string }) {
  const inStock =
    !stok.toLowerCase().includes('cannot') &&
    !stok.toLowerCase().includes('bulunamadı') &&
    !stok.toLowerCase().includes('dispatched');
  const limited = stok.toLowerCase().includes('only') || stok.toLowerCase().includes('left');

  if (limited) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
        <AlertCircle size={10} /> Az Kaldı
      </span>
    );
  }
  if (inStock) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
        <CheckCircle2 size={10} /> Stokta
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
      <X size={10} /> Stok Yok
    </span>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-slate-400 text-xs">—</span>;
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? 'text-amber-400' : half && i === full + 1 ? 'text-amber-300' : 'text-slate-200'}>
          ★
        </span>
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}


const CATEGORY_ICONS: Record<string, string> = {
  'Tümü': '🔍',
  'Marvel & DC': '🦸',
  'Star Wars': '⚔️',
  'Oyun Karakterleri': '🎮',
  'Disney & Pixar': '✨',
  'Canavar & Yaratıklar': '🦕',
  'Anime': '⛩️',
  'Diğer Figürler': '🤖',
};


function ComparePanel({
  selected,
  onRemove,
}: {
  selected: Urun[];
  onRemove: (id: number) => void;
}) {
  if (selected.length === 0) return null;

  const prices = selected.map((u) => parsePriceTRY(u.fiyat));
  const ratings = selected.map((u) => parseRating(u.yorum_puani));
  const minPrice = Math.min(...(prices.filter((p) => p !== null) as number[]));
  const maxRating = Math.max(...(ratings.filter((r) => r !== null) as number[]));

  const rows = [
    { label: 'Fiyat (TRY)', render: (u: Urun, i: number) => {
      const p = prices[i];
      return p !== null ? (
        <span className={`font-bold text-base ${p === minPrice ? 'text-emerald-600' : 'text-slate-800'}`}>
          ₺{p.toLocaleString('tr-TR')}
          {p === minPrice && <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-1 rounded">En Ucuz</span>}
        </span>
      ) : <span className="text-slate-400 text-sm">—</span>;
    }},
    { label: 'Puan', render: (u: Urun, i: number) => {
      const r = ratings[i];
      return (
        <div className={r === maxRating && r !== null ? 'ring-1 ring-amber-300 rounded-lg px-1' : ''}>
          <StarRating rating={r} />
        </div>
      );
    }},
    { label: 'Stok', render: (u: Urun) => <StockBadge stok={u.stok_durumu} /> },
    { label: 'Kategori', render: (u: Urun) => (
      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{u.kategori}</span>
    )},
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale size={16} className="text-teal-600" />
          <span className="font-semibold text-slate-800 text-sm">
            Karşılaştırma ({selected.length}/3)
          </span>
          <div className="flex-1" />
          <span className="text-xs text-slate-400">Max 3 ürün seçebilirsiniz</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs text-slate-400 font-medium pb-2 w-32">Kriter</th>
                {selected.map((u) => (
                  <th key={u.id} className="pb-2 px-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {u.gorsel_url ? (
                          <img src={u.gorsel_url} alt="" className="w-8 h-8 rounded-lg object-contain flex-shrink-0 bg-slate-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Package size={14} className="text-slate-400" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-slate-700 line-clamp-2 text-left max-w-[120px]">{u.urun_adi}</span>
                      </div>
                      <button
                        onClick={() => onRemove(u.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="py-2 text-xs text-slate-500 font-medium">{row.label}</td>
                  {selected.map((u, i) => (
                    <td key={u.id} className="py-2 px-3 text-center">
                      {row.render(u, i)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function UrunKarti({
  urun,
  isSelected,
  onToggle,
  canAdd,
  onCardClick,
}: {
  urun: Urun;
  isSelected: boolean;
  onToggle: () => void;
  canAdd: boolean;
  onCardClick: () => void;
}) {
  const rating = parseRating(urun.yorum_puani);
  const price = parsePriceTRY(urun.fiyat);

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden group
        ${isSelected
          ? 'border-teal-400 shadow-lg shadow-teal-100 ring-2 ring-teal-400/30'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm'
        }`}
    >
      {}
      <div className="relative h-44 bg-slate-50 overflow-hidden">
        {urun.gorsel_url ? (
          <img
            src={urun.gorsel_url}
            alt={urun.urun_adi}
            className="w-full h-full p-2 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-slate-300" />
          </div>
        )}
        {}
        <div className="absolute top-2 left-2">
          <span className="text-xs bg-white/90 backdrop-blur-sm text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
            {CATEGORY_ICONS[urun.kategori] ?? '📦'} {urun.kategori}
          </span>
        </div>
        {}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={!canAdd && !isSelected}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all
            ${isSelected
              ? 'bg-teal-500 text-white shadow-md'
              : canAdd
                ? 'bg-white/90 backdrop-blur-sm text-slate-400 hover:bg-teal-500 hover:text-white border border-slate-200'
                : 'bg-slate-100/80 text-slate-300 cursor-not-allowed'
            }`}
        >
          {isSelected ? <Minus size={12} /> : <Plus size={12} />}
        </button>
      </div>

      {}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[2.5rem]">
          {urun.urun_adi}
        </h3>

        {}
        <div className="mb-2">
          <StarRating rating={rating} />
        </div>

        {}
        <div className="mb-3">
          {price !== null ? (
            <span className="text-lg font-bold text-slate-900">
              ₺{price.toLocaleString('tr-TR')}
            </span>
          ) : (
            <span className="text-sm text-slate-400 italic">Fiyat bilgisi yok</span>
          )}
        </div>

        {}
        <div className="flex items-center justify-between">
          <StockBadge stok={urun.stok_durumu} />
          <a
            href={urun.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-teal-600 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}


export default function ComparisonsPage({ 
  onNavigate,
  onProductSelect
}: { 
  onNavigate: (page: Page) => void;
  onProductSelect?: (urun: Urun) => void;
}) {
  const [kategoriler, setKategoriler] = useState<string[]>([]);
  const [aktifKategori, setAktifKategori] = useState<string>('Tümü');
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedUrunler, setSelectedUrunler] = useState<Urun[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'fiyat_asc' | 'fiyat_desc' | 'puan'>('default');
  const [showSort, setShowSort] = useState(false);

  
  useEffect(() => {
    fetch('/api/kategoriler')
      .then((r) => r.json())
      .then((data) => {
        
        const names: string[] = (data.kategoriler as { ad: string }[]).map((k) => k.ad);
        setKategoriler(['Tümü', ...names]);
      })
      .catch(console.error);
  }, []);

  
  const fetchUrunler = useCallback(() => {
    setYukleniyor(true);
    const params = new URLSearchParams({ limit: '100', offset: '0' });
    if (aktifKategori !== 'Tümü') params.set('kategori', aktifKategori);

    fetch(`/api/urunler?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUrunler(data.urunler ?? []);
      })
      .catch(console.error)
      .finally(() => setYukleniyor(false));
  }, [aktifKategori]);

  useEffect(() => {
    fetchUrunler();
  }, [fetchUrunler]);

  
  const toggleSelect = (urun: Urun) => {
    if (selectedIds.includes(urun.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== urun.id));
      setSelectedUrunler((prev) => prev.filter((u) => u.id !== urun.id));
    } else if (selectedIds.length < 3) {
      setSelectedIds((prev) => [...prev, urun.id]);
      setSelectedUrunler((prev) => [...prev, urun]);
    }
  };

  
  const filtered = urunler
    .filter((u) =>
      u.urun_adi.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'fiyat_asc') {
        const pa = parsePriceTRY(a.fiyat) ?? Infinity;
        const pb = parsePriceTRY(b.fiyat) ?? Infinity;
        return pa - pb;
      }
      if (sortBy === 'fiyat_desc') {
        const pa = parsePriceTRY(a.fiyat) ?? -Infinity;
        const pb = parsePriceTRY(b.fiyat) ?? -Infinity;
        return pb - pa;
      }
      if (sortBy === 'puan') {
        const ra = parseRating(a.yorum_puani) ?? 0;
        const rb = parseRating(b.yorum_puani) ?? 0;
        return rb - ra;
      }
      return 0;
    });

  const sortLabels: Record<string, string> = {
    default: 'Varsayılan Sıralama',
    fiyat_asc: 'Fiyat: Düşükten Yükseğe',
    fiyat_desc: 'Fiyat: Yüksekten Düşüğe',
    puan: 'Puana Göre',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      {}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={22} className="text-teal-600" />
                Ürün Karşılaştırması
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Figür veritabanından ürünleri karşılaştır — max 3 ürün seç
              </p>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2">
                <Scale size={16} className="text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  {selectedIds.length} ürün seçildi
                </span>
                <TrendingUp size={14} className="text-teal-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">

        {}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ürün adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {}
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:border-slate-300 transition-all min-w-[200px] justify-between"
            >
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown size={14} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-20 min-w-[200px] overflow-hidden">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key as typeof sortBy); setShowSort(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors
                      ${sortBy === key ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length}</span> ürün bulundu
            {aktifKategori !== 'Tümü' && (
              <> — <span className="text-teal-600 font-medium">{aktifKategori}</span></>
            )}
          </span>
        </div>

        {}
        {yukleniyor ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-5 bg-slate-100 rounded w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package size={40} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">Bu kategoride ürün bulunamadı</p>
            <p className="text-sm mt-1">Farklı bir kategori veya arama terimi deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((urun) => (
              <UrunKarti
                key={urun.id}
                urun={urun}
                isSelected={selectedIds.includes(urun.id)}
                onToggle={() => toggleSelect(urun)}
                canAdd={selectedIds.length < 3}
                onCardClick={() => onProductSelect?.(urun)}
              />
            ))}
          </div>
        )}
      </div>

      {}
      <ComparePanel selected={selectedUrunler} onRemove={(id) => {
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        setSelectedUrunler((prev) => prev.filter((u) => u.id !== id));
      }} />
    </div>
  );
}
