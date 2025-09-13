
"use client";
import React, { useState, useEffect } from "react";
import { Image } from "antd";

type Props = {
  coverImage: string;
  images: { url: string; type: string }[];
};

function ProductImages(props: Props) {
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (props.coverImage) {
      setMainImage(props.coverImage);
    }
  }, [props.coverImage]);

  const thumbnails = props.coverImage
    ? [{ url: props.coverImage, type: "main" }, ...(props.images || [])]
    : [...(props.images || [])];

  return (
    <div>
      <Image.PreviewGroup>
        <Image
          src={mainImage || props.coverImage}
          alt="Main Product Image"
          style={{ width: "100%", marginBottom: "10px" }}
          className=" border rounded-4"
        />

        {/* <div className="thumbnail_img" style={{ display: "flex", gap: "10px", marginTop:"10px" }} >
          {thumbnails.map((item, index) => (
            <img
              key={index}
              src={item.url}
              alt={`Thumbnail ${index}`}
              style={{
                width: 50,
                cursor: "pointer",
                border: item.url === mainImage ? "2px solid #1890ff" : "1px solid #ccc",
                borderRadius: "5px",
              }}
              onMouseOver={() => setMainImage(item.url)}
            />
          ))}
        </div> */}
      </Image.PreviewGroup>
    </div>
  );
}

export default ProductImages;
