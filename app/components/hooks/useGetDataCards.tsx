import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../AuthContext';
import { parseCookies } from 'nookies';

interface ItemsData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export function useGetDataCards(apiUrl: string) {
  const [projects, setProjects] = useState<ItemsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  console.log(1);
  useEffect(() => {
    let isMounted = true;
    console.log(2);
    const fetchProjects = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies['jwt'];
        console.log(3);
        if (!token) {
          console.log(4);
          router.push('/auth/autorisation');
          return;
        }
        console.log(5);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(6);

        if (!response.ok) {
          console.log(7);
          throw new Error(`Projects: Error fetching projects: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(8);
        if (isMounted) {
          console.log(9);
          // Check if the component is still mounted before updating state
          setProjects(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Projects: Error fetching projects:', err);
        if (isMounted) {
          console.log(10);
          setError(err as Error);
          setProjects([]);
        }
      } finally {
        console.log(11);
        if (isMounted) {
          console.log(12);
          setIsLoading(false);
        }
      }
    };

    if (isAuthenticated && router.isReady) {
      // Check router.isReady !
      fetchProjects();
    } else if (!isAuthenticated) {
      router.push('/auth/autorisation');
    }
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, router.isReady, apiUrl]);

  return { projects, isLoading, error };
}
