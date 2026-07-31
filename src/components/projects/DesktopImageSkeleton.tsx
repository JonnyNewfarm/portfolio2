type DesktopImageSkeletonProps = {
  isDark: boolean;
};

export default function DesktopImageSkeleton({
  isDark,
}: DesktopImageSkeletonProps) {
  const skeletons = [-2, -1, 0, 1, 2];

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <div className="flex w-max items-center gap-4">
        {skeletons.map((position) => {
          const distance = Math.abs(position);

          const scale = distance > 1 ? 0.92 : distance === 1 ? 0.96 : 1;

          const opacity = distance > 1 ? 0.35 : distance === 1 ? 0.55 : 0.8;

          return (
            <div
              key={position}
              className="
                  h-[clamp(210px,26vw,330px)]
                  w-[clamp(370px,46vw,590px)]
                  shrink-0
                "
              style={{
                transform: `scale(${scale})`,
                opacity,

                backgroundColor: isDark
                  ? "rgba(214, 211, 209, 0.07)"
                  : "rgba(22, 19, 16, 0.065)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
