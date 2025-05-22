'use client';
import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';
import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../AuthContext';

interface ItemsData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export default function Characters() {
  const [items, setItems] = useState<ItemsData[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
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
        setItems(data);
      } catch (error) {
        console.error('Projects: Error fetching projects:', error);
      }
    };

    if (isAuthenticated) {
      fetchItems();
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router]);

  return (
    <CardsPageMaket
      typeSidebar="project"
      title="ПЕРСОНАЖИ"
      subtitle="Проект 1"
      masItems={items}
      createPageUrl="/projects/project/characters/create/base"
      typeCard={'character'}
    />
  );
}
