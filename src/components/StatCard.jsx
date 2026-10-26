function StatCard({ title, value, icon, color, bgColor, trend, trendValue }) {
  return (
    <div className="stat-card group cursor-pointer relative">
      <div className="flex items-center gap-3">
        {/* Icon Container with gradient and glow effect */}
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0"
          style={{ backgroundColor: bgColor, color: color }}
        >
          <div className="transform transition-transform duration-300 group-hover:rotate-12">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-brand-navy text-opacity-70 mb-1 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl lg:text-2xl font-bold text-brand-dark tracking-tight truncate">
              {value}
            </p>
            {trend && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-brand-mint transition-all duration-300 pointer-events-none" />
    </div>
  )
}

export default StatCard
