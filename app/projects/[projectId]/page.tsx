'use client';

import CreatePageMaket from '../../components/sections/create-page-maket/Create-page-maket';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { parseCookies } from 'nookies';

interface ProjectData {
  id: number;
  userId: number;
  info: any;
  createdAt: string;
  updatedAt: string;
  status: string;
  miniature: any;
  markerColor: string;
}
function F1() {
  console.log('Сохранение изменений');
}
export default function ProjectInfo() {
  const { projectId } = useParams();
  console.log('ProjectInfo: projectId:', projectId);
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(`ProjectInfo: Fetching project with ID: ${projectId}`);
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
        console.log('ProjectInfo: Data received:', data);
        setProject(data);
      } catch (error) {
        console.error('ProjectInfo: Error fetching project:', error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);
  if (!project) {
    return <div>Loading...</div>;
  }

  const option = [
    { value: '1', label: 'Запланирован' },
    { value: '2', label: 'В процессе' },
    { value: '3', label: 'Завершен' },
    { value: '4', label: 'Приостановлен' },
  ];
  return (
    <div>
      <CreatePageMaket
        typeSidebar="project"
        title="ДАННЫЕ ПРОЕКТА"
        subtitle={project.info?.Название}
        masItems={Object.entries(project.info).map(([key, value]) => ({
          label: key,
          value: value,
        }))}
        markerColor={project.markerColor}
        showCancelButton={false}
        showImageInput={true}
        onSubmit={F1}
      >
        <Label text={'Статус'} id="status">
          <Select options={option} defaultValue={project.status} />
        </Label>
        <Label text={'Дата создания'} id="created_date">
          <Input readOnly value={project.createdAt} />
        </Label>
        <Label text={'Дата обновления'} id="created_date">
          <Input readOnly value={project.updatedAt} />
        </Label>
      </CreatePageMaket>
    </div>
  );
}
