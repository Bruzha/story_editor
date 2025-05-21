'use client';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';

interface IdeaData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<IdeaData[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies['jwt'];

        if (!token) {
          router.push('/auth/autorisation');
          return;
        }

        const response = await fetch('http://localhost:3001/auth/ideas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ideas: Error fetching ideas: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Ideas: Error fetching ideas:', error);
      }
    };

    if (isAuthenticated) {
      fetchIdeas();
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router]);

  return <CardsPageMaket typeSidebar="profile" title="ИДЕИ" subtitle="Ruzhastik" masItems={ideas} />;
}
