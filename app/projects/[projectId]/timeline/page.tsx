// src/app/projects/[projectId]/timeline/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Maket from '@/app/components/sections/maket/Maket';
import Timeline from '../../../components/ui/timelineEvent/Timeline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import Label from '@/app/components/ui/label/Label';
import { fetchTimelineFilters } from '@/app/store/thunks/fetchTimelineFilters';
import { AppDispatch } from '@/app/store';
import { useForm, FormProvider } from 'react-hook-form';
import { FiltersData, TimelineEvent as TimelineEventType } from '@/app/store/reducers/filtersReducer';
import Radio from '@/app/components/ui/radio/Radio';
import MyLink from '@/app/components/ui/link/Link';
import './style.scss';

interface ITimelineEventAdapted {
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

export default function TimelinePage() {
  const { register, watch, control } = useForm({
    defaultValues: {
      filter: 'project', //  Устанавливаем значение по умолчанию для поля filter
    },
  });
  const subtitle = useSelector((state: RootState) => state.cards.subtitle);
  const [timelineEvents, setTimelineEvents] = useState<ITimelineEventAdapted[]>([]);
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const filters = useSelector((state: RootState) => state.filters.filters);
  const dispatch: AppDispatch = useDispatch();

  // Получаем значения полей формы с помощью watch
  const selectedFilter = watch('filter');

  let projectMarkerColor = useSelector((state: RootState) => {
    const project = state.cards.cachedData?.projects?.items?.find((item: any) => item.id === Number(projectId));
    return project ? project.markerColor : '#4682B4';
  });
  const items = useSelector((state: RootState) => {
    if (projectId) {
      return state.cards.cachedData?.['projects/' + projectId + '/time_events']?.items;
    }
    return undefined;
  });

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTimelineFilters(projectId));
    }
  }, [projectId, dispatch]);

  const getTimelineEvents = useCallback(
    (filters: FiltersData | null, selectedFilter: string | undefined): ITimelineEventAdapted[] => {
      if (!filters) {
        return [];
      }

      let timelineEvents: TimelineEventType[] = [];

      if (selectedFilter === 'project' && items) {
        return items.map((item: any) => ({
          id: item.id,
          name: item.info.name.value,
          eventDate: item.eventDate,
          color: item.markerColor,
          info: item.info,
          miniature: item.miniature,
          src: item.src,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
      } else {
        const character = filters.characters.find((char) => char.id === selectedFilter);
        if (character) {
          timelineEvents = character.timelineEvents;
        } else {
          const location = filters.locations.find((loc) => loc.id === selectedFilter);
          if (location) {
            timelineEvents = location.timelineEvents;
          } else {
            const object = filters.objects.find((obj) => obj.id === selectedFilter);
            if (object) {
              timelineEvents = object.timelineEvents;
            } else {
              const chapter = filters.chapters.find((chap) => chap.id === selectedFilter);
              if (chapter) {
                timelineEvents = chapter.timelineEvents;
              }
            }
          }
        }
      }

      // Удаляем дубликаты событий
      const uniqueEvents = Array.from(new Map(timelineEvents.map((item) => [item.id, item])).values());

      return uniqueEvents.map((item: any) => ({
        id: item.id,
        name: item.info.name.value,
        eventDate: item.eventDate,
        color: item.markerColor,
        info: item.info,
        miniature: item.miniature,
        src: item.src,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    },
    []
  );
  useEffect(() => {
    if (filters) {
      const timelineEventsData = getTimelineEvents(filters, selectedFilter);
      const sortedEvents = [...timelineEventsData].sort((a, b) => {
        const dateA = parseDate(a.eventDate);
        const dateB = parseDate(b.eventDate);
        return dateB.getTime() - dateA.getTime();
      });
      setTimelineEvents(sortedEvents);
      console.log('timelineEvents after filtering:', sortedEvents);
    }
  }, [filters, selectedFilter, getTimelineEvents]);

  const timelineColor = () => {
    let filterItem;
    if (selectedFilter === 'project') {
      return projectMarkerColor || '#4682B4';
    }
    if (filters) {
      filterItem =
        filters.characters.find((character) => character.id === selectedFilter) ||
        filters.locations.find((location) => location.id === selectedFilter) ||
        filters.objects.find((object) => object.id === selectedFilter) ||
        filters.chapters.find((chapter) => chapter.id === selectedFilter);
      return (projectMarkerColor = filterItem?.markerColor);
    }

    return projectMarkerColor || '#4682B4';
  };

  return (
    <Maket typeSidebar="timeline" title="ТАЙМЛАЙН" subtitle={subtitle}>
      <FormProvider {...{ register, control }}>
        <div className="line__radio-block">
          {projectId && (
            <Label text={'Проект'}>
              <Radio value="project" label="Весь проект" />
            </Label>
          )}
          {filters && (
            <>
              {filters.characters && filters.characters.length > 0 && (
                <Label text={'Персонажи'}>
                  {filters.characters.map((character) => (
                    <Radio key={character.id} value={String(character.id)} label={character.name} />
                  ))}
                </Label>
              )}

              {filters.locations && filters.locations.length > 0 && (
                <Label text={'Локации'}>
                  {filters.locations.map((location) => (
                    <Radio key={location.id} value={String(location.id)} label={location.name} />
                  ))}
                </Label>
              )}

              {filters.objects && filters.objects.length > 0 && (
                <Label text={'Объекты'}>
                  {filters.objects.map((object) => (
                    <Radio key={object.id} value={String(object.id)} label={object.name} />
                  ))}
                </Label>
              )}

              {filters.chapters && filters.chapters.length > 0 && (
                <Label text={'Главы'}>
                  {filters.chapters.map((chapter) => (
                    <Radio key={chapter.id} value={String(chapter.id)} label={chapter.name} />
                  ))}
                </Label>
              )}
            </>
          )}
        </div>
      </FormProvider>
      <div className="line__line">
        {timelineEvents.length > 0 ? (
          <Timeline events={timelineEvents} projectColor={timelineColor()} />
        ) : (
          <div className="line__message">
            <p>У этого элемента нет событий для отображения</p>
            <MyLink href={'/time_events/create'} name={'Создать событие?'} className="black-link-form" />
          </div>
        )}
      </div>
    </Maket>
  );
}

export function parseDate(dateString: string): Date {
  const parts = dateString.split(', ')[0].split('.');
  const timeParts = dateString.split(', ')[1].split(':');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  return new Date(year, month, day, hours, minutes);
}
