// import React from "react";
// import Slider from "react-slick";
// import useWindowWidth from "../../../../shared/hook/useWindowWidth";
// import { Container } from "react-bootstrap";
// import "../style.scss";
// function Banners(props: any) {
//   const Slidesettings = {
//     dots: false,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 6000,
//     speed: 3000,
//     slidesToShow: 1,
//     fade: true,
//     slidesToScroll: 1,
//   };

//   console.log(props?.data);
//   const isSmaller = useWindowWidth(762);
//   return (
//     <div className="HomeScreen-BannerBox mt-3">
//       <Container>
//         {props?.data?.length ? (
//           <Slider {...Slidesettings}>
//             {props?.data?.map((bann: any) => {
//               return (
//                 <div key={bann.id}>
//                   <div
//                     key={bann.id}
//                     className="HomeScreen-Banners"
//                     style={{
//                       backgroundImage: `url(${
//                         isSmaller
//                           ? bann.img_mob || bann.img_desk
//                           : bann.img_desk
//                       })`,

//                     }}
//                   >
//                     <div className="HomeScreen-BannersBox">
//                       <div className="HomeScreen-Bannertxt2">{bann.title}</div>
//                       <div className="HomeScreen-Bannertxt3">
//                         {bann.description}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </Slider>
//         ) : null}
//       </Container>
//     </div>
//   );
// }
// export default Banners;

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button, notification } from "antd";
import "../style.scss";

// Dynamically import react-slick to avoid SSR issues
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Import CSS for styling
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import { Col, Container, Row } from "react-bootstrap";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import API from "@/config/API";
import { GET, POST } from "@/util/apicall";
import { useDispatch } from "react-redux";
import { storeCart } from "@/redux/slice/cartSlice";
// background: linear-gradient(to right, #f7a900, #ff5733);
// Scoped styles using styled-jsx
const styles = `
  .carousel-container {
    position: relative;
    width: 100%;
 
    overflow: hidden;
  }
  .carousel-slide {
    display: flex !important;
    align-items: center;
    justify-content: center;
   min-height: 400px;
    border-radius: 15px;
    outline: none;
  }
  .image-container {
    flex: 1;
    display: flex;
    border:none !important;
    justify-content: center;
    animation: slideInFromLeft 1s ease-in-out forwards;
  }
  .text-container {
    flex: 1;
    color: white;
    text-align: left;
    padding: 20px;
    animation: slideInFromRight 1s ease-in-out forwards;
  }
  .text-container h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .text-container p {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  @keyframes slideInFromLeft {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInFromRight {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
`;

// Carousel data
const carouselItems = [
  {
    id: "ec90a2be-48a8-4f5d-ab26-4c4c9083d1c7",
    image:
      "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/ae653ad5-172c-4f20-e460-13ca33e38200/w=1000,h=1000,fit=crop",
    title: "Comprehensive Diagnostic Profile B Of 12 Rotors",
    price: "AED 1544.00",
  },
  {
    id: "ec90a2be-48a8-4f5d-ab26-4c4c9083d1c7",
    image:
      "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/c44aa7a5-30c4-43c9-2d7d-3b7069327700/w=1000,h=1000,fit=crop",
    title: "Comprehensive Diagnostic Profile B Of 12 Rotors",
    price: "AED 1299.00",
  },
  {
    id: "1f0a8411-4772-4086-98ea-27e8ec0f457a",
    image:
      "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/3c74feee-525e-42be-0657-1496951a5c00/w=550,h=550,fit=crop",
    title: "Comprehensive Diagnostic Profile B Of 12 Rotors",
    price: "AED 1544.00",
  },
];

const Banners = () => {
  const [Notifications, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const addToCart = async (id: number) => {
    // setCartBtn(true);
    // if (props?.item?.status != true) {
    //   notification.error({ message: `Product is Temporarily not Available` });
    //   return;
    // } else if (props?.item?.unit == 0) {
    //   notification.error({ message: `Product is Out of Stock!!` });
    //   return;
    // } else if (quantity > props?.item?.unit) {
    //   notification.error({ message: `Selected Quantity is Not Available.` });
    //   return;
    // } else if (quantity === 0) {
    //   notification.error({ message: `Please select at least 1 quantity.` });
    //   return;
    // }

    const obj = {
      productId: id,
      quantity: 1,
      variantId: null,
    };

    const url = API.CART;
    try {
      const newCart: any = await POST(url, obj);
      if (newCart.status) {
        Notifications.success({ message: newCart?.message });
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

  const CustomPrevArrow = ({ onClick }: any) => (
    <div className="scroll-button2 left" onClick={onClick}>
      <MdOutlineArrowBackIos size={20} />
    </div>
  );

  const CustomNextArrow = ({ onClick }: any) => (
    <div className="scroll-button2 right" onClick={onClick}>
      <MdOutlineArrowForwardIos size={20} />
    </div>
  );
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    beforeChange: () => {
      // Force re-animation by resetting the animation
      document.querySelectorAll(".image-container").forEach((el: any) => {
        el.style.animation = "none";
        el.offsetHeight; // Trigger reflow
        el.style.animation = "slideInFromLeft 1s ease-in-out forwards";
      });
      document.querySelectorAll(".text-container").forEach((el: any) => {
        el.style.animation = "none";
        el.offsetHeight; // Trigger reflow
        el.style.animation = "slideInFromRight 1s ease-in-out forwards";
      });
    },
  };

  return (
    <>
      {contextHolder}
      <style jsx>{styles}</style>
      <Container>
        <div
          className="mt-4 py-md-4"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(247, 169, 0, 1) 0%, rgba(255, 87, 51, 1) 41%)",
            borderRadius: "20px",
            height: "100%",
          }}
        >
          <div className="carousel-container">
            <Slider {...settings} className="home">
              {carouselItems.map((item: any, index: any) => (
                <div key={index} className="carousel-slide">
                  <Row>
                    <Col md={6}>
                      <div className="image-container" key={`image-${index}`}>
                        <Image
                          src={item?.image}
                          alt={item.title}
                          width={550}
                          height={550}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </Col>
                    <Col
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className="text-container" key={`text-${index}`}>
                        <p>GERMAN STANDARD GROUP</p>
                        <h1>{item.title}</h1>
                        <p>{item.price}</p>
                        <Button
                          className="custom-button"
                          size="large"
                          onClick={() => addToCart(item.id)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Banners;
