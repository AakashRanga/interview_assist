import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  dailySchedule,
  weeklySchedule,
  monthlySchedule,
  pipelineData,
  statusBreakdown,
  mockCandidates,
  mockPanels } from
'../data/mockData';
import {
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  UsersIcon,
  CheckCircle2Icon,
  PercentIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
type ScheduleView = 'daily' | 'weekly' | 'monthly';
export function AdminAnalytics() {
  const [view, setView] = useState<ScheduleView>('weekly');
  const scheduleData =
  view === 'daily' ?
  dailySchedule :
  view === 'weekly' ?
  weeklySchedule :
  monthlySchedule;
  const xKey = view === 'daily' ? 'hour' : view === 'weekly' ? 'day' : 'week';
  const totalSchedules = scheduleData.reduce((sum, d) => sum + d.count, 0);
  const avgPerPeriod = Math.round(totalSchedules / scheduleData.length);
  const peakItem = scheduleData.reduce((a, b) => a.count > b.count ? a : b);
  return (
    <DashboardLayout role="admin" title="Analytics" userName="Admin User">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6">
        
        {/* <h1 className="text-2xl font-bold text-secondary mb-1">Analytics</h1>
        <p className="text-xs text-secondary/70">
          Real-time insights into your recruitment pipeline
        </p> */}
      </motion.div>

      {/* Hero: Total Schedules */}
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
        className="mb-5">
        
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-3 gap-5">
            <div>
              <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-2">
                Total Interview Schedules
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-5xl font-bold text-secondary">
                  {totalSchedules}
                </span>
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <TrendingUpIcon className="w-3 h-3 mr-0.5" />
                  +12.4%
                </div>
              </div>
              <p className="text-[11px] text-secondary/60">
                vs. previous {view} period
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">
                    Average
                  </div>
                  <div className="text-lg font-bold text-secondary">
                    {avgPerPeriod}
                  </div>
                  <div className="text-[10px] text-secondary/60">
                    per {xKey}
                  </div>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">
                    Peak
                  </div>
                  <div className="text-lg font-bold text-secondary">
                    {peakItem.count}
                  </div>
                  <div className="text-[10px] text-secondary/60 truncate">
                    on {peakItem[xKey as keyof typeof peakItem]}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* View switcher */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                  Schedule Distribution
                </div>
                <div className="flex bg-white/50 rounded-lg p-0.5">
                  {(['daily', 'weekly', 'monthly'] as ScheduleView[]).map(
                    (v) =>
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all capitalize ${view === v ? 'bg-primary text-white shadow-glass' : 'text-secondary/70'}`}>
                      
                        {v}
                      </button>

                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
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
                  transition={{
                    duration: 0.2
                  }}>
                  
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={scheduleData}>
                      <defs>
                        <linearGradient
                          id="scheduleGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1">
                          
                          <stop
                            offset="0%"
                            stopColor="#7C3AED"
                            stopOpacity={0.4} />
                          
                          <stop
                            offset="100%"
                            stopColor="#7C3AED"
                            stopOpacity={0} />
                          
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(124, 58, 237, 0.08)" />
                      
                      <XAxis
                        dataKey={xKey}
                        tick={{
                          fill: '#1E293B',
                          fontSize: 10
                        }}
                        axisLine={false}
                        tickLine={false} />
                      
                      <YAxis
                        tick={{
                          fill: '#1E293B',
                          fontSize: 10
                        }}
                        axisLine={false}
                        tickLine={false} />
                      
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.6)',
                          borderRadius: '12px',
                          fontSize: '11px'
                        }} />
                      
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#7C3AED"
                        strokeWidth={2.5}
                        fill="url(#scheduleGrad)" />
                      
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
        {
          label: 'Avg. Time to Hire',
          value: '12d',
          trend: '-2.1d',
          up: true,
          icon: ClockIcon,
          color: 'cyan'
        },
        {
          label: 'No-show Rate',
          value: '4.2%',
          trend: '-1.1%',
          up: true,
          icon: UsersIcon,
          color: 'yellow'
        }].
        map((kpi, i) => {
          const Icon = kpi.icon;
          const colorMap: Record<string, string> = {
            primary: 'bg-primary/10 text-primary border-primary/20',
            cyan: 'bg-cyan/10 text-cyan border-cyan/20',
            green: 'bg-green-500/10 text-green-600 border-green-500/20',
            yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
          };
          return (
            <motion.div
              key={kpi.label}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.1 + i * 0.05
              }}>
              
              <GlassCard className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[kpi.color]}`}>
                    
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`flex items-center text-[10px] font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>
                    
                    {kpi.up ?
                    <TrendingUpIcon className="w-3 h-3 mr-0.5" /> :

                    <TrendingDownIcon className="w-3 h-3 mr-0.5" />
                    }
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                  {kpi.label}
                </div>
              </GlassCard>
            </motion.div>);

        })}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
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
            delay: 0.3
          }}>
          
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-secondary">
                Recruitment Pipeline
              </h3>
              <span className="text-[10px] text-secondary/60 uppercase tracking-wider">
                Funnel
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(124, 58, 237, 0.08)"
                  horizontal={false} />
                
                <XAxis
                  type="number"
                  tick={{
                    fill: '#1E293B',
                    fontSize: 10
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  type="category"
                  dataKey="stage"
                  tick={{
                    fill: '#1E293B',
                    fontSize: 10
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={80} />
                
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }} />
                
                <Bar dataKey="count" fill="#7C3AED" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            delay: 0.35
          }}>
          
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-secondary">
                Status Breakdown
              </h3>
              <span className="text-[10px] text-secondary/60 uppercase tracking-wider">
                Current
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value">
                    
                    {statusBreakdown.map((entry, i) =>
                    <Cell key={i} fill={entry.color} />
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-grow space-y-2">
                {statusBreakdown.map((s) =>
                <div
                  key={s.name}
                  className="flex items-center justify-between">
                  
                    <div className="flex items-center space-x-2">
                      <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: s.color
                      }} />
                    
                      <span className="text-[11px] text-secondary/70">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-secondary">
                      {s.value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>);

}