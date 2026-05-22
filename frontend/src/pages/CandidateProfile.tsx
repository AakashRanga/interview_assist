import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  UserIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CodeIcon,
  FileTextIcon,
  LinkIcon,
  UploadCloudIcon,
  XIcon,
  CheckCircleIcon,
  AwardIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon } from
'lucide-react';
import { seedJobRoles } from '../data/jobRoles';
interface UploadedFile {
  name: string;
  size: string;
}
export function CandidateProfile() {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  });
  const [education, setEducation] = useState({
    degree: 'Bachelor of Computer Science',
    university: 'Stanford University',
    graduationYear: '2022',
    gpa: '3.8'
  });
  const [experience, setExperience] = useState({
    currentRole: 'Frontend Developer',
    company: 'Tech Corp',
    years: '3',
    summary: ''
  });
  const [skills, setSkills] = useState<string[]>([
  'React',
  'TypeScript',
  'Node.js']
  );
  const [skillInput, setSkillInput] = useState('');
  const [preferences, setPreferences] = useState({
    role: '',
    location: ''
  });
  const [appliedRoleIds, setAppliedRoleIds] = useState<Set<string>>(new Set());
  const selectedRole = seedJobRoles.find((r) => r.id === preferences.role);
  const handleApply = () => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }
    if (appliedRoleIds.has(selectedRole.id)) {
      toast.info(`You've already applied to ${selectedRole.title}`);
      return;
    }
    setAppliedRoleIds((prev) => new Set(prev).add(selectedRole.id));
    toast.success(`Applied to ${selectedRole.title}`);
  };
  const indiaLocationOptions = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Delhi NCR',
  'Gurugram, Haryana',
  'Noida, Uttar Pradesh',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Kochi, Kerala',
  'Thiruvananthapuram, Kerala',
  'Coimbatore, Tamil Nadu',
  'Jaipur, Rajasthan',
  'Indore, Madhya Pradesh',
  'Bhubaneswar, Odisha',
  'Chandigarh',
  'Visakhapatnam, Andhra Pradesh',
  'Remote (India)'];

  const [links, setLinks] = useState({
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [resume, setResume] = useState<UploadedFile | null>(null);
  const [certificates, setCertificates] = useState<UploadedFile[]>([]);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
      toast.success('Resume uploaded successfully');
    }
  };
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newCerts = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      setCertificates([...certificates, ...newCerts]);
      toast.success(`${newCerts.length} certificate(s) uploaded`);
    }
  };
  const handleSubmit = () => {
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    toast.success('Profile saved! Auto-scheduling your interview...');
    setTimeout(() => {
      toast.success('Interview scheduled for May 15, 2026 at 2:00 PM');
    }, 1500);
  };
  const sections = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: UserIcon
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCapIcon
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: BriefcaseIcon
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: CodeIcon
  },
  {
    id: 'preferences',
    label: 'Role & Location',
    icon: BriefcaseIcon
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileTextIcon
  },
  {
    id: 'links',
    label: 'Links',
    icon: LinkIcon
  }];

  return (
    <DashboardLayout role="candidate" title="Profile" userName="John Doe">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8">
        
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Complete Your Profile
        </h1>
        <p className="text-sm text-secondary/70">
          Fill in your details and upload documents to auto-schedule your
          interview
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Section nav */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="lg:col-span-1">
          
          <GlassCard className="p-4 sticky top-24">
            <div className="space-y-1">
              {sections.map((s) =>
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-secondary/70 hover:bg-white/60 hover:text-secondary transition-all">
                
                  <s.icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </a>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Info */}
          <motion.section
            id="personal"
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">
                  Personal Information
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    fullName: e.target.value
                  })
                  } />
                
                <Input
                  label="Email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    email: e.target.value
                  })
                  } />
                
                <Input
                  label="Phone"
                  value={personalInfo.phone}
                  onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    phone: e.target.value
                  })
                  } />
                
                <Input
                  label="Location"
                  value={personalInfo.location}
                  onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    location: e.target.value
                  })
                  } />
                
              </div>
            </GlassCard>
          </motion.section>

          {/* Education */}
          <motion.section
            id="education"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15
            }}>
            
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <GraduationCapIcon className="w-5 h-5 text-cyan" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">
                  Education
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  value={education.degree}
                  onChange={(e) =>
                  setEducation({
                    ...education,
                    degree: e.target.value
                  })
                  } />
                
                <Input
                  label="University"
                  value={education.university}
                  onChange={(e) =>
                  setEducation({
                    ...education,
                    university: e.target.value
                  })
                  } />
                
                <Input
                  label="Graduation Year"
                  value={education.graduationYear}
                  onChange={(e) =>
                  setEducation({
                    ...education,
                    graduationYear: e.target.value
                  })
                  } />
                
                <Input
                  label="GPA"
                  value={education.gpa}
                  onChange={(e) =>
                  setEducation({
                    ...education,
                    gpa: e.target.value
                  })
                  } />
                
              </div>
            </GlassCard>
          </motion.section>

          {/* Experience */}
          <motion.section
            id="experience"
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <BriefcaseIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">
                  Experience
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Current Role"
                  value={experience.currentRole}
                  onChange={(e) =>
                  setExperience({
                    ...experience,
                    currentRole: e.target.value
                  })
                  } />
                
                <Input
                  label="Company"
                  value={experience.company}
                  onChange={(e) =>
                  setExperience({
                    ...experience,
                    company: e.target.value
                  })
                  } />
                
                <Input
                  label="Years of Experience"
                  value={experience.years}
                  onChange={(e) =>
                  setExperience({
                    ...experience,
                    years: e.target.value
                  })
                  } />
                
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                  Summary
                </label>
                <textarea
                  rows={4}
                  value={experience.summary}
                  onChange={(e) =>
                  setExperience({
                    ...experience,
                    summary: e.target.value
                  })
                  }
                  placeholder="Briefly describe your work experience..."
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-sm text-secondary placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                
              </div>
            </GlassCard>
          </motion.section>

          {/* Skills */}
          <motion.section
            id="skills"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.25
            }}>
            
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <CodeIcon className="w-5 h-5 text-cyan" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) =>
                <motion.span
                  key={skill}
                  initial={{
                    scale: 0.8,
                    opacity: 0
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1
                  }}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                  
                    <span>{skill}</span>
                    <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-primary/20 rounded-full p-0.5">
                    
                      <XIcon className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }} />
                
                <Button onClick={addSkill}>Add</Button>
              </div>
            </GlassCard>
          </motion.section>

          {/* Apply to a Role */}
          <motion.section
            id="preferences"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.28
            }}>
            
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BriefcaseIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">
                      Apply for a Role
                    </h2>
                    <p className="text-[11px] text-secondary/60 mt-0.5">
                      Pick from current openings and apply directly
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  {seedJobRoles.length} open roles
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                    Open Role
                  </label>
                  <select
                    value={preferences.role}
                    onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      role: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                    
                    <option value="">Select a role to apply</option>
                    {seedJobRoles.map((r) =>
                    <option key={r.id} value={r.id}>
                        {r.title} — {r.location}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                    Preferred Location (India)
                  </label>
                  <select
                    value={preferences.location}
                    onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      location: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                    
                    <option value="">Select a city</option>
                    {indiaLocationOptions.map((c) =>
                    <option key={c} value={c}>
                        {c}
                      </option>
                    )}
                  </select>
                </div>
              </div>
              {selectedRole &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="bg-white/60 border border-primary/20 rounded-2xl p-4">
                
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-secondary">
                        {selectedRole.title}
                      </div>
                      {selectedRole.description &&
                    <p className="text-[12px] text-secondary/70 mt-1">
                          {selectedRole.description}
                        </p>
                    }
                    </div>
                    <Button
                    size="sm"
                    variant={
                    appliedRoleIds.has(selectedRole.id) ?
                    'outline' :
                    'primary'
                    }
                    onClick={handleApply}
                    disabled={appliedRoleIds.has(selectedRole.id)}>
                    
                      {appliedRoleIds.has(selectedRole.id) ?
                    <>
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                          Applied
                        </> :

                    'Apply Now'
                    }
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan/10 border border-cyan/30 rounded-full text-[11px] font-medium text-cyan">
                      <MapPinIcon className="w-3 h-3" />
                      <span className="text-cyan/70">Location:</span>
                      <span>{selectedRole.location || 'Not specified'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-medium text-amber-700">
                      <ClockIcon className="w-3 h-3" />
                      <span className="text-amber-700/70">Experience:</span>
                      <span>{selectedRole.experience || 'Not specified'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full text-[11px] font-medium text-primary">
                      <UsersIcon className="w-3 h-3" />
                      {selectedRole.totalVacancy}{' '}
                      {selectedRole.totalVacancy === 1 ?
                    'vacancy' :
                    'vacancies'}
                    </div>
                  </div>
                </motion.div>
              }
              {appliedRoleIds.size > 0 &&
              <div className="mt-4 pt-4 border-t border-white/60">
                  <div className="text-[10px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                    Your Applications ({appliedRoleIds.size})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(appliedRoleIds).map((id) => {
                    const r = seedJobRoles.find((x) => x.id === id);
                    if (!r) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[11px] text-green-700">
                        
                          <CheckCircleIcon className="w-3 h-3" />
                          {r.title}
                        </span>);

                  })}
                  </div>
                </div>
              }
            </GlassCard>
          </motion.section>

          {/* Documents */}
          <motion.section
            id="documents"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3
            }}>
            
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">
                  Documents
                </h2>
              </div>

              {/* Resume */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                  Resume <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden" />
                
                {!resume ?
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-primary/30 rounded-2xl p-8 hover:bg-white/40 transition-colors text-center">
                  
                    <UploadCloudIcon className="w-10 h-10 text-primary/60 mx-auto mb-3" />
                    <div className="text-sm font-medium text-secondary mb-1">
                      Click to upload resume
                    </div>
                    <div className="text-xs text-secondary/60">
                      PDF, DOC, DOCX up to 10MB
                    </div>
                  </button> :

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-secondary">
                          {resume.name}
                        </div>
                        <div className="text-xs text-secondary/60">
                          {resume.size}
                        </div>
                      </div>
                    </div>
                    <button
                    onClick={() => setResume(null)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                    
                      <XIcon className="w-4 h-4 text-secondary" />
                    </button>
                  </div>
                }
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                  Certificates
                </label>
                <input
                  type="file"
                  ref={certInputRef}
                  onChange={handleCertUpload}
                  accept=".pdf,.jpg,.png"
                  multiple
                  className="hidden" />
                
                <div className="space-y-2 mb-3">
                  {certificates.map((cert, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                    
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                          <AwardIcon className="w-4 h-4 text-cyan" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary">
                            {cert.name}
                          </div>
                          <div className="text-xs text-secondary/60">
                            {cert.size}
                          </div>
                        </div>
                      </div>
                      <button
                      onClick={() =>
                      setCertificates(
                        certificates.filter((_, idx) => idx !== i)
                      )
                      }
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      
                        <XIcon className="w-4 h-4 text-secondary" />
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => certInputRef.current?.click()}
                  className="w-full">
                  
                  <UploadCloudIcon className="w-4 h-4 mr-2" />
                  Upload Certificates
                </Button>
              </div>
            </GlassCard>
          </motion.section>

          {/* Links */}
          <motion.section
            id="links"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.35
            }}>
            
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-cyan" />
                </div>
                <h2 className="text-lg font-semibold text-secondary">
                  Portfolio & Links
                </h2>
              </div>
              <div className="space-y-4">
                <Input
                  label="Portfolio URL"
                  placeholder="https://yourportfolio.com"
                  value={links.portfolio}
                  onChange={(e) =>
                  setLinks({
                    ...links,
                    portfolio: e.target.value
                  })
                  } />
                
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/yourname"
                  value={links.linkedin}
                  onChange={(e) =>
                  setLinks({
                    ...links,
                    linkedin: e.target.value
                  })
                  } />
                
                <Input
                  label="GitHub"
                  placeholder="https://github.com/yourname"
                  value={links.github}
                  onChange={(e) =>
                  setLinks({
                    ...links,
                    github: e.target.value
                  })
                  } />
                
              </div>
            </GlassCard>
          </motion.section>

          {/* Submit */}
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
              delay: 0.4
            }}
            className="flex justify-end space-x-3">
            
            <Button variant="outline" size="lg">
              Save Draft
            </Button>
            <Button size="lg" onClick={handleSubmit}>
              Submit & Auto-Schedule Interview
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>);

}