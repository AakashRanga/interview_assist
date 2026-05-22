import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CandidateDetailModal } from '../components/dashboard/CandidateDetailModal';
import { mockCandidates, mockPanels } from '../data/mockData';
import type { Candidate } from '../data/mockData';
import {
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  VideoIcon,
  MapPinIcon } from
'lucide-react';
export function PanelDashboard() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  // Sarah is on Panel A - HR
  const currentPanel =
  mockPanels.find((p) => p.id === 'panel-a-hr') ?? mockPanels[0];
  const myCandidates = mockCandidates.filter(
    (c) => c.panelId === currentPanel?.id
  );
  const todayInterviews = myCandidates.
  filter((c) => c.status === 'Scheduled').
  slice(0, 3);
  const handleJoin = (link?: string) => {
    if (link) {
      toast.success('Opening meeting...');
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <DashboardLayout
      role="panel"
      title="Panel Dashboard"
      userName="Sarah Johnson">
      
      {/* Welcome */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8 flex items-center justify-between flex-wrap gap-4">
        
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Welcome, Sarah!
          </h1>
          <p className="text-sm text-secondary/70">
            • {todayInterviews.length} interviews
            today
          </p>
        </div>
        <Badge variant="primary" size="md">
          {currentPanel.type}
        </Badge>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={UsersIcon}
          label="Assigned Candidates"
          value={myCandidates.length}
          color="primary" />
        
        <StatCard
          icon={CalendarIcon}
          label="Today's Interviews"
          value={todayInterviews.length}
          color="cyan" />
        
        <StatCard
          icon={ClockIcon}
          label="Pending Feedback"
          value="5"
          color="yellow" />
        
        <StatCard
          icon={CheckCircleIcon}
          label="Completed"
          value="15"
          color="green" />
        
      </div>

      {/* Panel Committee + Meet Info */}
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
        className="mb-8">
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <div className="text-xs text-secondary/60 uppercase tracking-wide mb-1">
                Your Panel Committee
              </div>
              <h3 className="text-base font-semibold text-secondary">
                {currentPanel.name} · 4-Member Committee
              </h3>
             
            </div>
            <Button onClick={() => handleJoin(currentPanel.meetLink)}>
              <VideoIcon className="w-4 h-4 mr-2" />
              Open Meeting
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
            {currentPanel.members.map((m) => {
              const isYou = m.name === 'Sarah Johnson';
              return (
                <div
                  key={m.name}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${isYou ? 'bg-primary/10 border-primary/30' : 'bg-white/60 border-white/60'}`}>
                  
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isYou ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                    
                    {m.name.
                    split(' ').
                    map((n) => n[0]).
                    join('').
                    slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-medium text-secondary truncate">
                        {m.name}
                      </span>
                      {isYou &&
                      <span className="text-[9px] text-primary uppercase tracking-wider font-semibold">
                          You
                        </span>
                      }
                    </div>
                    <div className="text-[10px] text-secondary/70 truncate">
                      {m.role}
                    </div>
                  </div>
                </div>);

            })}
          </div>

          <div className="bg-white/60 rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-0.5">
                Shared Meeting Link
              </div>
              <code className="text-[11px] text-primary font-mono truncate block">
                {currentPanel.meetLink}
              </code>
            </div>
            <Badge variant="primary" size="sm">
              {currentPanel.type}
            </Badge>
          </div>
        </GlassCard>
      </motion.div>

      {/* Today's Schedule */}
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
        }}
        className="mb-8">
        
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-secondary mb-6">
            Today's Schedule
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {todayInterviews.map((candidate, index) =>
            <motion.div
              key={candidate.id}
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                delay: 0.1 * index
              }}
              className="bg-white/50 rounded-2xl p-4">
              
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-secondary">
                    {candidate.interviewTime}
                  </div>
                  <Badge
                  variant={candidate.mode === 'Online' ? 'info' : 'neutral'}
                  size="sm">
                  
                    {candidate.mode}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-10 h-10 rounded-full" />
                
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-secondary truncate">
                      {candidate.name}
                    </div>
                    <div className="text-xs text-secondary/60 truncate">
                      {candidate.role}
                    </div>
                  </div>
                </div>
                <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (candidate.mode === 'Online') {
                    handleJoin(currentPanel?.meetLink);
                  } else {
                    setSelectedCandidate(candidate);
                  }
                }}>
                
                  {candidate.mode === 'Online' ?
                <>
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Join Interview
                    </> :

                <>
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      View Details
                    </>
                }
                </Button>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Assigned Candidates */}
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
          delay: 0.2
        }}>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-secondary">
              Assigned Candidates
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="primary">{myCandidates.length} candidates</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/panel/candidates')}>
                
                View All
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCandidates.slice(0, 6).map((candidate, index) =>
            <motion.div
              key={candidate.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.05 * index
              }}
              whileHover={{
                scale: 1.02
              }}
              className="bg-white/50 rounded-2xl p-4 cursor-pointer"
              onClick={() => setSelectedCandidate(candidate)}>
              
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full flex-shrink-0" />
                  
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-secondary truncate">
                        {candidate.name}
                      </div>
                      <div className="text-xs text-secondary/60 truncate">
                        {candidate.role}
                      </div>
                    </div>
                  </div>
                  <Badge
                  variant={
                  candidate.status === 'Selected' ?
                  'success' :
                  candidate.status === 'Rejected' ?
                  'danger' :
                  candidate.status === 'Interviewed' ?
                  'info' :
                  candidate.status === 'Scheduled' ?
                  'primary' :
                  'neutral'
                  }
                  size="sm">
                  
                    {candidate.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs text-secondary/60">
                    <CalendarIcon className="w-3 h-3 mr-2" />
                    {new Date(
                    candidate.interviewDate!
                  ).toLocaleDateString()} at {candidate.interviewTime}
                  </div>
                </div>

                <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setSelectedCandidate(candidate)}>
                
                  Review Profile
                </Button>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        viewerRole="panel"
        viewerName="Sarah Johnson" />
      
    </DashboardLayout>);

}