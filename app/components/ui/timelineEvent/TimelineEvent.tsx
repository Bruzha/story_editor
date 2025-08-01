// src/app/timeline/TimelineEvent.tsx

import React from 'react';
import { ITimelineEvent } from './type';
import './timelineEvent.scss';
import { useRouter } from 'next/navigation';

interface TimelineEventProps {
  event: ITimelineEvent;
  position: number;
  projectColor: string;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, position, projectColor }) => {
  const router = useRouter();
  const pushPage = (id: string) => {
    router.push(`/timelines/${id}`);
  };
  if (!projectColor) {
    projectColor = '#4682B4';
  }
  return (
    <div
      className="timeline-event"
      onClick={() => pushPage(String(event.id))} // Передаем анонимную функцию
      style={{ top: `${position * 100}%` }}
    >
      <div className="timeline-event__date">{event.eventDate}</div>
      <div
        className="timeline-event__circle"
        style={{ backgroundColor: event.color, border: `4px solid ${projectColor}` }}
      />
      <div className="timeline-event__name">{event.name}</div>
    </div>
  );
};

export default TimelineEvent;
