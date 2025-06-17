// src/app/timeline/TimelineEvent.tsx

import React from 'react';
import { ITimelineEvent } from './type';

interface TimelineEventProps {
  event: ITimelineEvent;
}
const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
  return (
    <div className="timeline-event">
      <div className="timeline-event__circle" style={{ backgroundColor: event.color }} />
      <div className="timeline-event__name">{event.name}</div>
      {/* Дополнительная информация о событии */}
    </div>
  );
};

export default TimelineEvent;
