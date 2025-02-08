export default interface Industry {
  id: string;
  name: string;
  subIndustries: string[];
}

export interface IndustryInsight {
  id?: string;
  industry?: string;
  salaryRange?:{ role: string; min: number; max: number; median: number; location: string }[];
  growthRate?: number;
  demandLevel: string;
  topSkills?: string[];
  marketOutlook?: string;
  keyTrends?: string[];
  recommendedSkills?: string[];
  createdAt?: Date;
  lastUpdated?: Date;
  nextUpdate?: Date;
}
