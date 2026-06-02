import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  BriefcaseIcon,
  Trash2Icon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon } from
'lucide-react';
import { seedJobRoles, type JobRole } from '../data/jobRoles';
export function AdminRoles() {
  const [roles, setRoles] = useState<JobRole[]>(seedJobRoles);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [totalVacancy, setTotalVacancy] = useState('');
  const [jobType, setJobType] = useState<'Online' | 'Offline'>('Online');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Role title is required');
      return;
    }
    if (!location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!experience.trim()) {
      toast.error('Experience is required');
      return;
    }
    if (jobType === 'Offline' && !venue.trim()) {
      toast.error('Venue is required for offline roles');
      return;
    }
    const vacancyNum = parseInt(totalVacancy, 10);
    if (!totalVacancy || isNaN(vacancyNum) || vacancyNum < 1) {
      toast.error('Total vacancy must be at least 1');
      return;
    }
    const newRole: JobRole = {
      id: `r-${Date.now()}`,
      title: title.trim(),
      location: location.trim(),
      experience: experience.trim(),
      totalVacancy: vacancyNum,
      jobType,
      venue: jobType === 'Offline' ? venue.trim() : undefined,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setRoles((r) => [newRole, ...r]);
    setTitle('');
    setLocation('');
    setExperience('');
    setTotalVacancy('');
    setJobType('Online');
    setVenue('');
    setDescription('');
    toast.success('Job role created');
  };
  const handleDelete = (id: string) => {
    setRoles((r) => r.filter((x) => x.id !== id));
    toast.success('Job role removed');
  };
  return (
    <DashboardLayout role="admin" title="Roles" userName="Admin User">
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
        
        <h1 className="text-2xl font-bold text-secondary mb-1">Job Roles</h1>
        {/* <p className="text-xs text-secondary/70">
          Create and manage open roles. Candidates see these on their dashboard
          when applying.
        </p> */}
      </motion.div>

      {/* Create form */}
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
        }}>
        
        <GlassCard className="p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/60">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <PlusIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-secondary">
                Create new role
              </h2>
              <p className="text-[11px] text-secondary/60">
                Add a new job opening with location, experience and vacancy
                details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Role Title"
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
              
              <Input
                label="Location"
                placeholder="e.g. Bangalore, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
              
              <Input
                label="Experience"
                placeholder="e.g. 3-5 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)} />
              
              <Input
                label="Total Vacancy"
                type="number"
                min={1}
                placeholder="e.g. 5"
                value={totalVacancy}
                onChange={(e) => setTotalVacancy(e.target.value)} />
              
                  <div>
                    <label className="block text-[10px] font-medium text-secondary/70 mb-2 uppercase tracking-wider">
                      Job Type
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value as 'Online' | 'Offline')}
                      className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
            </div>
                {jobType === 'Offline' && (
                <Input
                  label="Venue"
                  placeholder="e.g. Building 5, Room 203"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)} />
                )}
            <div>
              <label className="block text-[10px] font-medium text-secondary/70 mb-2 uppercase tracking-wider">
                Description (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief role overview shown to candidates"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-white/60 rounded-2xl text-sm text-secondary placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <PlusIcon className="w-3.5 h-3.5 mr-1" />
                Create Role
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Roles table */}
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
        
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold text-secondary">
            All Roles
            <span className="ml-2 text-[11px] font-normal text-secondary/60">
              {roles.length} {roles.length === 1 ? 'role' : 'roles'}
            </span>
          </h2>
        </div>

        <GlassCard className="overflow-hidden">
          {roles.length === 0 ?
          <div className="p-10 text-center">
              <BriefcaseIcon className="w-8 h-8 text-secondary/40 mx-auto mb-2" />
              <p className="text-sm text-secondary/70">No roles yet</p>
              <p className="text-[11px] text-secondary/50 mt-1">
                Use the form above to create your first role
              </p>
            </div> :

          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/40 border-b border-white/60">
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                      Role Title
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider w-28">
                      Vacancy
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-secondary/70 uppercase tracking-wider w-32">
                      Created
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-semibold text-secondary/70 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {roles.map((role) =>
                  <motion.tr
                    key={role.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: -4
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: -4
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className="border-b border-white/40 last:border-b-0 hover:bg-white/40 transition-colors">
                    
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                              <BriefcaseIcon className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-[13px] font-medium text-secondary">
                              {role.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-secondary/80">
                            <MapPinIcon className="w-3 h-3 text-secondary/50" />
                            {role.location}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-secondary/80">
                            <ClockIcon className="w-3 h-3 text-secondary/50" />
                            {role.experience}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-slate-700">
                          {role.jobType}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-slate-700">
                          {role.venue || '—'}
                        </td>
                        <td className="px-5 py-3">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
                            <UsersIcon className="w-3 h-3 text-primary" />
                            <span className="text-[11px] font-semibold text-primary">
                              {role.totalVacancy}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-secondary/70">
                          {role.createdAt}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                        onClick={() => handleDelete(role.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group inline-flex"
                        title="Remove role">
                        
                            <Trash2Icon className="w-3.5 h-3.5 text-secondary/50 group-hover:text-red-500" />
                          </button>
                        </td>
                      </motion.tr>
                  )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          }
        </GlassCard>
      </motion.div>
    </DashboardLayout>);

}