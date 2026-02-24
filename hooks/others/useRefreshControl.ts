import { useCallback, useState } from "react";

const useRefreshControl = (refetchFn: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchFn();
    } finally {
      setRefreshing(false);
    }
  }, [refetchFn]);

  return { refreshing, onRefresh };
};

export default useRefreshControl;
