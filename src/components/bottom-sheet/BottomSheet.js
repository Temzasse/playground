import React from 'react';
import ReactDOM from 'react-dom';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import styled, { css, createGlobalStyle } from 'styled-components';
import { usePrevious, EMPTY_THEME } from './utils';

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

const SHEET_ITEM_HEIGHT = 60;
const SHEET_BOTTOM_PAD = 150;
const SPRING_CONFIG = { stiffness: 200, damping: 15, mass: 0.5 };

const BottomSheet = ({ blurTarget, theme }) => {
  const { isOpen, sheetItems } = useBottomSheetState();
  const prevOpen = usePrevious(isOpen);
  const dispatch = useBottomSheetDispatch();

  const closeY = window.innerHeight + 50; // Add padding for closing animation
  const openY = Math.max(
    sheetItems.length * SHEET_ITEM_HEIGHT - SHEET_BOTTOM_PAD,
    window.innerHeight / 2
  );

  const y = useSpring(closeY, SPRING_CONFIG);

  const handleDragEnd = React.useCallback(
    (e, { velocity }) => {
      if (velocity.y > 500) {
        // User flicked the sheet down
        dispatch({ type: 'close' });
      } else {
        // Snap back to original position
        y.stop();
        y.set(openY);
      }
    },
    [dispatch, openY, y]
  );

  React.useEffect(() => {
    if (prevOpen && !isOpen) dispatch({ type: 'close' });
  }, [dispatch, isOpen, prevOpen]);

  return (
    <React.Fragment>
      <Wrapper isOpen={isOpen}>
        <AnimatePresence>
          {isOpen && (
            <Backdrop
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: 'close' })}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <Sheet
              key="sheet"
              drag="y"
              dragConstraints={{ top: openY }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              initial={{ y: closeY }}
              animate={{ y: openY }}
              exit={{ y: closeY }}
              style={{ ...theme.sheet, y }}
            >
              {sheetItems.map(item => (
                <SheetItem
                  key={item.label}
                  onTap={item.onClick}
                  style={theme.sheetItem}
                >
                  {item.label}
                </SheetItem>
              ))}
            </Sheet>
          )}
        </AnimatePresence>
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
        transform: scale(${props.shouldBlur ? 1.05 : 1});
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

const Backdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(51, 51, 51, 0.5);
`;

const Sheet = styled(motion.div)`
  position: absolute;
  top: 0;
  background-color: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  padding-bottom: 100px;
  height: calc(100vh + 100px);
  width: 100vw;

  @media screen and (min-width: 700px) {
    width: 40vw !important;
    left: calc(50% - 20vw) !important;
  }
`;

const SheetItem = styled(motion.div)`
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
