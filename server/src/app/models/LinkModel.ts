export interface LinkModel {
  id: string;
  originalLink: string;
  shortLink: string;
  createdAt: Date;
}

export interface LinkWithVisitModel extends LinkModel {
  totalVisits: number;
}
