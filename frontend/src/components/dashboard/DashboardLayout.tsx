import React, { useEffect, useState } from 'react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
interface DashboardLayoutProps {
  role: 'candidate' | 'panel' | 'admin';
  title: string;
  userName: string;
  children: React.ReactNode;
}
export function DashboardLayout({
  role,
  title,
  userName,
  children
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [displayUserName, setDisplayUserName] = useState(userName);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.full_name) {
          setDisplayUserName(u.full_name);
        }
      } catch (e) {
        console.error('Error parsing session user', e);
      }
    }
  }, [userName]);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const notificationPath =
  role === 'candidate' ?
  '/candidate/notifications' :
  role === 'panel' ?
  '/panel/notifications' :
  undefined;
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 248;
  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatedBackground />
      <Sidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)} />
      

      <div
        className="h-screen overflow-y-auto transition-[margin] duration-300"
        style={{
          marginLeft: sidebarWidth
        }}>
        
        <TopBar
          title={title}
          userName={displayUserName}
          notificationPath={notificationPath}
          onMenuClick={() => setMobileOpen(true)}
          showMenu={isMobile} />
        
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>);

}