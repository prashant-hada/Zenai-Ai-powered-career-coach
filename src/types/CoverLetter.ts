export interface CoverLetterData{
  content: string;
  jobDescription: string|null;
  companyName: string;
  jobTitle: string;
}
export interface CoverLetter extends CoverLetterData{
  userId: string;
  // content: string;
  // jobDescription: string;
  // companyName: string;
  // jobTitle: string;
  createdAt: Date;
  updatedAt: Date;
}
