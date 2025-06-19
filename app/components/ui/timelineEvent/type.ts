export interface ITimelineProps {
  events: ITimelineEvent[];
  projectColor: string;
}

export interface ITimelineEvent {
  id: number;
  name: string;
  eventDate: string;
  color: string;
  info: any;
  miniature: any;
  src: string | null;
  createdAt: string;
  updatedAt: string;
}
