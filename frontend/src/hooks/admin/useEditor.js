import { useCallback, useEffect, useReducer } from 'react';

const INITIAL = Object.freeze({ value: null, status: 'loading', error: null });

// State machine of a CMS form: loading → idle ⇄ dirty → saving → saved | error.
const TRANSITIONS = {
  loaded: (_state, { value }) => ({ value, status: 'idle', error: null }),
  changed: (state, { value }) => ({ ...state, value, status: 'dirty', error: null }),
  saving: (state) => ({ ...state, status: 'saving', error: null }),
  saved: (state, { value }) => ({ value: value ?? state.value, status: 'saved', error: null }),
  failed: (state, { error }) => ({ ...state, status: 'error', error }),
};

function reducer(state, action)
{
  return TRANSITIONS[action.type](state, action);
}

async function runSave(save, value, dispatch)
{
  dispatch({ type: 'saving' });
  try {
    dispatch({ type: 'saved', value: await save(value) });
  } catch (error) {
    dispatch({ type: 'failed', error });
  }
}

/** Loads a value with `load()`, tracks edits, and saves it with `save(value)` (both stable callbacks). */
export function useEditor(load, save)
{
  const [state, dispatch] = useReducer(reducer, INITIAL);
  useEffect(() => {
    load().then((value) => dispatch({ type: 'loaded', value }), (error) => dispatch({ type: 'failed', error }));
  }, [load]);
  const change = useCallback((value) => dispatch({ type: 'changed', value }), []);
  const submit = useCallback(() => runSave(save, state.value, dispatch), [save, state.value]);
  return { ...state, change, submit };
}
