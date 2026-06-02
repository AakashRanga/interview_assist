export interface JobRole {
  id: string;
  title: string;
  location: string;
  experience: string;
  totalVacancy: number;
  jobType: 'Online' | 'Offline';
  description?: string;
  venue?: string;
  createdAt: string;
}

export const seedJobRoles: JobRole[] = [
{
  id: 'r-1',
  title: 'Senior Frontend Engineer',
  location: 'Bangalore, India',
  experience: '5-8 years',
  totalVacancy: 4,
  jobType: 'Online',
  description:
  'Build delightful user experiences with React, TypeScript, and modern frontend tooling.',
  createdAt: '2026-05-10'
},
{
  id: 'r-2',
  title: 'Product Designer',
  location: 'Hyderabad, India',
  experience: '3-5 years',
  totalVacancy: 2,
  jobType: 'Offline',
  venue: 'Tech Park Campus, Floor 3, Room 12',
  description:
  'Design beautiful, intuitive product flows and contribute to our design system.',
  createdAt: '2026-05-08'
},
{
  id: 'r-3',
  title: 'HR Business Partner',
  location: 'Pune, India',
  experience: '6-10 years',
  totalVacancy: 1,
  jobType: 'Offline',
  venue: 'Corporate HQ, Conference Room A',
  description:
  'Partner with engineering leadership to drive people strategy and talent growth.',
  createdAt: '2026-05-02'
}];