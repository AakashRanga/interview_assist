import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { mockCandidates, mockPanels, mockPanelGroups } from '../data/mockData';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  VideoIcon,
  MapPinIcon,
  CalendarIcon } from
'lucide-react';
export function AdminSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2026, 4, 15)
  );
  const [filterGroupId, setFilterGroupId] = useState('all');
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', {
    month: 'long'
  });
  const interviewsByDay = new Map<number, typeof mockCandidates>();
  mockCandidates.forEach((c) => {
    if (!c.interviewDate) return;
    const d = new Date(c.interviewDate);
    if (d.getFullYear() !== year || d.getMonth() !== month) return;
    if (filterGroupId !== 'all' && c.panelGroupId !== filterGroupId) return;
    const day = d.getDate();
    if (!interviewsByDay.has(day)) interviewsByDay.set(day, []);
    interviewsByDay.get(day)!.push(c);
  });
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const selectedDayInterviews =
  selectedDate &&
  selectedDate.getMonth() === month &&
  selectedDate.getFullYear() === year ?
  interviewsByDay.get(selectedDate.getDate()) || [] :
  [];
  const handleJoin = (panelId: string) => {
    const cat = mockPanels.find((p) => p.id === panelId);
    if (cat) {
      toast.success('Opening meeting...');
      window.open(cat.meetLink, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <DashboardLayout role="admin" title="Schedule" userName="Admin User">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-5 flex items-center justify-between flex-wrap gap-3">
        
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-1">
            Interview Schedule
          </h1>
          <p className="text-xs text-secondary/70">
            Real-time calendar of all scheduled interviews across panels
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterGroupId('all')}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${filterGroupId === 'all' ? 'bg-primary text-white' : 'bg-white/60 text-secondary/70 border border-white/60'}`}>
            
            All Panels
          </button>
          {mockPanelGroups.map((g) =>
          <button
            key={g.id}
            onClick={() => setFilterGroupId(g.id)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${filterGroupId === g.id ? 'bg-primary text-white' : 'bg-white/60 text-secondary/70 border border-white/60'}`}>
            
              {g.name}
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.05
          }}
          className="lg:col-span-2">
          
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-secondary">
                {monthName} {year}
              </h3>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                  
                  <ChevronLeftIcon className="w-4 h-4 text-secondary" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                  
                  <ChevronRightIcon className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1.5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) =>
              <div
                key={d}
                className="text-[10px] font-semibold text-secondary/60 text-center py-1.5 uppercase tracking-wider">
                
                  {d}
                </div>
              )}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, index) => {
                if (day === null)
                return (
                  <div key={`empty-${index}`} className="aspect-square" />);

                const dayInts = interviewsByDay.get(day) || [];
                const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === month;
                const has = dayInts.length > 0;
                return (
                  <motion.button
                    key={day}
                    whileHover={{
                      scale: 1.05
                    }}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`aspect-square rounded-xl p-1.5 text-left transition-all relative ${isSelected ? 'bg-primary text-white shadow-glass' : has ? 'bg-primary/10 text-secondary hover:bg-primary/20' : 'bg-white/40 text-secondary/70 hover:bg-white/60'}`}>
                    
                    <div className="text-xs font-semibold">{day}</div>
                    {has &&
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                        {dayInts.slice(0, 3).map((_, i) =>
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />

                      )}
                      </div>
                    }
                  </motion.button>);

              })}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}>
          
          <GlassCard className="p-5">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                  Selected Date
                </div>
                <div className="text-xs font-semibold text-secondary">
                  {selectedDate ?
                  selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  }) :
                  'Pick a date'}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-3">
              {selectedDayInterviews.length} Interview
              {selectedDayInterviews.length !== 1 ? 's' : ''}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate?.toISOString()}
                initial={{
                  opacity: 0,
                  y: 5
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -5
                }}
                className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                
                {selectedDayInterviews.length === 0 ?
                <div className="text-center py-6">
                    <CalendarIcon className="w-8 h-8 text-secondary/30 mx-auto mb-1.5" />
                    <p className="text-[11px] text-secondary/60">
                      No interviews scheduled
                    </p>
                  </div> :

                selectedDayInterviews.map((c, i) => {
                  const cat = mockPanels.find((p) => p.id === c.panelId)!;
                  const group = mockPanelGroups.find(
                    (g) => g.id === c.panelGroupId
                  );
                  return (
                    <motion.div
                      key={c.id}
                      initial={{
                        opacity: 0,
                        x: -5
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      transition={{
                        delay: i * 0.04
                      }}
                      className="bg-white/50 rounded-xl p-2.5">
                      
                        <div className="flex items-center space-x-2 mb-1.5">
                          <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-8 h-8 rounded-full flex-shrink-0" />
                        
                          <div className="min-w-0 flex-grow">
                            <div className="text-xs font-medium text-secondary truncate">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-secondary/60 truncate">
                              {group?.name} • {cat.name}
                            </div>
                          </div>
                          <Badge
                          variant={c.mode === 'Online' ? 'info' : 'neutral'}
                          size="sm">
                          
                            {c.interviewTime}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="text-[10px] text-secondary/60 flex items-center">
                            {c.mode === 'Online' ?
                          <>
                                <VideoIcon className="w-2.5 h-2.5 mr-1" />
                                Online
                              </> :

                          <>
                                <MapPinIcon className="w-2.5 h-2.5 mr-1" />
                                Offline
                              </>
                          }
                          </div>
                          {c.mode === 'Online' &&
                        <button
                          onClick={() => handleJoin(c.panelId)}
                          className="px-2.5 py-1 bg-primary text-white text-[10px] font-medium rounded-lg hover:bg-primary/90 transition-colors">
                          
                              Join
                            </button>
                        }
                        </div>
                      </motion.div>);

                })
                }
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>);

}