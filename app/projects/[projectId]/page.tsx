'use client';

import CreatePageMaket from '../../components/sections/create-page-maket/Create-page-maket';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useDispatch } from 'react-redux';

interface IProjectData {
  id: number;
  userId: number;
  info: any;
  createdAt: string;
  updatedAt: string;
  status: string;
  miniature: any;
  markerColor: string;
}

interface IProjectInfo {
  [key: string]: { title: string; value: any; placeholder: string; removable: boolean };
}

export default function ProjectInfo({ params }: any) {
  console.log('1: ', params);
  const { projectId } = useParams<{ projectId: string }>();
  console.log('projectId: ' + projectId);
  const [project, setProject] = useState<IProjectData | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies['jwt'];

        if (!token) {
          console.error('ProjectInfo: Token not found in cookies');
          return;
        }

        const response = await fetch(`http://localhost:3001/auth/projects/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('ProjectInfo: Error fetching project:', response.status, response.statusText);
          return;
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('ProjectInfo: Error fetching project:', error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, dispatch]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const option = [
    { value: 'запланирован', label: 'Запланирован' },
    { value: 'в процессе', label: 'В процессе' },
    { value: 'завершен', label: 'Завершен' },
    { value: 'приостановлен', label: 'Приостановлен' },
  ];

  // Определение желаемого порядка ключей
  const orderedKeys = ['name', 'author', 'annotation', 'genre', 'synopsis', 'fabula', 'setting'];
  // Сортировка объекта info
  const sortProjectInfo = (info: IProjectInfo, keys: string[]): IProjectInfo => {
    const orderedInfo: IProjectInfo = {};
    keys.forEach((key) => {
      if (info && info.hasOwnProperty(key)) {
        orderedInfo[key] = info[key];
      }
    });

    // Ключи, которых нет в orderedKeys
    Object.keys(info).forEach((key) => {
      if (!orderedKeys.includes(key)) {
        orderedInfo[key] = info[key];
      }
    });
    return orderedInfo;
  };

  // Сортировка project.info
  const sortedProjectInfo = project.info ? sortProjectInfo(project.info, orderedKeys) : {};

  const saveProject = () => {
    console.log('Сохранение изменений');
  };

  return (
    <div>
      <CreatePageMaket
        typeSidebar="project"
        title="ДАННЫЕ ПРОЕКТА"
        subtitle={project.info?.name.value}
        masItems={Object.entries(sortedProjectInfo).map(([key, value]) => ({
          key: key,
          title: value.title,
          value: value.value,
          placeholder: value.placeholder,
          removable: value.removable,
        }))}
        markerColor={project.markerColor}
        showCancelButton={false}
        showImageInput={true}
        onSubmit={saveProject}
      >
        <Label text={'Статус'} id="status">
          <Select options={option} defaultValue={project.status} />
        </Label>
        <Label text={'Дата создания'} id="created_date">
          <Input readOnly value={formatDate(project.createdAt)} />
        </Label>
        <Label text={'Дата обновления'} id="updated_date">
          <Input readOnly value={formatDate(project.updatedAt)} />
        </Label>
      </CreatePageMaket>
    </div>
  );
}
