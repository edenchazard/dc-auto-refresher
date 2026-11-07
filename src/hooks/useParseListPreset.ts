import { useEffect } from 'react';
import { getListFromString } from '../utils/functions';
import type { Dragon } from '../app/types';
import { useRouter } from 'next/navigation';

export default function useParseListPreset(
  setListOfDragons: (list: Dragon[]) => void,
  replaceHistory = true,
) {
  const router = useRouter();
  
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const list = query.get('list');

    // No list.
    if (typeof list !== 'string') return;

    // Parse the list and put it into our actual list
    const presetDragonList = getListFromString(list);

    if (presetDragonList !== null) {
      setListOfDragons(presetDragonList);
    }

    // Remove list from URL
    if (replaceHistory){
      router.replace('/');
    }
  }, [setListOfDragons, replaceHistory]);
}
