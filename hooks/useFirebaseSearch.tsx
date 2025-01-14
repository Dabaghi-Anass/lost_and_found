import { searchDocs } from '@/api/database';
import { FirebaseCollections } from '@/lib/constants';
import 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useFirebaseSearch<T>(collection: FirebaseCollections, queryString: string, searchFields: string[]) {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await searchDocs<T>(collection, queryString, searchFields);
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
