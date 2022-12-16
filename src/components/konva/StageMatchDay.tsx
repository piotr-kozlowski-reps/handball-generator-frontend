import Konva from "konva";
import { add } from "lodash";
import { Fragment, useRef } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import convertImageIntoBase64 from "../../utils/convertImageIntoBase64";

interface StageMatchDayProps {
  imageBackground: HTMLImageElement | undefined;
  mainText: string;
  date: string;
  hour: string;
  takesPlace: string;
  // handleSave: any;
}

const StageMatchDay = ({
  imageBackground,
  mainText,
  date,
  hour,
  takesPlace,
}: // handleSave,
StageMatchDayProps) => {
  ////vars
  const stageRef = useRef<any>(null);

  //TODO: do wywalenia - start
  const [image_podklad] = useImage(
    `${process.env.REACT_APP_BACKEND_URL}/images/background-images/canvas___20221109-162530.png`,
    "anonymous"
  );

  //TODO: do wywalenia - end
  // const image_podklad = Konva.Image.fromURL(
  //   `${process.env.REACT_APP_BACKEND_URL}/images/background-images/canvas___20221109-162530.png`,
  //   () => {}
  // );
  console.log(image_podklad);

  ////logic
  const handleSaveInner = () => {
    const uri = stageRef!.current!.toDataURL();
    console.log(uri);
  };

  return (
    <Fragment>
      <div className="bg-red-400 m-3">
        <button
          className="bg-appInFocus p-2 text-white"
          onClick={handleSaveInner}
        >
          zapisz plik
        </button>
      </div>
      <Stage
        width={1024}
        height={1024}
        scaleX={0.4}
        scaleY={0.4}
        ref={stageRef}
      >
        {/* <Layer>
          <Image
            image={image_podklad}
            width={1024}
            height={1024}
            x={0}
            y={0}
            cross
          />
        </Layer> */}

        <Layer>
          <Image
            image={imageBackground}
            width={1024}
            height={1024}
            x={0}
            y={0}
            // opacity={0.4}
          />
        </Layer>
        <Layer id="texts-bottom">
          <Text
            text={mainText}
            fontSize={105}
            fontStyle="bold"
            fill="#fff"
            align="center"
            y={727}
            width={1024}
            fontFamily={"Oswald"}
            letterSpacing={3}
          />
          <Text
            text={`${date} / ${hour}`}
            fontSize={43}
            fill="#fff"
            align="center"
            y={844}
            width={1024}
            fontFamily={"Oswald"}
            letterSpacing={2}
          />
          <Text
            text={takesPlace}
            fontSize={20}
            fill="#fff"
            align="center"
            y={894}
            width={1024}
            fontFamily={"Oswald"}
            letterSpacing={2}
          />
        </Layer>
      </Stage>
    </Fragment>
  );
};

export default StageMatchDay;
