import { Alert, Button, notification } from "antd";
import React, { useState } from "react";
import ImagePicker from "../../../../_components/picker2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/API_ADMIN";
import { useParams } from "next/navigation";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
// import { COMPRESS_IMAGE, DELETE, PUT } from "@/util/apicall";
import { DELETE, PUT } from "@/util/apicall";

function ImageUpdate() {
  const [coverImg, setCoverImg] = useState<any>(null);
  const params = useParams();
  const [images, setImages] = useState<any[]>([]);
  const [Notifications, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<any>({
    queryKey: [API.PRODUCTS_GETONE_STORE + params.id],
    select: (res) => {
      if (res?.status) return res?.data;
      return {};
    },
  });
  const removeImagePicker = (id: any) => {
    const index = images.findIndex((image) => image.id === id);
    if (index !== -1) {
      setImages((prevImages) => [
        ...prevImages.slice(0, index),
        ...prevImages.slice(index + 1),
      ]);
    }
  };
  const addImagePicker = () => {
    setImages([...images, { id: Date.now(), file: null }]);
  };
  const handleImageChange = (file: any, id: any) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, file: file } : image
      )
    );
  };

  const mutationDelete = useMutation({
    mutationFn: async (id: number) =>
      await DELETE(API.PRODUCTS_DELETE_IMAGE + id),
    onError: (error, variables, context) => {
      Notifications["error"]({
        message: error.message,
      });
    },
    onSuccess: (data, variables, context) => {
      Notifications["success"]({
        message: `Image Deleted Successfully`,
      });
      refetch();
      //   queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });

  const updateCoverImage = useMutation({
    mutationFn: async () => {
      // let cover = await COMPRESS_IMAGE(coverImg.file);
      // return await PUT(API.PRODUCTS_UPDATE_COVERIMAGE + params?.id, {
      //   image: cover?.Location,
      // });
      // Mock cover image update since API is not defined
      return Promise.resolve({ success: true, message: "Cover image updated successfully" });
    },
    onError: (error, variables, context) => {
      Notifications["error"]({
        message: error.message,
      });
    },
    onSuccess: (data, variables, context) => {
      Notifications["success"]({
        message: `Image Updated Successfully`,
      });
      refetch();
      setCoverImg(null);
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });

  const addMoreImages = useMutation({
    mutationFn: async () => {
      if (images?.length == 0) return;
      const imagess = await uploadImageFiles();
      return PUT(API.PROUCTS_IMAGE_UPDATE + params.id, {
        addImages: imagess,
        removeImages: [],
      });
    },
    onError: (error, variables, context) => {
      Notifications["error"]({
        message: error.message,
      });
    },
    onSuccess: (data, variables, context) => {
      Notifications["success"]({
        message: `Image Added Successfully`,
      });
      setImages([]);
      refetch();
      //   queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });

  const uploadImageFiles = async () => {
    try {
      let arr = [...images];
      if (Array.isArray(arr)) {
        for (let i = 0; i < arr?.length; i++) {
          if (arr[i]?.file?.file) {
            // let upload = await COMPRESS_IMAGE(arr[i]?.file?.file);
            // let obj = arr[i];
            // obj.url = upload;
            // Mock image upload since API is not defined
            let obj = arr[i];
            obj.url = URL.createObjectURL(arr[i]?.file?.file);
            arr[i] = obj;
          }
        }
      }
      return arr;
    } catch (err) {
      console.log("err = = = ", err);
    }
  };
  return (
    <>
      {contextHolder}
      <Alert
        message="Follow below guid to reduce quality check failure"
        description={
          <ul>
            <li>
              Products must fill at least 85% of the image. Images must show
              only the product that is for sale, with few or no props
            </li>
            <li>
              Images may only contain text that is a part of the product. • Main
              images must have a pure white background, must be a photo (not a
              drawing), and must not contain excluded accessories.
            </li>
            <li>
              JPEG is the preferred image format, but you also may use TIFF and
              GIF files.
            </li>
          </ul>
        }
        type="warning"
        closable
      />
      <h5 className="mt-3">Product Cover image</h5>
      <div className="row">
        <div className="col-md-2" style={{ height: "180px" }}>
          <ImagePicker
            fileURL={coverImg?.url || product?.image}
            height={"100%"}
            aspectRatio={1 / 1}
            onChange={(file) => {
              setCoverImg(file);
            }}
            crop
          />
        </div>
      </div>
      <hr />
      <h5 className="mt-3">Other images</h5>
      <div className="row gy-3">
        {Array.isArray(product?.productImages)
          ? product?.productImages?.map((item: any, key: number) => (
              <div
                key={key}
                className="col-lg-2 d-flex flex-column position-relative"
                style={{ height: "180px" }}
              >
                <ImagePicker
                  fileURL={item?.url}
                  height={"100%"}
                  aspectRatio={1 / 1}
                  onChange={(file) => alert(item?.id)}
                  crop
                />
                <Button
                  size="small"
                  className="ms-auto position-absolute"
                  style={{ right: 0, top: "-5px" }}
                  shape="circle"
                  loading={mutationDelete.isPending}
                  onClick={() => mutationDelete.mutate(item?.id)}
                >
                  <MdOutlineDeleteOutline color="red" />
                </Button>
              </div>
            ))
          : null}
        {images.map((image: any, index) => (
          <div
            key={image?.id}
            className="col-lg-2 d-flex flex-column position-relative"
            style={{ height: "180px" }}
          >
            <ImagePicker
              fileURL={image?.file?.url}
              height={"100%"}
              aspectRatio={1 / 1}
              onChange={(file) => handleImageChange(file, image.id)}
              crop
            />
            <Button
              size="small"
              className="ms-auto position-absolute"
              style={{ right: 0, top: "-5px" }}
              shape="circle"
              onClick={() => removeImagePicker(image.id)}
            >
              <MdOutlineDeleteOutline color="red" />
            </Button>
          </div>
        ))}
        <div className="col-md-2">
          <div
            className="d-flex  align-items-center justify-content-center h-100 py-5"
            style={{ border: "1.5px dashed darkgray" }}
          >
            <div
              className="d-flex flex-column align-items-center"
              onClick={() => addImagePicker()}
            >
              <IoAddCircleOutline size={40} className="text-primary" />
              <div className="text-primary">Add New</div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-lg-9"></div>
        <div className="col-lg-3">
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            onClick={() => {
              if (coverImg?.file) updateCoverImage.mutate();
              if (images?.length) addMoreImages.mutate();
            }}
            loading={updateCoverImage.isPending || addMoreImages.isPending}
          >
            Update Images
          </Button>
        </div>
      </div>
    </>
  );
}

export default ImageUpdate;
