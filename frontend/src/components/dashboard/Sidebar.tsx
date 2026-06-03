import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  UserIcon,
  CalendarIcon,
  BellIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayersIcon,
  XIcon,
  BriefcaseIcon } from
'lucide-react';
import { VirtusaLogo } from '../ui/VirtusaLogo';
import { API_BASE_URL } from '../../config';
interface SidebarProps {
  role: 'candidate' | 'panel' | 'admin';
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
export function Sidebar({
  role,
  collapsed,
  onToggle,
  isMobile,
  mobileOpen,
  onMobileClose
}: SidebarProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (role === 'admin') {
        setUnreadCount(0);
        return;
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);
        if (!user?.id) return;

        const response = await fetch(`${API_BASE_URL}/user/${user.id}/notifications/unread-count`);
        if (!response.ok) return;

        const data = await response.json();
        setUnreadCount(data?.unread_count ?? 0);
      } catch (error) {
        console.error('Failed to load unread notification count', error);
      }
    };

    fetchUnreadCount();

    const handleCountUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        setUnreadCount(customEvent.detail);
      }
    };

    window.addEventListener('notificationUnreadCountUpdated', handleCountUpdated);
    return () => window.removeEventListener('notificationUnreadCountUpdated', handleCountUpdated);
  }, [role]);

  const candidateLinks = [
  {
    to: '/candidate/dashboard',
    icon: LayoutDashboardIcon,
    label: 'Dashboard'
  },
  {
    to: '/candidate/profile',
    icon: UserIcon,
    label: 'Profile'
  },
  {
    to: '/candidate/notifications',
    icon: BellIcon,
    label: 'Notifications',
    badge: unreadCount
  }];

  const panelLinks = [
  {
    to: '/panel/dashboard',
    icon: LayoutDashboardIcon,
    label: 'Dashboard'
  },
  {
    to: '/panel/candidates',
    icon: UsersIcon,
    label: 'Candidates'
  },
  {
    to: '/panel/schedule',
    icon: CalendarIcon,
    label: 'Schedule'
  },
  {
    to: '/panel/notifications',
    icon: BellIcon,
    label: 'Notifications',
    badge: unreadCount
  }];

  const adminLinks = [
  {
    to: '/admin/dashboard',
    icon: LayoutDashboardIcon,
    label: 'Dashboard'
  },
  {
    to: '/admin/candidates',
    icon: UsersIcon,
    label: 'Candidates'
  },
  {
    to: '/admin/panels',
    icon: LayersIcon,
    label: 'Panels'
  },
  {
    to: '/admin/roles',
    icon: BriefcaseIcon,
    label: 'Roles'
  },
  {
    to: '/admin/analytics',
    icon: BarChart3Icon,
    label: 'Analytics'
  },
  {
    to: '/admin/settings',
    icon: SettingsIcon,
    label: 'Settings'
  }];

  const links =
  role === 'candidate' ?
  candidateLinks :
  role === 'panel' ?
  panelLinks :
  adminLinks;
  const portalLabel =
  role === 'candidate' ?
  'Candidate Portal' :
  role === 'panel' ?
  'Panel Portal' :
  'Admin Portal';
  const effectiveCollapsed = isMobile ? false : collapsed;
  const width = isMobile ? 260 : collapsed ? 80 : 248;
  const showSidebar = isMobile ? mobileOpen : true;
  const handleLinkClick = () => {
    if (isMobile) onMobileClose();
  };
  return (
    <>
      <AnimatePresence>
        {isMobile && mobileOpen &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onMobileClose}
          className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 lg:hidden" />

        }
      </AnimatePresence>

      <AnimatePresence>
        {showSidebar &&
        <motion.aside
          initial={
          isMobile ?
          {
            x: -280
          } :
          false
          }
          animate={{
            x: 0,
            width
          }}
          exit={
          isMobile ?
          {
            x: -280
          } :
          undefined
          }
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="fixed left-0 top-0 bottom-0 bg-white/80 backdrop-blur-xl border-r border-white/60 z-50 overflow-hidden">
          
            <div className="flex flex-col h-full p-3.5">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 px-2 pt-1">
                <motion.div
                initial={{
                  opacity: 0,
                  x: -8
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -8
                }}
                transition={{
                  duration: 0.15
                }}>
                
                  <div className="flex items-center gap-1.5">
                    <VirtusaLogo className="w-6 h-6" />
                    <h1 className="text-base font-bold text-primary tracking-tight leading-tight">
                      Interview Schedule
                    </h1>
                  </div>
                  <p className="text-[11px] text-secondary/60 uppercase tracking-wider mt-0.5">
                    {portalLabel}
                  </p>
                </motion.div>
                {isMobile ?
              <button
                onClick={onMobileClose}
                className="p-1.5 hover:bg-white/60 rounded-lg transition-colors flex-shrink-0">
                
                    <XIcon className="w-4 h-4 text-secondary" />
                  </button> :

              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-white/60 rounded-lg transition-colors flex-shrink-0">
                
                    {collapsed ?
                <ChevronRightIcon className="w-4 h-4 text-secondary" /> :

                <ChevronLeftIcon className="w-4 h-4 text-secondary" />
                }
                  </button>
              }
              </div>

              {/* Nav */}
              <nav className="flex-grow space-y-1">
                {links.map((link) =>
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to.includes('/dashboard')}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                `flex items-center ${effectiveCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-secondary/70 hover:bg-white/60 hover:text-secondary'}`
                }
                title={effectiveCollapsed ? link.label : undefined}>
                
                    <link.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {!effectiveCollapsed &&
                  <motion.span
                    initial={{
                      opacity: 0,
                      width: 0
                    }}
                    animate={{
                      opacity: 1,
                      width: 'auto'
                    }}
                    exit={{
                      opacity: 0,
                      width: 0
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden">
                    
                          {link.label}
                        </motion.span>
                  }
                    </AnimatePresence>
                    {link.badge > 0 && (
                      <span
                        className={`ml-auto ${effectiveCollapsed ? 'w-2.5 h-2.5 rounded-full bg-primary' : 'inline-flex items-center justify-center min-w-[1.4rem] h-6 rounded-full bg-primary/10 text-primary text-[11px] font-semibold'}`}>
                        {!effectiveCollapsed && link.badge}
                      </span>
                    )}
                  </NavLink>
              )}
              </nav>

              <NavLink
              to="/login"
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-secondary/70 hover:bg-white/60 hover:text-secondary transition-all`}>
              
                <LogOutIcon className="w-[18px] h-[18px] flex-shrink-0" />
                <AnimatePresence>
                  {!effectiveCollapsed &&
                <motion.span
                  initial={{
                    opacity: 0,
                    width: 0
                  }}
                  animate={{
                    opacity: 1,
                    width: 'auto'
                  }}
                  exit={{
                    opacity: 0,
                    width: 0
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  
                      Logout
                    </motion.span>
                }
                </AnimatePresence>
              </NavLink>
            </div>
          </motion.aside>
        }
      </AnimatePresence>
    </>);

}