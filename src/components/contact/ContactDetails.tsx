import { motion } from "framer-motion";

import WaveLinkText from "../WaveLinkText";
import { CONTACT_EASE } from "./contactUtils";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.85,
      ease: CONTACT_EASE,
    },
  },
};

export default function ContactDetails() {
  return (
    <aside className="order-2 lg:order-1">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.25,
        }}
        variants={{
          hidden: {},

          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="
          grid
          grid-cols-1
          gap-10
          text-sm
          font-bold
          uppercase
          tracking-[0.18em]
          sm:grid-cols-2
          lg:sticky
          lg:top-28
          lg:grid-cols-1
        "
      >
        <motion.div variants={itemVariants}>
          <p
            className="
              mb-1
              text-lg
              tracking-[0.24em]
            "
          >
            Details
          </p>

          <div
            className="
              flex
              flex-col
              text-xl
              items-start
              font-normal
              gap-2
            "
          >
            <a
              href="mailto:jonasnygaard96@gmail.com"
              className="
                w-fit
                normal-case
                tracking-[0.05]
                transition
                duration-500
                hover:opacity-60
              "
            >
              <WaveLinkText text="jonasnygaard96@gmail.com" />
            </a>

            <a
              href="tel:+4748263011"
              className="
                w-fit
                transition
                duration-500
                hover:opacity-60
              "
            >
              <WaveLinkText text="+47 48 26 30 11" />
            </a>

            <p>Oslo, Norway</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p
            className="
              mb-1
              text-lg
              tracking-[0.24em]
            "
          >
            Social
          </p>

          <div
            className="
              flex
              flex-col
              items-start
              text-2xl
              font-normal
              gap-2
            "
          >
            <a
              href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                transition
                duration-500
                hover:opacity-60
              "
            >
              <WaveLinkText text="LinkedIn" />
            </a>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p
            className="
              mb-1
              text-lg
              tracking-[0.1em]
            "
          >
            Work
          </p>

          <p
            className="
              max-w-[340px]
              text-2xl
              font-normal
              normal-case
              leading-[1.35]
              tracking-normal
            "
          >
            Available for freelance work, web design, web app builds and
            selected collaborations.
          </p>
        </motion.div>
      </motion.div>
    </aside>
  );
}
