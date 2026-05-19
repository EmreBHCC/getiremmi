import { Activity, TrendingUp, Globe, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { LineChart, BarChart } from '../components/Chart';

interface TopCommodity {
  name: string;
  category: string;
  price: string;
  change: number;
  trend: 'up' | 'down';
  volume: number;
  image: string;
}

interface MarketAlert {
  id: number;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

const topCommodities: TopCommodity[] = [
  {
    name: 'Premium İpek',
    category: 'TEKSTİL',
    price: '$45,00',
    change: 4.2,
    trend: 'up',
    volume: 8234,
    image: 'https://images.pexels.com/photos/4464484/pexels-photo-4464484.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Sızma Zeytinyağı',
    category: 'TARIM',
    price: '$18,50',
    change: 0.0,
    trend: 'down',
    volume: 5847,
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=80',
  },
  {
    name: 'Çeşitli Baharatlar',
    category: 'TARIM',
    price: '$22,00',
    change: 8.5,
    trend: 'up',
    volume: 12543,
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=80',
  },
];

const marketAlerts: MarketAlert[] = [
  {
    id: 1,
    title: 'Gümrük Tarifesi Güncellemesi: Çin',
    description: "Mart 2024'ten itibaren tekstil ithalatında yeni %15 tarife",
    severity: 'high',
    timestamp: '2 saat önce',
  },
  {
    id: 2,
    title: 'Tedarik Zinciri Uyarısı',
    description: "Şanghay'daki liman tıkanıklığının hafta sonuna kadar çözülmesi bekleniyor",
    severity: 'medium',
    timestamp: '5 saat önce',
  },
  {
    id: 3,
    title: 'Fiyat Artışı: Zeytinyağı',
    description: 'Akdeniz kuraklığı mahsul verimini düşürüyor',
    severity: 'high',
    timestamp: '1 gün önce',
  },
];

const chartData = [
  { label: 'Çin', value: 45 },
  { label: 'Yunanistan', value: 28 },
  { label: 'Hindistan', value: 62 },
  { label: 'Vietnam', value: 38 },
  { label: 'Brezilya', value: 52 },
];

const priceData = [
  { label: 'Oca', value: 42 },
  { label: 'Şub', value: 38 },
  { label: 'Mar', value: 51 },
  { label: 'Nis', value: 48 },
  { label: 'May', value: 55 },
  { label: 'Haz', value: 62 },
];

const severityLabels: Record<string, string> = {
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
};

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    medium: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
    low: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[severity]}`}>
      {severityLabels[severity]}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Gösterge Paneli</h1>
        <p className="text-slate-500 text-sm">Gerçek zamanlı ticaret piyasası genel görünümü ve analitik.</p>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Toplam Ticaret Hacmi"
          value="$2,84 Mlr"
          change={12}
          changeLabel="+%12,3 geçen aya göre"
          trend="up"
          icon={<Activity size={18} />}
        />
        <DashboardCard
          title="Aktif Piyasalar"
          value="47"
          change={3}
          changeLabel="+3 yeni piyasa"
          trend="up"
          icon={<Globe size={18} />}
        />
        <DashboardCard
          title="Ort. Piyasa Duyarlılığı"
          value="7,2"
          unit="/10"
          changeLabel="Kararlı"
          trend="neutral"
          icon={<TrendingUp size={18} />}
        />
        <DashboardCard
          title="Arz Oynaklığı"
          value="Orta"
          changeLabel="-%2,1 eğilim"
          trend="down"
          icon={<AlertCircle size={18} />}
        />
      </div>

      {/* Grafik Satırı */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <BarChart
          data={chartData.map((d) => ({
            ...d,
            color: 'bg-teal-500',
          }))}
          title="Menşe Ülkeye Göre Ticaret Hacmi"
        />
        <LineChart data={priceData} title="Emtia Fiyat Endeksi (6 Ay)" />
      </div>

      {/* Alt Bölüm */}
      <div className="grid grid-cols-3 gap-4">
        {/* Öne Çıkan Emtialar */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Öne Çıkan Emtialar</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {topCommodities.map((commodity) => (
                <div
                  key={commodity.name}
                  className="px-5 py-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={commodity.image}
                        alt={commodity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{commodity.name}</p>
                      <p className="text-xs text-slate-400">{commodity.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{commodity.price}</p>
                      <div
                        className={`flex items-center gap-0.5 text-xs font-medium ${
                          commodity.trend === 'up' ? 'text-teal-600' : 'text-red-600'
                        }`}
                      >
                        {commodity.trend === 'up' ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        %{commodity.change}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Hacim</p>
                      <p className="text-sm font-medium text-slate-900">
                        {commodity.volume.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Piyasa Uyarıları */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Piyasa Uyarıları</h2>
          </div>
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {marketAlerts.map((alert) => (
              <div key={alert.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.severity === 'high'
                        ? 'bg-red-500'
                        : alert.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                      <SeverityBadge severity={alert.severity} />
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{alert.description}</p>
                    <p className="text-xs text-slate-400">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
