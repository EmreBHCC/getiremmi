interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  height?: string;
}

export function BarChart({ data, title, height = 'h-64' }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className={`${height} flex items-end justify-between gap-3`}>
        {data.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden relative">
              <div
                className={`${item.color} w-full transition-all duration-500 rounded-t-lg`}
                style={{ height: `${(item.value / maxValue) * 200}px` }}
              />
            </div>
            <p className="text-xs font-medium text-slate-600 text-center">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title: string;
  color?: string;
}

export function LineChart({ data, title, color = 'bg-teal-500' }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data.map((d) => (d.value / maxValue) * 100);

  let pathD = '';
  points.forEach((point, i) => {
    const x = (i / (points.length - 1)) * 280;
    const y = 120 - point * 1.2;
    pathD += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <svg width="100%" height="160" viewBox="0 0 320 150" className="mb-4">
        <path
          d={pathD}
          stroke="#14b8a6"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, i) => (
          <circle
            key={i}
            cx={(i / (points.length - 1)) * 280}
            cy={120 - point * 1.2}
            r="3"
            fill="#14b8a6"
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{data[0].label}</span>
        <span>{data[Math.floor(data.length / 2)].label}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
