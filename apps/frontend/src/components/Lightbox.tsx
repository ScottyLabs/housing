import { useEffect } from "react";

export interface LightboxItem {
  link: string;
  description: string;
}

export interface LightboxState {
  items: LightboxItem[];
  index: number;
}

const ROUND_BUTTON =
  "absolute rounded-full bg-black/40 text-white transition-colors hover:bg-black/60";

function shift(state: LightboxState, step: number): LightboxState {
  const count = state.items.length;
  return { items: state.items, index: (state.index + step + count) % count };
}

function useLightboxKeys(
  state: LightboxState,
  onChangeAction: (state: LightboxState) => void,
  onCloseAction: () => void,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
      if (e.key === "ArrowLeft") onChangeAction(shift(state, -1));
      if (e.key === "ArrowRight") onChangeAction(shift(state, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [state, onChangeAction, onCloseAction]);
}

function RoundButton({
  label,
  symbol,
  className,
  onClickAction,
}: {
  label: string;
  symbol: string;
  className: string;
  onClickAction: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`${ROUND_BUTTON} ${className}`}
      onClick={() => {
        onClickAction();
      }}
    >
      {symbol}
    </button>
  );
}

function ArrowButton({
  step,
  onStepAction,
}: {
  step: -1 | 1;
  onStepAction: (step: number) => void;
}) {
  const backward = step < 0;
  return (
    <RoundButton
      label={backward ? "Previous" : "Next"}
      symbol={backward ? "<" : ">"}
      className={`${backward ? "left-4" : "right-4"} px-3 py-2 text-3xl`}
      onClickAction={() => {
        onStepAction(step);
      }}
    />
  );
}

function LightboxFigure({ state, item }: { state: LightboxState; item: LightboxItem }) {
  return (
    <figure className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-3">
      <img
        src={item.link}
        alt={item.description}
        className="h-[80vh] w-auto max-w-[90vw] rounded-2xl object-contain shadow-2xl"
      />
      <figcaption className="text-[15px] text-white">
        {item.description}
        {state.items.length > 1 && (
          <span className="ml-2 text-[13px] text-white/50">
            {state.index + 1} / {state.items.length}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function Lightbox({
  state,
  onChangeAction,
  onCloseAction,
}: {
  state: LightboxState;
  onChangeAction: (state: LightboxState) => void;
  onCloseAction: () => void;
}) {
  useLightboxKeys(state, onChangeAction, onCloseAction);
  const item = state.items.at(state.index);
  if (item === undefined) return null;
  const hasMultiple = state.items.length > 1;
  const step = (by: number) => {
    onChangeAction(shift(state, by));
  };

  return (
    <dialog
      open
      aria-label={item.description}
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-0"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
        onClick={() => {
          onCloseAction();
        }}
      />
      {hasMultiple && <ArrowButton step={-1} onStepAction={step} />}
      <LightboxFigure state={state} item={item} />
      {hasMultiple && <ArrowButton step={1} onStepAction={step} />}
      <RoundButton
        label="Close"
        symbol="&times;"
        className="right-4 top-4 px-3 py-1 text-2xl"
        onClickAction={onCloseAction}
      />
    </dialog>
  );
}
