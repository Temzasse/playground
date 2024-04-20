import { CSSProperties, HTMLAttributes, forwardRef, useReducer, useRef } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useGSAP } from '@gsap/react';
import useMeasure from 'react-use-measure';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

// Size of floorball field is 40m x 20m but we want uneven number of cells
// so that the center point is in the middle of the field
const cols = 21;
const rows = 41;
const aspectRatio = cols / rows; // vertically long field

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);

  const timeline = useRef<gsap.core.Timeline>(
    gsap.timeline({
      repeat: Infinity,
      paused: true,
    })
  ).current;

  function handleDragEnd(event: DragEndEvent) {
    console.log('> event', event);
    if (event.over && event.over.id === 'field-grid-cell') {
      // Get drop position relative to the drop target
      // const kind = event.active.id as DotKind;
      // if (kind === 'player') {
      //   dispatch({ type: 'addPlayer', payload: 'player' });
      // } else if (kind === 'opponent') {
      //   dispatch({ type: 'addOpponent', payload: 'opponent' });
      // } else if (kind === 'neutral') {
      //   dispatch({ type: 'addNeutral', payload: 'neutral' });
      // }
    }
  }

  useGSAP(
    () => {
      // timeline.to(circlerRef.current, { x: '100%', duration: 1 });
      // timeline.to(circlerRef.current, { y: 50, duration: 1 });
      // timeline.to(circlerRef.current, { opacity: 0, duration: 1 });
    },
    { scope: containerRef }
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={containerRef} style={styles.container}>
        <Field />
        <DotOptions />
        <Controls timeline={timeline} />
      </div>
    </DndContext>
  );
}

function Field() {
  const [measureRef, bounds] = useMeasure();
  const cellSize = Math.round(bounds.width / cols);

  return (
    <div ref={measureRef} style={styles.field}>
      <FieldGrid />
      <FieldCenterLine />
      <FieldCenterPoint cellSize={cellSize / 2} />
    </div>
  );
}

function FieldGrid() {
  return (
    <>
      {Array.from({ length: cols * rows }).map((_, index) => (
        <FieldGridCell key={index} index={index} />
      ))}
    </>
  );
}

const debug = false;

function FieldGridCell({ index }: { index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `field-grid-cell-${index + 1}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: debug ? '1px solid red' : 'none',
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
      }}
    />
  );
}

function FieldCenterPoint({ cellSize }: { cellSize: number }) {
  return <div style={{ ...styles.fieldCenterPoint, width: cellSize, height: cellSize }} />;
}

function FieldCenterLine() {
  return <div style={styles.fieldCenterLine} />;
}

function DotOptions() {
  return (
    <div style={styles.dotOptions}>
      <DotOption kind="player" />
      <DotOption kind="opponent" />
      <DotOption kind="neutral" />
    </div>
  );
}

function DotOption({ kind }: { kind: DotKind }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: kind,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return <Dot kind={kind} ref={setNodeRef} style={style} {...listeners} {...attributes} />;
}

function Controls({ timeline }: { timeline: gsap.core.Timeline }) {
  return (
    <div style={styles.controls}>
      <button onClick={() => timeline.play()}>Play</button>
      <button onClick={() => timeline.pause()}>Pause</button>
      <button onClick={() => timeline.reverse()}>Reverse</button>
      <button onClick={() => timeline.restart()}>Restart</button>
    </div>
  );
}

type DotKind = 'player' | 'opponent' | 'neutral';

type DotProps = HTMLAttributes<HTMLDivElement> & {
  kind: DotKind;
};

const kindToColor: Record<DotKind, string> = {
  player: 'blue',
  opponent: 'red',
  neutral: 'gray',
};

const Dot = forwardRef<HTMLDivElement, DotProps>(({ kind, style, ...rest }, ref) => {
  return (
    <div
      {...rest}
      ref={ref}
      style={{
        ...style,
        ...styles.dot,
        background: kindToColor[kind],
      }}
    />
  );
});

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
    padding: '50px',
  },
  field: {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols} , 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    height: '100%',
    aspectRatio: `${aspectRatio}`,
    background: '#5DB5E0',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '40px',
  },
  fieldCenterPoint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: 'black',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  fieldCenterLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '2px',
    width: '100%',
    background: '#4697c0',
    transform: 'translate(-50%, -50%)',
  },
  dotOptions: {
    display: 'flex',
    gap: '10px',
  },
  dot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
  },
  controls: {
    display: 'flex',
    gap: '10px',
  },
} satisfies Record<string, CSSProperties>;

type DotState = {
  kind: DotKind;
  initialPosition: {
    x: number;
    y: number;
  };
};

type TrainingState = {
  players: DotState[];
  opponents: DotState[];
  neutrals: DotState[];
};

type TrainingAction = {
  type: 'add';
  payload: DotState;
};

function useTrainingState() {
  const [state, dispatch] = useReducer(
    (state: TrainingState, action: TrainingAction) => {
      if (action.type === 'add') {
        return {
          ...state,
          [action.payload.kind]: [...state[action.payload.kind], action.payload.initialPosition],
        };
      }
      return state;
    },
    {
      players: [],
      opponents: [],
      neutrals: [],
    }
  );

  return { state, dispatch };
}
