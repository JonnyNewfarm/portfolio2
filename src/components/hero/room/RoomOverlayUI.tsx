import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import DarkModeBtn from "../../DarkModeBtn";

import { roomEase } from "./roomConstants";

type RoomOverlayUIProps = {
  sceneLoaded: boolean;
  onCloseAction: () => void;
};

export default function RoomOverlayUI({
  sceneLoaded,
  onCloseAction,
}: RoomOverlayUIProps) {
  return (
    <>
      {sceneLoaded ? (
        <div
          className="
            pointer-events-auto
            absolute
            bottom-8
            left-4
            z-[120]
            md:bottom-10
            lg:left-auto
            lg:right-5
          "
        >
          <DarkModeBtn />
        </div>
      ) : null}

      {sceneLoaded ? (
        <div
          className="
            pointer-events-none
            absolute
            left-10
            top-7
            z-[200]
            flex
            items-center
            justify-center
            rounded-[2px]
            bg-[#161310]
            px-3
            py-1
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-stone-300
            dark:bg-stone-300
            dark:text-[#161310]
            md:text-[16px]
          "
        >
          NEWFARM STUDIO / 3D EXPERIENCE
        </div>
      ) : null}

      {sceneLoaded ? (
        <motion.button
          type="button"
          onClick={onCloseAction}
          aria-label="Close 3D room"
          initial={{
            opacity: 0,
            y: -16,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: roomEase,
          }}
          className="
            absolute
            right-10
            top-7
            z-[200]
            flex
            cursor-pointer
            items-center
            justify-center
            gap-x-1
            rounded-[2px]
            bg-[#161310]
            px-3
            py-1
            text-[10px]
            font-black
            uppercase
            tracking-[0.12em]
            text-stone-300
            dark:bg-stone-300
            dark:text-[#161310]
            md:text-[16px]
          "
        >
          <IoMdClose size={25} />
        </motion.button>
      ) : null}

      <AnimatePresence>
        {!sceneLoaded ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
            transition={{
              duration: 0.3,
              ease: roomEase,
            }}
            className="
              pointer-events-none
              absolute
              bottom-6
              left-6
              z-[120]
              flex
              items-center
              gap-3
              sm:bottom-8
              sm:left-8
            "
          >
            <span
              className="
                text-[27px]
                font-black
                uppercase
                tracking-[0.1em]
              "
            >
              Loading 3D room
            </span>

            <span
              aria-hidden="true"
              className="
                block
                h-8
                w-8
                animate-spin
                rounded-full
                border
                border-current
                border-t-transparent
              "
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
