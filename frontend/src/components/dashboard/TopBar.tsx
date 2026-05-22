import React from 'react';
import { BellIcon, MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface TopBarProps {
  title: string;
  userName: string;
  notificationPath?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
}
export function TopBar({
  title,
  userName,
  notificationPath,
  onMenuClick,
  showMenu
}: TopBarProps) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/60 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {showMenu &&
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/60 rounded-lg transition-colors flex-shrink-0 lg:hidden"
            aria-label="Open menu">
            
              <MenuIcon className="w-4 h-4 text-secondary" />
            </button>
          }
          <h2 className="text-base sm:text-lg font-semibold text-secondary truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => notificationPath && navigate(notificationPath)}
            className="relative p-2 hover:bg-white/60 rounded-lg transition-colors"
            aria-label="Notifications">
            
            <BellIcon className="w-4 h-4 text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-secondary leading-tight">
                {userName}
              </div>
              <div className="text-[10px] text-secondary/60">Online</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-primary">
                {userName.
                split(' ').
                map((n) => n[0]).
                join('').
                slice(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}