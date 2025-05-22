'use client';
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../AuthContext';

interface ItemsData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

interface GetDataCardProps {
  apiUrl: string;
}

export default function GetDataCard({ apiUrl }: GetDataCardProps) {
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

        const response = await fetch(apiUrl, {
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
  }, [isAuthenticated, router, apiUrl]);

  return items;
}
