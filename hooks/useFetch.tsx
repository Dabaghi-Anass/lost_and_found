import { fetchAllDocs, fetchDoc } from '@/api/database';
import { FirebaseCollections } from '@/lib/constants';
import { RecursiveFetcher } from '@/types/utils.types';
import { useEffect, useState } from 'react';

export function useFetchAll<T>(collection: FirebaseCollections) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await fetchAllDocs<T>(collection);
      setData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [collection]);
  return { data, loading, error, refetch: () => fetchData() };
};
export function useFetch<T>(collection: FirebaseCollections, id: string, recursivefetchers: RecursiveFetcher[] | undefined = undefined, convertersMap: Record<string, (data: any) => any> = {}) {
  const [data, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchDoc<T>(collection, id, recursivefetchers, convertersMap);
      setItem(data ?? null);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [collection, id]);
  return { data, loading, error, refetch: () => fetchData() };
};
