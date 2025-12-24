export function LineChart({ data, color = "blue" }) {
    // data: array of numbers
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const width = 100;
    const height = 40;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const colors = {
        blue: "stroke-blue-500",
        purple: "stroke-purple-500",
        green: "stroke-green-500",
        yellow: "stroke-yellow-500"
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
                fill="none"
                strokeWidth="2"
                points={points}
                vectorEffect="non-scaling-stroke"
                className={colors[color]}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BarChart({ data, labels, color = "blue" }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data) || 1;

    const colors = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500"
    };

    return (
        <div className="flex items-end justify-between h-32 gap-2">
            {data.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-slate-800 rounded-t-md relative h-full flex items-end overflow-hidden">
                        <div
                            className={`w-full ${colors[color]} opacity-50 group-hover:opacity-80 transition-all duration-500 rounded-t-md`}
                            style={{ height: `${(val / max) * 100}%` }}
                        ></div>
                        <div className="absolute bottom-0 w-full text-center text-[10px] text-white font-bold pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}
                        </div>
                    </div>
                    {labels && <span className="text-[10px] text-slate-500">{labels[i]}</span>}
                </div>
            ))}
        </div>
    );
}
