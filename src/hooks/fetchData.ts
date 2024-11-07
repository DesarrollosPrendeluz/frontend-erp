import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

interface UseFetchDataProps<T> {
  url: string;
  page: number;
  limit?: number;
  initialData?: T[];
  params?: Record<string, any>; 
}

interface UseFetchDataResult<T> {
  data: T[];
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
}

const useFetchData = <T>({
  url,
  page,
  limit = 5,
  initialData = [],
  params = {}
}: UseFetchDataProps<T>): UseFetchDataResult<T> => {
  const [data, setData] = useState<T[]>(initialData);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token =     Cookies.get("erp_token");
      setIsLoading(true);
      try {
        params.page = page
        params.page_size = limit

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        });
        setData(response.data.Results.data);
        setTotalPages(Math.ceil(response.data.Results.recount / limit));
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, page, limit, params]);

  return { data, totalPages, isLoading, error };
};

export default useFetchData;
