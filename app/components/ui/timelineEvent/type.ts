export interface ITimelineEvent {
  id: string;
  name: string;
  eventDate: string;
  color: string; // Или другой способ задания цвета, например, hex-код
}

export interface ITimelineProps {
  events: ITimelineEvent[];
  projectColor: string; // Цвет линии времени (цвет проекта)
}
