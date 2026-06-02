import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  XIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CalendarIcon,
  MapPinIcon,
  VideoIcon,
  FileTextIcon,
  DownloadIcon,
  ClockIcon,
  AwardIcon,
  CheckCircleIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  PauseCircleIcon,
  MessageSquareIcon } from
'lucide-react';
import { Badge } from '../ui/Badge';
import type { Candidate } from '../../data/mockData';
import {
  getFeedbackBySubmitter,
  getFeedbackForCandidate,
  submitFeedback,
  type FeedbackDecision,
  type FeedbackEntry } from
'../../data/feedbackStore';
interface Props {
  candidate: Candidate | null;
  onClose: () => void;
  /** Controls the feedback section. Omit to hide it entirely. */
  viewerRole?: 'panel' | 'admin';
  /** Required when viewerRole is 'panel' — used to attribute submitted feedback. */
  viewerName?: string;
}
const DECISION_META: Record<
  FeedbackDecision,
  {
    label: string;
    icon: typeof ThumbsUpIcon;
    activeClass: string;
    idleClass: string;
    badgeClass: string;
  }> =
{
  Selected: {
    label: 'Selected',
    icon: ThumbsUpIcon,
    activeClass: 'bg-green-500 border-green-500 text-white shadow-sm',
    idleClass:
    'bg-white border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-700',
    badgeClass: 'bg-green-100 text-green-700 border-green-200'
  },
  'Not Selected': {
    label: 'Not Selected',
    icon: ThumbsDownIcon,
    activeClass: 'bg-red-500 border-red-500 text-white shadow-sm',
    idleClass:
    'bg-white border-slate-200 text-slate-700 hover:border-red-400 hover:text-red-700',
    badgeClass: 'bg-red-100 text-red-700 border-red-200'
  },
  Hold: {
    label: 'Hold',
    icon: PauseCircleIcon,
    activeClass: 'bg-amber-500 border-amber-500 text-white shadow-sm',
    idleClass:
    'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200'
  }
};
function formatRelative(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}
function initials(name: string): string {
  return name.
  split(' ').
  map((n) => n[0]).
  join('').
  slice(0, 2).
  toUpperCase();
}
export function CandidateDetailModal({
  candidate,
  onClose,
  viewerRole,
  viewerName
}: Props) {
  const [decision, setDecision] = useState<FeedbackDecision | null>(null);
  const [comment, setComment] = useState('');
  // Bump this to force re-read from the module-level store after a submit
  const [version, setVersion] = useState(0);
  const allFeedback = useMemo<FeedbackEntry[]>(() => {
    if (!candidate) return [];
    return getFeedbackForCandidate(candidate.id);
  }, [candidate, version]);
  const ownFeedback = useMemo<FeedbackEntry | undefined>(() => {
    if (!candidate || viewerRole !== 'panel' || !viewerName) return undefined;
    return getFeedbackBySubmitter(candidate.id, viewerName);
  }, [candidate, viewerRole, viewerName, version]);
  // Reset form state whenever the open candidate changes
  useEffect(() => {
    if (!candidate) return;
    setDecision(ownFeedback?.decision ?? null);
    setComment(ownFeedback?.comment ?? '');
  }, [candidate?.id, ownFeedback?.id]);
  const handleSubmit = () => {
    if (!candidate || !viewerName) return;
    if (!decision) {
      toast.error('Please pick a decision');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }
    submitFeedback({
      candidateId: candidate.id,
      decision,
      comment: comment.trim(),
      submittedBy: viewerName
    });
    setVersion((v) => v + 1);
    toast.success(ownFeedback ? 'Feedback updated' : 'Feedback submitted');
  };
  return (
    <AnimatePresence>
      {candidate &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]" />
        

          {/* Modal */}
          <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.97
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.97
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
          
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-primary/8 to-cyan/8 flex-shrink-0">
                <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/80 transition-colors">
                
                  <XIcon className="w-4 h-4 text-slate-700" />
                </button>

                <div className="flex items-start gap-4">
                  <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-2xl ring-2 ring-white shadow-md flex-shrink-0" />
                
                  <div className="min-w-0 flex-grow pr-8">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-xl font-bold text-slate-900">
                        {candidate.name}
                      </h2>
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
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <BriefcaseIcon className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        Applied for: {candidate.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <a
                      href={`mailto:${candidate.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      
                        <MailIcon className="w-3 h-3" />
                        {candidate.email}
                      </a>
                      <a
                      href={`tel:${candidate.phone}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      
                        <PhoneIcon className="w-3 h-3" />
                        {candidate.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-white">
                {/* Profile completion */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                      Profile Completion
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {candidate.profileComplete}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${candidate.profileComplete}%`
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeOut'
                    }}
                    className="h-full bg-gradient-to-r from-primary to-cyan rounded-full" />
                  
                  </div>
                </div>

                {/* Interview details */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2.5">
                    Interview Details
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          Date
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        {candidate.interviewDate ?
                      new Date(
                        candidate.interviewDate
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) :
                      'Not scheduled'}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-cyan" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          Time
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        {candidate.interviewTime || '—'}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {candidate.mode === 'Online' ?
                      <VideoIcon className="w-3.5 h-3.5 text-primary" /> :

                      <MapPinIcon className="w-3.5 h-3.5 text-primary" />
                      }
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          Mode
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        {candidate.mode}
                        {candidate.venue &&
                      <div className="text-[10px] text-slate-800 mt-0.5 font-normal truncate">
                            {candidate.venue}
                          </div>
                      }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-2">
                      <GraduationCapIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                        Education
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {candidate.education}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BriefcaseIcon className="w-3.5 h-3.5 text-cyan" />
                      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                        Experience
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {candidate.experience}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <AwardIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                      Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill, i) =>
                  <motion.span
                    key={i}
                    initial={{
                      opacity: 0,
                      scale: 0.9
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    transition={{
                      delay: i * 0.03
                    }}
                    className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-medium rounded-full border border-primary/15">
                    
                        {skill}
                      </motion.span>
                  )}
                  </div>
                </div>

                {/* === FEEDBACK SECTION === */}
                {viewerRole === 'panel' &&
              <div className="border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquareIcon className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                          Your Feedback
                        </span>
                      </div>
                      {ownFeedback &&
                  <span className="text-[10px] text-slate-500">
                          Last submitted{' '}
                          {formatRelative(ownFeedback.submittedAt)}
                        </span>
                  }
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                      {/* Decision picker */}
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Decision
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                      Object.keys(DECISION_META) as FeedbackDecision[]).
                      map((key) => {
                        const meta = DECISION_META[key];
                        const Icon = meta.icon;
                        const active = decision === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setDecision(key)}
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border text-xs font-medium transition-all ${active ? meta.activeClass : meta.idleClass}`}>
                            
                                <Icon className="w-4 h-4" />
                                <span>{meta.label}</span>
                              </button>);

                      })}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Comment
                        </div>
                        <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share specific observations — strengths, concerns, and your rationale..."
                      style={{
                        color: '#000000',
                        backgroundColor: '#FFFFFF'
                      }}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none shadow-sm" />
                    
                      </div>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-[10px] text-slate-500">
                          {viewerName ?
                      `Submitting as ${viewerName}` :
                      'Anonymous submission'}
                        </div>
                        <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                      
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          {ownFeedback ? 'Update Feedback' : 'Submit Feedback'}
                        </button>
                      </div>
                    </div>
                  </div>
              }

                {viewerRole === 'admin' &&
              <div className="border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquareIcon className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                          Panel Feedback
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {allFeedback.length} submission
                        {allFeedback.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {allFeedback.length === 0 ?
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                        <MessageSquareIcon className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">
                          No panel feedback yet for this candidate.
                        </p>
                      </div> :

                <div className="space-y-2.5">
                        {allFeedback.map((entry) => {
                    const meta = DECISION_META[entry.decision];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={entry.id}
                        className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                        
                              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                    {initials(entry.submittedBy)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-slate-900 truncate">
                                      {entry.submittedBy}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {formatRelative(entry.submittedAt)}
                                    </div>
                                  </div>
                                </div>
                                <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${meta.badgeClass}`}>
                            
                                  <Icon className="w-3 h-3" />
                                  {meta.label}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                {entry.comment}
                              </p>
                            </div>);

                  })}
                      </div>
                }
                  </div>
              }

                {/* Resume */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2.5">
                    Resume
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-cyan/5 rounded-xl p-4 border border-primary/15">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                          <FileTextIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {candidate.name.replace(/\s+/g, '_')}_Resume.pdf
                          </div>
                          <div className="text-[10px] text-slate-500">
                            PDF · 245 KB · Updated{' '}
                            {new Date(
                            candidate.appliedDate
                          ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <a
                      href={candidate.resumeUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] font-medium rounded-lg hover:bg-primary/90 transition-colors">
                      
                        <DownloadIcon className="w-3 h-3" />
                        Download
                      </a>
                    </div>

                    {/* Resume preview */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200 space-y-3 max-h-64 overflow-y-auto">
                      <div className="text-center pb-2 border-b border-slate-200">
                        <div className="text-sm font-bold text-slate-900">
                          {candidate.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {candidate.email} • {candidate.phone}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
                          Summary
                        </div>
                        <p className="text-[10px] text-slate-700 leading-relaxed">
                          Experienced {candidate.role} with{' '}
                          {candidate.experience} of hands-on industry exposure.
                          Strong background in{' '}
                          {candidate.skills.slice(0, 3).join(', ')} and a track
                          record of delivering impactful work in fast-paced
                          environments.
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
                          Education
                        </div>
                        <p className="text-[10px] text-slate-700">
                          {candidate.education}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
                          Skills
                        </div>
                        <p className="text-[10px] text-slate-700">
                          {candidate.skills.join(' · ')}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
                          Experience
                        </div>
                        <ul className="text-[10px] text-slate-700 space-y-1">
                          <li className="flex gap-1.5">
                            <CheckCircleIcon className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              Led key initiatives as a {candidate.role}, working
                              across cross-functional teams.
                            </span>
                          </li>
                          <li className="flex gap-1.5">
                            <CheckCircleIcon className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              Deep expertise in {candidate.skills[0]} and{' '}
                              {candidate.skills[1] || 'related technologies'}.
                            </span>
                          </li>
                          <li className="flex gap-1.5">
                            <CheckCircleIcon className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              Delivered measurable outcomes through consistent
                              high-quality execution.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
                <div className="text-[10px] text-slate-500">
                  Applied{' '}
                  {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                </div>
                <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors">
                
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}