import { useEffect, useState } from 'react';
import { getState, subscribe } from '../lib/demoStore';

// Subscribes a component to the in-memory demo store so
// it re-renders whenever any data changes (mimics realtime).
export function useDemoState() {
  const [snapshot, setSnapshot] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSnapshot({ ...getState() });
    });
    return unsubscribe;
  }, []);

  return snapshot;
}
