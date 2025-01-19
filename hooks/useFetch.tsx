import { fetchAllDocs, fetchDoc } from '@/api/database';
import { FirebaseCollections } from '@/lib/constants';
import { RecursiveFetcher } from '@/types/utils.types';
import { useEffect, useState } from 'react';

type FetchProps = {
  collection: FirebaseCollections;
  recursivefetchers?: RecursiveFetcher[];
  convertersMap?: Record<string, (data: any) => any>;
  cache?: (data: any) => any;
  cachedData?: any;
  id?: string;
}

export function useFetchAll<T>({ collection, recursivefetchers = undefined, convertersMap = {}, cache = () => { }, cachedData = null }: FetchProps) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDocs<T>(collection, recursivefetchers, convertersMap);
      setData(data);
      cache(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cachedData?.length > 0) {
      setData(cachedData);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [collection]);
  return { data, loading, error, refetch: () => fetchData() };
};

export function useFetch<T>({ collection, id = "", recursivefetchers = undefined, convertersMap = {}, cache = () => { }, cachedData = null }: FetchProps) {
  const [data, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchDoc<T>(collection, id, recursivefetchers, convertersMap);
      setItem(data ?? null);
      cache(data);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cachedData) {
      setItem(cachedData);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [collection, id]);
  return { data, loading, error, refetch: () => fetchData() };
};
