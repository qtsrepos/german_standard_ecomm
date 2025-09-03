import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const getCategoryId = (cid: any): string => {
  try {
    return window.atob(String(cid));
  } catch (err) {
    return "0";
  }
};

function CategoryList() {
  const router = useRouter();
  const Category = useSelector((state: any) => state?.Category?.categries);
  const searchParams = useSearchParams();
  const subcId = useMemo(() => {
    return getCategoryId(searchParams.get("id"));
  }, [searchParams.get("id")]);


  const CustomPrevArrow = ({ onClick }: any) => (
    <div className="scroll-button left" onClick={onClick}>
      <MdOutlineArrowBackIos size={20} />
    </div>
  );

  const CustomNextArrow = ({ onClick }: any) => (
    <div className="scroll-button right" onClick={onClick}>
      <MdOutlineArrowForwardIos size={20} />
    </div>
  );

  const settings = {
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 5,
    speed: 500,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 7 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4, slidesToScroll: 4, },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 , slidesToScroll: 2,},
      },
    ],
  };


  return (
    <div className="category-container">
      <h2 className="category-heading">Explore Categories</h2>
      <div className="line-div"></div>
      <div className="category-scroll-wrapper">
        <div className="category-scroll-wrapper">
          <Slider {...settings}>
            {Category?.map((item: any) => (
              <div
                key={item._id}
                className={`${subcId === item._id ? "active" : ""}`}
                onClick={() => {
                  router.push(
                    `/category/${item.slug}?id=${window.btoa(item._id)}&type=${encodeURIComponent(item.name)}`
                  );
                }}
              >
                <div className="category-card">
                  <div className="category-image-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="category-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="category-name">{item.name}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
