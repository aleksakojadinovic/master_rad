import { useMemo } from 'react';
import { wrapper } from './store';

function useHydrateStore(props) {
  const hydrationProps = useMemo(() => {
    const resolvedProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => key !== 'reduxWrapperActionsGIAP',
      ),
    );
    return resolvedProps;
  }, [props]);

  return wrapper.useHydration(hydrationProps);
}

export default useHydrateStore;
