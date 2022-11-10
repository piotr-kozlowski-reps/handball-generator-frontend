import useImage from "use-image";
import { Image } from "react-konva";

interface Props {}

const KonvaImage = (source: string, ...props: any) => {
  const [image] = useImage(source);

  return <Image image={image} {...props} />;
};

export default KonvaImage;
