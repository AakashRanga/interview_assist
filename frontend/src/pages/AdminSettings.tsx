import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  ServerIcon,
  KeyIcon,
  SunIcon,
  MoonIcon,
  CheckIcon } from
'lucide-react';
type Section =
'profile' |
'notifications' |
'security' |
'appearance' |
'integrations';
function Toggle({
  checked,
  onChange



}: {checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-secondary/20'}`}>
      
      <motion.div
        animate={{
          x: checked ? 16 : 2
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
      
    </button>);

}
export function AdminSettings() {
  const [section, setSection] = useState<Section>('profile');
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    schedule: true,
    feedback: false,
    weekly: true
  });
  const sections = [
  {
    id: 'profile' as Section,
    label: 'Profile',
    icon: UserIcon
  },
  {
    id: 'notifications' as Section,
    label: 'Notifications',
    icon: BellIcon
  },
  {
    id: 'security' as Section,
    label: 'Security',
    icon: ShieldIcon
  },
  {
    id: 'appearance' as Section,
    label: 'Appearance',
    icon: PaletteIcon
  },
  {
    id: 'integrations' as Section,
    label: 'Integrations',
    icon: ServerIcon
  }];

  return (
    <DashboardLayout role="admin" title="Settings" userName="Admin User">
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-5">
        
        {/* <h1 className="text-xl font-semibold text-secondary mb-1">Settings</h1>
        <p className="text-xs text-secondary/70">
          Manage your account and platform preferences
        </p> */}
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div
          initial={{
            opacity: 0,
            x: -10
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="lg:col-span-1">
          
          <GlassCard className="p-2.5">
            <div className="space-y-0.5">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-secondary/70 hover:bg-white/60'}`}>
                    
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>);

              })}
            </div>
          </GlassCard>
        </motion.div>

        <div className="lg:col-span-3 space-y-4 sm:space-y-5">
          {section === 'profile' &&
          <motion.div
            key="profile"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
              <GlassCard className="p-5">
                <h2 className="text-sm font-semibold text-secondary mb-4">
                  Admin Profile
                </h2>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">AU</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Change Photo
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Full Name" defaultValue="Admin User" />
                  <Input
                  label="Email"
                  type="email"
                  defaultValue="admin@inteviu.com" />
                
                  <Input label="Phone" defaultValue="+1 (555) 000-0000" />
                  <Input label="Role" defaultValue="Super Admin" disabled />
                </div>
                <div className="flex justify-end gap-2 mt-5">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                  size="sm"
                  onClick={() => toast.success('Profile updated')}>
                  
                    Save Changes
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          }

          {section === 'notifications' &&
          <motion.div
            key="notifications"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
              <GlassCard className="p-5">
                <h2 className="text-sm font-semibold text-secondary mb-4">
                  Notification Preferences
                </h2>
                <div>
                  {[
                {
                  key: 'email' as const,
                  label: 'Email notifications',
                  desc: 'Receive important updates via email'
                },
                {
                  key: 'push' as const,
                  label: 'Push notifications',
                  desc: 'Real-time alerts in the platform'
                },
                {
                  key: 'schedule' as const,
                  label: 'Schedule changes',
                  desc: 'Notify when interviews are rescheduled'
                },
                {
                  key: 'feedback' as const,
                  label: 'Feedback submissions',
                  desc: 'Notify when panel members submit feedback'
                },
                {
                  key: 'weekly' as const,
                  label: 'Weekly digest',
                  desc: 'Summary of weekly recruitment activity'
                }].
                map((opt) =>
                <div
                  key={opt.key}
                  className="flex items-center justify-between py-3 border-b border-white/40 last:border-0 gap-3">
                  
                      <div>
                        <div className="text-xs font-medium text-secondary">
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-secondary/60">
                          {opt.desc}
                        </div>
                      </div>
                      <Toggle
                    checked={notifs[opt.key]}
                    onChange={(v) =>
                    setNotifs({
                      ...notifs,
                      [opt.key]: v
                    })
                    } />
                  
                    </div>
                )}
                </div>
              </GlassCard>
            </motion.div>
          }

          {section === 'security' &&
          <motion.div
            key="security"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
              <GlassCard className="p-5">
                <h2 className="text-sm font-semibold text-secondary mb-4">
                  Security
                </h2>
                <div className="space-y-3">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <div className="flex justify-end">
                    <Button
                    size="sm"
                    onClick={() => toast.success('Password updated')}>
                    
                      <KeyIcon className="w-3 h-3" />
                      Update Password
                    </Button>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-secondary">
                        Two-Factor Authentication
                      </div>
                      <div className="text-[10px] text-secondary/60">
                        Add an extra layer of security
                      </div>
                    </div>
                    <Toggle
                    checked
                    onChange={() => toast.info('2FA settings')} />
                  
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          }

          {section === 'appearance' &&
          <motion.div
            key="appearance"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
              <GlassCard className="p-5">
                <h2 className="text-sm font-semibold text-secondary mb-4">
                  Appearance
                </h2>
                <div>
                  <div className="text-xs font-medium text-secondary mb-3">
                    Theme
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                    onClick={() => {
                      setTheme('dark');
                      toast.success('Dark theme activated');
                    }}
                    className="relative p-3 rounded-xl border-2 border-primary text-left">
                    
                      <div className="w-full h-14 rounded-lg mb-2 border border-white/60 flex items-center justify-center bg-secondary">
                        <MoonIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs font-medium text-secondary">
                        Dark
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          }

          {section === 'integrations' &&
          <motion.div
            key="integrations"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
              <GlassCard className="p-5">
                <h2 className="text-sm font-semibold text-secondary mb-4">
                  Integrations
                </h2>
                <div className="space-y-2">
                  {[
                {
                  name: 'Google Meet',
                  desc: 'Auto-generate meeting links',
                  connected: true
                },
                {
                  name: 'Zoom',
                  desc: 'Alternative video conferencing',
                  connected: true
                },
                {
                  name: 'Google Calendar',
                  desc: 'Sync interview schedules',
                  connected: false
                },
                {
                  name: 'Slack',
                  desc: 'Notify on key events',
                  connected: false
                }].
                map((int) =>
                <div
                  key={int.name}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-xl gap-3">
                  
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-secondary">
                          {int.name}
                        </div>
                        <div className="text-[10px] text-secondary/60">
                          {int.desc}
                        </div>
                      </div>
                      <button
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors flex-shrink-0 ${int.connected ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-primary text-white'}`}>
                    
                        {int.connected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                )}
                </div>
              </GlassCard>
            </motion.div>
          }
        </div>
      </div>
    </DashboardLayout>);

}