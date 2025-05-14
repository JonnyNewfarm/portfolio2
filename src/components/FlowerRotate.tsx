"use client";
import { motion } from "framer-motion";
import React from "react";

const FlowerRotate = () => {
  return (
    <div className="absolute top-[55%] right-4 w-full flex justify-center pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="89.294"
        height="86.555"
        viewBox="0 0 89.294 86.555"
      >
        <g
          id="Group_1"
          data-name="Group 1"
          transform="translate(3.223 -200.66)"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
            id="Path_1"
            data-name="Path 1"
            d="M30.962,202.5C33,329.048-13.549,268.554-13.549,268.554"
            transform="translate(-17.594 4.527) rotate(-8)"
            fill="none"
            stroke="#707070"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            id="Path_2"
            data-name="Path 2"
            d="M53.408,286.664c-.244-82.658,2.3-83.751,2.3-83.751l29.859,83.751V202.913"
            fill="none"
            stroke="#707070"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

export default FlowerRotate;
