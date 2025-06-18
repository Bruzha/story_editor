// src/app/timeline/Timeline.tsx

import React from 'react';
import TimelineEvent from './TimelineEvent';
import { ITimelineProps } from './type';
import { parseDate } from '@/app/projects/[projectId]/timeline/page';
import './timeline.scss';

const Timeline: React.FC<ITimelineProps> = ({ events, projectColor }) => {
  // Определяем самую раннюю и самую позднюю даты
  const earliestDate = parseDate(events[0].eventDate);
  const latestDate = parseDate(events[events.length - 1].eventDate);
  const earliestTime = new Date(earliestDate).getTime();
  const latestTime = new Date(latestDate).getTime();

  return (
    <div className="timeline">
      <div className="timeline__line" style={{ backgroundColor: projectColor }} />
      {events.map((event) => {
        const eventTime = new Date(parseDate(event.eventDate)).getTime();
        const position = (eventTime - earliestTime) / (latestTime - earliestTime);

        return <TimelineEvent key={event.id} event={event} position={position} />;
      })}
    </div>
  );
};

export default Timeline;
