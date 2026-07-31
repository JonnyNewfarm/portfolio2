type RoomFocusButtonProps = {
  visible: boolean;
  focused: boolean;
  onToggleAction: () => void;
};

export default function RoomFocusButton({
  visible,
  focused,
  onToggleAction,
}: RoomFocusButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleAction}
        className={`
          absolute
          left-[67%]
          top-[47%]
          z-[80]
          hidden
          items-center
          gap-3
          whitespace-nowrap
          rounded-full
          border
          border-black/20
          bg-white/90
          px-5
          py-3
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-black
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-500
          ease-out
          hover:scale-105
          hover:bg-black
          hover:text-white
          dark:border-white/20
          dark:bg-black/85
          dark:text-white
          dark:hover:bg-white
          dark:hover:text-black
          md:flex

          ${
            visible
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0"
          }
        `}
      >
        {focused ? "Exit full screen" : "Full screen"}

        <span aria-hidden="true" className="text-base leading-none">
          {focused ? "↙" : "↗"}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleAction}
        className={`
          absolute
          bottom-24
          left-1/2
          z-[80]
          flex
          -translate-x-1/2
          items-center
          gap-3
          whitespace-nowrap
          rounded-full
          border
          border-black/20
          bg-white/90
          px-5
          py-3
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-black
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-500
          ease-out
          dark:border-white/20
          dark:bg-black/85
          dark:text-white
          md:hidden

          ${
            visible
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }
        `}
      >
        {focused ? "Exit full screen" : "Full screen"}
      </button>
    </>
  );
}
