import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function DashboardCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  trend,
  icon,
  subtitle,
}: DashboardCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-teal-600 bg-teal-50'
      : trend === 'down'
        ? 'text-red-600 bg-red-50'
        : 'text-slate-500 bg-slate-100';

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mb-3">{subtitle}</p>}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>

      {change !== undefined && changeLabel && (
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium ${trendColor}`}>
          <TrendIcon size={14} />
          {changeLabel}
        </div>
      )}
    </div>
  );
}
