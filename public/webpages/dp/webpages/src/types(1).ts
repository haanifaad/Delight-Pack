export type JobCategory = 'All' | 'Factory Floor' | 'Logistics' | 'Admin' | 'Engineering' | 'Internships';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  description: string;
  requirements: string[];
}
