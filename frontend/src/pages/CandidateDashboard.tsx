import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { mockPanels } from '../data/mockData';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  VideoIcon } from
'lucide-react';
export function CandidateDashboard() {
  const [fullName, setFullName] = React.useState('John Doe');
  const [firstName, setFirstName] = React.useState('John');

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.full_name) {
          setFullName(u.full_name);
          setFirstName(u.full_name.split(' ')[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const profileCompletion = 85;
  const assignedCategory = mockPanels.find((p) => p.type === 'Technical') ?? mockPanels[0];
  const meetLink = assignedCategory?.meetLink ?? '';

  const handleJoinInterview = () => {
    if (!meetLink) {
      toast.error('No meeting link available');
      return;
    }
    toast.success('Opening Google Meet...');
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (!meetLink) {
      toast.error('No meeting link to copy');
      return;
    }
    navigator.clipboard.writeText(meetLink);
    toast.success('Link copied');
  };
  return (
    <DashboardLayout role="candidate" title="Dashboard" userName={fullName}>
      {/* Welcome */}
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6">
        
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-secondary mb-1">
              Welcome back, {firstName}
            </h1>
            
          </div>
          <div className="text-right">
            <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">
              Profile completion
            </div>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{
                    width: 0
                  }}
                  animate={{
                    width: `${profileCompletion}%`
                  }}
                  className="h-full bg-primary" />
                
              </div>
              <span className="text-xs font-semibold text-primary">
                {profileCompletion}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 items-start">
        {/* Left column — Next Interview + Recent Notifications */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Next Interview */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}>
            
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-secondary">
                  Interview Schedule
                </h3>
                <Badge variant="primary" size="sm">
                  Scheduled
                </Badge>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <VideoIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-0.5">
                        Date & Time
                      </div>
                      <div className="text-xs font-medium text-secondary">
                        May 15, 2026 · 2:00 PM
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-0.5">
                        Panel
                      </div>
                      <div className="text-xs font-medium text-secondary">
                        {assignedCategory.name} · 4 members
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             

              <div className="bg-white/60 rounded-xl p-3 mb-3">
                <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1.5">
                  Google Meet Link
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[11px] text-primary font-mono truncate">
                    {meetLink || 'No link available'}
                  </code>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    Copy
                  </Button>
                </div>
              </div>

              <Button
                size="md"
                onClick={handleJoinInterview}
                className="w-full">
                
                <VideoIcon className="w-3.5 h-3.5" />
                Join Interview
              </Button>
            </GlassCard>
          </motion.div>

          {/* Recent Notifications — now stacked under Next Interview */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.18
            }}>
            
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-secondary mb-4">
                Recent Notifications
              </h3>
              <div className="space-y-2.5">
                {[
                {
                  message: 'Interview scheduled for May 15',
                  time: '2 hours ago'
                },
                {
                  message: 'Profile viewed by HR Panel',
                  time: '5 hours ago'
                },
                {
                  message: 'Document uploaded successfully',
                  time: '1 day ago'
                },
                {
                  message: 'New job match: Senior Frontend Dev',
                  time: '2 days ago'
                }].
                map((notif, index) =>
                <div key={index} className="p-2.5 bg-white/60 rounded-lg">
                    <div className="text-xs text-secondary mb-0.5">
                      {notif.message}
                    </div>
                    <div className="text-[10px] text-secondary/60">
                      {notif.time}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right column — Interview Timeline (sticky on desktop) */}
        <div className="lg:sticky lg:top-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}>
            
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-secondary mb-4">
                Interview Timeline
              </h3>
              <div className="space-y-4">
                {[
                {
                  status: 'completed',
                  label: 'Application Submitted',
                  date: 'May 1, 2026',
                  icon: CheckCircleIcon
                },
                {
                  status: 'completed',
                  label: 'Profile Reviewed',
                  date: 'May 3, 2026',
                  icon: CheckCircleIcon
                },
                {
                  status: 'active',
                  label: 'Interview Scheduled',
                  date: 'May 15, 2026',
                  icon: CalendarIcon
                },
                {
                  status: 'pending',
                  label: 'Interview Completed',
                  date: 'Pending',
                  icon: ClockIcon
                },
                {
                  status: 'pending',
                  label: 'Final Decision',
                  date: 'Pending',
                  icon: ClockIcon
                }].
                map((step, index) =>
                <div key={index} className="flex items-start gap-3">
                    <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${step.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : step.status === 'active' ? 'bg-primary/10 border-primary/20' : 'bg-neutral/10 border-neutral/20'}`}>
                    
                      <step.icon
                      className={`w-3.5 h-3.5 ${step.status === 'completed' ? 'text-green-600' : step.status === 'active' ? 'text-primary' : 'text-neutral'}`} />
                    
                    </div>
                    <div className="flex-grow pt-1">
                      <div className="text-xs font-medium text-secondary">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-secondary/60">
                        {step.date}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>);

}