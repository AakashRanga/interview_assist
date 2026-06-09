import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { CandidateDetailModal } from '../components/dashboard/CandidateDetailModal';
import { API_BASE_URL } from '../config';
import {
  mockPanels,
  mockPanelGroups,
  Candidate } from
'../data/mockData';
import {
  SearchIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MoreVerticalIcon,
  DownloadIcon } from
'lucide-react';

export function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [feedbackViewOpen, setFeedbackViewOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  // Modal form states
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedPanelGroupId, setSelectedPanelGroupId] = useState('');
  const [selectedPanelId, setSelectedPanelId] = useState('');

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates`);
      if (!res.ok) throw new Error('Failed to fetch candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (err: any) {
      toast.error(err.message || 'Error loading candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (openMenu) {
        const target = e.target as HTMLElement;
        if (!target.closest('.candidate-menu-container')) {
          setOpenMenu(null);
          setMenuCoords(null);
        }
      }
    };
    const handleScroll = () => {
      if (openMenu) {
        setOpenMenu(null);
        setMenuCoords(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openMenu]);

  const handleAction = (action: string, candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setOpenMenu(null);
    if (action === 'reschedule') {
      setNewDate(candidate.interviewDate ? candidate.interviewDate.split('T')[0] : '');
      setNewTime(candidate.interviewTime ? candidate.interviewTime.split(' - ')[0] : '');
      setRescheduleOpen(true);
    }
    if (action === 'reassign') {
      setSelectedPanelGroupId(candidate.panelGroupId || mockPanelGroups[0]?.id || '');
      setSelectedPanelId(candidate.panelId || mockPanels[0]?.id || '');
      setReassignOpen(true);
    }
    if (action === 'feedback') {
      setFeedbackViewOpen(true);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedCandidate) return;
    if (!newDate || !newTime) {
      toast.error('Please select both date and time');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${selectedCandidate.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to reschedule');
      }
      toast.success('Interview rescheduled successfully');
      setRescheduleOpen(false);
      fetchCandidates();
    } catch (err: any) {
      toast.error(err.message || 'Error rescheduling interview');
    }
  };

  const handleConfirmReassign = async () => {
    if (!selectedCandidate) return;
    if (!selectedPanelGroupId || !selectedPanelId) {
      toast.error('Please select both Panel and Category');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${selectedCandidate.id}/reassign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panel_group_id: selectedPanelGroupId,
          panel_id: selectedPanelId,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to reassign panel');
      }
      toast.success('Panel reassigned successfully');
      setReassignOpen(false);
      fetchCandidates();
    } catch (err: any) {
      toast.error(err.message || 'Error reassigning panel');
    }
  };



  const handleApproveReject = async (status: 'Selected' | 'Rejected', candidateId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Failed to update status to ${status}`);
      }
      toast.success(`Candidate status updated to ${status} successfully`);
      fetchCandidates();
    } catch (err: any) {
      toast.error(err.message || `Error updating status to ${status}`);
    }
  };

  const filtered = candidates.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (groupFilter !== 'all' && c.panelGroupId !== groupFilter) return false;
    return true;
  });

  const handleDownloadExcel = async () => {
    if (filtered.length === 0) {
      toast.error('No candidates to download');
      return;
    }

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (groupFilter !== 'all') params.append('panelGroupId', groupFilter);

    const toastId = toast.loading('Preparing Excel download...');

    try {
      const url = `${API_BASE_URL}/admin/candidates/export-excel?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to generate Excel download');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const filename = `candidates_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      toast.dismiss(toastId);
      toast.success('Excel downloaded successfully');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to download Excel file');
    }
  };

  const statuses = [
    'all',
    'Applied',
    'Scheduled',
    'Interviewed',
    'Selected',
    'Rejected',
    'On Hold'
  ];

  const counts = {
    total: candidates.length,
    scheduled: candidates.filter((c) => c.status === 'Scheduled').length,
    selected: candidates.filter((c) => c.status === 'Selected').length,
    rejected: candidates.filter((c) => c.status === 'Rejected').length
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
            <Button
              variant="outline"
              onClick={handleDownloadExcel}
              className="ml-auto flex items-center gap-1.5 bg-white/70 border border-white/60 text-xs text-secondary hover:bg-white/95 rounded-xl px-4 py-2"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              Download Excel
            </Button>
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
        
        <GlassCard className="overflow-visible">
          <div className="overflow-x-auto min-h-[280px] pb-12">
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-secondary/60 mt-2">Loading candidates...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <UsersIcon className="w-10 h-10 text-secondary/30 mx-auto mb-2" />
                      <p className="text-xs text-secondary/60">No candidates match your filters</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => {
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
                            {c.interviewDate ? new Date(c.interviewDate).toLocaleDateString() : 'Not scheduled'}
                          </div>
                          <div className="text-[10px] text-secondary/60">
                            {c.interviewTime || '—'}
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
                        <td className="px-4 py-3 text-right relative candidate-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (openMenu === c.id) {
                                setOpenMenu(null);
                                setMenuCoords(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuCoords({
                                  top: rect.bottom,
                                  left: rect.right - 176
                                });
                                setSelectedCandidate(c);
                                setOpenMenu(c.id);
                              }
                            }}
                            className="p-1.5 hover:bg-white/60 rounded-lg transition-colors">
                            
                            <MoreVerticalIcon className="w-4 h-4 text-secondary" />
                          </button>
                        </td>
                    </motion.tr>);

                  })
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Reschedule modal */}
      <Modal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title={`Reschedule ${selectedCandidate?.name ?? ''}`}
        size="md">
        
        <div className="space-y-4">
          <Input 
            type="date" 
            label="New Date" 
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <Input 
            type="time" 
            label="New Time" 
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <div className="flex space-x-3">
            <Button
              className="flex-grow"
              onClick={handleConfirmReschedule}>
              
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
            <select 
              value={selectedPanelGroupId}
              onChange={(e) => {
                const groupId = e.target.value;
                setSelectedPanelGroupId(groupId);
                const firstCat = mockPanels.find(p => p.panelGroupId === groupId);
                setSelectedPanelId(firstCat ? firstCat.id : '');
              }}
              className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
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
            <select 
              value={selectedPanelId}
              onChange={(e) => setSelectedPanelId(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {mockPanels
                .filter((p) => p.panelGroupId === selectedPanelGroupId)
                .map((p) =>
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                )
              }
            </select>
          </div>
          <div className="flex space-x-3">
            <Button
              className="flex-grow"
              onClick={handleConfirmReassign}>
              
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

      {openMenu && menuCoords && selectedCandidate && createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${menuCoords.top + 4}px`,
            left: `${menuCoords.left}px`,
            zIndex: 9999,
          }}
          className="candidate-menu-container w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
        >
          <button
            onClick={() => handleAction('reschedule', selectedCandidate)}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-slate-100">
            Reschedule
          </button>
          <button
            onClick={() => handleAction('reassign', selectedCandidate)}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-slate-100">
            Reassign Panel
          </button>
          <button
            onClick={() => handleAction('feedback', selectedCandidate)}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            View Feedback
          </button>
          {selectedCandidate.status !== 'Selected' && selectedCandidate.status !== 'Rejected' && (
            <>
              <button
                onClick={() => {
                  setOpenMenu(null);
                  handleApproveReject('Selected', selectedCandidate.id);
                }}
                className="w-full text-left px-3 py-2 text-xs text-green-600 hover:bg-green-50/50 transition-colors font-medium border-t border-slate-100">
                Approve
              </button>
              <button
                onClick={() => {
                  setOpenMenu(null);
                  handleApproveReject('Rejected', selectedCandidate.id);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50/50 transition-colors font-medium">
                Reject
              </button>
            </>
          )}
        </div>,
        document.body
      )}
      
    </DashboardLayout>
  );
}