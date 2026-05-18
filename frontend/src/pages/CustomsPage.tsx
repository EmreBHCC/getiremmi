import { useState } from 'react';
import { BookOpen, Search, AlertCircle, CheckCircle, XCircle, Info, ChevronDown } from 'lucide-react';

interface GtipResult {
  code: string;
  description: string;
  taxRate: number;
  kdv: number;
  additionalDuty: number | null;
  status: 'free' | 'restricted' | 'banned';
  restrictions: string[];
  notes: string;
}

const gtipDatabase: Record<string, GtipResult> = {
  '5208.11': {
    code: '5208.11',
    description: 'Pamuklu dokuma kumaşlar (ağarlıkça %85 veya daha fazla pamuk içeren, boyanmamış, sade örgülü)',
    taxRate: 12,
    kdv: 20,
    additionalDuty: null,
    status: 'free',
    restrictions: [],
    notes: 'GTBS belgesi gerekli değildir. CE işareti aranmaz.',
  },
  '8542.31': {
    code: '8542.31',
    description: 'İşlemciler ve denetleyiciler (bellekler, dönüştürücüler ve diğerleriyle birlikte olsa da olmasa da)',
    taxRate: 0,
    kdv: 20,
    additionalDuty: 5,
    status: 'restricted',
    restrictions: ['CE Belgesi', 'RoHS Uyumluluk Beyanı', 'Teknik Dosya'],
    notes: 'Çift kullanımlı ürün kapsamında olabilir. Savunma amaçlı kullanımda izin zorunludur.',
  },
  '1509.10': {
    code: '1509.10',
    description: 'Zeytinyağı ve fraksiyonları (sızma zeytinyağı)',
    taxRate: 25.5,
    kdv: 1,
    additionalDuty: null,
    status: 'free',
    restrictions: ['Gıda Güvenliği Belgesi', 'Analiz Sertifikası'],
    notes: 'Gıda Tarım ve Hayvancılık Bakanlığı ön iznine tabidir. Ambalaj Türkçe etiket içermelidir.',
  },
  '9013.80': {
    code: '9013.80',
    description: 'Lazer cihazları (diğer optik alet ve cihazlar)',
    taxRate: 3.7,
    kdv: 20,
    additionalDuty: 8,
    status: 'restricted',
    restrictions: ['Radyasyon Güvenliği Lisansı', 'Savunma Sanayi Onayı (Sınıf IV)'],
    notes: 'Sınıf III-B ve IV lazerler için Sağlık Bakanlığı onayı gereklidir.',
  },
  '2933.39': {
    code: '2933.39',
    description: 'Diğer piridin halkası içeren bileşikler (ilaç ham maddeleri)',
    taxRate: 0,
    kdv: 20,
    additionalDuty: null,
    status: 'restricted',
    restrictions: ['İlaç Ham Maddesi İthalat İzni', 'SGK Onayı', 'Analiz Sertifikası'],
    notes: 'İlaç ve Tıbbi Cihaz Kurumu (TİTCK) ön izni zorunludur.',
  },
  '9301.00': {
    code: '9301.00',
    description: 'Askeri silahlar (askeri tüfekler, toplar vb.)',
    taxRate: 0,
    kdv: 0,
    additionalDuty: null,
    status: 'banned',
    restrictions: [],
    notes: 'Sivil ithalat kesinlikle yasaktır. Yalnızca Millî Savunma Bakanlığı yetkilidir.',
  },
};

const popularCodes = Object.keys(gtipDatabase);

const statusConfig = {
  free: { label: 'Serbest', icon: CheckCircle, cls: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' },
  restricted: { label: 'Kısıtlı', icon: AlertCircle, cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  banned: { label: 'Yasak', icon: XCircle, cls: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
};

export default function CustomsPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<GtipResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (gtipDatabase[trimmed]) {
      setResult(gtipDatabase[trimmed]);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleQuickSelect = (code: string) => {
    setQuery(code);
    setResult(gtipDatabase[code]);
    setNotFound(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Başlık */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow">
            <BookOpen size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Gümrük Mevzuat Kütüphanesi</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          GTİP koduna göre güncel vergi oranları, kısıtlamalar ve yasaklı ürün listesi.
        </p>
      </div>

      {/* Arama */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          GTİP (Gümrük Tarife İstatistik Pozisyonu) Kodu
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Örn: 5208.11 veya 8542.31"
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
          >
            Sorgula
          </button>
        </div>

        {/* Hızlı Seçimler */}
        <div className="mt-4">
          <p className="text-xs text-slate-400 mb-2">Örnek kodlar:</p>
          <div className="flex flex-wrap gap-2">
            {popularCodes.map((code) => (
              <button
                key={code}
                onClick={() => handleQuickSelect(code)}
                className="text-xs font-mono font-medium px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded-lg transition-colors border border-transparent hover:border-amber-200"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuç */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <XCircle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>"{query}"</strong> kodu için kayıt bulunamadı. GTİP kodunu kontrol edip tekrar deneyin.
          </p>
        </div>
      )}

      {result && (() => {
        const sc = statusConfig[result.status];
        const StatusIcon = sc.icon;
        return (
          <div className="space-y-4">
            {/* Kod Başlık */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-lg font-bold text-slate-900">{result.code}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>
                      <StatusIcon size={12} />
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{result.description}</p>
                </div>
              </div>
            </div>

            {/* Vergi Oranları */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Gümrük Vergisi', value: `%${result.taxRate}`, color: result.taxRate > 15 ? 'text-red-600' : 'text-slate-900' },
                { label: 'KDV', value: `%${result.kdv}`, color: 'text-slate-900' },
                { label: 'İlave Gümrük Vergisi', value: result.additionalDuty ? `%${result.additionalDuty}` : 'Yok', color: result.additionalDuty ? 'text-amber-600' : 'text-teal-600' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Kısıtlamalar */}
            {result.restrictions.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                  <AlertCircle size={15} className="text-amber-600" />
                  <p className="text-sm font-semibold text-amber-800">Gerekli Belgeler & Kısıtlamalar</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {result.restrictions.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-sm text-slate-700">
                        <ChevronDown size={14} className="text-amber-500 rotate-[-90deg] flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.status === 'banned' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">İthalat Yasak</p>
                  <p className="text-xs text-red-700">{result.notes}</p>
                </div>
              </div>
            )}

            {/* Notlar */}
            {result.status !== 'banned' && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                <Info size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">{result.notes}</p>
              </div>
            )}
          </div>
        );
      })()}

      {!result && !notFound && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 text-center gap-4">
          <BookOpen size={48} strokeWidth={1} />
          <p className="text-sm">Bir GTİP kodu girerek gümrük vergi oranlarını ve<br />kısıtlamaları sorgulayın.</p>
        </div>
      )}
    </div>
  );
}
