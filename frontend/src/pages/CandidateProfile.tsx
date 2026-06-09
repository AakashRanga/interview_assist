import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { API_BASE_URL } from '../config';

interface UploadedFile {
  name: string;
  size: string;
  file?: File;
  path?: string;
}

export function parseGpa(gpaStr: string): { cgpa: string; percentage: string } {
  if (!gpaStr) return { cgpa: '', percentage: '' };
  if (gpaStr.includes('|')) {
    const parts = gpaStr.split('|');
    return {
      cgpa: parts[0]?.trim() || '',
      percentage: parts[1]?.trim() || ''
    };
  }
  const val = gpaStr.replace('%', '').trim();
  const num = parseFloat(val);
  if (!isNaN(num)) {
    if (num > 10) {
      return { cgpa: '', percentage: val };
    } else {
      return { cgpa: val, percentage: '' };
    }
  }
  return { cgpa: '', percentage: gpaStr };
}

export function getErrorMessage(data: any, defaultMsg: string): string {
  if (!data || !data.detail) return defaultMsg;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((err: any) => {
      const field = err.loc ? err.loc[err.loc.length - 1] : '';
      return field ? `${field}: ${err.msg}` : err.msg;
    }).join(', ');
  }
  return defaultMsg;
}

export function CandidateProfile() {
  const [userId, setUserId] = useState<number | null>(null);
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<string>('personal');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      const validSections = ['personal', 'education', 'experience', 'skills', 'preferences', 'documents', 'links'];
      if (validSections.includes(sectionId)) {
        setSection(sectionId);
      }
    }
  }, []);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });
  const [educationList, setEducationList] = useState<Array<{
    id?: number;
    degree: string;
    university: string;
    graduationYear: string;
    gpa: string;
  }>>([
    { degree: 'SSLC', university: '', graduationYear: '', gpa: '' },
    { degree: 'HSC', university: '', graduationYear: '', gpa: '' },
    { degree: '', university: '', graduationYear: '', gpa: '' },
    { degree: '', university: '', graduationYear: '', gpa: '' }
  ]);
  const [visibleEducationLevels, setVisibleEducationLevels] = useState<number>(1);

  const updateUgPgGpa = (index: number, field: 'cgpa' | 'percentage', value: string) => {
    const updated = [...educationList];
    const { cgpa, percentage } = parseGpa(updated[index]?.gpa || '');
    let newCgpa = cgpa;
    let newPercentage = percentage;
    if (field === 'cgpa') {
      newCgpa = value;
    } else {
      newPercentage = value;
    }
    updated[index] = {
      ...updated[index],
      gpa: (newCgpa || newPercentage) ? `${newCgpa}|${newPercentage}` : ''
    };
    setEducationList(updated);
  };

  const handleRemoveLevel = (index: number) => {
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      university: '',
      graduationYear: '',
      gpa: '',
      degree: index >= 2 ? '' : updated[index].degree
    };
    setEducationList(updated);
    setVisibleEducationLevels(index);
    toast.success('Education section removed');
  };

  const [experienceList, setExperienceList] = useState<Array<{
    id?: number;
    currentRole: string;
    company: string;
    years: string;
    summary: string;
  }>>([{ currentRole: '', company: '', years: '', summary: '' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [preferences, setPreferences] = useState({
    role: '',
    location: ''
  });
  const [appliedRoleIds, setAppliedRoleIds] = useState<Set<string>>(new Set());

  const [links, setLinks] = useState({
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [resume, setResume] = useState<UploadedFile | null>(null);
  const [certificates, setCertificates] = useState<UploadedFile[]>([]);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.id) {
          setUserId(u.id);
          fetchProfile(u.id);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.error('Please log in first');
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/candidate/user/${id}/profile`);
      if (!res.ok) {
        toast.error('Failed to load profile details');
        return;
      }
      const data = await res.json();
      
      setPersonalInfo({
        fullName: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || ''
      });
      
      const loadedEducation: Array<{
        id?: number;
        degree: string;
        university: string;
        graduationYear: string;
        gpa: string;
      }> = [
        { degree: 'SSLC', university: '', graduationYear: '', gpa: '' },
        { degree: 'HSC', university: '', graduationYear: '', gpa: '' },
        { degree: '', university: '', graduationYear: '', gpa: '' },
        { degree: '', university: '', graduationYear: '', gpa: '' }
      ];

      if (data.education && Array.isArray(data.education)) {
        data.education.forEach((edu: any) => {
          const deg = (edu.degree || '').trim();
          if (!deg) return;

          if (deg === 'SSLC') {
            loadedEducation[0] = {
              id: edu.id,
              degree: 'SSLC',
              university: edu.university || '',
              graduationYear: edu.graduation_year || '',
              gpa: edu.gpa || ''
            };
          } else if (deg === 'HSC') {
            loadedEducation[1] = {
              id: edu.id,
              degree: 'HSC',
              university: edu.university || '',
              graduationYear: edu.graduation_year || '',
              gpa: edu.gpa || ''
            };
          } else if (deg.startsWith('UG - ')) {
            loadedEducation[2] = {
              id: edu.id,
              degree: deg.slice(5),
              university: edu.university || '',
              graduationYear: edu.graduation_year || '',
              gpa: edu.gpa || ''
            };
          } else if (deg.startsWith('PG - ')) {
            loadedEducation[3] = {
              id: edu.id,
              degree: deg.slice(5),
              university: edu.university || '',
              graduationYear: edu.graduation_year || '',
              gpa: edu.gpa || ''
            };
          } else {
            // Un-prefixed degree fallback. Guess based on common patterns.
            const lowerDeg = deg.toLowerCase();
            const isPg = lowerDeg.startsWith('m') || 
                         lowerDeg.includes('master') || 
                         lowerDeg.startsWith('pg') || 
                         lowerDeg.startsWith('post');
            if (isPg) {
              loadedEducation[3] = {
                id: edu.id,
                degree: deg,
                university: edu.university || '',
                graduationYear: edu.graduation_year || '',
                gpa: edu.gpa || ''
              };
            } else {
              loadedEducation[2] = {
                id: edu.id,
                degree: deg,
                university: edu.university || '',
                graduationYear: edu.graduation_year || '',
                gpa: edu.gpa || ''
              };
            }
          }
        });
      }
      setEducationList(loadedEducation);
      
      let maxVisible = 1;
      if (loadedEducation[3].university || loadedEducation[3].graduationYear || loadedEducation[3].gpa || loadedEducation[3].degree) {
        maxVisible = 4;
      } else if (loadedEducation[2].university || loadedEducation[2].graduationYear || loadedEducation[2].gpa || loadedEducation[2].degree) {
        maxVisible = 3;
      } else if (loadedEducation[1].university || loadedEducation[1].graduationYear || loadedEducation[1].gpa) {
        maxVisible = 2;
      }
      setVisibleEducationLevels(maxVisible);
      
      if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
        setExperienceList(
          data.experience.map((exp: any) => ({
            id: exp.id,
            currentRole: exp.current_role || '',
            company: exp.company || '',
            years: exp.years_experience || '',
            summary: exp.summary || ''
          }))
        );
      } else {
        setExperienceList([{ currentRole: '', company: '', years: '', summary: '' }]);
      }
      
      if (data.skills) {
        setSkills(data.skills);
      }
      
      if (data.links) {
        setLinks({
          portfolio: data.links.portfolio || '',
          linkedin: data.links.linkedin || '',
          github: data.links.github || ''
        });
      }
      
      if (data.documents) {
        if (data.documents.resume_path) {
          setResume({
            name: data.documents.resume_path.split('/').pop() || data.documents.resume_path,
            size: 'Existing File',
            path: data.documents.resume_path
          });
        }
        if (data.documents.certificates && data.documents.certificates.length > 0) {
          setCertificates(data.documents.certificates.map((c: string) => ({
            name: c.split('/').pop() || c,
            size: 'Existing File',
            path: c
          })));
        }
      }
      
      if (data.applications) {
        const ids = new Set<string>();
        data.applications.forEach((app: any) => ids.add(String(app.role_id)));
        setAppliedRoleIds(ids);
      }
      
      if (data.open_roles) {
        setJobRoles(data.open_roles);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching candidate profile from server');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = jobRoles.find((r) => String(r.id) === String(preferences.role));

  const handleApply = async () => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }
    if (appliedRoleIds.size > 0) {
      toast.error('You can only apply to one job role at a time.');
      return;
    }
    if (!userId) {
      toast.error('User session not found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidate/user/${userId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: selectedRole.id,
          preferred_location: preferences.location || null,
          cover_letter: `Applying for ${selectedRole.title}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(getErrorMessage(data, 'Failed to apply'));
        return;
      }

      setAppliedRoleIds((prev) => {
        const next = new Set(prev);
        next.add(String(selectedRole.id));
        return next;
      });
      toast.success(`Applied to ${selectedRole.title}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to server');
    }
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
    'Remote (India)'
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const getFileName = (path: string) => path.split('/').pop() || path;

  const getDocumentUrl = (path?: string) => {
    if (!path) return undefined;
    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;
    // If path starts with /, it's a proper relative path
    if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
    // Otherwise, add leading slash
    return `${API_BASE_URL}/${path}`;
  };

  const countFilled = (value?: string | null) =>
    value && value.trim().length > 0 ? 1 : 0;

  const calculateCompletion = () => {
    const personalComplete =
      countFilled(personalInfo.fullName) &&
      countFilled(personalInfo.email) &&
      countFilled(personalInfo.phone) &&
      countFilled(personalInfo.location);

    const hasEducation = educationList.some(
      (edu, idx) =>
        countFilled(edu.university) ||
        countFilled(edu.graduationYear) ||
        countFilled(edu.gpa) ||
        (idx === 2 && countFilled(edu.degree)) ||
        (idx === 3 && countFilled(edu.degree))
    );
    const hasExperience = experienceList.some(
      (exp) =>
        countFilled(exp.currentRole) ||
        countFilled(exp.company) ||
        countFilled(exp.years) ||
        countFilled(exp.summary)
    );
    const hasSkills = skills.length > 0;
    const hasDocuments = resume?.path || resume?.file || certificates.length > 0;
    const hasLinks =
      countFilled(links.portfolio) ||
      countFilled(links.linkedin) ||
      countFilled(links.github);

    const sections = [
      personalComplete ? 1 : 0,
      hasEducation ? 1 : 0,
      hasExperience ? 1 : 0,
      hasSkills ? 1 : 0,
      hasDocuments ? 1 : 0,
      hasLinks ? 1 : 0
    ];

    const totalSections = sections.length;
    const filledSections = sections.reduce((sum, value) => sum + value, 0);

    return Math.min(100, Math.round((filledSections / totalSections) * 100));
  };

  const profileCompletion = useMemo(
    () => calculateCompletion(),
    [personalInfo, educationList, experienceList, skills, resume, certificates, links]
  );

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file,
        path: undefined
      });
      toast.success('Resume selected successfully');
    }
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newCerts = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file,
        path: undefined
      }));
      setCertificates([...certificates, ...newCerts]);
      toast.success(`${newCerts.length} certificate(s) selected`);
    }
  };

  const uploadDocuments = async () => {
    if (!userId) return { resumePath: resume?.path, certificatePaths: certificates.map((cert) => cert.path).filter(Boolean) as string[] };

    let resumePath = resume?.path;
    const certificatePaths: string[] = [];
    const updatedCertificates = [...certificates];

    if (resume?.file) {
      const uploaded = await uploadDocumentFile(userId, resume.file, 'resume');
      resumePath = uploaded;
      setResume({
        name: resume.name,
        size: resume.size,
        path: uploaded
      });
    }

    for (let index = 0; index < certificates.length; index += 1) {
      const cert = certificates[index];
      if (cert.file) {
        const uploaded = await uploadDocumentFile(userId, cert.file, 'certificate');
        certificatePaths.push(uploaded);
        updatedCertificates[index] = {
          name: cert.name,
          size: cert.size,
          path: uploaded
        };
      } else if (cert.path) {
        certificatePaths.push(cert.path);
      }
    }

    if (updatedCertificates.length > 0) {
      setCertificates(updatedCertificates);
    }

    return { resumePath, certificatePaths };
  };

  const uploadDocumentFile = async (userId: number, file: File, docType: 'resume' | 'certificate') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);

    const response = await fetch(`${API_BASE_URL}/candidate/user/${userId}/upload-document`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(getErrorMessage(data, 'Document upload failed'));
    }
    return data.path;
  };

  const handleSave = async (showToast = true) => {
    if (!userId) {
      toast.error('User session not found. Please log in.');
      return false;
    }

    let resumePath: string | undefined | null = resume?.path;
    let certificatePaths: string[] = certificates.map((cert) => cert.path).filter(Boolean) as string[];

    try {
      const uploadResult = await uploadDocuments();
      resumePath = uploadResult.resumePath ?? resumePath;
      certificatePaths = uploadResult.certificatePaths.length > 0 ? uploadResult.certificatePaths : certificatePaths;
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload documents');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidate/user/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: personalInfo.fullName,
          email: personalInfo.email,
          phone: personalInfo.phone,
          location: personalInfo.location,
          education: educationList
            .map((edu, idx) => {
              let savedDegree = edu.degree || '';
              if (idx === 0) savedDegree = 'SSLC';
              else if (idx === 1) savedDegree = 'HSC';
              else if (idx === 2) savedDegree = edu.degree ? `UG - ${edu.degree}` : 'UG';
              else if (idx === 3) savedDegree = edu.degree ? `PG - ${edu.degree}` : 'PG';

              return {
                id: edu.id,
                degree: savedDegree,
                university: edu.university || '',
                graduation_year: edu.graduationYear || '',
                gpa: edu.gpa || ''
              };
            })
            .filter((edu, idx) => {
              if (idx >= visibleEducationLevels) return false;
              const isFilled =
                edu.university.trim().length > 0 ||
                edu.graduation_year.trim().length > 0 ||
                edu.gpa.trim().length > 0 ||
                (idx === 2 && edu.degree !== 'UG') ||
                (idx === 3 && edu.degree !== 'PG');
              return isFilled;
            }),
          experience: experienceList.map((exp) => ({
            id: exp.id,
            current_role: exp.currentRole,
            company: exp.company,
            years_experience: exp.years,
            summary: exp.summary
          })),
          skills: skills,
          links: {
            portfolio: links.portfolio || null,
            linkedin: links.linkedin || null,
            github: links.github || null
          },
          documents: {
            resume_path: resumePath || null,
            certificates: certificatePaths
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(getErrorMessage(data, 'Failed to save profile'));
        return false;
      }

      // Update stored user if fullName or email changed
      const storedUser = localStorage.getItem('user');
      if (storedUser && data.user) {
        const parsed = JSON.parse(storedUser);
        parsed.full_name = data.user.full_name;
        parsed.email = data.user.email;
        localStorage.setItem('user', JSON.stringify(parsed));
      }

      if (showToast) {
        toast.success('Draft saved successfully');
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to server');
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    const saved = await handleSave(false);
    if (saved) {
      toast.success('Profile saved! Auto-scheduling your interview...');
      setTimeout(() => {
        toast.success('Interview scheduled for May 15, 2026 at 2:00 PM');
      }, 1500);
    }
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

  if (loading) {
    return (
      <DashboardLayout role="candidate" title="Profile" userName={personalInfo.fullName || "John Doe"}>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate" title="Profile" userName={personalInfo.fullName || "John Doe"}>
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
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Complete Your Profile
            </h1>
            <p className="text-sm text-secondary/70">
              Fill in your details and upload documents to schedule your
              interview
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-secondary/60 mb-2">Profile completion</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <span className="text-sm font-semibold text-secondary">
                {profileCompletion}%
              </span>
            </div>
          </div>
        </div>
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
              {sections.map((s) => {
                const isActive = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSection(s.id);
                      window.history.replaceState(null, '', `#${s.id}`);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-secondary/70 hover:bg-white/60 hover:text-secondary'
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
          </GlassCard>
        </motion.div>

        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Info */}
          {section === 'personal' && (
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
          )}

          {/* Education */}
          {section === 'education' && (
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
                <div className="space-y-6">
                  {/* SSLC Panel */}
                  {educationList[0] && (
                    <div className="relative p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm space-y-4">
                      <div className="text-[12px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                        SSLC (Class 10)
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="School Name / Board"
                          value={educationList[0].university}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[0] = { ...updated[0], university: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                        <Input
                          label="Passing Year"
                          value={educationList[0].graduationYear}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[0] = { ...updated[0], graduationYear: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                        <Input
                          label="Percentage (%)"
                          value={educationList[0].gpa}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[0] = { ...updated[0], gpa: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* HSC Panel */}
                  {visibleEducationLevels >= 2 && educationList[1] && (
                    <div className="relative p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm space-y-4">
                      {visibleEducationLevels === 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLevel(1)}
                          className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer border-0"
                          title="Remove HSC"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-[12px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                        HSC (Class 12)
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="School Name / Board"
                          value={educationList[1].university}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[1] = { ...updated[1], university: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                        <Input
                          label="Passing Year"
                          value={educationList[1].graduationYear}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[1] = { ...updated[1], graduationYear: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                        <Input
                          label="Percentage (%)"
                          value={educationList[1].gpa}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[1] = { ...updated[1], gpa: e.target.value };
                            setEducationList(updated);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* UG Panel */}
                  {visibleEducationLevels >= 3 && educationList[2] && (() => {
                    const { cgpa, percentage } = parseGpa(educationList[2].gpa);
                    return (
                      <div className="relative p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm space-y-4">
                        {visibleEducationLevels === 3 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLevel(2)}
                            className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer border-0"
                            title="Remove UG"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        )}
                        <div className="text-[12px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                          Undergraduate (UG)
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Degree Name (e.g. B.E, B.Tech, B.Sc)"
                            value={educationList[2].degree}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[2] = { ...updated[2], degree: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <Input
                            label="College / University"
                            value={educationList[2].university}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[2] = { ...updated[2], university: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <Input
                            label="Passing Year"
                            value={educationList[2].graduationYear}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[2] = { ...updated[2], graduationYear: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label="CGPA"
                              value={cgpa}
                              onChange={(e) => updateUgPgGpa(2, 'cgpa', e.target.value)}
                            />
                            <Input
                              label="Percentage (%)"
                              value={percentage}
                              onChange={(e) => updateUgPgGpa(2, 'percentage', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* PG Panel */}
                  {visibleEducationLevels >= 4 && educationList[3] && (() => {
                    const { cgpa, percentage } = parseGpa(educationList[3].gpa);
                    return (
                      <div className="relative p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm space-y-4">
                        {visibleEducationLevels === 4 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLevel(3)}
                            className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer border-0"
                            title="Remove PG"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        )}
                        <div className="text-[12px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                          Postgraduate (PG) - Optional
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Degree Name (e.g. M.E, M.Tech, M.Sc)"
                            value={educationList[3].degree}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[3] = { ...updated[3], degree: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <Input
                            label="College / University"
                            value={educationList[3].university}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[3] = { ...updated[3], university: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <Input
                            label="Passing Year"
                            value={educationList[3].graduationYear}
                            onChange={(e) => {
                              const updated = [...educationList];
                              updated[3] = { ...updated[3], graduationYear: e.target.value };
                              setEducationList(updated);
                            }}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label="CGPA"
                              value={cgpa}
                              onChange={(e) => updateUgPgGpa(3, 'cgpa', e.target.value)}
                            />
                            <Input
                              label="Percentage (%)"
                              value={percentage}
                              onChange={(e) => updateUgPgGpa(3, 'percentage', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Add Education Button */}
                  {visibleEducationLevels < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setVisibleEducationLevels((prev) => prev + 1)}
                      className="w-full mt-2 cursor-pointer"
                    >
                      + Add Education
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.section>
          )}

          {/* Experience */}
          {section === 'experience' && (
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
                <div className="space-y-6">
                  {experienceList.map((exp, index) => (
                    <div key={index} className="relative p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm space-y-4">
                      {experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setExperienceList(experienceList.filter((_, i) => i !== index));
                            toast.success('Experience entry removed');
                          }}
                          className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer border-0"
                          title="Remove Experience"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-[11px] font-semibold text-secondary/60 uppercase tracking-wider mb-2">
                        Experience #{index + 1}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Job Role / Title"
                          value={exp.currentRole}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[index] = { ...updated[index], currentRole: e.target.value };
                            setExperienceList(updated);
                          }}
                        />
                        <Input
                          label="Company"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[index] = { ...updated[index], company: e.target.value };
                            setExperienceList(updated);
                          }}
                        />
                        <Input
                          label="Years of Experience"
                          value={exp.years}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[index] = { ...updated[index], years: e.target.value };
                            setExperienceList(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase tracking-wide">
                          Summary
                        </label>
                        <textarea
                          rows={3}
                          value={exp.summary}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[index] = { ...updated[index], summary: e.target.value };
                            setExperienceList(updated);
                          }}
                          placeholder="Briefly describe your work experience..."
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-sm text-secondary placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-medium"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExperienceList([...experienceList, { currentRole: '', company: '', years: '', summary: '' }])}
                    className="w-full mt-2 cursor-pointer"
                  >
                    + Add Experience
                  </Button>
                </div>
              </GlassCard>
            </motion.section>
          )}

          {/* Skills */}
          {section === 'skills' && (
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
          )}

          {/* Apply to a Role */}
          {section === 'preferences' && (
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
                    {jobRoles.length} open roles
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
                      {jobRoles.map((r) =>
                      <option key={r.id} value={r.id}>
                          {r.title} — {r.location} — {r.level ? `${r.level} — ` : ''}{r.job_type || r.jobType || 'Online'}
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
                      appliedRoleIds.has(String(selectedRole.id)) ?
                      'outline' :
                      'primary'
                      }
                      onClick={handleApply}
                      disabled={appliedRoleIds.size > 0}>
                      
                        {appliedRoleIds.has(String(selectedRole.id)) ?
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
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-full text-[11px] font-medium text-slate-700">
                        <span>Type:</span>
                        <span>{selectedRole.job_type || selectedRole.jobType || 'Online'}</span>
                      </div>
                      {selectedRole.level && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[11px] font-medium text-indigo-700">
                          <span>Level:</span>
                          <span>{selectedRole.level}</span>
                        </div>
                      )}
                      {((selectedRole.job_type || selectedRole.jobType) === 'Offline') && selectedRole.venue && (
                        <div className="w-full rounded-2xl bg-slate-50 p-3 border border-slate-200 text-[13px] text-slate-800 mt-3">
                          <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                            Interview Venue
                          </div>
                          {selectedRole.venue}
                        </div>
                      )}
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
                      const r = jobRoles.find((x) => String(x.id) === String(id));
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
          )}

          {/* Documents */}
          {section === 'documents' && (
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
  
                  <div className="flex flex-col gap-3 p-4 bg-white/50 rounded-2xl border border-primary/20 sm:flex-row sm:items-center sm:justify-between">
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
                      <div className="flex items-center gap-2">
                        {resume.path && (
                          <a
                            href={getDocumentUrl(resume.path)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            View
                          </a>
                        )}
                        <button
                          onClick={() => setResume(null)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <XIcon className="w-4 h-4 text-secondary" />
                        </button>
                      </div>
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
                        <div className="flex items-center gap-2">
                          {cert.path && (
                            <a
                              href={getDocumentUrl(cert.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary hover:text-primary/80 font-medium"
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() =>
                              setCertificates(
                                certificates.filter((_, idx) => idx !== i)
                              )
                            }
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <XIcon className="w-4 h-4 text-secondary" />
                          </button>
                        </div>
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
          )}

          {/* Links */}
          {section === 'links' && (
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
          )}

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
            
            <Button variant="outline" size="lg" onClick={() => handleSave(true)}>
              Save Draft
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={appliedRoleIds.size > 0}>
              Schedule Interview
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>);

}