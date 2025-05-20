'use client';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext'; //  Import useAuth

interface ProjectData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const router = useRouter(); //  Import useRouter
  const { isAuthenticated } = useAuth(); //  Use useAuth to check auth

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Projects: fetchProjects - fetching projects...');
        const cookies = parseCookies();
        const token = cookies['jwt'];
        console.log('Projects: fetchProjects - token from cookie:', token);

        if (!token) {
          console.error('Projects: Token not found in cookies');
          //  If not authenticated redirect
          router.push('/auth/autorisation');
          return;
        }

        const response = await fetch('http://localhost:3001/auth/projects', {
          //  Использовать абсолютный URL
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Projects: Error fetching projects:', response.status, response.statusText);
          throw new Error(`Projects: Error fetching projects: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Projects: fetchProjects - data received:', data);
        setProjects(data);
      } catch (error) {
        console.error('Projects: Error fetching projects:', error);
        // Handle the error
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    } else {
      //  If not authenticated redirect
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router]); // Add dependencies

  return (
    <CardsPageMaket
      typeSidebar="profile"
      title="ПРОЕКТЫ"
      subtitle="Ruzhastik"
      masItems={projects} //  Use the projects state here
      createPageUrl="/projects/create"
    />
  );
}
