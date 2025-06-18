// src/app/timeline/TimelineEvent.tsx

import React from 'react';
import { ITimelineEvent } from './type';
import './timelineEvent.scss';
import { useRouter } from 'next/navigation';

interface TimelineEventProps {
  event: ITimelineEvent;
  position: number;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, position }) => {
  const router = useRouter();
  const pushPage = (id: string) => {
    router.push(`/timelines/${id}`);
  };

  return (
    <div
      className="timeline-event"
      onClick={() => pushPage(event.id)} // Передаем анонимную функцию
      style={{ top: `${position * 100}%` }}
    >
      <div className="timeline-event__date">{event.eventDate}</div>
      <div className="timeline-event__circle" style={{ backgroundColor: event.color }} />
      <div className="timeline-event__name">{event.name}</div>
    </div>
  );
};

export default TimelineEvent;
