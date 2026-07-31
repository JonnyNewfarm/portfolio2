import type { MotionValue } from "framer-motion";
import { memo, useEffect } from "react";

import Bird from "./Bird";
import Bookshelf from "./BookShelf";
import { CameraController } from "./CameraController";
import Chair from "./Chair";
import Chest from "./Chest";
import Clock from "./Clock";
import ComputerTower from "./ComputerTower";
import Curtain from "./Curtain";
import Desk from "./Desk";
import Floor from "./Floor";
import FloorLamp from "./FloorLamp";
import Plant from "./Plant";
import RecordPlayer from "./RecordPlayer";
import ScreenUI from "./ScreenUI";
import Skateboard from "./Skateboard";
import Wall from "./Wall";
import Wall2 from "./Wall2";
import WallShelfWithCandle from "./WallShelfWithCandle";
import WindowOnWall from "./WindowOnWall";

type RoomSceneProps = {
  scrollYProgress: MotionValue<number>;
  monitorFocused: boolean;
  onReadyAction: () => void;
};

const RoomScene = memo(function RoomScene({
  scrollYProgress,
  monitorFocused,
  onReadyAction,
}: RoomSceneProps) {
  useEffect(() => {
    onReadyAction();
  }, [onReadyAction]);

  return (
    <>
      <FloorLamp />
      <Desk />
      <Bookshelf />
      <WindowOnWall />

      <Wall />
      <Wall2 />

      <Plant />
      <Bird />
      <Chest />
      <Curtain />

      <WallShelfWithCandle />
      <Floor />
      <Clock />
      <Chair />
      <Skateboard />
      <RecordPlayer />
      <ComputerTower />

      <ScreenUI scrollYProgress={scrollYProgress} />

      <CameraController
        scrollYProgress={scrollYProgress}
        monitorFocused={monitorFocused}
      />
    </>
  );
});

export default RoomScene;
