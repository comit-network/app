import { useEffect, useReducer } from 'react';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.data
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const useFetch = (func, initialData) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });
  const [refreshFlag, refresh] = useReducer(r => r + 1, 0);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await func();

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', data: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [refreshFlag]); // TODO: enable refresh

  return { ...state, refresh };
};

export default useFetch;
