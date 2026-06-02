export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status:
  'Applied' |
  'Scheduled' |
  'Interviewed' |
  'Selected' |
  'Rejected' |
  'On Hold';
  interviewDate?: string;
  interviewTime?: string;
  mode: 'Online' | 'Offline';
  panelId: string;
  panelGroupId: string;
  profileComplete: number;
  avatar: string;
  skills: string[];
  experience: string;
  education: string;
  resumeUrl?: string;
  meetLink?: string;
  venue?: string;
  appliedDate: string;
}

export interface PanelMember {
  name: string;
  role: string;
}

export interface PanelCategory {
  id: string;
  panelGroupId: string;
  name: string;
  type: string;
  members: PanelMember[];
  capacity: number;
  currentLoad: number;
  meetLink: string;
  zoomLink: string;
  mode?: 'Online' | 'Offline';
  venue?: string;
}

export interface PanelGroup {
  id: string;
  name: string;
  description: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  panelId: string;
  date: string;
  time: string;
  mode: 'Online' | 'Offline';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetLink?: string;
  venue?: string;
}

export interface Feedback {
  id: string;
  candidateId: string;
  panelId: string;
  technicalRating: number;
  hrRating: number;
  communicationRating: number;
  comments: string;
  recommendation: 'Select' | 'Reject' | 'Hold';
  submittedBy: string;
  submittedAt: string;
}

export interface Activity {
  id: string;
  type:
  'interview_scheduled' |
  'feedback_submitted' |
  'candidate_applied' |
  'panel_assigned';
  message: string;
  timestamp: string;
  user: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'interview' | 'feedback' | 'system' | 'profile';
  audience: 'candidate' | 'panel' | 'admin' | 'all';
}

// Panel groups (parents)
export const mockPanelGroups: PanelGroup[] = [
{
  id: 'group-1',
  name: 'Panel A',
  description: 'Primary interview panel for engineering roles'
},
{
  id: 'group-2',
  name: 'Panel B',
  description: 'Secondary interview panel for product roles'
}];


// Categories (children of panel groups)
// Each panel is a committee of 4 members that conducts interviews together
export const mockPanels: PanelCategory[] = [
// Panel A categories
{
  id: 'panel-a-hr',
  panelGroupId: 'group-1',
  name: 'Panel A',
  type: 'Panel A',
  members: [
  { name: 'Sarah Johnson', role: 'HR Lead' },
  { name: 'Mike Chen', role: 'HR Specialist' },
  { name: 'Olivia Bennett', role: 'Talent Manager' },
  { name: 'Rahul Sharma', role: 'HR Coordinator' }],

  capacity: 10,
  currentLoad: 10,
  meetLink: 'https://meet.google.com/panel-a-hr-001',
  zoomLink: 'https://zoom.us/j/1110000001',
  mode: 'Online'
},
{
  id: 'panel-a-tech',
  panelGroupId: 'group-1',
  name: 'Panel B',
  type: 'Panel B',
  members: [
  { name: 'Alex Kumar', role: 'Tech Lead' },
  { name: 'Emily Rodriguez', role: 'Senior Engineer' },
  { name: 'Daniel Kim', role: 'Architect' },
  { name: 'Sneha Iyer', role: 'Engineering Manager' }],

  capacity: 10,
  currentLoad: 10,
  meetLink: 'https://meet.google.com/panel-a-tech-002',
  zoomLink: 'https://zoom.us/j/1110000002',
  mode: 'Offline',
  venue: 'Tech Campus, Conference Room B'
},
{
  id: 'panel-a-p1',
  panelGroupId: 'group-1',
  name: 'Panel C',
  type: 'Panel C',
  members: [
  { name: 'David Lee', role: 'Principal Engineer' },
  { name: 'Jessica Park', role: 'Senior Engineer' },
  { name: 'Marcus Hall', role: 'Tech Lead' },
  { name: 'Anita Reddy', role: 'Engineering Manager' }],

  capacity: 10,
  currentLoad: 10,
  meetLink: 'https://meet.google.com/panel-a-p1-003',
  zoomLink: 'https://zoom.us/j/1110000003',
},
{
  id: 'panel-a-p2',
  panelGroupId: 'group-1',
  name: 'Panel D',
  type: 'Panel D',
  members: [
  { name: 'Robert Taylor', role: 'Senior Engineer' },
  { name: 'Amanda White', role: 'Product Manager' },
  { name: 'Vikram Singh', role: 'Tech Lead' },
  { name: 'Chloe Adams', role: 'Team Lead' }],

  capacity: 10,
  currentLoad: 10,
  meetLink: 'https://meet.google.com/panel-a-p2-004',
  zoomLink: 'https://zoom.us/j/1110000004',
},
{
  id: 'panel-a-p3',
  panelGroupId: 'group-1',
  name: 'Panel E',
  type: 'Panel E',
  members: [
  { name: 'Linda Wang', role: 'Engineering Manager' },
  { name: 'James Brown', role: 'Senior Engineer' },
  { name: 'Arjun Mehta', role: 'Tech Lead' },
  { name: 'Sophia Turner', role: 'Architect' }],

  capacity: 10,
  currentLoad: 10,
  meetLink: 'https://meet.google.com/panel-a-p3-005',
  zoomLink: 'https://zoom.us/j/1110000005',
},
// Panel B categories
{
  id: 'panel-b-hr',
  panelGroupId: 'group-2',
  name: 'Panel F',
  type: 'Panel F',
  members: [
  { name: 'Priya Nair', role: 'HR Lead' },
  { name: 'Carlos Garcia', role: 'HR Specialist' },
  { name: 'Ethan Wright', role: 'Talent Manager' },
  { name: 'Meera Joshi', role: 'HR Coordinator' }],

  capacity: 10,
  currentLoad: 6,
  meetLink: 'https://meet.google.com/panel-b-hr-006',
  zoomLink: 'https://zoom.us/j/2220000001',
},
{
  id: 'panel-b-tech',
  panelGroupId: 'group-2',
  name: 'Panel G',
  type: 'Panel G',
  members: [
  { name: 'Tom Wilson', role: 'Tech Lead' },
  { name: 'Nina Patel', role: 'Senior Engineer' },
  { name: 'Hiroshi Tanaka', role: 'Architect' },
  { name: 'Aarav Kapoor', role: 'Engineering Manager' }],

  capacity: 10,
  currentLoad: 8,
  meetLink: 'https://meet.google.com/panel-b-tech-007',
  zoomLink: 'https://zoom.us/j/2220000002',
}];


export const mockCandidates: Candidate[] = Array.from(
  { length: 60 },
  (_, i) => {
    // Distribute candidates: 10 per category in Panel A (50), then fill Panel B
    const categoryIndex = Math.floor(i / 10) % mockPanels.length;
    const category = mockPanels[categoryIndex];

    const statuses: Candidate['status'][] = [
    'Applied',
    'Scheduled',
    'Interviewed',
    'Selected',
    'Rejected',
    'On Hold'];

    const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager'];

    const modes: ('Online' | 'Offline')[] = ['Online', 'Offline'];
    const mode = modes[i % 2];

    return {
      id: `candidate-${i + 1}`,
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@example.com`,
      phone: `+1 (555) ${String(i + 1).padStart(3, '0')}-${String(1000 + i * 7).slice(0, 4)}`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      interviewDate: new Date(2026, 4, 12 + i % 14).toISOString(),
      interviewTime: `${10 + i % 8}:00 ${i % 8 >= 2 ? 'PM' : 'AM'}`,
      mode,
      panelId: category.id,
      panelGroupId: category.panelGroupId,
      profileComplete: 60 + i % 40,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'AWS',
      'Docker'].
      slice(i % 3, i % 3 + 3),
      experience: `${2 + i % 8} years`,
      education: 'Bachelor of Computer Science',
      resumeUrl: 'https://example.com/resume.pdf',
      meetLink: mode === 'Online' ? category.meetLink : undefined,
      venue:
      mode === 'Offline' ?
      'Tech Tower, Floor 5, Conference Room A' :
      undefined,
      appliedDate: new Date(2026, 4, 1 + i % 14).toISOString()
    };
  }
);

export const mockInterviews: Interview[] = mockCandidates.
filter((c) => c.status === 'Scheduled' || c.status === 'Interviewed').
map((c) => ({
  id: `interview-${c.id}`,
  candidateId: c.id,
  panelId: c.panelId,
  date: c.interviewDate!,
  time: c.interviewTime!,
  mode: c.mode,
  status: c.status === 'Interviewed' ? 'Completed' : 'Scheduled',
  meetLink: c.meetLink,
  venue: c.venue
}));

export const mockActivities: Activity[] = [
{
  id: 'activity-1',
  type: 'interview_scheduled',
  message: 'Interview scheduled for Candidate 5',
  timestamp: new Date(2026, 4, 12, 14, 30).toISOString(),
  user: 'System'
},
{
  id: 'activity-2',
  type: 'feedback_submitted',
  message: 'Feedback submitted for Candidate 3',
  timestamp: new Date(2026, 4, 12, 13, 15).toISOString(),
  user: 'Alex Kumar'
},
{
  id: 'activity-3',
  type: 'candidate_applied',
  message: 'New candidate applied: Candidate 35',
  timestamp: new Date(2026, 4, 12, 11, 45).toISOString(),
  user: 'System'
},
{
  id: 'activity-4',
  type: 'panel_assigned',
  message: 'Candidate 12 assigned to Technical category',
  timestamp: new Date(2026, 4, 12, 10, 20).toISOString(),
  user: 'Admin'
},
{
  id: 'activity-5',
  type: 'interview_scheduled',
  message: 'Interview rescheduled for Candidate 8',
  timestamp: new Date(2026, 4, 12, 9, 0).toISOString(),
  user: 'Sarah Johnson'
}];


export const candidateNotifications: Notification[] = [
{
  id: 'n-c-1',
  title: 'Interview Scheduled',
  message:
  'Your interview with Technical category has been scheduled for May 15, 2026 at 2:00 PM.',
  timestamp: new Date(2026, 4, 12, 14, 30).toISOString(),
  read: false,
  type: 'interview',
  audience: 'candidate'
},
{
  id: 'n-c-2',
  title: 'Meet Link Generated',
  message:
  'A Google Meet link has been auto-generated for your upcoming interview.',
  timestamp: new Date(2026, 4, 12, 14, 31).toISOString(),
  read: false,
  type: 'interview',
  audience: 'candidate'
},
{
  id: 'n-c-3',
  title: 'Profile Viewed',
  message: 'Sarah Johnson from HR category viewed your profile.',
  timestamp: new Date(2026, 4, 11, 10, 15).toISOString(),
  read: true,
  type: 'profile',
  audience: 'candidate'
},
{
  id: 'n-c-4',
  title: 'Document Uploaded',
  message: 'Your resume has been uploaded successfully.',
  timestamp: new Date(2026, 4, 10, 16, 0).toISOString(),
  read: true,
  type: 'system',
  audience: 'candidate'
},
{
  id: 'n-c-5',
  title: 'Interview Reminder',
  message: 'Your interview is in 24 hours. Please be prepared.',
  timestamp: new Date(2026, 4, 14, 14, 0).toISOString(),
  read: false,
  type: 'interview',
  audience: 'candidate'
}];


export const panelNotifications: Notification[] = [
{
  id: 'n-p-1',
  title: 'New Interview Assigned',
  message:
  'You have been assigned to interview Candidate 5 on May 15, 2026 at 2:00 PM.',
  timestamp: new Date(2026, 4, 12, 14, 30).toISOString(),
  read: false,
  type: 'interview',
  audience: 'panel'
},
{
  id: 'n-p-2',
  title: 'Candidate Profile Ready',
  message: 'Candidate 8 has completed their profile and is ready for review.',
  timestamp: new Date(2026, 4, 12, 13, 0).toISOString(),
  read: false,
  type: 'profile',
  audience: 'panel'
},
{
  id: 'n-p-3',
  title: 'Feedback Reminder',
  message: 'Please submit feedback for Candidate 3 within 24 hours.',
  timestamp: new Date(2026, 4, 12, 11, 0).toISOString(),
  read: true,
  type: 'feedback',
  audience: 'panel'
}];


export const pipelineData = [
{ stage: 'Applied', count: 60 },
{ stage: 'Screened', count: 45 },
{ stage: 'Interviewed', count: 28 },
{ stage: 'Offered', count: 16 },
{ stage: 'Hired', count: 10 }];


export const interviewsOverTime = [
{ date: 'Jan', count: 18 },
{ date: 'Feb', count: 24 },
{ date: 'Mar', count: 32 },
{ date: 'Apr', count: 28 },
{ date: 'May', count: 41 },
{ date: 'Jun', count: 36 },
{ date: 'Jul', count: 45 },
{ date: 'Aug', count: 52 },
{ date: 'Sep', count: 47 },
{ date: 'Oct', count: 58 },
{ date: 'Nov', count: 49 },
{ date: 'Dec', count: 38 }];


export const statusBreakdown = [
{ name: 'Scheduled', value: 12, color: '#7C3AED' },
{ name: 'Interviewed', value: 8, color: '#06B6D4' },
{ name: 'Selected', value: 6, color: '#10B981' },
{ name: 'On Hold', value: 4, color: '#F59E0B' },
{ name: 'Rejected', value: 5, color: '#EF4444' }];


// Schedule analytics
export const dailySchedule = [
{ hour: '9 AM', count: 2 },
{ hour: '10 AM', count: 4 },
{ hour: '11 AM', count: 3 },
{ hour: '12 PM', count: 1 },
{ hour: '1 PM', count: 2 },
{ hour: '2 PM', count: 5 },
{ hour: '3 PM', count: 4 },
{ hour: '4 PM', count: 3 },
{ hour: '5 PM', count: 1 }];


export const weeklySchedule = [
{ day: 'Mon', count: 12 },
{ day: 'Tue', count: 18 },
{ day: 'Wed', count: 15 },
{ day: 'Thu', count: 22 },
{ day: 'Fri', count: 19 },
{ day: 'Sat', count: 6 },
{ day: 'Sun', count: 2 }];


export const monthlySchedule = [
{ week: 'Week 1', count: 38 },
{ week: 'Week 2', count: 52 },
{ week: 'Week 3', count: 47 },
{ week: 'Week 4', count: 61 }];