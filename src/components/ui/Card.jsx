import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className, title, icon: Icon, action, accentColor = "blue" }) => {
  // Map màu sắc cho đường viền trên cùng
  const colorMap = {
    blue: "border-t-blue-500",
    green: "border-t-green-500", 
    orange: "border-t-orange-500",
    purple: "border-t-purple-500",
    red: "border-t-red-500"
  };

  const iconColorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600"
  };

  return (
    <div className={cn(
      // --- QUAN TRỌNG: Đã XÓA 'overflow-hidden' ở dòng dưới ---
      "bg-white rounded-2xl shadow-sm border border-slate-200 transition-shadow duration-300 border-t-4",
      colorMap[accentColor] || "border-t-blue-500",
      className
    )}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                iconColorMap[accentColor] || "bg-blue-100 text-blue-600"
              )}>
                <Icon size={16} />
              </div>
            )}
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          {action}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default React.memo(Card);