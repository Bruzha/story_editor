// src/app/timeline/Timeline.tsx

import React from 'react';
import TimelineEvent from './TimelineEvent';
import { ITimelineProps } from './type';

const Timeline: React.FC<ITimelineProps> = ({ events, projectColor }) => {
  return (
    <div className="timeline">
      <div className="timeline__line" style={{ backgroundColor: projectColor }} />
      {events.map((event) => (
        <TimelineEvent key={event.id} event={event} />
      ))}
    </div>
  );
};

export default Timeline;
