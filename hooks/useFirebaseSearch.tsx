import { fetchAllDocs, searchDocs } from '@/api/database';
import { FirebaseCollections } from '@/lib/constants';
import { RecursiveFetcher } from '@/types/utils.types';
import 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useFirebaseSearch<T>(collection: FirebaseCollections, queryString: string, searchFields: string[], recursivefetchers: RecursiveFetcher[] | undefined = undefined, convertersMap: Record<string, (data: any) => any> = {}) {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      let data;
      if (queryString === "") {
        data = await fetchAllDocs<T>(collection, recursivefetchers, convertersMap);
      } else {
        data = await searchDocs<T>(collection, queryString, searchFields);
      }
      setResults(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [collection, queryString]);

  return { data: results, loading, error, refetch: fetchData };
};
