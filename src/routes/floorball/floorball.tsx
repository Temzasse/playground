import {
  CSSProperties,
  HTMLAttributes,
  forwardRef,
  useState,
  useRef,
} from 'react';

import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

import { useGSAP } from '@gsap/react';
import useMeasure from 'react-use-measure';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

// Constants ------------------------------------------------------------------
// Size of floorball field is 40m x 20m but we want uneven number of cells
// so that the center point is in the middle of the field
const cols = 21;
const rows = 41;
const aspectRatio = 1 / 2; // vertically long field
const cellIdPrefix = 'field-grid-cell';
// ----------------------------------------------------------------------------

export function Floorball() {
  const { state, addDot } = useFieldState();
  const { timeline, timelineRef } = useTimeline();

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id.toString().includes(cellIdPrefix)) {
      const kind = event.active.data.current?.kind;
      const index = event.over.data.current?.index;

      if (dotKinds.includes(kind) && typeof index === 'number') {
        addDot(kind, index);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={timelineRef} style={styles.container}>
        <Field state={state} />
        <DotOptions />
        <TimelineControls timeline={timeline} />
      </div>
    </DndContext>
  );
}

// Animation ------------------------------------------------------------------

function useTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>(
    gsap.timeline({ repeat: Infinity, paused: true })
  ).current;

  useGSAP(
    () => {
      // timeline.to(circlerRef.current, { x: '100%', duration: 1 });
      // timeline.to(circlerRef.current, { y: 50, duration: 1 });
      // timeline.to(circlerRef.current, { opacity: 0, duration: 1 });
    },
    { scope: timelineRef }
  );

  return { timeline, timelineRef };
}

// Components -----------------------------------------------------------------

function Field({ state }: { state: FieldState }) {
  const [measureRef, bounds] = useMeasure();

  // Determine cell size so that the field fits the container and has cell size
  // is a whole number
  const cellSize = Math.floor(
    Math.min(bounds.width / cols, bounds.height / rows)
  );

  function renderDot(dot: DotState) {
    const x = dot.initialIndex % cols;
    const y = Math.floor(dot.initialIndex / cols);

    return (
      <Dot
        key={`${dot.kind}-${dot.initialIndex}`}
        kind={dot.kind}
        style={{
          ...styles.fieldDot,
          top: `${y * cellSize}px`,
          left: `${x * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
        }}
      />
    );
  }

  return (
    <div ref={measureRef} style={styles.fieldContainer}>
      {bounds.height !== 0 && (
        <div
          style={{
            ...styles.field,
            width: cellSize * cols,
            height: cellSize * rows,
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          <FieldGrid />
          <FieldCenterLine />
          <FieldCenterPoint cellSize={cellSize / 2} />
          {state.neutral.map(renderDot)}
          {state.player.map(renderDot)}
          {state.opponent.map(renderDot)}
        </div>
      )}
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
    id: `${cellIdPrefix}-${index}`,
    data: { index },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: debug ? '1px solid red' : 'none',
        borderRadius: '999px',
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
      }}
    />
  );
}

function FieldCenterPoint({ cellSize }: { cellSize: number }) {
  return (
    <div
      style={{ ...styles.fieldCenterPoint, width: cellSize, height: cellSize }}
    />
  );
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
  const { attributes, listeners, transform, isDragging, setNodeRef } =
    useDraggable({
      id: kind,
      data: { kind },
    });

  const style = transform
    ? {
        cursor: 'grabbing',
        transform: `
          translate3d(${transform.x}px, ${transform.y}px, 0)
          scale(${isDragging ? 0.65 : 1})
        `,
      }
    : {
        cursor: 'grab',
      };

  return (
    <Dot
      kind={kind}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    />
  );
}

function TimelineControls({ timeline }: { timeline: gsap.core.Timeline }) {
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

const dotKinds: DotKind[] = ['player', 'opponent', 'neutral'];

const kindToColor: Record<DotKind, string> = {
  player: 'blue',
  opponent: 'red',
  neutral: 'gray',
};

const Dot = forwardRef<HTMLDivElement, DotProps>(
  ({ kind, style, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        style={{
          ...styles.dot,
          ...style,
          background: kindToColor[kind],
        }}
      />
    );
  }
);

// State management -----------------------------------------------------------

type DotState = {
  kind: DotKind;
  initialIndex: number; // grid cell index
};

type FieldState = Record<DotKind, DotState[]>;

function useFieldState() {
  const [state, setState] = useState<FieldState>({
    player: [],
    opponent: [],
    neutral: [],
  });

  function addDot(kind: DotKind, initialIndex: number) {
    setState((prev) => {
      const dots = prev[kind];

      // Max 5 dots per kind
      if (dots.length >= 5) {
        return prev;
      }

      // There cannot be two dots in the same cell
      if (dots.some((dot) => dot.initialIndex === initialIndex)) {
        return prev;
      }

      const newDot = { kind, initialIndex };

      return { ...prev, [kind]: [...dots, newDot] };
    });
  }

  function removeDot(dot: DotState) {
    setState((prev) => {
      const dots = prev[dot.kind];
      const index = dots.findIndex((d) => d.initialIndex === dot.initialIndex);

      if (index === -1) {
        return prev;
      }

      return {
        ...prev,
        [dot.kind]: [...dots.slice(0, index), ...dots.slice(index + 1)],
      };
    });
  }

  return { state, addDot, removeDot };
}

// Styles ---------------------------------------------------------------------

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
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    aspectRatio: `${aspectRatio}`,
  },
  field: {
    display: 'grid',
    background: '#5DB5E0',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '40px',
    border: '4px solid #3281a8',
    boxSizing: 'content-box',
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
  fieldDot: {
    position: 'absolute',
    transform: 'scale(0.95)', // small gap between dots
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
