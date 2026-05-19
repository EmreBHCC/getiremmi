import React, { useState } from 'react';
import { Calculator, BookOpen, Search, Ship, Plane, Truck, AlertTriangle, CheckCircle, Scale, DollarSign } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// Tip Tanımlamaları
interface CalculationResult {
  type: 'Konteyner' | 'Hava Kargo' | 'Tır';
  basePrice: number;
  tax: number;
  total: number;
}

interface GtipData {
  code: string;
  taxRate: number;
  forbidden: boolean;
  restrictions: string;
}

export default function App() {
  // State Yönetimleri
  const [activeTab, setActiveTab] = useState<'logistics' | 'customs'>('logistics');
  const [weight, setWeight] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [gtipQuery, setGtipQuery] = useState<string>('');
  const [gtipResult, setGtipResult] = useState<GtipData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Lojistik Maliyet Hesaplama Fonksiyonu
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !volume) return;

    setLoading(true);
    const w = parseFloat(weight);
    const v = parseFloat(volume);

    // Mock anlık navlun fiyatlandırma algoritması
    const basePrice = (w * 0.5) + (v * 1.2);
    const tax = basePrice * 0.18;
    const total = basePrice + tax;

    const result: CalculationResult = {
      type: w > 1000 || v > 10 ? 'Konteyner' : 'Tır',
      basePrice: Math.round(basePrice),
      tax: Math.round(tax),
      total: Math.round(total)
    };

    setCalcResult(result);

    // Firebase'e yapılan aramayı/hesabı loglama (Opsiyonel)
    try {
      await addDoc(collection(db, "logistics_calculations"), {
        weight: w,
        volume: v,
        totalCost: total,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error("Firebase kayıt hatası: ", error);
    }
    setLoading(false);
  };

  // 2. Gümrük Mevzuat Sorgulama Fonksiyonu (GTİP)
  const handleGtipSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gtipQuery) return;

    setLoading(true);
    
    // Test amaçlı statik veri simülasyonu (Gerçek senaryoda Firestore'dan çekilebilir)
    setTimeout(async () => {
      let mockGtip: GtipData = {
        code: gtipQuery,
        taxRate: 20,
        forbidden: false,
        restrictions: "Standart ithalat rejimine tabidir. Ek denetim belgesi gerekebilir."
      };

      // Örnek yasaklı veya yüksek vergili kod simülasyonu
      if (gtipQuery.startsWith('85')) {
        mockGtip = { code: gtipQuery, taxRate: 25, forbidden: false, restrictions: "Elektronik ürün kapsamında TRT bandrolü ve TSE onayı gereklidir." };
      } else if (gtipQuery.startsWith('12')) {
        mockGtip = { code: gtipQuery, taxRate: 10, forbidden: true, restrictions: "Tarım bakanlığı özel izni kısıtlaması nedeniyle geçici olarak ithalatı durdurulmuştur." };
      }

      setGtipResult(mockGtip);

      // Firebase'e sorgulanan GTİP kodunu kaydetme
      try {
        await addDoc(collection(db, "gtip_searches"), {
          gtipCode: gtipQuery,
          date: new Date().toISOString()
        });
      } catch (error) {
        console.error("Firebase kayıt hatası: ", error);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Üst Menü / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Getiremmi</h1>
              <p className="text-xs text-slate-500">Cross-Border Trade Panel</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'logistics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Calculator size={16} /> Lojistik Hesaplayıcı
            </button>
            <button
              onClick={() => setActiveTab('customs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'customs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <BookOpen size={16} /> Gümrük Mevzuatı
            </button>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        
        {/* MODÜL 1: Lojistik Maliyet Hesaplayıcı */}
        {activeTab === 'logistics' && (
          <div className="grid md:grid-cols-5 gap-8 animate-fadeIn">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Calculator className="text-indigo-600" size={20} /> Lojistik Maliyet Hesaplayıcı
              </h2>
              <p className="text-xs text-slate-500 mb-6">Konteyner, hava kargo veya tır bazlı anlık navlun fiyatlandırması.</p>
              
              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Desi / Ağırlık (KG)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Örn: 150"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Hacim (m³)</label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Örn: 2.5"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-indigo-400"
                >
                  {loading ? 'Hesaplanıyor...' : 'Maliyeti Hesapla'}
                </button>
              </form>
            </div>

            <div className="md:col-span-3 flex flex-col justify-between">
              {calcResult ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-slate-900">Tahmini Navlun Sonucu</h3>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                      {calcResult.type === 'Konteyner' ? <Ship size={14} /> : calcResult.type === 'Hava Kargo' ? <Plane size={14} /> : <Truck size={14} />}
                      {calcResult.type} Taşıma
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Ham Navlun Bedeli</span>
                      <span className="font-medium text-slate-900">${calcResult.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Liman ve Gümrük Vergileri (%18)</span>
                      <span className="font-medium text-slate-900">${calcResult.tax}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Toplam Birim Maliyet</span>
                      <span className="text-2xl font-black text-emerald-600 flex items-center"><DollarSign size={20}/>{calcResult.total}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white/50">
                  <Calculator size={40} className="mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Lojistik maliyet kırılımlarını görebilmek için sol taraftan veri girişi yapın.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODÜL 2: Gümrük Mevzuat Kütüphanesi */}
        {activeTab === 'customs' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Scale className="text-indigo-600" size={20} /> Gümrük Mevzuat Kütüphanesi
            </h2>
            <p className="text-xs text-slate-500 mb-6">Ürününüzün GTİP (Gümrük Tarife İstatistik Pozisyonu) koduna göre güncel vergi ve yasak durumunu sorgulayın.</p>

            <form onSubmit={handleGtipSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  maxLength={12}
                  value={gtipQuery}
                  onChange={(e) => setGtipQuery(e.target.value.replace(/\D/g, ''))} // Sadece rakam izni
                  placeholder="12 haneli GTİP kodunu girin (Örn: 8517, 1202)"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 rounded-xl text-sm transition-colors disabled:bg-slate-400"
              >
                {loading ? 'Sorgulanıyor...' : 'Sorgula'}
              </button>
            </form>

            {gtipResult && (
              <div className={`p-5 rounded-xl border ${gtipResult.forbidden ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/30 border-emerald-100'} space-y-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sorgulanan Kod</h4>
                    <p className="text-lg font-bold text-slate-900 tracking-wide">{gtipResult.code}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {gtipResult.forbidden ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                        <AlertTriangle size={14} /> İthalat Yasak/Kısıtlı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        <CheckCircle size={14} /> İthalata Uygun
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3">
                  <div>
                    <span className="text-xs text-slate-500 block">Gümrük Vergisi Oranı</span>
                    <span className="text-lg font-bold text-slate-900">%{gtipResult.taxRate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">KDV Oranı</span>
                    <span className="text-lg font-bold text-slate-900">%20</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-600 block mb-1">Mevzuat Notları & Kısıtlamalar:</span>
                  <p className="text-sm text-slate-600 leading-relaxed">{gtipResult.restrictions}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}