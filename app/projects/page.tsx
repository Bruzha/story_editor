'use client';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';

interface ProjectData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies['jwt'];

        if (!token) {
          router.push('/auth/autorisation');
          return;
        }

        const response = await fetch('http://localhost:3001/auth/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Projects: Error fetching projects: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Projects: Error fetching projects:', error);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router]);

  return (
    <CardsPageMaket
      typeSidebar="profile"
      typeCard="project"
      title="ПРОЕКТЫ"
      subtitle="Ruzhastik"
      masItems={projects}
      createPageUrl="/projects/create"
    />
  );
}
