import React from 'react';

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function usePrevious(value) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const EMPTY_THEME = {
  sheet: {},
  sheetItem: {},
};

const IOS_THEME = {
  sheet: {
    padding: '4px 0px',
    borderRadius: 16,
    margin: 16,
    width: 'calc(100vw - 32px)',
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    opacity: 0.95,
    height: 'auto',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
  },
  sheetItem: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    color: '#000',
  },
};

const ANDROID_THEME = {
  sheet: {
    borderRadius: 0,
  },
  sheetItem: {
    borderBottom: 'none',
  },
};

export const themes = {
  ios: { ...EMPTY_THEME, ...IOS_THEME },
  android: { ...EMPTY_THEME, ...ANDROID_THEME },
};
