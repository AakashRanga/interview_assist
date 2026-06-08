import { API_BASE_URL } from '../config';

export interface CandidateResponse {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  status: string;
  skills?: string;
  resume_path?: string;
  linkedin?: string;
  github?: string;
  created_at: string;
}

export interface ApplicationResponse {
  id: number;
  role_id: number;
  role_title?: string;
  status: string;
  created_at: string;
}

export interface InterviewScheduleResponse {
  id: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  interview_status?: string;
  meet_link?: string;
}

export interface CandidateDetailResponse {
  candidate: CandidateResponse;
  applications: ApplicationResponse[];
  interview_schedules: InterviewScheduleResponse[];
}

export interface CandidateListResponse {
  candidates: CandidateDetailResponse[];
  total: number;
}

export const fetchCandidates = async (
  statusFilter?: string,
  search?: string
): Promise<CandidateListResponse> => {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') {
    params.append('status_filter', statusFilter);
  }
  if (search) {
    params.append('search', search);
  }

  const response = await fetch(
    `${API_BASE_URL}/admin/candidates?${params.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch candidates');
  }

  return response.json();
};