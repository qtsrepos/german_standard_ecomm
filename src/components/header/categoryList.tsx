import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdKeyboardArrowDown } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const subcId = useMemo(() => {
    return getCategoryId(searchParams.get("id"));
  }, [searchParams.get("id")]);

  // Handle image load errors
  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => new Set([...prev, categoryId]));
  };

  // Check if category has valid subcategories
  const hasSubCategories = (category: any) => {
    return category?.sub_categories && category.sub_categories.length > 0;
  };


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
        settings: { slidesToShow: 2, slidesToScroll: 2, },
      },
    ],
  };


  // Loading state for categories
  if (!Category || Category.length === 0) {
    return (
      <div className="category-container">
        <h2 className="category-heading">Explore Categories</h2>
        <div className="line-div"></div>
        <div className="category-scroll-wrapper">
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="text-muted">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">
      <h2 className="category-heading">
        <BiCategory className="me-2" />
        Explore Categories
        <span className="text-muted fs-6 ms-2">({Category.length})</span>
      </h2>
      <div className="line-div"></div>
      <div className="category-scroll-wrapper">
        <div className="category-scroll-wrapper">
          <Slider {...settings}>
            {Category?.map((item: any) => (
              <div
                key={item._id}
                className={`category-slide ${subcId === item._id ? "active" : ""}`}
                onMouseEnter={() => setHoveredCategory(item._id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => {
                  router.push(
                    `/category/${item.slug}?id=${window.btoa(item._id)}&type=${encodeURIComponent(item.name)}`
                  );
                }}
              >
                <div className="category-card">
                  <div className="category-image-container">
                    {!imageErrors.has(item._id) && item.image &&
                     !item.image.includes('NoImage.jpg') &&
                     !item.image.includes('/images/no-image.jpg') &&
                     item.image.startsWith('http') ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="category-image"
                        loading="lazy"
                        onError={() => handleImageError(item._id)}
                      />
                    ) : (
                      <div className="category-image-placeholder category-emoji-icon">
                        {item.image && !item.image.startsWith('http') && !item.image.includes('/') ? (
                          <span className="category-emoji" style={{ fontSize: '2.5rem' }}>
                            {item.image}
                          </span>
                        ) : (
                          <BiCategory size={32} className="text-muted" />
                        )}
                      </div>
                    )}

                    {/* Subcategory indicator */}
                    {hasSubCategories(item) && (
                      <div className="subcategory-indicator">
                        <MdKeyboardArrowDown size={16} />
                        <span className="subcategory-count">{item.sub_categories.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="category-content">
                    <div className="category-name" title={item.name}>
                      {item.name}
                    </div>

                    {/* Show subcategories on hover */}
                    {hasSubCategories(item) && hoveredCategory === item._id && (
                      <div className="subcategory-preview">
                        {item.sub_categories.slice(0, 3).map((subCat: any) => (
                          <div key={subCat.id} className="subcategory-item">
                            {subCat.name}
                          </div>
                        ))}
                        {item.sub_categories.length > 3 && (
                          <div className="subcategory-more">
                            +{item.sub_categories.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
