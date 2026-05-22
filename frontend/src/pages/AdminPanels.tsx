import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  createElement } from
'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import {
  PlusIcon,
  UsersIcon,
  VideoIcon,
  CopyIcon,
  CalendarIcon,
  MoreVerticalIcon,
  MapPinIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UploadIcon,
  UserPlusIcon,
  DownloadIcon } from
'lucide-react';
interface ScheduleItem {
  id: string;
  candidate: string;
  avatar: string;
  role: string;
  date: string; // ISO date
  time: string;
  mode: 'Online' | 'Offline';
}
interface PanelMemberEntry {
  name: string;
  role: string;
}
interface PanelCard {
  id: string;
  name: string;
  type: string;
  members: PanelMemberEntry[];
  capacity: number;
  currentLoad: number;
  meetLink: string;
  zoomLink: string;
  date: string;
  schedule: ScheduleItem[];
}
const buildSchedule = (
panelKey: string,
entries: Array<{
  candidate: string;
  seed: number;
  role: string;
  day: number;
  time: string;
  mode: 'Online' | 'Offline';
}>)
: ScheduleItem[] =>
entries.map((e, i) => ({
  id: `${panelKey}-s-${i}`,
  candidate: e.candidate,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.seed}`,
  role: e.role,
  date: new Date(2026, 4, e.day).toISOString(),
  time: e.time,
  mode: e.mode
}));
const panels: PanelCard[] = [
{
  id: 'p-hr',
  name: 'Panel A',
  type: 'HR',
  members: [
  {
    name: 'Sarah Johnson',
    role: 'HR Lead'
  },
  {
    name: 'Mike Chen',
    role: 'HR Specialist'
  },
  {
    name: 'Olivia Bennett',
    role: 'Talent Manager'
  },
  {
    name: 'Rahul Sharma',
    role: 'HR Coordinator'
  }],

  capacity: 10,
  currentLoad: 8,
  meetLink: 'https://meet.google.com/panel-hr-001',
  zoomLink: 'https://zoom.us/j/1110000001',
  date: '2026-05-18',
  schedule: buildSchedule('hr', [
  {
    candidate: 'Candidate 1',
    seed: 1,
    role: 'Frontend Developer',
    day: 12,
    time: '10:00 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 7',
    seed: 7,
    role: 'Product Manager',
    day: 15,
    time: '11:30 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 14',
    seed: 14,
    role: 'DevOps Engineer',
    day: 18,
    time: '2:00 PM',
    mode: 'Offline'
  },
  {
    candidate: 'Candidate 22',
    seed: 22,
    role: 'Backend Developer',
    day: 20,
    time: '9:30 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 31',
    seed: 31,
    role: 'Data Scientist',
    day: 22,
    time: '3:00 PM',
    mode: 'Online'
  }]
  )
},
{
  id: 'p-tm1',
  name: 'Panel B',
  type: 'Technical',
  members: [
  {
    name: 'Alex Kumar',
    role: 'Tech Lead'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Senior Engineer'
  },
  {
    name: 'Daniel Kim',
    role: 'Architect'
  },
  {
    name: 'Sneha Iyer',
    role: 'Engineering Manager'
  }],

  capacity: 10,
  currentLoad: 7,
  meetLink: 'https://meet.google.com/panel-tm1-002',
  zoomLink: 'https://zoom.us/j/1110000002',
  date: '2026-05-19',
  schedule: buildSchedule('tm1', [
  {
    candidate: 'Candidate 3',
    seed: 3,
    role: 'Full Stack Developer',
    day: 13,
    time: '9:30 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 9',
    seed: 9,
    role: 'Backend Developer',
    day: 14,
    time: '12:00 PM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 21',
    seed: 21,
    role: 'Data Scientist',
    day: 19,
    time: '3:30 PM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 28',
    seed: 28,
    role: 'Backend Developer',
    day: 21,
    time: '10:00 AM',
    mode: 'Offline'
  }]
  )
},
{
  id: 'p-tm2',
  name: 'Panel C',
  type: 'Technical',
  members: [
  {
    name: 'David Lee',
    role: 'Principal Engineer'
  },
  {
    name: 'Jessica Park',
    role: 'Senior Engineer'
  },
  {
    name: 'Marcus Hall',
    role: 'Tech Lead'
  },
  {
    name: 'Anita Reddy',
    role: 'Engineering Manager'
  }],

  capacity: 10,
  currentLoad: 6,
  meetLink: 'https://meet.google.com/panel-tm2-003',
  zoomLink: 'https://zoom.us/j/1110000003',
  date: '2026-05-20',
  schedule: buildSchedule('tm2', [
  {
    candidate: 'Candidate 5',
    seed: 5,
    role: 'Backend Developer',
    day: 14,
    time: '10:00 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 12',
    seed: 12,
    role: 'Frontend Developer',
    day: 16,
    time: '1:00 PM',
    mode: 'Offline'
  },
  {
    candidate: 'Candidate 19',
    seed: 19,
    role: 'DevOps Engineer',
    day: 20,
    time: '11:00 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 27',
    seed: 27,
    role: 'Full Stack Developer',
    day: 23,
    time: '2:30 PM',
    mode: 'Online'
  }]
  )
},
{
  id: 'p-1',
  name: 'Panel D',
  type: 'General',
  members: [
  {
    name: 'Robert Taylor',
    role: 'Senior Engineer'
  },
  {
    name: 'Amanda White',
    role: 'Product Manager'
  },
  {
    name: 'Vikram Singh',
    role: 'Tech Lead'
  },
  {
    name: 'Chloe Adams',
    role: 'Team Lead'
  }],

  capacity: 10,
  currentLoad: 5,
  meetLink: 'https://meet.google.com/panel-1-004',
  zoomLink: 'https://zoom.us/j/1110000004',
  date: '2026-05-21',
  schedule: buildSchedule('p1', [
  {
    candidate: 'Candidate 18',
    seed: 18,
    role: 'Full Stack Developer',
    day: 15,
    time: '11:00 AM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 26',
    seed: 26,
    role: 'DevOps Engineer',
    day: 17,
    time: '2:30 PM',
    mode: 'Online'
  },
  {
    candidate: 'Candidate 33',
    seed: 33,
    role: 'Product Manager',
    day: 21,
    time: '4:00 PM',
    mode: 'Offline'
  },
  {
    candidate: 'Candidate 40',
    seed: 40,
    role: 'Frontend Developer',
    day: 24,
    time: '10:30 AM',
    mode: 'Online'
  }]
  )
}];

export function AdminPanels() {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const selectedPanel = panels.find((p) => p.id === selectedPanelId) || null;
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Imported panel members from ${file.name}`);
    e.target.value = '';
  };
  const handleDownloadTemplate = () => {
    const csv =
    'Panel Name,Member Name,Email,Role\nHR,John Smith,john@example.com,HR Lead\nTechnical,Jane Doe,jane@example.com,Senior Engineer\n';
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'panel-members-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };
  useEffect(() => {
    if (selectedPanelId && scheduleRef.current) {
      scheduleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedPanelId]);
  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied');
  };
  const handleDateButtonClick = (panel: PanelCard) => {
    if (selectedPanelId === panel.id) {
      setSelectedPanelId(null);
      setSelectedDate(null);
      return;
    }
    setSelectedPanelId(panel.id);
    const d = new Date(panel.date);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(d);
  };
  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Calendar grid data for selected panel
  const calendarData = useMemo(() => {
    if (!selectedPanel) return null;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('default', {
      month: 'long'
    });
    const interviewsByDay = new Map<number, ScheduleItem[]>();
    selectedPanel.schedule.forEach((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      const day = d.getDate();
      if (!interviewsByDay.has(day)) interviewsByDay.set(day, []);
      interviewsByDay.get(day)!.push(s);
    });
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return {
      year,
      month,
      monthName,
      days,
      interviewsByDay
    };
  }, [selectedPanel, currentDate]);
  const selectedDayInterviews =
  selectedPanel && selectedDate && calendarData ?
  calendarData.interviewsByDay.get(selectedDate.getDate()) || [] :
  [];
  return (
    <DashboardLayout role="admin" title="Panels" userName="Admin User">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6 flex items-center justify-between flex-wrap gap-3">
        
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-1">
            Panel Management
          </h1>
          {/* <p className="text-xs text-secondary/70">
            Each interview is conducted by a 4-member panel committee, assigned
            automatically. Manage members below.
          </p> */}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelImport}
            className="hidden" />
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadTemplate}
            title="Download CSV template">
            
            <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
            Template
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => excelInputRef.current?.click()}>
            
            <UploadIcon className="w-3.5 h-3.5 mr-1.5" />
            Import Excel
          </Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {panels.map((cat, idx) => {
          const loadPct = cat.currentLoad / cat.capacity * 100;
          const isSelected = cat.id === selectedPanelId;
          return (
            <motion.div
              key={cat.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.06
              }}>
              
              <GlassCard
                className={`p-4 h-full flex flex-col transition-shadow ${isSelected ? 'ring-2 ring-primary/60 shadow-glass-lg' : ''}`}>
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <UsersIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-secondary truncate">
                        {cat.name}
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-white/60 rounded-lg transition-colors flex-shrink-0">
                    <MoreVerticalIcon className="w-4 h-4 text-secondary/60" />
                  </button>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={() => handleDateButtonClick(cat)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 border rounded-xl transition-colors mb-3 group ${isSelected ? 'bg-primary text-white border-primary' : 'bg-primary/10 hover:bg-primary/20 border-primary/20'}`}>
                  
                  <div className="flex items-center gap-2">
                    <CalendarIcon
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    
                    <div className="text-left">
                      <div
                        className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-secondary/60'}`}>
                        
                        Next Interview
                      </div>
                      <div
                        className={`text-[12px] font-semibold ${isSelected ? 'text-white' : 'text-secondary'}`}>
                        
                        {formatShortDate(cat.date)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${isSelected ? 'text-white' : 'text-primary'}`}>
                    
                    {isSelected ? 'Hide' : 'View ↓'}
                  </span>
                </motion.button>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[9px] text-secondary/60 uppercase tracking-wider">
                      Members ({cat.members.length}/4)
                    </div>
                    <button
                      onClick={() => setAddMemberOpen(cat.id)}
                      className="text-[9px] text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                      
                      <UserPlusIcon className="w-2.5 h-2.5" />
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {cat.members.map((m) =>
                    <li
                      key={m.name}
                      className="flex items-center justify-between gap-2">
                      
                        <span className="text-[11px] font-medium text-secondary truncate">
                          {m.name}
                        </span>
                        <span className="text-[9px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {m.role}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-secondary/60 uppercase tracking-wider">
                      Load
                    </span>
                    <span className="font-medium text-secondary">
                      {cat.currentLoad}/{cat.capacity}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${loadPct}%`
                      }}
                      className={`h-full ${loadPct === 100 ? 'bg-red-500' : loadPct > 80 ? 'bg-yellow-500' : 'bg-primary'}`} />
                    
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-2 mb-2 mt-auto">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <VideoIcon className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] text-secondary/60 uppercase tracking-wider">
                      Meet
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <code className="text-[10px] text-primary font-mono truncate flex-grow">
                      {cat.meetLink.replace('https://', '')}
                    </code>
                    <button
                      onClick={() => copyLink(cat.meetLink)}
                      className="p-1 hover:bg-white/60 rounded transition-colors flex-shrink-0">
                      
                      <CopyIcon className="w-2.5 h-2.5 text-secondary/60" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-2">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <VideoIcon className="w-2.5 h-2.5 text-cyan" />
                    <span className="text-[9px] text-secondary/60 uppercase tracking-wider">
                      Zoom
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <code className="text-[10px] text-cyan font-mono truncate flex-grow">
                      {cat.zoomLink.replace('https://', '')}
                    </code>
                    <button
                      onClick={() => copyLink(cat.zoomLink)}
                      className="p-1 hover:bg-white/60 rounded transition-colors flex-shrink-0">
                      
                      <CopyIcon className="w-2.5 h-2.5 text-secondary/60" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>);

        })}
      </div>

      {/* Inline calendar schedule */}
      <div ref={scheduleRef}>
        <AnimatePresence mode="wait">
          {selectedPanel && calendarData &&
          <motion.div
            key={selectedPanel.id}
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 16
            }}
            transition={{
              duration: 0.25
            }}
            className="mt-6">
            
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-0.5">
                    {selectedPanel.name} — Interview Schedule
                  </h2>
                  <p className="text-[11px] text-secondary/70">
                    Calendar of interviews scheduled for this panel
                  </p>
                </div>
                <button
                onClick={() => {
                  setSelectedPanelId(null);
                  setSelectedDate(null);
                }}
                className="p-1.5 hover:bg-white/60 rounded-lg transition-colors"
                title="Close schedule">
                
                  <XIcon className="w-4 h-4 text-secondary" />
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <GlassCard className="p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold text-secondary">
                        {calendarData.monthName} {calendarData.year}
                      </h3>
                      <div className="flex space-x-1.5">
                        <button
                        onClick={() =>
                        setCurrentDate(
                          new Date(
                            calendarData.year,
                            calendarData.month - 1,
                            1
                          )
                        )
                        }
                        className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                        
                          <ChevronLeftIcon className="w-4 h-4 text-secondary" />
                        </button>
                        <button
                        onClick={() =>
                        setCurrentDate(
                          new Date(
                            calendarData.year,
                            calendarData.month + 1,
                            1
                          )
                        )
                        }
                        className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                        
                          <ChevronRightIcon className="w-4 h-4 text-secondary" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 mb-1.5">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (d) =>
                      <div
                        key={d}
                        className="text-[10px] font-semibold text-secondary/60 text-center py-1.5 uppercase tracking-wider">
                        
                            {d}
                          </div>

                    )}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarData.days.map((day, index) => {
                      if (day === null)
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square" />);


                      const dayInts =
                      calendarData.interviewsByDay.get(day) || [];
                      const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === calendarData.month;
                      const has = dayInts.length > 0;
                      return (
                        <motion.button
                          key={day}
                          whileHover={{
                            scale: 1.05
                          }}
                          onClick={() =>
                          setSelectedDate(
                            new Date(
                              calendarData.year,
                              calendarData.month,
                              day
                            )
                          )
                          }
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
                </div>

                {/* Day interview list */}
                <div>
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
                      key={selectedDate?.toISOString() || 'empty'}
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

                      selectedDayInterviews.map((s, i) =>
                      <motion.div
                        key={s.id}
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
                            src={s.avatar}
                            alt={s.candidate}
                            className="w-8 h-8 rounded-full flex-shrink-0" />
                          
                                <div className="min-w-0 flex-grow">
                                  <div className="text-xs font-medium text-secondary truncate">
                                    {s.candidate}
                                  </div>
                                  <div className="text-[10px] text-secondary/60 truncate">
                                    {selectedPanel.name} • {s.role}
                                  </div>
                                </div>
                                <Badge
                            variant={
                            s.mode === 'Online' ? 'info' : 'neutral'
                            }
                            size="sm">
                            
                                  {s.time}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="text-[10px] text-secondary/60 flex items-center">
                                  {s.mode === 'Online' ?
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
                                {s.mode === 'Online' &&
                          <button
                            onClick={() => {
                              window.open(
                                selectedPanel.meetLink,
                                '_blank',
                                'noopener,noreferrer'
                              );
                              toast.success('Opening meeting...');
                            }}
                            className="px-2.5 py-1 bg-primary text-white text-[10px] font-medium rounded-lg hover:bg-primary/90 transition-colors">
                            
                                    Join
                                  </button>
                          }
                              </div>
                            </motion.div>
                      )
                      }
                      </motion.div>
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      <Modal
        isOpen={createPanelOpen}
        onClose={() => setCreatePanelOpen(false)}
        title="Create New Panel"
        size="md">
        
        <div className="space-y-4">
          <Input label="Panel Name" placeholder="e.g. Panel 2" />
          <div>
            <label className="block text-[10px] font-medium text-secondary/70 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What is this panel used for?"
              className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            
          </div>
          <div className="flex space-x-3">
            <Button
              className="flex-grow"
              onClick={() => {
                toast.success('Panel created');
                setCreatePanelOpen(false);
              }}>
              
              Create
            </Button>
            <Button
              variant="outline"
              className="flex-grow"
              onClick={() => setCreatePanelOpen(false)}>
              
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={addMemberOpen !== null}
        onClose={() => {
          setAddMemberOpen(null);
          setNewMemberName('');
          setNewMemberEmail('');
          setNewMemberRole('');
        }}
        title="Add Panel Member"
        size="md">
        
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
            <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">
              Adding to
            </div>
            <div className="text-sm font-semibold text-secondary">
              {panels.find((p) => p.id === addMemberOpen)?.name}
            </div>
            <div className="text-[11px] text-secondary/70 mt-1">
              Each panel committee has 4 members who conduct interviews
              together.
            </div>
          </div>
          <Input
            label="Member Name"
            placeholder="e.g. Priya Patel"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)} />
          
          <Input
            label="Role"
            placeholder="e.g. Senior Engineer"
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)} />
          
          <Input
            label="Email"
            type="email"
            placeholder="member@company.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)} />
          
          <div className="flex space-x-3 pt-1">
            <Button
              className="flex-grow"
              onClick={() => {
                if (!newMemberName.trim()) {
                  toast.error('Please enter a name');
                  return;
                }
                if (!newMemberRole.trim()) {
                  toast.error('Please enter a role');
                  return;
                }
                toast.success(
                  `Added ${newMemberName} (${newMemberRole}) to panel`
                );
                setAddMemberOpen(null);
                setNewMemberName('');
                setNewMemberEmail('');
                setNewMemberRole('');
              }}>
              
              Add Member
            </Button>
            <Button
              variant="outline"
              className="flex-grow"
              onClick={() => {
                setAddMemberOpen(null);
                setNewMemberName('');
                setNewMemberEmail('');
                setNewMemberRole('');
              }}>
              
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>);

}