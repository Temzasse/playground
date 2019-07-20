import React from 'react';
import ReactDOM from 'react-dom';
import { useGesture } from 'react-use-gesture';
import { useSpring, animated } from 'react-spring';
import styled, { css, createGlobalStyle } from 'styled-components';

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

import { clamp, usePrevious, EMPTY_THEME } from './utils';

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function useBottomSheetDispatch() {
  const dispatch = React.useContext(DispatchContext);

  if (dispatch === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }

  return dispatch;
}

function useBottomSheetState() {
  const state = React.useContext(StateContext);

  if (state === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }

  return state;
}

function bottomSheetReducer(state, action) {
  switch (action.type) {
    case 'open': {
      return {
        ...state,
        isOpen: true,
        sheetItems: action.payload || [],
      };
    }
    case 'close': {
      return {
        ...state,
        isOpen: false,
        sheetItems: [],
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  isOpen: false,
  sheetItems: [],
};

export function BottomSheetProvider({
  children,
  blurTarget,
  theme = EMPTY_THEME,
}) {
  const [state, dispatch] = React.useReducer(bottomSheetReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
        <BottomSheetPortal blurTarget={blurTarget} theme={theme} />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useBottomSheet() {
  const dispatch = useBottomSheetDispatch();

  return React.useMemo(
    () => ({
      openBottomSheet: items => dispatch({ type: 'open', payload: items }),
      closeBottomSheet: () => dispatch({ type: 'close' }),
    }),
    [dispatch]
  );
}

const SCREEN_HEIGHT = window.innerHeight;
const SHEET_ITEM_HEIGHT = 60;
const SHEET_BOTTOM_PAD = 150;

const BottomSheetPortal = props => {
  const portalRef = React.useRef(null);

  React.useEffect(() => {
    let el = document.getElementById('#bottom-sheet-portal');

    if (!el) {
      el = document.createElement('div');
      el.id = 'bottom-sheet-portal';
      document.body.appendChild(el);
    }

    portalRef.current = el;
  }, []);

  if (!portalRef.current) return null;

  const bottomSheet = <BottomSheet {...props} />;

  return ReactDOM.createPortal(bottomSheet, portalRef.current);
};

const BottomSheet = ({ blurTarget, theme }) => {
  const { isOpen, sheetItems } = useBottomSheetState();
  const prevOpen = usePrevious(isOpen);
  const dispatch = useBottomSheetDispatch();
  const sheetRef = React.useRef();

  const sheetHeight = Math.max(
    sheetItems.length * SHEET_ITEM_HEIGHT + SHEET_BOTTOM_PAD,
    window.innerHeight / 2
  );

  const [{ x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 210, friction: 25 },
  }));

  const closeSheet = React.useCallback(() => {
    set({ y: 0 });
    dispatch({ type: 'close' });
    enableBodyScroll(sheetRef.current);
  }, [dispatch, set]);

  const openSheet = React.useCallback(() => {
    set({ y: -sheetHeight });
    disableBodyScroll(sheetRef.current);
  }, [set, sheetHeight]);

  const bindGesture = useGesture({
    onDrag: ({ delta, temp = [x.getValue(), y.getValue()] }) => {
      set({
        y: clamp(temp[1] + delta[1], -sheetHeight - 50, SCREEN_HEIGHT),
      });
      return temp;
    },
    onDragEnd: ({ delta }) => {
      if (delta[1] < sheetHeight / 3) {
        openSheet();
      } else {
        closeSheet();
      }
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      openSheet();
    } else if (prevOpen && !isOpen) {
      closeSheet();
    }
  }, [closeSheet, isOpen, openSheet, prevOpen]);

  React.useEffect(() => {
    return () => clearAllBodyScrollLocks();
  }, []);

  return (
    <React.Fragment>
      <Wrapper isOpen={isOpen}>
        <Backdrop isOpen={isOpen} onClick={closeSheet} />

        <Sheet
          {...bindGesture()}
          style={{
            ...theme.sheet,
            transform: y.interpolate(y => `translateY(${y}px)`),
          }}
          ref={sheetRef}
        >
          {sheetItems.map(item => (
            <SheetItem
              key={item.label}
              onClick={item.onClick}
              style={theme.sheetItem}
            >
              {item.label}
            </SheetItem>
          ))}
        </Sheet>
      </Wrapper>

      {blurTarget && (
        <BlurHandler shouldBlur={isOpen} blurTarget={blurTarget} />
      )}
    </React.Fragment>
  );
};

const BlurHandler = createGlobalStyle`
  ${props =>
    props.blurTarget &&
    css`
      ${props.blurTarget} {
        will-change: filter, transform;
        transition: filter 200ms linear, transform 200ms linear;
        filter: blur(${props.shouldBlur ? 6 : 0}px);
        transform: scale(${props.shouldBlur ? 1.02 : 1});
      }
    `}
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(51, 51, 51, 0.5);
  will-change: opacity;
  transition: opacity 100ms cubic-bezier(0.075, 0.82, 0.165, 1);
  opacity: ${props => (props.isOpen ? 1 : 0)};
`;

const Sheet = styled(animated.div)`
  position: absolute;
  top: 100vh;
  background-color: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  height: 100vh;
  width: 100vw;

  @media screen and (min-width: 700px) {
    width: 40vw !important;
    left: calc(50% - 20vw) !important;
  }
`;

const SheetItem = styled.div`
  padding: 0px 16px;
  height: ${SHEET_ITEM_HEIGHT}px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  color: #222;

  &:last-child {
    border-bottom: none !important;
  }
`;

export default BottomSheet;
