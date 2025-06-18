// src/app/projects/[projectId]/timeline/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Maket from '@/app/components/sections/maket/Maket';
import { ITimelineEvent } from '../../../components/ui/timelineEvent/type';
import Timeline from '../../../components/ui/timelineEvent/Timeline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import Label from '@/app/components/ui/label/Label';
import { fetchTimelineFilters } from '@/app/store/thunks/fetchTimelineFilters';
import { AppDispatch } from '@/app/store';
import { useForm, FormProvider } from 'react-hook-form';

interface FilterItem {
  id: string;
  name: string;
  markerColor: string;
  timelineEventIds: string[];
}

interface FiltersData {
  characters: FilterItem[];
  locations: FilterItem[];
  objects: FilterItem[];
  chapters: FilterItem[];
}

export default function TimelinePage() {
  const { register, watch } = useForm(); // Получаем control
  const subtitle = useSelector((state: RootState) => state.cards.subtitle);
  const [timelineEvents, setTimelineEvents] = useState<ITimelineEvent[]>([]);
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const items = useSelector((state: RootState) => {
    if (projectId) {
      return state.cards.cachedData?.['projects/' + projectId + '/time_events']?.items;
    }
    return undefined;
  });
  const filters = useSelector((state: RootState) => state.filters.filters);
  const dispatch: AppDispatch = useDispatch();

  // Получаем значения полей формы с помощью watch
  const selectedCharacterId = watch('filter');
  const selectedLocationId = watch('filter');
  const selectedObjectId = watch('filter');
  const selectedChapterId = watch('filter');

  const projectMarkerColor = useSelector((state: RootState) => {
    const project = state.cards.cachedData?.projects?.items?.find((item: any) => item.id === Number(projectId));
    return project ? project.markColor : '#4682B4';
  });

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTimelineFilters(projectId));
    }
  }, [projectId, dispatch]);

  const filterEvents = useCallback(
    (
      events: any[],
      filters: FiltersData | null,
      selectedCharacterId: string | undefined,
      selectedLocationId: string | undefined,
      selectedObjectId: string | undefined,
      selectedChapterId: string | undefined
    ): ITimelineEvent[] => {
      console.log('events in filterEvents:', events);
      if (!filters) {
        return events.map((item: any) => ({
          id: item.id,
          name: item.info.name.value,
          eventDate: item.eventDate,
          color: item.markerColor,
        }));
      }

      let filteredEvents = [...events];

      if (selectedCharacterId === 'project') {
        return events.map((item: any) => ({
          id: item.id,
          name: item.info.name.value,
          eventDate: item.eventDate,
          color: item.markerColor,
        }));
      }

      if (selectedCharacterId) {
        const selectedCharacterIdNumber = Number(selectedCharacterId); // Преобразуем в число
        console.log('selectedCharacterId 2: ', selectedCharacterId);
        filteredEvents = filteredEvents.filter((event: any) => {
          const character = filters.characters.find((char) => {
            console.log('char.id:', char.id, 'selectedCharacterIdNumber:', selectedCharacterIdNumber); //  Добавили логи
            return Number(char.id) === selectedCharacterIdNumber;
          });
          console.log('character:', character); //  Добавили логи
          if (!character) return false;
          console.log('character.timelineEventIds 2: ', character.timelineEventIds);
          console.log('event.id:', event.id);
          return character.timelineEventIds.some((eventId) => eventId === event.id);
        });
      }

      if (selectedLocationId) {
        filteredEvents = filteredEvents.filter((event: any) =>
          filters.locations
            .filter((location) => selectedLocationId === location.id)
            .some((location) => location.timelineEventIds.includes(event.id))
        );
      }

      if (selectedObjectId) {
        filteredEvents = filteredEvents.filter((event: any) =>
          filters.objects
            .filter((object) => selectedObjectId === object.id)
            .some((object) => object.timelineEventIds.includes(event.id))
        );
      }

      if (selectedChapterId) {
        filteredEvents = filteredEvents.filter((event: any) =>
          filters.chapters
            .filter((chapter) => selectedChapterId === chapter.id)
            .some((chapter) => chapter.timelineEventIds.includes(event.id))
        );
      }

      console.log('filteredEvents: ', filteredEvents);
      return filteredEvents.map((item: any) => ({
        id: item.id,
        name: item.info.name.value,
        eventDate: item.eventDate,
        color: item.markerColor,
      }));
    },
    []
  );

  useEffect(() => {
    console.log('selectedCharacterId 3:', selectedCharacterId);
    console.log('selectedLocationId 3:', selectedLocationId);
    console.log('selectedObjectId 3:', selectedObjectId);
    console.log('selectedChapterId 3:', selectedChapterId);
    if (items && filters) {
      const filteredTimelineEvents = filterEvents(
        items,
        filters,
        selectedCharacterId,
        selectedLocationId,
        selectedObjectId,
        selectedChapterId
      );
      const sortedEvents = [...filteredTimelineEvents].sort((a, b) => {
        const dateA = parseDate(a.eventDate);
        const dateB = parseDate(b.eventDate);
        return dateB.getTime() - dateA.getTime();
      });
      setTimelineEvents(sortedEvents);
      console.log('timelineEvents after filtering:', sortedEvents); //  Здесь выводим в консоль
    }
  }, [items, filters, selectedCharacterId, selectedLocationId, selectedObjectId, selectedChapterId, filterEvents]);

  function parseDate(dateString: string): Date {
    const parts = dateString.split(', ')[0].split('.');
    const timeParts = dateString.split(', ')[1].split(':');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes);
  }

  const timelineColor = () => {
    if (selectedCharacterId === 'project') {
      return projectMarkerColor || '#000000';
    }
    if (selectedCharacterId) {
      const character = filters?.characters.find((character) => character.id === selectedCharacterId);
      return character?.markerColor || projectMarkerColor || '#000000';
    }
    if (selectedLocationId) {
      const location = filters?.locations.find((location) => location.id === selectedLocationId);
      return location?.markerColor || projectMarkerColor || '#000000';
    }
    if (selectedObjectId) {
      const object = filters?.objects.find((object) => object.id === selectedObjectId);
      return object?.markerColor || projectMarkerColor || '#000000';
    }
    if (selectedChapterId) {
      const chapter = filters?.chapters.find((chapter) => chapter.id === selectedChapterId);
      return chapter?.markerColor || projectMarkerColor || '#000000';
    }
    return projectMarkerColor || '#000000';
  };

  return (
    <Maket typeSidebar="timeline" title="ТАЙМЛАЙН" subtitle={subtitle}>
      <FormProvider {...useForm()}>
        <div>
          <Label text={'Проект'}>
            <label>
              <input
                type="radio"
                value="project"
                {...register('filter')} // Use the same name for all radio buttons
              />
              Весь проект
            </label>
          </Label>
          {filters && (
            <>
              {filters.characters && filters.characters.length > 0 && (
                <Label text={'Персонажи'}>
                  {filters.characters.map((character) => (
                    <label key={character.id}>
                      <input
                        type="radio"
                        value={String(character.id)}
                        {...register('filter')} // Use the same name for all radio buttons
                      />
                      {character.name}
                    </label>
                  ))}
                </Label>
              )}

              {filters.locations && filters.locations.length > 0 && (
                <Label text={'Локации'}>
                  {filters.locations.map((location) => (
                    <label key={location.id}>
                      <input
                        type="radio"
                        value={String(location.id)}
                        {...register('filter')} // Use the same name for all radio buttons
                      />
                      {location.name}
                    </label>
                  ))}
                </Label>
              )}

              {filters.objects && filters.objects.length > 0 && (
                <Label text={'Объекты'}>
                  {filters.objects.map((object) => (
                    <label key={object.id}>
                      <input
                        type="radio"
                        value={String(object.id)}
                        {...register('filter')} // Use the same name for all radio buttons
                      />
                      {object.name}
                    </label>
                  ))}
                </Label>
              )}

              {filters.chapters && filters.chapters.length > 0 && (
                <Label text={'Главы'}>
                  {filters.chapters.map((chapter) => (
                    <label key={chapter.id}>
                      <input
                        type="radio"
                        value={String(chapter.id)}
                        {...register('filter')} // Use the same name for all radio buttons
                      />
                      {chapter.name}
                    </label>
                  ))}
                </Label>
              )}
            </>
          )}
        </div>
      </FormProvider>
      {timelineEvents.length > 0 ? (
        <Timeline events={timelineEvents} projectColor={timelineColor()} />
      ) : (
        <p>Нет событий для отображения</p>
      )}
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
