import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { CandidateDetailModal } from '../components/dashboard/CandidateDetailModal';
import { mockCandidates, mockPanels, mockPanelGroups } from '../data/mockData';
import type { Candidate } from '../data/mockData';
import {
  VideoIcon,
  CalendarIcon,
  MapPinIcon,
  CopyIcon,
  UsersIcon,
  SearchIcon,
  LayersIcon } from
'lucide-react';
export function PanelCandidates() {
  const [selectedGroupId, setSelectedGroupId] = useState(mockPanelGroups[0].id);
  const groupCategories = mockPanels.filter(
    (p) => p.panelGroupId === selectedGroupId
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    groupCategories[0]?.id
  );
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  // When switching groups, reset selected category to first in that group
  useEffect(() => {
    const cats = mockPanels.filter((p) => p.panelGroupId === selectedGroupId);
    if (cats.length && !cats.find((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(cats[0].id);
    }
  }, [selectedGroupId]);
  const selectedCategory = mockPanels.find((p) => p.id === selectedCategoryId);
  const selectedGroup = mockPanelGroups.find((g) => g.id === selectedGroupId);
  const candidates = mockCandidates.filter(
    (c) =>
    c.panelId === selectedCategoryId &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleJoin = (link: string) => {
    toast.success('Opening meeting...');
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied');
  };
  return (
    <DashboardLayout role="panel" title="Candidates" userName="Sarah Johnson">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-5">
        
        <h1 className="text-2xl font-bold text-secondary mb-1">
          Panel Candidates
        </h1>
        {/* <p className="text-xs text-secondary/70">
          Select a panel, then drill into a category to view assigned candidates
        </p> */}
      </motion.div>

      {/* Panel Group selector */}
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
        className="mb-4">
        
        <div className="flex items-center space-x-2 mb-2">
          <LayersIcon className="w-3.5 h-3.5 text-secondary/60" />
          <span className="text-[10px] font-semibold text-secondary/60 uppercase tracking-wider">
            Panels
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {mockPanelGroups.map((group) => {
            const isActive = group.id === selectedGroupId;
            const total = mockPanels.filter(
              (p) => p.panelGroupId === group.id
            ).length;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${isActive ? 'bg-secondary text-white shadow-glass' : 'bg-white/60 backdrop-blur-xl border border-white/60 text-secondary/70 hover:bg-white/80'}`}>
                
                <span>{group.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-secondary/10 text-secondary/70'}`}>
                  
                  {total} categories
                </span>
              </button>);

          })}
        </div>
      </motion.div>

      {/* Category tabs (within selected panel) */}
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
        }}
        className="mb-5">
        
        <div className="text-[10px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
          {selectedGroup?.name} · Categories
        </div>
        <div className="flex flex-wrap gap-1.5">
          {groupCategories.map((cat) => {
            const isActive = cat.id === selectedCategoryId;
            const count = mockCandidates.filter(
              (c) => c.panelId === cat.id
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${isActive ? 'bg-primary text-white shadow-glass' : 'bg-white/60 backdrop-blur-xl border border-white/60 text-secondary/70 hover:bg-white/80'}`}>
                
                <span>{cat.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  
                  {count}
                </span>
              </button>);

          })}
        </div>
      </motion.div>

      {/* Selected Category Info */}
      {selectedCategory &&
      <AnimatePresence mode="wait">
          <motion.div
          key={selectedCategory.id}
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
          transition={{
            duration: 0.2
          }}>
          
            <GlassCard className="p-4 mb-5">
              <div className="grid lg:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                        Category
                      </div>
                      <div className="text-sm font-semibold text-secondary">
                        {selectedCategory.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">
                    Members
                  </div>
                  <ul className="space-y-1">
                    {selectedCategory.members.map((m) =>
                  <li
                    key={m.name}
                    className="flex items-center justify-between gap-2 text-xs">
                    
                        <span className="text-secondary truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {m.role}
                        </span>
                      </li>
                  )}
                  </ul>
                </div>

                <div className="bg-white/50 rounded-xl p-3">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <VideoIcon className="w-3 h-3 text-primary" />
                    <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                      Google Meet
                    </div>
                  </div>
                  <code className="text-[10px] text-primary font-mono block mb-2 break-all">
                    {selectedCategory.meetLink}
                  </code>
                  <div className="flex gap-1.5">
                    <button
                    onClick={() => handleJoin(selectedCategory.meetLink)}
                    className="flex-grow px-3 py-1.5 bg-primary text-white text-[11px] font-medium rounded-lg hover:bg-primary/90 transition-colors">
                    
                      Join Meet
                    </button>
                    <button
                    onClick={() => copyLink(selectedCategory.meetLink)}
                    className="px-2.5 py-1.5 bg-white/70 border border-white/60 text-secondary text-[11px] rounded-lg hover:bg-white/90 transition-colors">
                    
                      <CopyIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/50 rounded-xl p-3">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <VideoIcon className="w-3 h-3 text-cyan" />
                    <div className="text-[10px] text-secondary/60 uppercase tracking-wider">
                      Zoom
                    </div>
                  </div>
                  <code className="text-[10px] text-cyan font-mono block mb-2 break-all">
                    {selectedCategory.zoomLink}
                  </code>
                  <div className="flex gap-1.5">
                    <button
                    onClick={() => handleJoin(selectedCategory.zoomLink)}
                    className="flex-grow px-3 py-1.5 bg-cyan text-white text-[11px] font-medium rounded-lg hover:bg-cyan/90 transition-colors">
                    
                      Join Zoom
                    </button>
                    <button
                    onClick={() => copyLink(selectedCategory.zoomLink)}
                    className="px-2.5 py-1.5 bg-white/70 border border-white/60 text-secondary text-[11px] rounded-lg hover:bg-white/90 transition-colors">
                    
                      <CopyIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      }

      {/* Search */}
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
          delay: 0.15
        }}
        className="mb-4">
        
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary/40" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-xl text-xs text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          
        </div>
      </motion.div>

      {/* Candidates Grid */}
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
        }}>
        
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-secondary">
              {selectedGroup?.name} / {selectedCategory?.name}
            </h3>
            <Badge variant="primary" size="sm">
              {candidates.length} candidates
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {candidates.map((candidate, index) =>
              <motion.div
                key={candidate.id}
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
                  scale: 0.95
                }}
                transition={{
                  delay: 0.03 * index
                }}
                whileHover={{
                  scale: 1.02
                }}
                className="bg-white/50 rounded-2xl p-3">
                
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-9 h-9 rounded-full flex-shrink-0" />
                    
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-secondary truncate">
                          {candidate.name}
                        </div>
                        <div className="text-[10px] text-secondary/60 truncate">
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

                  <div className="space-y-1 mb-2.5">
                    <div className="flex items-center text-[10px] text-secondary/60">
                      <CalendarIcon className="w-2.5 h-2.5 mr-1.5" />
                      {new Date(
                      candidate.interviewDate!
                    ).toLocaleDateString()}{' '}
                      • {candidate.interviewTime}
                    </div>
                    <div className="flex items-center text-[10px] text-secondary/60">
                      {candidate.mode === 'Online' ?
                    <>
                          <VideoIcon className="w-2.5 h-2.5 mr-1.5" />
                          Online
                        </> :

                    <>
                          <MapPinIcon className="w-2.5 h-2.5 mr-1.5" />
                          Offline
                        </>
                    }
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {candidate.skills.slice(0, 3).map((skill, i) =>
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded-full">
                    
                        {skill}
                      </span>
                  )}
                  </div>

                  <div className="flex gap-1.5">
                    {candidate.mode === 'Online' && selectedCategory &&
                  <button
                    onClick={() => handleJoin(selectedCategory.meetLink)}
                    className="flex-grow flex items-center justify-center px-2.5 py-1.5 bg-primary text-white text-[10px] font-medium rounded-lg hover:bg-primary/90 transition-colors">
                    
                        <VideoIcon className="w-2.5 h-2.5 mr-1" />
                        Join
                      </button>
                  }
                    <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`px-2.5 py-1.5 bg-white/70 border border-white/60 text-secondary text-[10px] font-medium rounded-lg hover:bg-white/90 transition-colors ${candidate.mode === 'Online' ? '' : 'flex-grow'}`}>
                    
                      Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {candidates.length === 0 &&
          <div className="text-center py-10">
              <UsersIcon className="w-10 h-10 text-secondary/30 mx-auto mb-2" />
              <p className="text-xs text-secondary/60">No candidates found</p>
            </div>
          }
        </GlassCard>
      </motion.div>

      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        viewerRole="panel"
        viewerName="Sarah Johnson" />
      
    </DashboardLayout>);

}