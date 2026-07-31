import { ROOM_PROGRESS_STEP } from "./roomConstants";

type RoomProgressControlsProps = {
  visible: boolean;
  progress: number;
  onChangeAction: (progress: number) => void;
  onStepAction: (amount: number) => void;
};

export default function RoomProgressControls({
  visible,
  progress,
  onChangeAction,
  onStepAction,
}: RoomProgressControlsProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="
        absolute
        bottom-8
        left-4
        z-[150]
        flex
        w-[calc(100%-40px)]
        max-w-[440px]
        items-center
        gap-3
        rounded-[2px]
        bg-[#161310]
        px-3
        py-2
        text-stone-300
        dark:bg-stone-300
        dark:text-[#161310]
        md:bottom-10
        md:px-4
        md:py-3
      "
    >
      <h1 className="hidden text-xl uppercase xl:block">Scroll</h1>

      <h1
        className="
          ml-4
          mr-4
          hidden
          text-base
          uppercase
          xl:block
        "
      >
        Or
      </h1>

      <button
        type="button"
        aria-label="Move camera backwards"
        onClick={() => {
          onStepAction(-ROOM_PROGRESS_STEP);
        }}
        className="
          flex
          h-6
          w-6
          shrink-0
          cursor-pointer
          items-center
          justify-center
          text-base
          font-semibold
          leading-none
        "
      >
        ←
      </button>

      <span
        className="
          hidden
          shrink-0
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.1em]
          sm:block
        "
      >
        00
      </span>

      <input
        type="range"
        aria-label="3D room progress"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={(event) => {
          onChangeAction(Number(event.currentTarget.value));
        }}
        className="
          h-[2px]
          min-w-0
          flex-1
          cursor-pointer
          accent-current
        "
      />

      <span
        className="
          min-w-[28px]
          shrink-0
          text-right
          text-[9px]
          font-semibold
          tabular-nums
          tracking-[0.08em]
        "
      >
        {Math.round(progress * 100)
          .toString()
          .padStart(2, "0")}
      </span>

      <button
        type="button"
        aria-label="Move camera forwards"
        onClick={() => {
          onStepAction(ROOM_PROGRESS_STEP);
        }}
        className="
          flex
          h-6
          w-6
          shrink-0
          cursor-pointer
          items-center
          justify-center
          text-base
          font-semibold
          leading-none
        "
      >
        →
      </button>
    </div>
  );
}
