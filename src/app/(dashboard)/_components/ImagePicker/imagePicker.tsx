import "./styles.scss";
import moment from "moment";
import Dropzone from "react-dropzone";
import { Button, message, Modal } from "antd";
import { FiInbox } from "react-icons/fi";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImagePicker = (props: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [cropperModalOpen, setCropperModalOpen] = useState<boolean>(false);
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    try {
      const maxFileSize = 3 * 1024 * 1024; // 3MB
      const myFile = acceptedFiles[0];

      if (!myFile.type.startsWith("image/")) {
        message.error("Only image files are allowed.");
        return;
      }

      if (myFile.size > maxFileSize) {
        message.error("File size exceeded the 3MB limit.");
        return;
      }

      const name = moment(new Date()).unix();
      const myNewFile = new File([myFile], `${name}G.png`, {
        type: myFile.type,
      });
      const url = URL.createObjectURL(myNewFile);

      setImage({
        file: myNewFile,
        url: url,
      });
      setCropperModalOpen(true);
    } catch (err) {
      console.error("Error handling drop:", err);
      message.error("An error occurred while processing the image.");
    }
  };

  const handleCrop = async () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.cropper.getCroppedCanvas({
      fillColor: "transparent",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (canvas) {
      try {
        const croppedData = canvas.toDataURL("image/png");
        const imageBlob = await fetch(croppedData).then((r) => r.blob());
        const name = moment(new Date()).unix();
        const file = new File([imageBlob], `${name}N.png`, { type: "image/png" });
        const url = URL.createObjectURL(file);

        props.onChange({
          file: file,
          url: url,
        });
        setCropperModalOpen(false);
      } catch (err) {
        console.error("Error cropping image:", err);
        message.error("Failed to crop image");
      }
    }
  };

  return (
    <div
      className="image-picker-container"
      style={{
        width: props.width || "100%",
        height: props.height || "100%",
        backgroundColor: "transparent",
      }}
    >
      {cropperModalOpen && (
        <Modal
          open={cropperModalOpen}
          onCancel={() => setCropperModalOpen(false)}
          footer={[
            <Button key="change" onClick={() => fileInputRef.current?.click()}>
              Change
            </Button>,
            <Button key="cancel" onClick={() => setCropperModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="crop" type="primary" onClick={handleCrop}>
              Crop
            </Button>,
          ]}
          width="80%"
          style={{ maxHeight: "90vh" }}
          bodyStyle={{ padding: 0, overflow: "hidden", height: "calc(90vh - 110px)" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%", // Fill Modal body
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setImage({
                    file: selectedFile,
                    url: URL.createObjectURL(selectedFile),
                  });
                }
              }}
            />
            <Cropper
              ref={cropperRef}
              src={image?.url}
              style={{
                width: "100%",
                height: "100%", // Fill parent container
                maxHeight: "calc(90vh - 110px)", // Prevent overflow
              }}
              guides={true}
              background={false}
              dragMode="move" // Free dragging
              cropBoxMovable={true}
              cropBoxResizable={true}
              zoomable={true}
              scalable={true}
              autoCropArea={0.8}
              minCropBoxWidth={50}
              minCropBoxHeight={50}
              checkCrossOrigin={false}
            />
          </div>
        </Modal>
      )}

      <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone-container">
            <input {...getInputProps()} />
            <div className="dropzone-content">
              {props.fileURL ? (
                <img
                  src={props.fileURL}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                  alt="Preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <FiInbox size={30} />
                  <div className="upload-text">
                    Click or drag image to this area to upload
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default ImagePicker;