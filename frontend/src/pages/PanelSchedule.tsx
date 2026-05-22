import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { mockCandidates, mockPanels } from '../data/mockData';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  VideoIcon,
  MapPinIcon,
  CalendarIcon } from
'lucide-react';
export function PanelSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2026, 4, 15)
  );
  const [filterPanelId, setFilterPanelId] = useState<string>('all');
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', {
    month: 'long'
  });
  const goPrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const goNext = () => setCurrentDate(new Date(year, month + 1, 1));
  // Build interviews map per day
  const interviewsByDay = new Map<number, typeof mockCandidates>();
  mockCandidates.forEach((c) => {
    if (!c.interviewDate) return;
    const d = new Date(c.interviewDate);
    if (d.getFullYear() !== year || d.getMonth() !== month) return;
    if (filterPanelId !== 'all' && c.panelId !== filterPanelId) return;
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
    const panel = mockPanels.find((p) => p.id === panelId);
    if (panel) {
      toast.success('Opening meeting...');
      window.open(panel.meetLink, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <DashboardLayout role="panel" title="Schedule" userName="Sarah Johnson">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6 flex items-center justify-between flex-wrap gap-4">
        
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Interview Schedule
          </h1>
          {/* <p className="text-sm text-secondary/70">
            Real-time calendar of all scheduled interviews
          </p> */}
        </div>
        {/* <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setFilterPanelId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filterPanelId === 'all' ? 'bg-primary text-white' : 'bg-white/60 text-secondary/70 border border-white/60'}`}>
            
            All Panels
          </button>
          {mockPanels.map((p) =>
          <button
            key={p.id}
            onClick={() => setFilterPanelId(p.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filterPanelId === p.id ? 'bg-primary text-white' : 'bg-white/60 text-secondary/70 border border-white/60'}`}>
            
              {p.type}
            </button>
          )}
        </div> */}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.05
          }}
          className="lg:col-span-2">
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary">
                {monthName} {year}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={goPrev}
                  className="p-2 hover:bg-white/60 rounded-xl transition-colors">
                  
                  <ChevronLeftIcon className="w-5 h-5 text-secondary" />
                </button>
                <button
                  onClick={goNext}
                  className="p-2 hover:bg-white/60 rounded-xl transition-colors">
                  
                  <ChevronRightIcon className="w-5 h-5 text-secondary" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) =>
              <div
                key={d}
                className="text-xs font-semibold text-secondary/60 text-center py-2 uppercase tracking-wide">
                
                  {d}
                </div>
              )}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />);

                }
                const dayInterviews = interviewsByDay.get(day) || [];
                const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === month &&
                selectedDate?.getFullYear() === year;
                const hasInterviews = dayInterviews.length > 0;
                return (
                  <motion.button
                    key={day}
                    whileHover={{
                      scale: 1.05
                    }}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`aspect-square rounded-xl p-2 text-left transition-all relative ${isSelected ? 'bg-primary text-white shadow-glass' : hasInterviews ? 'bg-primary/10 text-secondary hover:bg-primary/20' : 'bg-white/40 text-secondary/70 hover:bg-white/60'}`}>
                    
                    <div className="text-sm font-semibold">{day}</div>
                    {hasInterviews &&
                    <div
                      className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-0.5`}>
                      
                        {dayInterviews.slice(0, 3).map((_, i) =>
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />

                      )}
                        {dayInterviews.length > 3 &&
                      <div
                        className={`text-[8px] font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                        
                            +
                          </div>
                      }
                      </div>
                    }
                  </motion.button>);

              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Day Details */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}>
          
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-secondary/60 uppercase tracking-wide">
                  Selected Date
                </div>
                <div className="text-sm font-semibold text-secondary">
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

            <div className="text-xs text-secondary/60 uppercase tracking-wide mb-3">
              {selectedDayInterviews.length} Interview
              {selectedDayInterviews.length !== 1 ? 's' : ''}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate?.toISOString()}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -10
                }}
                className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                
                {selectedDayInterviews.length === 0 ?
                <div className="text-center py-8">
                    <CalendarIcon className="w-10 h-10 text-secondary/30 mx-auto mb-2" />
                    <p className="text-xs text-secondary/60">
                      No interviews scheduled
                    </p>
                  </div> :

                selectedDayInterviews.map((c, i) => {
                  const panel = mockPanels.find((p) => p.id === c.panelId)!;
                  return (
                    <motion.div
                      key={c.id}
                      initial={{
                        opacity: 0,
                        x: -10
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      transition={{
                        delay: i * 0.05
                      }}
                      className="bg-white/50 rounded-2xl p-3">
                      
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-full flex-shrink-0" />
                        
                          <div className="min-w-0 flex-grow">
                            <div className="text-sm font-medium text-secondary truncate">
                              {c.name}
                            </div>
                            <div className="text-xs text-secondary/60 truncate">
                              {c.role}
                            </div>
                          </div>
                          <Badge
                          variant={c.mode === 'Online' ? 'info' : 'neutral'}
                          size="sm">
                          
                            {c.interviewTime}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-secondary/60 truncate">
                            {panel.type} •{' '}
                            {c.mode === 'Online' ?
                          <span className="inline-flex items-center">
                                <VideoIcon className="w-3 h-3 mx-1" /> Online
                              </span> :

                          <span className="inline-flex items-center">
                                <MapPinIcon className="w-3 h-3 mx-1" /> Offline
                              </span>
                          }
                          </div>
                          {c.mode === 'Online' &&
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJoin(c.panelId)}>
                          
                              Join
                            </Button>
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