import { DemandLevel, MarketOutlook } from "@prisma/client";

export default interface Industry {
  id: string;
  name: string;
  subIndustries: string[];
}

export interface IndustryInsight {
  // id?: string;
  industry: string;
  salaryRange:Range[];
  growthRate: number;
  demandLevel: string;
  topSkills: string[];
  marketOutlook: string;
  keyTrends: string[];
  recommendedSkills: string[];
  createdAt?: Date;
  lastUpdated: Date;
  nextUpdate: Date;
}

export interface Insight {
  // id?: string;
  salaryRange:Range[];
  growthRate: number;
  demandLevel: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutlook;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: Date;
}

export interface Range{
  role: string; min: number; max: number; median: number; location: string 
}
