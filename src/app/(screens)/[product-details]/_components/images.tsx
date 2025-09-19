
"use client";
import React, { useState, useEffect } from "react";
import { Image } from "antd";

type Props = {
  coverImage: string;
  images: { url: string; type: string }[];
};

function ProductImages(props: Props) {
  const [hasValidImage, setHasValidImage] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState<string>("");

  // Function to check if an image is NoImage.jpg or invalid
  const isNoImage = (imageUrl: string): boolean => {
    return !imageUrl ||
           imageUrl.includes('NoImage.jpg') ||
           imageUrl.includes('noimage') ||
           imageUrl.trim() === '';
  };

  useEffect(() => {
    if (props.coverImage && !isNoImage(props.coverImage)) {
      setMainImage(props.coverImage);
      setHasValidImage(true);
    } else {
      setMainImage("");
      setHasValidImage(false);
    }
  }, [props.coverImage]);

  // Removed thumbnails logic for now

  return (
    <div>
      {hasValidImage ? (
        <Image.PreviewGroup>
          <Image
            src={mainImage}
            alt="Product Image"
            style={{ width: "100%", marginBottom: "10px" }}
            className="border rounded-4"
            onError={() => setHasValidImage(false)}
          />
        </Image.PreviewGroup>
      ) : (
        <div
          className="border rounded-4 d-flex align-items-center justify-content-center"
          style={{
            width: "100%",
            height: "400px",
            marginBottom: "10px",
            backgroundColor: "#f8f9fa"
          }}
        >
          <span className="text-muted">No image</span>
        </div>
      )}

        {/* Thumbnails disabled for now */}
    </div>
  );
}

export default ProductImages;
