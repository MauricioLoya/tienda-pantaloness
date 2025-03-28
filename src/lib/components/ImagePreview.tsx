"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

export interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  onPreview?: () => void;
  containerClassName?: string;
  imageClassName?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "Imagen",
  onRemove,
  onPreview,
  containerClassName = "relative w-32 h-32",
  imageClassName = "w-full h-full object-cover rounded-lg border border-gray-200",
}) => {
  return (
    <div className={containerClassName}>
      <img src={src} alt={alt} className={imageClassName} />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-xs btn-circle btn-error absolute top-1 left-1"
        >
          <IoClose />
        </button>
      )}
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="btn btn-xs btn-circle btn-info absolute top-1 right-1"
        >
          <FaEye />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;
