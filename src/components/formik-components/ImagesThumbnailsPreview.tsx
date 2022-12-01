import React from "react";
import { IImageWithPreview } from "./ImageUploadFormik";

interface Props {
  files: IImageWithPreview[] | null;
}

const ImagesThumbnailsPreview = ({ files }: Props) => {
  let thumbnails = <p>nie wybrano pliku</p>;

  if (files && files.length > 0) {
    thumbnails = (
      <div className="flex gap-4">
        {files.map((file) => (
          <img
            width="96"
            height="96"
            key={file.name}
            src={file.preview}
            alt={file.name}
          ></img>
        ))}
      </div>
    );
  }

  return (
    <div className="w-24 h-24 border-2 border-gray-200 m-4">{thumbnails}</div>
  );
};

export default ImagesThumbnailsPreview;
