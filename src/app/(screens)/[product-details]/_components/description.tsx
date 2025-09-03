// =================davood code========================

"use client";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { Button, notification } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../config/API";
import { storeCheckout } from "../../../../redux/slice/checkoutSlice";
import { GET, POST } from "../../../../util/apicall";
import { useSession } from "next-auth/react";
import { decrement, increment } from "@/redux/slice/favouriteSlice";
import { addToLocalCart } from "@/redux/slice/localcartSlice";
import "../style.scss";
import { storeCart } from "@/redux/slice/cartSlice";
import { CiHeart, CiShuffle } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";

type Props = {
  data: any;
  currentVariant: any;
  handleBuyNow: (val: any) => void;
};

function Description(props: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session }: any = useSession();

  const checkWishlistStatus = async () => {
    try {
      const res = await GET(API.WISHLIST_GETALL);
      const isInWishlist = res?.data?.some(
        (item: any) => {
          return item?.pid == props?.data?.pid;
        }
        // (!props.currentVariant?.id
        //   || item.variantId === props.currentVariant.id)
      );

      setFavourited(!!isInWishlist);
    } catch (err) {
      console.log("err", err);
      setFavourited(false);
    }
  };

  const availableQuantity =
    props?.currentVariant?.units ?? props?.data?.unit ?? 0;
  const settings = useAppSelector(reduxSettings);
  const [Notifications, contextHolder] = notification.useNotification();
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const LocalCart = useSelector(
    (state: any) => state.LocalCart || { items: [] }
  );
  // const [favourited, setFavourited] = useState(props?.data ?? false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const cart = useSelector((state: any) => state.Cart.items);

  const cartItems = session?.token ? cart : LocalCart.items;

  const isProductInCart = cartItems?.some(
    (item: any) => item.pid === props?.data?.pid
  );

  useEffect(() => {
    const basePrice =
      props?.currentVariant?.price ?? props?.data?.retail_rate ?? 0;
    setTotalPrice(basePrice);
  }, [quantity, props?.currentVariant, props?.data]);

  useEffect(() => {
    if (props?.data?.pid) {
      checkWishlistStatus();
    }
  }, [props?.data?.pid]);

  const updateQuantity = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < availableQuantity) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const shareLink = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({
          title: document?.title,
          url: window?.location?.href,
        });
      } else {
        Notifications.error({ message: `Failed to share link` });
      }
    } catch (err) {
      Notifications.error({ message: `Failed to share link` });
    }
  };

  const buyNow = () => {
    if (props?.data?.status != true) {
      notification.error({ message: `Product is Temporarily not Available` });
      return;
    } else if (availableQuantity === 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > props?.data?.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    }
    const obj = {
      name: props?.data?.name,
      buyPrice: props?.currentVariant?.price ?? props?.data?.retail_rate,
      productId: props?.data?._id,
      quantity: quantity,
      storeId: props?.data?.store_id,
      totalPrice: totalPrice,
      variantId: props?.currentVariant?.id ?? null,
      image: props?.currentVariant?.id
        ? props?.currentVariant?.image
        : props?.data?.image,
      combination: props?.currentVariant?.combination,
      storeName: props?.data?.storeDetails?.store_name,
    };

    // Store in Redux
    dispatch(storeCheckout([obj]));

    // Also store in localStorage
    try {
      localStorage.setItem("checkout_items", JSON.stringify([obj]));
    } catch (error) {
      console.error("Error storing checkout data in localStorage:", error);
    }

    if (session?.token) {
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };

  const addToCart = async (item: any, quantity: number) => {
    if (props?.data?.status != true) {
      notification.error({ message: `Product is Temporarily not Available` });
      return;
    } else if (props?.data?.unit == 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > props?.data?.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    }
    const obj = {
      productId: props?.data?.pid,
      quantity: quantity,
      variantId: props?.currentVariant?.id ?? null,
    };
    const url = API.CART;
    try {
      const newCart: any = await POST(url, obj);
      if (newCart.status) {
        Notifications.success({ message: newCart?.message });
        // setTimeout(() => {
        //   router.push("/cart");
        // }, 1000);
      } else {
        Notifications.error({ message: newCart?.message });
      }
    } catch (err: any) {
      Notifications.error({ message: "Something went wrong!" });
    }
    try {
      const url = API.CART_GET_ALL;
      const cartItems: any = await GET(url);
      if (cartItems.status) {
        dispatch(storeCart(cartItems.data));
      }
    } catch (err) {}
  };

  const handleAddToLocalCart = () => {
    if (props?.data?.status != true) {
      notification.error({ message: `Product is Temporarily not Available` });
      return;
    } else if (props?.data?.unit == 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > props?.data?.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    } else if (quantity === 0) {
      notification.error({ message: `Please select at least 1 quantity.` });
      return;
    }

    const cartItem = {
      productId: props?.data?.pid || props?.data?._id,
      pid: props?.data?.pid,
      name: props?.data?.name,
      price: props?.data?.retail_rate,
      quantity: quantity,
      image: props?.data?.image,
      variantId: null,
      totalPrice: totalPrice,
      availableQuantity: props?.data?.unit,
      storeId: props?.data?.store_id,
      storeName: props?.data?.storeDetails?.store_name,
    };

    try {
      dispatch(addToLocalCart(cartItem));
    } catch (error) {
      console.error("Error adding to local cart:", error);
      notification.error({ message: "Failed to add item to cart" });
    }
  };

  const AddWishlist = async () => {
    const obj = {
      productId: props?.data?.pid,
      variantId: props?.currentVariant?.id ?? null,
    };
    const url = API.WISHLIST;

    try {
      const response = await POST(url, obj);
      if (response?.status) {
        // Update state immediately for better UX
        const newFavoritedState = !favourited;
        setFavourited(newFavoritedState);

        const message = newFavoritedState
          ? "Successfully added to Wishlist"
          : "Item removed from wishlist.";
        Notifications.success({ message });
        if (newFavoritedState) {
          dispatch(increment());
        } else {
          dispatch(decrement());
        }
      } else {
        Notifications.error({ message: response?.message });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      Notifications.error({
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      {/* <div>category: {props?.data?.categoryName?.name}</div>
      <div>subCategory: {props?.data?.subCategoryName?.name}</div> */}
      <div className=" justify-content-between align-items-center">
        <div className="d-flex fw-bold">
          <div className="ts-5 detail-head mt-4">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: settings.currency ?? "INR",
            }).format(totalPrice)}
          </div>
        </div>
        <br />
        <div className="d-flex gap-2">
          <div className="d-flex gap-3 align-items-center product-qnty">
            <Button
              shape="circle"
              icon={<AiOutlineMinus />}
              disabled={quantity === 1}
              onClick={() => updateQuantity("decrement")}
            />
            <div style={{ fontSize: "24px", color: "#777" }}>{quantity}</div>
            <Button
              shape="circle"
              icon={<AiOutlinePlus />}
              disabled={availableQuantity <= quantity}
              onClick={() => updateQuantity("increment")}
            />
          </div>

          <br />
          {/* {availableQuantity === 0 ? (
            <h5 className="text-danger">Currently Out of Stock</h5>
          ) : availableQuantity < quantity ? (
            <h5 className="text-danger">{`Only ${availableQuantity} units left`}</h5>
          ) : null}
          <br /> */}
          <div className="d-flex gap-2 align-items-center button-container">
            {/* {availableQuantity > 0 && (
          <Button
            className="buynow-btn fw-bold"
            type="primary"
            onClick={() => {
              props?.handleBuyNow(quantity);
              buyNow();
            }}
          >
            Buy Now
          </Button>
        )} */}
            <Button
              className="addtocart-btn fw-bold "
              icon={<HiOutlineShoppingBag />}
              onClick={() => {
                if (isProductInCart) {
                  router.push("/cart");
                } else {
                  if (session?.token) {
                    // Check for session token - use API
                    addToCart(props?.data, quantity);
                  } else {
                    // For non-logged in users - use Redux + localStorage via the LocalCartSlice
                    handleAddToLocalCart();
                  }
                }
              }}
            >
              {isProductInCart ? "Go to Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
      <br />
      {/* Additional Actions */}
      <div className="d-flex gap-2 align-items-center">
        <Button
          type="text"
          className="productDetails-text-btn1 ps-md-0"
          onClick={() => {
            if (session) {
              AddWishlist();
            } else {
              router.push("/login");
            }
          }}
          icon={
            favourited ? (
              <CiHeart
                color="#FF006A"
                className={isWobbling ? "wobble" : ""}
                size={20}
              />
            ) : (
              <IoMdHeartEmpty color="#DBDBDB" size={20} />
            )
          }
        >
          Add to wishlist
        </Button>
        <Button
          type="text"
          className="productDetails-text-btn1"
          icon={
            <CiShuffle
              // color="#FF006A"
              className={isWobbling ? "wobble" : ""}
              size={20}
            />
          }
        >
          Compare
        </Button>
        {/* <div>Any Problem with Product?</div> */}
        {/* <Button type="text" icon={<RiFlag2Fill />}>
            Report
          </Button> */}
      </div>
    </div>
  );
}

export default Description;
