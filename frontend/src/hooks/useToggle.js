import { useCallback, useState } from 'react';

/** Boolean state with stable toggle() and close() callbacks. */
export function useToggle(initial = false)
{
  const [isOn, setIsOn] = useState(initial);
  const toggle = useCallback(() => setIsOn((value) => !value), []);
  const close = useCallback(() => setIsOn(false), []);
  return [isOn, toggle, close];
}
