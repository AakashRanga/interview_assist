import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { CandidateDetailModal } from '../components/dashboard/CandidateDetailModal';
import {
  mockCandidates,
  mockPanels,
  mockPanelGroups,
  Candidate } from
'../data/mockData';
import {
  SearchIcon,
  FilterIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  MoreVerticalIcon } from
'lucide-react';
export function AdminCandidates() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [feedbackViewOpen, setFeedbackViewOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const filtered = mockCandidates.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
    return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (groupFilter !== 'all' && c.panelGroupId !== groupFilter) return false;
    return true;
  });
  const statuses = [
  'all',
  'Applied',
  'Scheduled',
  'Interviewed',
  'Selected',
  'Rejected',
  'On Hold'];

  const counts = {
    total: mockCandidates.length,
    scheduled: mockCandidates.filter((c) => c.status === 'Scheduled').length,
    selected: mockCandidates.filter((c) => c.status === 'Selected').length,
    rejected: mockCandidates.filter((c) => c.status === 'Rejected').length
  };
  const handleAction = (action: string, candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setOpenMenu(null);
    if (action === 'reschedule') setRescheduleOpen(true);
    if (action === 'reassign') setReassignOpen(true);
    if (action === 'feedback') setFeedbackViewOpen(true);
  };
  return (
    <DashboardLayout role="admin" title="Candidates" userName="Admin User">
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
        
        <h1 className="text-2xl font-bold text-secondary mb-1">
          Candidate Management
        </h1>
        {/* <p className="text-xs text-secondary/70">
          Manage all candidates across the recruitment pipeline
        </p> */}
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
        {
          label: 'Total',
          value: counts.total,
          icon: UsersIcon,
          color: 'primary'
        },
        {
          label: 'Scheduled',
          value: counts.scheduled,
          icon: ClockIcon,
          color: 'cyan'
        },
        {
          label: 'Selected',
          value: counts.selected,
          icon: CheckCircleIcon,
          color: 'green'
        },
        {
          label: 'Rejected',
          value: counts.rejected,
          icon: XCircleIcon,
          color: 'red'
        }].
        map((s, i) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = {
            primary: 'bg-primary/10 text-primary border-primary/20',
            cyan: 'bg-cyan/10 text-cyan border-cyan/20',
            green: 'bg-green-500/10 text-green-600 border-green-500/20',
            red: 'bg-red-500/10 text-red-600 border-red-500/20'
          };
          return (
            <motion.div
              key={s.label}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.05
              }}>
              
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[s.color]}`}>
                    
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {s.value}
                </div>
                <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                  {s.label}
                </div>
              </GlassCard>
            </motion.div>);

        })}
      </div>

      {/* Filters */}
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
          delay: 0.2
        }}
        className="mb-4">
        
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-grow min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary/40" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/70 border border-white/60 rounded-xl text-xs text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/70 border border-white/60 rounded-xl text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50">
              
              {statuses.map((s) =>
              <option key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s}
                </option>
              )}
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 bg-white/70 border border-white/60 rounded-xl text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50">
              
              <option value="all">All Panels</option>
              {mockPanelGroups.map((g) =>
              <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              )}
            </select>
          </div>
        </GlassCard>
      </motion.div>

      {/* Table */}
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
          delay: 0.25
        }}>
        
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/40 border-b border-white/60">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Panel / Category
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Interview
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map((c, i) => {
                  const category = mockPanels.find((p) => p.id === c.panelId);
                  const group = mockPanelGroups.find(
                    (g) => g.id === c.panelGroupId
                  );
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        delay: i * 0.02
                      }}
                      className="border-b border-white/40 hover:bg-white/30 transition-colors">
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-8 h-8 rounded-full" />
                          
                          <div>
                            <div className="text-xs font-medium text-secondary">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-secondary/60">
                              {c.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-secondary">
                        {c.role}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-secondary">
                          {group?.name}
                        </div>
                        <div className="text-[10px] text-secondary/60">
                          {category?.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-secondary">
                          {new Date(c.interviewDate!).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-secondary/60">
                          {c.interviewTime}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                          c.status === 'Selected' ?
                          'success' :
                          c.status === 'Rejected' ?
                          'danger' :
                          c.status === 'Interviewed' ?
                          'info' :
                          c.status === 'Scheduled' ?
                          'primary' :
                          'neutral'
                          }
                          size="sm">
                          
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right relative">
                        <button
                          onClick={() =>
                          setOpenMenu(openMenu === c.id ? null : c.id)
                          }
                          className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                          
                          <MoreVerticalIcon className="w-4 h-4 text-secondary" />
                        </button>
                        {openMenu === c.id &&
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -5
                          }}
                          animate={{
                            opacity: 1,
                            y: 0
                          }}
                          className="absolute right-4 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                          
                            <button
                            onClick={() => handleAction('reschedule', c)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                            
                              Reschedule
                            </button>
                            <button
                            onClick={() => handleAction('reassign', c)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                            
                              Reassign Panel
                            </button>
                            <button
                            onClick={() => handleAction('feedback', c)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                            
                              View Feedback
                            </button>
                          </motion.div>
                        }
                      </td>
                    </motion.tr>);

                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 &&
          <div className="text-center py-12">
              <UsersIcon className="w-10 h-10 text-secondary/30 mx-auto mb-2" />
              <p className="text-xs text-secondary/60">
                No candidates match your filters
              </p>
            </div>
          }
        </GlassCard>
      </motion.div>

      {/* Reschedule modal */}
      <Modal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title={`Reschedule ${selectedCandidate?.name ?? ''}`}
        size="md">
        
        <div className="space-y-4">
          <Input type="date" label="New Date" />
          <Input type="time" label="New Time" />
          <div className="flex space-x-3">
            <Button
              className="flex-grow"
              onClick={() => {
                toast.success('Interview rescheduled');
                setRescheduleOpen(false);
              }}>
              
              Confirm
            </Button>
            <Button
              variant="outline"
              className="flex-grow"
              onClick={() => setRescheduleOpen(false)}>
              
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reassign modal */}
      <Modal
        isOpen={reassignOpen}
        onClose={() => setReassignOpen(false)}
        title={`Reassign ${selectedCandidate?.name ?? ''}`}
        size="md">
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-secondary/70 mb-2 uppercase tracking-wider">
              Panel
            </label>
            <select className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50">
              {mockPanelGroups.map((g) =>
              <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-secondary/70 mb-2 uppercase tracking-wider">
              Category
            </label>
            <select className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50">
              {mockPanels.map((p) =>
              <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              )}
            </select>
          </div>
          <div className="flex space-x-3">
            <Button
              className="flex-grow"
              onClick={() => {
                toast.success('Candidate reassigned');
                setReassignOpen(false);
              }}>
              
              Reassign
            </Button>
            <Button
              variant="outline"
              className="flex-grow"
              onClick={() => setReassignOpen(false)}>
              
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback view modal (admin) */}
      <CandidateDetailModal
        candidate={feedbackViewOpen ? selectedCandidate : null}
        onClose={() => setFeedbackViewOpen(false)}
        viewerRole="admin" />
      
    </DashboardLayout>);

}