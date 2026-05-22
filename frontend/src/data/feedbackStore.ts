export type FeedbackDecision = 'Selected' | 'Not Selected' | 'Hold';

export interface FeedbackEntry {
  id: string;
  candidateId: string;
  decision: FeedbackDecision;
  comment: string;
  submittedBy: string;
  submittedAt: string;
}

// Module-level in-memory store (resets on reload — fine for prototype)
const store = new Map<string, FeedbackEntry[]>();

const daysAgo = (d: number, h = 0) =>
new Date(Date.now() - 1000 * 60 * 60 * (24 * d + h)).toISOString();

// Seed: 4 interviewed candidates, each with feedback from 4 different panel members
// (HR Lead, Tech Lead, Senior Engineer, Engineering Manager) so admins see a
// meaningful multi-panel view in /admin/candidates.

// Candidate 3 — Frontend Developer (Interviewed)
store.set('candidate-3', [
{
  id: 'fb-c3-1',
  candidateId: 'candidate-3',
  decision: 'Selected',
  comment:
  'Excellent React and TypeScript fundamentals. Walked through component composition and state management trade-offs with clarity. Strong hire from a technical lens.',
  submittedBy: 'Alex Kumar',
  submittedAt: daysAgo(2, 3)
},
{
  id: 'fb-c3-2',
  candidateId: 'candidate-3',
  decision: 'Selected',
  comment:
  'Great communication and team-fit signals. Asked thoughtful questions about our product roadmap and showed genuine interest in long-term growth.',
  submittedBy: 'Sarah Johnson',
  submittedAt: daysAgo(2, 1)
},
{
  id: 'fb-c3-3',
  candidateId: 'candidate-3',
  decision: 'Hold',
  comment:
  'Solid on the basics but I want to see one more round on performance optimization patterns before we commit. Borderline on senior-level depth.',
  submittedBy: 'Emily Rodriguez',
  submittedAt: daysAgo(1, 5)
},
{
  id: 'fb-c3-4',
  candidateId: 'candidate-3',
  decision: 'Selected',
  comment:
  'Aligned with our engineering culture. Demonstrated ownership in past projects and handled ambiguity well during the system design discussion.',
  submittedBy: 'Sneha Iyer',
  submittedAt: daysAgo(1, 1)
}]
);

// Candidate 9 — Full Stack Developer (Interviewed)
store.set('candidate-9', [
{
  id: 'fb-c9-1',
  candidateId: 'candidate-9',
  decision: 'Not Selected',
  comment:
  "Struggled with the backend portion — couldn't articulate database indexing strategies or trade-offs around eventual consistency. Frontend was passable but not at the level we need.",
  submittedBy: 'Tom Wilson',
  submittedAt: daysAgo(3, 4)
},
{
  id: 'fb-c9-2',
  candidateId: 'candidate-9',
  decision: 'Hold',
  comment:
  'Mixed signals. Strong on tooling and DevOps awareness, but coding fundamentals felt rehearsed. Would consider for a more junior role.',
  submittedBy: 'Nina Patel',
  submittedAt: daysAgo(3, 2)
},
{
  id: 'fb-c9-3',
  candidateId: 'candidate-9',
  decision: 'Not Selected',
  comment:
  'Communication was unclear when explaining past project contributions. Hard to gauge actual impact versus team effort.',
  submittedBy: 'Priya Nair',
  submittedAt: daysAgo(2, 6)
},
{
  id: 'fb-c9-4',
  candidateId: 'candidate-9',
  decision: 'Hold',
  comment:
  'Promising potential but not a fit for the current opening. Recommend keeping warm and re-engaging for a future mid-level role.',
  submittedBy: 'Aarav Kapoor',
  submittedAt: daysAgo(2, 2)
}]
);

// Candidate 15 — Data Scientist (Interviewed)
store.set('candidate-15', [
{
  id: 'fb-c15-1',
  candidateId: 'candidate-15',
  decision: 'Selected',
  comment:
  'Exceptional grasp of statistical modeling and feature engineering. Walked through a real production ML pipeline they built end-to-end. Top of the funnel for me.',
  submittedBy: 'Daniel Kim',
  submittedAt: daysAgo(4, 5)
},
{
  id: 'fb-c15-2',
  candidateId: 'candidate-15',
  decision: 'Selected',
  comment:
  'Clear thinker. Explained complex trade-offs (bias-variance, evaluation metrics) without jargon. Would pair well with our existing data team.',
  submittedBy: 'Alex Kumar',
  submittedAt: daysAgo(4, 2)
},
{
  id: 'fb-c15-3',
  candidateId: 'candidate-15',
  decision: 'Selected',
  comment:
  'Strong cultural alignment. Talked openly about a failed model deployment and what they learned — exactly the growth mindset we want.',
  submittedBy: 'Olivia Bennett',
  submittedAt: daysAgo(3, 7)
},
{
  id: 'fb-c15-4',
  candidateId: 'candidate-15',
  decision: 'Hold',
  comment:
  'Technically strong, but answers on stakeholder management were thin. Want to confirm cross-functional collaboration skills in a follow-up.',
  submittedBy: 'Sneha Iyer',
  submittedAt: daysAgo(3, 3)
}]
);

// Candidate 21 — Frontend Developer (Interviewed)
store.set('candidate-21', [
{
  id: 'fb-c21-1',
  candidateId: 'candidate-21',
  decision: 'Hold',
  comment:
  'Decent fundamentals but answers were surface-level. Did well on CSS layout questions but struggled when pushed on React reconciliation internals.',
  submittedBy: 'David Lee',
  submittedAt: daysAgo(5, 6)
},
{
  id: 'fb-c21-2',
  candidateId: 'candidate-21',
  decision: 'Selected',
  comment:
  'Strong eye for UI craftsmanship — shared portfolio pieces with thoughtful interaction design. Would be a great fit for our design-engineering crossover work.',
  submittedBy: 'Jessica Park',
  submittedAt: daysAgo(5, 3)
},
{
  id: 'fb-c21-3',
  candidateId: 'candidate-21',
  decision: 'Hold',
  comment:
  "Communication is great, attitude is positive, but I'm unsure about technical depth for a senior role. Could be a strong mid-level hire.",
  submittedBy: 'Marcus Hall',
  submittedAt: daysAgo(4, 8)
},
{
  id: 'fb-c21-4',
  candidateId: 'candidate-21',
  decision: 'Not Selected',
  comment:
  'Not ready for the scope of this role. Recommend revisiting in 12 months after more production experience with large-scale React apps.',
  submittedBy: 'Anita Reddy',
  submittedAt: daysAgo(4, 4)
}]
);

export function getFeedbackForCandidate(candidateId: string): FeedbackEntry[] {
  return store.get(candidateId) ?? [];
}

export function getFeedbackBySubmitter(
candidateId: string,
submittedBy: string)
: FeedbackEntry | undefined {
  return getFeedbackForCandidate(candidateId).find(
    (f) => f.submittedBy === submittedBy
  );
}

export function submitFeedback(input: {
  candidateId: string;
  decision: FeedbackDecision;
  comment: string;
  submittedBy: string;
}): FeedbackEntry {
  const existing = store.get(input.candidateId) ?? [];
  // Replace an entry from the same submitter if it exists
  const filtered = existing.filter((f) => f.submittedBy !== input.submittedBy);
  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    candidateId: input.candidateId,
    decision: input.decision,
    comment: input.comment,
    submittedBy: input.submittedBy,
    submittedAt: new Date().toISOString()
  };
  store.set(input.candidateId, [...filtered, entry]);
  return entry;
}