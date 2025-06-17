'use client';

import React, { useEffect, useState } from 'react';
import Maket from '@/app/components/sections/maket/Maket';
import { ITimelineEvent } from '../../../components/ui/timelineEvent/type';
import Timeline from '../../../components/ui/timelineEvent/Timeline';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

export default function TimelinePage() {
  const subtitle = useSelector((state: RootState) => state.cards.subtitle);
  const [timelineEvents, setTimelineEvents] = useState<ITimelineEvent[]>([]);
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const items = useSelector((state: RootState) => {
    if (projectId) {
      return state.cards.cachedData?.['projects/' + projectId + '/time_events']?.items;
    }
    return undefined; // Или вернуть какое-то значение по умолчанию, например, пустой массив []
  });
  console.log('items: ', items);
  useEffect(() => {
    if (items) {
      // Преобразование данных в формат, необходимый для компонента Timeline
      const events: ITimelineEvent[] = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        eventDate: item.eventDate,
        color: item.markerColor,
      }));

      // Сортировка событий по eventDate
      events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

      setTimelineEvents(events);
    }
  }, [items]);

  return (
    <Maket typeSidebar="timeline" title="ТАЙМЛАЙН" subtitle={subtitle}>
      {timelineEvents.length > 0 ? (
        <Timeline events={timelineEvents} projectColor="#333333" />
      ) : (
        <p>Нет событий для отображения</p>
      )}
    </Maket>
  );
}
