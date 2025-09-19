// "use client";
// import { useSearchParams, useRouter } from "next/navigation";
// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
// import { GET } from "@/util/apicall";
// import API from "@/config/API";
// import { Button } from "antd";

// // Define TypeScript interfaces for our data
// interface SubCategory {
//   id: string;  // Changed from _id to id
//   name: string;
//   slug: string;
// }

// interface CategoryItem {
//   id: string;  // Changed from _id to id
//   name: string;
//   slug?: string;
//   sub_categories?: SubCategory[];
// }

// interface Brand {
//   _id: string;
//   name: string;
//   count?: number;
// }

// interface RootState {
//   Category: {
//     categries: CategoryItem[];
//   };
// }

// const PageSider: React.FC = () => {
//   const searchParams = useSearchParams();
//   const progressBarRef = useRef<HTMLDivElement>(null);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const Category = useSelector((state: RootState) => state.Category.categries);

//   // State variables
//   const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

//   // Price range states
//   const [minPrice, setMinPrice] = useState<number>(0);
//   const [maxPrice, setMaxPrice] = useState<number>(741362);
//   const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 741362 });
//   const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
//   const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

//   // Brand filter states
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(false);

//   // Get current category ID for brand loading
//   const getCategoryId = (): string => {
//     try {
//       const id = searchParams.get("id");
//       return id ? window.atob(id) : "";
//     } catch (e) {
//       console.error("Invalid base64 id:", e);
//       return "";
//     }
//   };

//   // Get main category ID for API calls
//   const getMainCategoryId = (): string => {
//     // First try to get from URL params (direct category ID)
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) {
//       console.log("Found category from URL param:", categoryParam);
//       return categoryParam;
//     }

//     // Fallback to finding by category name/type
//     const type = searchParams.get("type");
//     console.log("Looking for category by type:", type);

//     if (type && Category && Category.length > 0) {
//       console.log("Available categories:", Category.map(cat => ({ id: cat.id, name: cat.name })));  // Changed _id to id
//       const mainCategory = Category.find(cat => cat.name === type);
//       if (mainCategory) {
//         console.log("Found main category:", mainCategory.id, mainCategory.name);  // Changed _id to id
//         return mainCategory.id;  // Changed _id to id
//       } else {
//         console.log("No category found with name:", type);
//       }
//     } else {
//       console.log("No type in URL or no categories available");
//     }

//     return "";
//   };

//   // Initialize filter states from URL parameters
//   useEffect(() => {
//     const urlMinPrice = searchParams.get('minPrice');
//     const urlMaxPrice = searchParams.get('maxPrice');
//     const urlBrands = searchParams.get('brand');

//     if (urlMinPrice) {
//       const min = parseInt(urlMinPrice);
//       setMinPrice(min);
//       setPriceRange(prev => ({ ...prev, min }));
//     }

//     if (urlMaxPrice) {
//       const max = parseInt(urlMaxPrice);
//       setMaxPrice(max);
//       setPriceRange(prev => ({ ...prev, max }));
//     }

//     if (urlBrands) {
//       setSelectedBrands(urlBrands.split(','));
//     }
//   }, []);

//   // Load brands when category or subcategory changes
//   useEffect(() => {
//     const mainCategoryId = getMainCategoryId();
//     const subcategoryId = getCategoryId();

//     console.log("Category change detected:", { mainCategoryId, subcategoryId });
//     console.log("URL params:", {
//       id: searchParams.get("id"),
//       type: searchParams.get("type"),
//       category: searchParams.get("category")
//     });

//     if (mainCategoryId) {
//       console.log("Calling loadBrandsForCategory with:", { mainCategoryId, subcategoryId });
//       loadBrandsForCategory(mainCategoryId, subcategoryId);
//     } else {
//       console.log("No mainCategoryId found, not loading brands");
//     }
//   }, [searchParams.get("id"), searchParams.get("type"), Category]);

//   // Toggle sidebar for responsive design
//   const toggleSidebar = (): void => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Navigate to a subcategory page
//   const CategoryLink = (
//     categoryId: string,
//     categoryName: string,
//     slug?: string
//   ): void => {
//     console.log("CategoryLink clicked:", { categoryId, categoryName, slug });

//     const encodedCategoryId = window.btoa(categoryId);
//     const path = `/category/${slug}?id=${encodedCategoryId}&type=${encodeURIComponent(
//       categoryName
//     )}`;

//     console.log("Navigating to:", path);
//     router.push(path);

//     // Clear selected brands when changing category/subcategory
//     setSelectedBrands([]);

//     // Close sidebar on mobile after navigation
//     if (window.innerWidth < 992) {
//       setSidebarOpen(false);
//     }
//   };

//   // Load brands for selected category - REAL API IMPLEMENTATION
//   const loadBrandsForCategory = async (categoryId: string, subcategoryId?: string): Promise<void> => {
//     setIsLoadingBrands(true);

//     try {
//       // Build API URL with category and subcategory as query parameters
//       let apiUrl = `${API.CATEGORY_BRAND}?category=${categoryId}`;

//       if (subcategoryId && subcategoryId !== 'undefined') {
//         apiUrl += `&subcategoryId=${subcategoryId}`;
//       }

//       console.log("Loading brands from API:", apiUrl);
//       console.log("Category ID:", categoryId);
//       console.log("Subcategory ID:", subcategoryId || "None");

//       const response = await GET(apiUrl);

//       if (response?.status && response?.data) {
//         // Map the API response to our Brand interface
//         const mappedBrands: Brand[] = response.data.map((brand: any) => ({
//           _id: brand.id,
//           name: brand.name,
//           count: brand.count || undefined
//         }));

//         setBrands(mappedBrands);
//         console.log("Brands loaded successfully:", mappedBrands.length, "brands");
//         console.log("Brand data:", mappedBrands);
//       } else {
//         setBrands([]);
//         console.log("No brands found in response");
//       }

//     } catch (error) {
//       console.error('Error loading brands:', error);
//       setBrands([]);
//     } finally {
//       setIsLoadingBrands(false);
//     }
//   };

//   // Toggle category expansion
//   const toggleCategory = (idx: number): void => {
//     setExpandedCategories((prev) => (prev.includes(idx) ? [] : [idx]));
//   };

//   // Handle brand selection
//   const handleBrandSelection = (brandId: string): void => {
//     setSelectedBrands(prev => {
//       if (prev.includes(brandId)) {
//         return prev.filter(id => id !== brandId);
//       } else {
//         return [...prev, brandId];
//       }
//     });
//   };

//   // Get the active subcategory ID from URL
//   const getActiveId = (): string => {
//     try {
//       const id = searchParams.get("id");
//       return id ? window.atob(id) : "";
//     } catch (e) {
//       console.error("Invalid base64 id:", e);
//       return "";
//     }
//   };

//   // Price Range Handlers
//   const handleMinSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
//     e.preventDefault();
//     setIsDraggingMin(true);
//     updateMinPrice(e);
//   };

//   const handleMaxSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
//     e.preventDefault();
//     setIsDraggingMax(true);
//     updateMaxPrice(e);
//   };

//   const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
//     if (isDraggingMin) {
//       updateMinPrice(e);
//     } else if (isDraggingMax) {
//       updateMaxPrice(e);
//     }
//   };

//   const handleSliderMouseUp = (): void => {
//     setIsDraggingMin(false);
//     setIsDraggingMax(false);
//   };

//   const updateMinPrice = (e: React.MouseEvent<HTMLDivElement> | MouseEvent): void => {
//     if (!progressBarRef.current) return;

//     const rect = progressBarRef.current.getBoundingClientRect();
//     let offsetX = e.clientX - rect.left;
//     offsetX = Math.max(0, Math.min(offsetX, rect.width));
//     const percentage = (offsetX / rect.width) * 100;

//     const newMinPrice = Math.round((percentage / 100) * 741362);

//     if (newMinPrice <= maxPrice) {
//       setMinPrice(newMinPrice);
//       setPriceRange(prev => ({ ...prev, min: newMinPrice }));
//     }
//   };

//   const updateMaxPrice = (e: React.MouseEvent<HTMLDivElement> | MouseEvent): void => {
//     if (!progressBarRef.current) return;

//     const rect = progressBarRef.current.getBoundingClientRect();
//     let offsetX = e.clientX - rect.left;
//     offsetX = Math.max(0, Math.min(offsetX, rect.width));
//     const percentage = (offsetX / rect.width) * 100;

//     const newMaxPrice = Math.round((percentage / 100) * 741362);

//     if (newMaxPrice >= minPrice) {
//       setMaxPrice(newMaxPrice);
//       setPriceRange(prev => ({ ...prev, max: newMaxPrice }));
//     }
//   };

//   // Handle manual input changes
//   const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const value = parseInt(e.target.value) || 0;
//     if (value <= maxPrice && value >= 0) {
//       setMinPrice(value);
//       setPriceRange(prev => ({ ...prev, min: value }));
//     }
//   };

//   const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const value = parseInt(e.target.value) || 741362;
//     if (value >= minPrice && value <= 741362) {
//       setMaxPrice(value);
//       setPriceRange(prev => ({ ...prev, max: value }));
//     }
//   };

//   // Filter function to be called when FILTER button is clicked
//   const handleFilter = (): void => {
//     console.log(`Applying filters:`);
//     console.log(`Price range: ${priceRange.min} - ${priceRange.max} AED`);
//     console.log(`Selected brands:`, selectedBrands);

//     // Update URL params to trigger a product refetch
//     const currentParams = new URLSearchParams(searchParams.toString());
//     currentParams.set('minPrice', priceRange.min.toString());
//     currentParams.set('maxPrice', priceRange.max.toString());

//     if (selectedBrands.length > 0) {
//       currentParams.set('brand', selectedBrands.join(','));
//     } else {
//       currentParams.delete('brand');
//     }

//     // Reset to page 1 when applying filters
//     currentParams.set('page', '1');

//     router.push(`?${currentParams.toString()}`);

//     // Close sidebar on mobile after filtering
//     if (window.innerWidth < 992) {
//       setSidebarOpen(false);
//     }
//   };

//   // Initialize expanded category based on active subcategory
//   useEffect(() => {
//     const activeId = getActiveId();
//     if (activeId) {
//       const parentCategoryIndex = Category.findIndex((category) =>
//         category.sub_categories?.some((subCat) => subCat.id === activeId)  // Changed _id to id
//       );
//       if (
//         parentCategoryIndex !== -1 &&
//         !expandedCategories.includes(parentCategoryIndex)
//       ) {
//         setExpandedCategories([parentCategoryIndex]);
//       }
//     }
//   }, [searchParams, Category, expandedCategories]);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent): void => {
//       if (sidebarOpen && window.innerWidth < 992) {
//         if (
//           sidebarRef.current &&
//           !sidebarRef.current.contains(event.target as Node) &&
//           !(event.target as Element).closest(".sidebar-toggle")
//         ) {
//           setSidebarOpen(false);
//         }
//       }
//     };

//     const handleResize = (): void => {
//       if (window.innerWidth >= 992) {
//         setSidebarOpen(true);
//       } else if (!sidebarOpen) {
//         setSidebarOpen(false);
//       }
//     };

//     handleResize();

//     document.addEventListener("mousedown", handleClickOutside);
//     window.addEventListener("resize", handleResize);

//     return (): void => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [sidebarOpen]);

//   // Global mouse listeners for dragging
//   useEffect(() => {
//     const handleGlobalMouseUp = (): void => {
//       setIsDraggingMin(false);
//       setIsDraggingMax(false);
//     };

//     const handleGlobalMouseMove = (e: MouseEvent): void => {
//       if (isDraggingMin && progressBarRef.current) {
//         updateMinPrice(e);
//       } else if (isDraggingMax && progressBarRef.current) {
//         updateMaxPrice(e);
//       }
//     };

//     if (isDraggingMin || isDraggingMax) {
//       window.addEventListener("mouseup", handleGlobalMouseUp);
//       window.addEventListener("mousemove", handleGlobalMouseMove);
//     }

//     return (): void => {
//       window.removeEventListener("mouseup", handleGlobalMouseUp);
//       window.removeEventListener("mousemove", handleGlobalMouseMove);
//     };
//   }, [isDraggingMin, isDraggingMax, minPrice, maxPrice]);

//   return (
//     <div className="sidebar-wrapper">
//       {/* Mobile Sidebar Toggle Button */}
//       <button
//         className="sidebar-toggle"
//         onClick={toggleSidebar}
//         aria-label="Toggle sidebar"
//       >
//         {sidebarOpen ? <FaTimes /> : <FaBars />}
//       </button>

//       <div
//         className={`page-sider ${sidebarOpen ? "open" : ""}`}
//         ref={sidebarRef}
//       >
//         {/* Close button inside sidebar for mobile */}
//         <div className="sidebar-close-btn" onClick={toggleSidebar}>
//           <FaTimes />
//         </div>

//         {/* Stock Status */}
//         <div className="main-sidebar">
//           <div className="stock-section">
//             <h6>Stock status</h6>
//             <div className="stock-buttons">
//               <button>On sale</button>
//               <button>In stock</button>
//             </div>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="category border-top pt-5">
//           <h6>PRODUCT CATEGORIES</h6>
//           <ul className="category-list">
//             {Category?.map((item, idx) => (
//               <li key={idx}>
//                 <div
//                   className={`category-item ${`${searchParams.get("type") === item.name ? "active" : ""
//                     } ${expandedCategories.includes(idx) ? "expanded" : ""}`}`}
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent event bubbling
//                     toggleCategory(idx);

//                     // Navigate to main category page
//                     CategoryLink(item.id, item.name, item.slug);

//                     // Load brands for this category
//                     console.log("Category clicked:", item);
//                     console.log("Category ID:", item.id, "Name:", item.name);
//                     if (item.id) {
//                       loadBrandsForCategory(item.id);
//                     } else {
//                       console.error("Category ID is undefined");
//                     }
//                   }}
//                 >
//                   {item.name}
//                   {item?.sub_categories && item.sub_categories.length > 0 && (
//                     <FaChevronDown className="category-icon" />
//                   )}
//                 </div>
//                 {item?.sub_categories && item.sub_categories.length > 0 && (
//                   <ul
//                     className={`sub-category-list ${expandedCategories.includes(idx) ? "visible" : ""
//                       }`}
//                   >
//                     {item.sub_categories.map((subCat, i) => (
//                       <li
//                         key={i}
//                         className={`sub-category-item ${getActiveId() === subCat.id ? "active" : ""  // Changed _id to id
//                           }`}
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent parent category click

//                           // Navigate to subcategory page
//                           CategoryLink(subCat.id, subCat.name, subCat.slug);

//                           // Also load brands for this subcategory
//                           const mainCategoryId = item.id; // parent category ID
//                           const subcategoryId = subCat.id; // subcategory ID
//                           console.log("Subcategory clicked:", {
//                             mainCategory: item,
//                             subCategory: subCat,
//                             mainCategoryId,
//                             subcategoryId
//                           });
//                           if (mainCategoryId && subcategoryId) {
//                             loadBrandsForCategory(mainCategoryId, subcategoryId);
//                           } else {
//                             console.error("Missing IDs:", { mainCategoryId, subcategoryId });
//                           }
//                         }}
//                       >
//                         <span>{subCat.name}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Species/Brand Filter */}
//         <div className=" border-top pt-5">

//           {/* Brand list */}
//           <div className="r">
//             {isLoadingBrands ? (
//               <div className="loading-brands">Loading brands...</div>
//             ) : brands.length > 0 ? (
//               <ul className="brand-list">
//                 {brands.map((brand) => (
//                   <li key={brand._id} className="brand-item">
//                     <label className="brand-checkbox">
//                       <input
//                         type="checkbox"
//                         checked={selectedBrands.includes(brand._id)}
//                         onChange={() => handleBrandSelection(brand._id)}
//                       />
//                       <span className="brand-name">{brand.name}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="no-brands d-none">No brands available for this category</div>
//             )}
//           </div>

//           {brands.length > 0 && (
//             <Button
//               type="primary" style={{ width: "100%" }} onClick={handleFilter}>
//               FILTER
//             </Button>
//           )}
//         </div>

//         {/* Interactive Price Range Filter */}
//         <div className="progress-section pt-5">
//           <h6>PRICE RANGE</h6>

//           {/* Range Slider */}
//           <div className="price-range-container">
//             <div
//               className="price-range-track"
//               ref={progressBarRef}
//               onMouseMove={handleSliderMouseMove}
//               onMouseUp={handleSliderMouseUp}
//             >
//               {/* Track background */}
//               <div className="range-track-bg"></div>

//               {/* Active range */}
//               <div
//                 className="range-track-active"
//                 style={{
//                   left: `${(minPrice / 741362) * 100}%`,
//                   width: `${((maxPrice - minPrice) / 741362) * 100}%`
//                 }}
//               ></div>

//               {/* Min handle */}
//               <div
//                 className="range-handle range-handle-min"
//                 style={{ left: `${(minPrice / 741362) * 100}%` }}
//                 onMouseDown={handleMinSliderMouseDown}
//               >
//                 <div className="range-handle-inner"></div>
//                 <div className="range-tooltip">{minPrice.toLocaleString()}</div>
//               </div>

//               {/* Max handle */}
//               <div
//                 className="range-handle range-handle-max"
//                 style={{ left: `${(maxPrice / 741362) * 100}%` }}
//                 onMouseDown={handleMaxSliderMouseDown}
//               >
//                 <div className="range-handle-inner"></div>
//                 <div className="range-tooltip">{maxPrice.toLocaleString()}</div>
//               </div>
//             </div>
//           </div>

//           {/* Price Labels */}
//           <div className="price-labels">
//             <span>0</span>
//             <span>185,341</span>
//             <span>370,681</span>
//             <span>556,022</span>
//             <span>741,362</span>
//           </div>

//           {/* Price Inputs */}
//           <div className="price-inputs">
//             <div className="price-input-group">
//               <label>AED</label>
//               <input
//                 type="number"
//                 value={minPrice}
//                 onChange={handleMinPriceInputChange}
//                 className="price-input"
//                 min="0"
//                 max="741362"
//               />
//             </div>
//             <span className="price-separator">-</span>
//             <div className="price-input-group">
//               <input
//                 type="number"
//                 value={maxPrice}
//                 onChange={handleMaxPriceInputChange}
//                 className="price-input"
//                 min="0"
//                 max="741362"
//               />
//             </div>
//           </div>

//           <Button
//             type="primary" style={{ width: "100%" }} onClick={handleFilter}>
//             FILTER
//           </Button>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div className="sidebar-overlay" onClick={toggleSidebar}></div>
//       )}

//       {/* CSS Styles */}
//       <style jsx>{`
//         .species-section {
//           padding: 0;
//           margin-top: 20px;
//           background: #f8f9fa;
//           border-radius: 8px;
//           padding: 20px;
//           border: 1px solid #e9ecef;
//         }

//         .species-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 15px;
//           padding-bottom: 10px;
//           border-bottom: 1px solid #e9ecef;
//         }

//         .species-header h6 {
//           margin: 0;
//           font-weight: 500;
//           color: #495057;
//           font-size: 14px;
//           text-transform: uppercase;
//           font-family: "Inter", sans-serif;
//         }

//         .species-count {
//           background: #6c757d;
//           color: white;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 500;
//           min-width: 24px;
//           text-align: center;
//           font-family: "Inter", sans-serif;
//         }

//         .brand-list-container {
//           max-height: 250px;
//           overflow-y: auto;
//           margin-bottom: 20px;
//           background: white;
//           border-radius: 6px;
//           border: 1px solid #e9ecef;
//         }

//         .brand-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         .brand-item {
//           border-bottom: 1px solid #f1f3f4;
//         }

//         .brand-item:last-child {
//           border-bottom: none;
//         }

//         .brand-checkbox {
//           display: flex;
//           align-items: center;
//           cursor: pointer;
//           padding: 12px 15px;
//           position: relative;
//           font-size: 14px;
//           transition: all 0.2s ease;
//           background: white;
//         }

//         .brand-checkbox:hover {
//           background: #f8f9fa;
//         }

//         .brand-checkbox input[type="checkbox"] {
//           opacity: 0;
//           width: 18px;
//           height: 18px;
//           cursor: pointer;
//           position: absolute;
//           z-index: 1;
//         }

//         .brand-checkbox::before {
//           content: '';
//           width: 18px;
//           height: 18px;
//           border: 2px solid #dee2e6;
//           border-radius: 3px;
//           background: white;
//           margin-right: 12px;
//           transition: all 0.2s ease;
//           flex-shrink: 0;
//         }

//         .brand-checkbox input[type="checkbox"]:checked + .brand-name {
//           color: #8888880;
//           font-weight: 500;
//         }

//         .brand-checkbox:has(input[type="checkbox"]:checked)::before {
//           background: #ff4000;
//           border-color: #ff4000;
//         }

//         .brand-checkbox:has(input[type="checkbox"]:checked)::after {
//           content: "✓";
//           position: absolute;
//           left: 15px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: white;
//           font-size: 12px;
//           font-weight: bold;
//           z-index: 2;
//         }

//         .brand-name {
//           flex: 1;
//           font-size: 14px;
//           color: #495057;
//           font-weight: 400;
//           font-family: "Inter", sans-serif;
//           transition: all 0.2s ease;
//         }

//         .loading-brands {
//           text-align: center;
//           padding: 40px 20px;
//           color: #6c757d;
//           font-style: italic;
//           font-family: "Inter", sans-serif;
//         }

//         .no-brands {
//           text-align: center;
//           padding: 40px 20px;
//           color: #adb5bd;
//           font-style: italic;
//           font-size: 13px;
//           font-family: "Inter", sans-serif;
//         }

//         .filter-button {
//           width: 100%;
//           padding: 12px 20px;
//           background: #e9ecef;
//           color: #495057;
//           border: 1px solid #ced4da;
//           border-radius: 6px;
//           font-size: 13px;
//           font-weight: 600;
//           cursor: pointer;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           font-family: "Inter", sans-serif;
//           transition: all 0.2s ease;
//         }

//         .filter-button:hover {
//           background: #dee2e6;
//           border-color: #adb5bd;
//           transform: translateY(-1px);
//         }

//         .filter-button:active {
//           transform: translateY(0);
//         }

//         /* Price Range Styles */
//         .progress-section h6 {
//           margin: 0 0 20px 0;
//           font-weight: normal;
//           color: #000;
//           font-size: 14px;
//           text-transform: uppercase;
//         }

//         .price-range-container {
//           position: relative;
//           height: 40px;
//           margin: 20px 0;
//         }

//         .price-range-track {
//           position: relative;
//           height: 4px;
//           top: 18px;
//           background: #ddd;
//           cursor: pointer;
//         }

//         .range-track-bg {
//           width: 100%;
//           height: 100%;
//           background: #ddd;
//         }

//         .range-track-active {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           background: #ff4444;
//         }

//         .range-handle {
//           position: absolute;
//           top: -6px;
//           width: 16px;
//           height: 16px;
//           cursor: pointer;
//           z-index: 2;
//         }

//         .range-handle-inner {
//           width: 100%;
//           height: 100%;
//           background: #ff4444;
//           border: 2px solid white;
//           border-radius: 50%;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.3);
//         }

//         .range-tooltip {
//           position: absolute;
//           top: -30px;
//           left: 50%;
//           transform: translateX(-50%);
//           background: #000;
//           color: white;
//           padding: 3px 6px;
//           font-size: 10px;
//           white-space: nowrap;
//           opacity: 0;
//           transition: opacity 0.2s;
//         }

//         .range-handle:hover .range-tooltip {
//           opacity: 1;
//         }

//         .price-labels {
//           display: flex;
//           justify-content: space-between;
//           font-size: 10px;
//           color: #666;
//           margin-top: 10px;
//         }

//         .price-inputs {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin: 20px 0;
//         }

//         .price-input-group {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           border: 1px solid #ddd;
//           padding: 5px 8px;
//           flex: 1;
//         }

//         .price-input-group label {
//           font-size: 12px;
//           color: #000;
//           font-weight: normal;
//         }

//         .price-input {
//           border: none;
//           outline: none;
//           font-size: 12px;
//           background: transparent;
//           width: 100%;
//           text-align: right;
//         }

//         .price-separator {
//           color: #000;
//           font-weight: normal;
//           padding: 0 5px;
//         }

//         /* Category Styles */
//         .category h6 {
//           color: #262941;
//           font-family: "DMSans-Medium", sans-serif;
//           font-weight: 500;
//         }

//         .category-item {
//           color: #262941;
//           font-family: "DMSans-Regular", sans-serif;
//           transition: color 0.3s ease;
//           cursor: pointer;
//           padding: 8px 0;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .category-item:hover {
//           color: #ff4000;
//         }

//         .category-item.active {
//           color: #ff4000;
//           font-family: "DMSans-Medium", sans-serif;
//         }

//         .category-icon {
//           transition: transform 0.3s ease;
//         }

//         .category-item.expanded .category-icon {
//           transform: rotate(180deg);
//         }

//         .sub-category-list {
//           list-style: none;
//           padding-left: 20px;
//           margin: 0;
//           max-height: 0;
//           overflow: hidden;
//           transition: max-height 0.3s ease;
//         }

//         .sub-category-list.visible {
//           max-height: 500px;
//         }

//         .sub-category-item {
//           color: #888c99;
//           font-family: "DMSans-Regular", sans-serif;
//           transition: color 0.3s ease;
//           cursor: pointer;
//           padding: 5px 0;
//         }

//         .sub-category-item:hover {
//           color: #ff4000;
//         }

//         .sub-category-item.active {
//           color: #ff4000;
//           font-family: "DMSans-Medium", sans-serif;
//         }

//         /* Stock Section */
//         .stock-section h6 {
//           color: #262941;
//           font-family: "DMSans-Medium", sans-serif;
//           font-weight: 500;
//           margin-bottom: 15px;
//         }

//         .stock-buttons {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//         }

//         .stock-buttons button {
//           background: #f7f7f7;
//           color: #262941;
//           border: 1px solid #d9d9d9;
//           padding: 8px 15px;
//           border-radius: 4px;
//           font-family: "DMSans-Regular", sans-serif;
//           font-size: 14px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .stock-buttons button:hover {
//           background: #ff4000;
//           color: #ffffff;
//           border-color: #ff4000;
//         }

//         /* Mobile Styles */
//         .sidebar-toggle {
//           display: none;
//           position: fixed;
//           top: 20px;
//           left: 20px;
//           z-index: 1000;
//           background: #262941;
//           color: white;
//           border: none;
//           padding: 10px;
//           border-radius: 4px;
//           cursor: pointer;
//         }

//         .sidebar-close-btn {
//           display: none;
//           position: absolute;
//           top: 15px;
//           right: 15px;
//           cursor: pointer;
//           color: #262941;
//           font-size: 18px;
//         }

//         .sidebar-overlay {
//           display: none;
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0,0,0,0.5);
//           z-index: 998;
//         }

//         /* Scrollbar styles */
//         .brand-list-container::-webkit-scrollbar {
//           width: 4px;
//         }

//         .brand-list-container::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }

//         .brand-list-container::-webkit-scrollbar-thumb {
//           background: #ccc;
//         }

//         .brand-list-container::-webkit-scrollbar-thumb:hover {
//           background: #999;
//         }

//         /* Responsive adjustments */
//         @media (max-width: 991px) {
//           .sidebar-toggle {
//             display: block;
//           }

//           .page-sider {
//             position: fixed;
//             top: 0;
//             left: -100%;
//             width: 300px;
//             height: 100vh;
//             background: white;
//             z-index: 999;
//             overflow-y: auto;
//             transition: left 0.3s ease;
//             padding: 20px;
//           }

//           .page-sider.open {
//             left: 0;
//           }

//           .sidebar-close-btn {
//             display: block;
//           }

//           .sidebar-overlay {
//             display: block;
//           }

//           .brand-list-container {
//             max-height: 150px;
//           }
//         }

//         @media (max-width: 768px) {
//           .page-sider {
//             width: 280px;
//           }

//           .sidebar-toggle {
//             top: 15px;
//             left: 15px;
//             padding: 8px;
//           }
//         }

//         /* Border and spacing utilities */
//         .border-top {
//           border-top: 1px solid #e9ecef;
//         }

//         .pt-5 {
//           padding-top: 2rem;
//         }

//         /* Sidebar wrapper */
//         .sidebar-wrapper {
//           position: relative;
//         }

//         .main-sidebar {
//           padding: 20px 0;
//         }

//         .category {
//           padding: 20px 0;
//         }

//         .category-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         .category-list > li {
//           margin-bottom: 5px;
//         }

//         /* Enhanced focus states for accessibility */
//         .brand-checkbox input[type="checkbox"]:focus {
//           outline: 2px solid #ff4000;
//           outline-offset: 2px;
//         }

//         .filter-button:focus {
//           outline: 2px solid #ff4000;
//           outline-offset: 2px;
//         }

//         .price-input:focus {
//           outline: 1px solid #ff4000;
//         }

//         /* Loading and empty states */
//         .loading-brands,
//         .no-brands {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 60px;
//         }

//         /* Improved button states */
//         .filter-button:active {
//           transform: translateY(1px);
//         }

//         .filter-button:disabled {
//           background: #ccc;
//           cursor: not-allowed;
//         }

//         /* Enhanced mobile experience */
//         @media (max-width: 480px) {
//           .page-sider {
//             width: 100vw;
//             left: -100vw;
//           }

//           .price-inputs {
//             flex-direction: column;
//             gap: 15px;
//           }

//           .price-separator {
//             display: none;
//           }

//           .price-input-group {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PageSider;

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { GET } from "@/util/apicall";
import API from "@/config/API";
import { Button } from "antd";

// Define TypeScript interfaces for our data
interface SubCategory {
  id: string;
  _id: string; // Support both id and _id fields
  name: string;
  slug: string;
}

interface CategoryItem {
  id: string;
  _id: string; // Support both id and _id fields
  name: string;
  slug?: string;
  sub_categories?: SubCategory[];
}

interface Brand {
  _id: string;
  name: string;
  count?: number;
}

interface RootState {
  Category: {
    categries: CategoryItem[];
  };
}

const PageSider: React.FC = () => {
  const searchParams = useSearchParams();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const Category = useSelector((state: RootState) => state.Category.categries);

  // State variables
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Price range states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(741362);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 741362,
  });
  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

  // Brand filter states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(false);

  // Get current category ID for brand loading
  const getCategoryId = (): string => {
    try {
      const id = searchParams.get("id");
      return id ? window.atob(id) : "";
    } catch (e) {
      console.error("Invalid base64 id:", e);
      return "";
    }
  };

  // Get main category ID for API calls
  const getMainCategoryId = (): string => {
    // First try to get from URL params (direct category ID)
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      console.log("Found category from URL param:", categoryParam);
      return categoryParam;
    }

    // Get the current ID from URL (could be main category or subcategory)
    const currentId = getCategoryId();
    const type = searchParams.get("type");

    console.log("Looking for category by type and ID:", { type, currentId });

    if (Category && Category.length > 0) {
      // First, check if currentId is a main category (support both id and _id)
      const mainCategory = Category.find(
        (cat) => (cat.id || cat._id) === currentId
      );
      if (mainCategory) {
        const catId = mainCategory.id || mainCategory._id;
        console.log("Found main category by ID:", catId, mainCategory.name);
        return catId;
      }

      // If not found as main category, search in subcategories to find parent
      for (const category of Category) {
        if (category.sub_categories) {
          const foundSubCategory = category.sub_categories.find((subCat) => {
            const subCatId = subCat.id || subCat._id;
            return subCatId === currentId;
          });
          if (foundSubCategory) {
            const catId = category.id || category._id;
            console.log(
              "Found subcategory, returning parent category:",
              catId,
              category.name
            );
            return catId; // Return parent category ID
          }
        }
      }

      // Fallback: try to find by category name/type
      if (type) {
        const categoryByName = Category.find((cat) => cat.name === type);
        if (categoryByName) {
          const catId = categoryByName.id || categoryByName._id;
          console.log("Found category by name:", catId, categoryByName.name);
          return catId;
        }
      }
    }

    console.log("No category found");
    return "";
  };

  // Initialize filter states from URL parameters
  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlBrands = searchParams.get("brand");

    if (urlMinPrice) {
      const min = parseInt(urlMinPrice);
      setMinPrice(min);
      setPriceRange((prev) => ({ ...prev, min }));
    }

    if (urlMaxPrice) {
      const max = parseInt(urlMaxPrice);
      setMaxPrice(max);
      setPriceRange((prev) => ({ ...prev, max }));
    }

    if (urlBrands) {
      setSelectedBrands(urlBrands.split(","));
    }
  }, []);

  // Load brands for selected category - ONLY CATEGORY ID
  // const loadBrandsForCategory = async (categoryId: string): Promise<void> => {
  //   setIsLoadingBrands(true);

  //   try {
  //     // Build API URL with only category parameter
  //     const apiUrl = `${API.CATEGORY_BRAND}?categoryId=${categoryId}`;

  //     console.log("Loading brands from API:", apiUrl);
  //     console.log("Category ID:", categoryId);

  //     const response = await GET(apiUrl);

  //     if (response?.status && response?.data) {
  //       // Map the API response to our Brand interface
  //       const mappedBrands: Brand[] = response.data.map((brand: any) => ({
  //         _id: brand.id,
  //         name: brand.name,
  //         count: brand.count || undefined,
  //       }));

  //       setBrands(mappedBrands);
  //       console.log(
  //         "Brands loaded successfully:",
  //         mappedBrands.length,
  //         "brands"
  //       );
  //       console.log("Brand data:", mappedBrands);
  //     } else {
  //       setBrands([]);
  //       console.log("No brands found in response");
  //     }
  //   } catch (error) {
  //     console.error("Error loading brands:", error);
  //     setBrands([]);
  //   } finally {
  //     setIsLoadingBrands(false);
  //   }
  // };

  // Load brands when category changes (on page load)
  // useEffect(() => {
  //   const mainCategoryId = getMainCategoryId();

  //   console.log("Page loaded - checking for category:", mainCategoryId);

  //   // Only call if we have a valid category
  //   if (mainCategoryId) {
  //     console.log("Loading brands for category on page load:", mainCategoryId);
  //     loadBrandsForCategory(mainCategoryId);
  //   }
  // }, [searchParams.get("id"), searchParams.get("type"), Category]);

  // Toggle sidebar for responsive design
  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigate to a subcategory page
  const CategoryLink = (
    categoryId: string,
    categoryName: string,
    slug?: string
  ): void => {
    console.log("CategoryLink clicked:", { categoryId, categoryName, slug });

    const encodedCategoryId = window.btoa(categoryId);
    // Use categoryName as fallback if slug is undefined
    const categorySlug =
      slug || categoryName.toLowerCase().replace(/\s+/g, "-");
    const path = `/category/${categorySlug}?id=${encodedCategoryId}&type=${encodeURIComponent(
      categoryName
    )}`;

    console.log("Navigating to:", path);
    router.push(path);

    // Clear selected brands when changing category/subcategory
    setSelectedBrands([]);

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  // Toggle category expansion - Allow multiple categories to be expanded
  const toggleCategory = (idx: number): void => {
    setExpandedCategories(
      (prev) =>
        prev.includes(idx)
          ? prev.filter((index) => index !== idx) // Remove from expanded if already expanded
          : [...prev, idx] // Add to expanded if not already expanded
    );
  };

  // Handle brand selection
  const handleBrandSelection = (brandId: string): void => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  // Get the active subcategory ID from URL
  const getActiveId = (): string => {
    try {
      const id = searchParams.get("id");
      return id ? window.atob(id) : "";
    } catch (e) {
      console.error("Invalid base64 id:", e);
      return "";
    }
  };

  // Price Range Handlers
  const handleMinSliderMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();
    setIsDraggingMin(true);
    updateMinPrice(e);
  };

  const handleMaxSliderMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();
    setIsDraggingMax(true);
    updateMaxPrice(e);
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isDraggingMin) {
      updateMinPrice(e);
    } else if (isDraggingMax) {
      updateMaxPrice(e);
    }
  };

  const handleSliderMouseUp = (): void => {
    setIsDraggingMin(false);
    setIsDraggingMax(false);
  };

  const updateMinPrice = (
    e: React.MouseEvent<HTMLDivElement> | MouseEvent
  ): void => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;

    const newMinPrice = Math.round((percentage / 100) * 741362);

    if (newMinPrice <= maxPrice) {
      setMinPrice(newMinPrice);
      setPriceRange((prev) => ({ ...prev, min: newMinPrice }));
    }
  };

  const updateMaxPrice = (
    e: React.MouseEvent<HTMLDivElement> | MouseEvent
  ): void => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;

    const newMaxPrice = Math.round((percentage / 100) * 741362);

    if (newMaxPrice >= minPrice) {
      setMaxPrice(newMaxPrice);
      setPriceRange((prev) => ({ ...prev, max: newMaxPrice }));
    }
  };

  // Handle manual input changes
  const handleMinPriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value) || 0;
    if (value <= maxPrice && value >= 0) {
      setMinPrice(value);
      setPriceRange((prev) => ({ ...prev, min: value }));
    }
  };

  const handleMaxPriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value) || 741362;
    if (value >= minPrice && value <= 741362) {
      setMaxPrice(value);
      setPriceRange((prev) => ({ ...prev, max: value }));
    }
  };

  // Filter function to be called when FILTER button is clicked
  const handleFilter = (): void => {
    console.log(`Applying filters:`);
    console.log(`Price range: ${priceRange.min} - ${priceRange.max} AED`);
    console.log(`Selected brands:`, selectedBrands);

    // Update URL params to trigger a product refetch
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("minPrice", priceRange.min.toString());
    currentParams.set("maxPrice", priceRange.max.toString());

    if (selectedBrands.length > 0) {
      currentParams.set("brand", selectedBrands.join(","));
    } else {
      currentParams.delete("brand");
    }

    // Reset to page 1 when applying filters
    currentParams.set("page", "1");

    router.push(`?${currentParams.toString()}`);

    // Close sidebar on mobile after filtering
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  // Initialize expanded category based on active subcategory
  useEffect(() => {
    const activeId = getActiveId();
    if (activeId && Category && Category.length > 0) {
      const parentCategoryIndex = Category.findIndex((category) =>
        category.sub_categories?.some((subCat) => {
          const subCatId = subCat.id || subCat._id;
          return subCatId === activeId;
        })
      );
      if (parentCategoryIndex !== -1) {
        setExpandedCategories((prev) => {
          // Only add if not already in the list to prevent infinite loops
          return prev.includes(parentCategoryIndex)
            ? prev
            : [...prev, parentCategoryIndex];
        });
      }
    }
  }, [searchParams, Category]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (sidebarOpen && window.innerWidth < 992) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest(".sidebar-toggle")
        ) {
          setSidebarOpen(false);
        }
      }
    };

    const handleResize = (): void => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else if (!sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    handleResize();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [sidebarOpen]);

  // Global mouse listeners for dragging
  useEffect(() => {
    const handleGlobalMouseUp = (): void => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent): void => {
      if (isDraggingMin && progressBarRef.current) {
        updateMinPrice(e);
      } else if (isDraggingMax && progressBarRef.current) {
        updateMaxPrice(e);
      }
    };

    if (isDraggingMin || isDraggingMax) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }

    return (): void => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDraggingMin, isDraggingMax, minPrice, maxPrice]);

  return (
    <>
      <div className="sidebar-wrapper">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`page-sider ${sidebarOpen ? "open" : ""}`}
          ref={sidebarRef}
        >
          {/* Close button inside sidebar for mobile */}
          <div className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </div>

          {/* Stock Status */}
          <div className="main-sidebar">
            <div className="stock-section">
              <h6>Stock status</h6>
              <div className="stock-buttons">
                <button>On sale</button>
                <button>In stock</button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="category border-top pt-5">
            <h6>PRODUCT CATEGORIES</h6>
            <ul className="category-list">
              {Category?.map((item, idx) => (
                <li key={idx}>
                  <div
                    className={`category-item ${
                      searchParams.get("type") === item.name ? "active" : ""
                    } ${expandedCategories.includes(idx) ? "expanded" : ""}`}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();

                        // Navigate to main category page
                        const catId = item.id || item._id;
                        CategoryLink(catId, item.name, item.slug);

                        // Load brands for this main category
                        console.log("Main category clicked:", item);
                        console.log("Category ID:", catId, "Name:", item.name);
                        if (catId) {
                          // Call brands API with only category ID
                          // loadBrandsForCategory(catId);
                        } else {
                          console.error("Category ID is undefined");
                        }
                      }}
                      style={{ cursor: "pointer", flex: 1 }}
                    >
                      {item.name}
                    </span>
                    {item?.sub_categories && item.sub_categories.length > 0 && (
                      <FaChevronDown
                        className={`expand-icon ${
                          expandedCategories.includes(idx) ? "rotated" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(idx);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                  {item?.sub_categories && item.sub_categories.length > 0 && (
                    <ul
                      className={`sub-category-list ${
                        expandedCategories.includes(idx) ? "visible" : ""
                      }`}
                    >
                      {item.sub_categories.map((subCat, i) => (
                        <li
                          key={i}
                          className={`sub-category-item ${
                            getActiveId() === (subCat.id || subCat._id)
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();

                            // Navigate to subcategory page
                            const subCatId = subCat.id || subCat._id;
                            const mainCatId = item.id || item._id;

                            // Create URL with both main category and subcategory info
                            const encodedSubCategoryId = window.btoa(subCatId);
                            const subCategorySlug =
                              subCat.slug ||
                              subCat.name.toLowerCase().replace(/\s+/g, "-");
                            const path = `/category/${subCategorySlug}?id=${encodedSubCategoryId}&ogCategory=${mainCatId}&type=${encodeURIComponent(
                              subCat.name
                            )}`;

                            console.log("Navigating to subcategory:", path);
                            router.push(path);

                            // Load brands for the main category (not subcategory)
                            const mainCategoryId = item.id || item._id;
                            console.log("Subcategory clicked:", {
                              mainCategory: item,
                              subCategory: subCat,
                              mainCategoryId,
                            });
                            if (mainCategoryId) {
                              // Call brands API with only main category ID
                              // loadBrandsForCategory(mainCategoryId);
                            } else {
                              console.error("Missing main category ID");
                            }
                          }}
                        >
                          <span>{subCat.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Species/Brand Filter */}
          <div className="border-top pt-5">
            {/* Brand list */}
            <div className="r">
              {isLoadingBrands ? (
                <div className="loading-brands">Loading brands...</div>
              ) : brands.length > 0 ? (
                <ul className="brand-list mb-2">
                  {brands.map((brand) => (
                    <li key={brand._id} className="brand-item">
                      <label className="brand-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand._id)}
                          onChange={() => handleBrandSelection(brand._id)}
                        />
                        <span className="brand-name">{brand.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-brands d-none">
                  No brands available for this category
                </div>
              )}
            </div>

            {brands.length > 0 && (
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={handleFilter}
              >
                FILTER
              </Button>
            )}
          </div>

          {/* Interactive Price Range Filter */}
          <div className="progress-section pt-5">
            <h6>PRICE RANGE</h6>

            {/* Range Slider */}
            <div className="price-range-container">
              <div
                className="price-range-track"
                ref={progressBarRef}
                onMouseMove={handleSliderMouseMove}
                onMouseUp={handleSliderMouseUp}
              >
                {/* Track background */}
                <div className="range-track-bg"></div>

                {/* Active range */}
                <div
                  className="range-track-active"
                  style={{
                    left: `${(minPrice / 741362) * 100}%`,
                    width: `${((maxPrice - minPrice) / 741362) * 100}%`,
                  }}
                ></div>

                {/* Min handle */}
                <div
                  className="range-handle range-handle-min"
                  style={{ left: `${(minPrice / 741362) * 100}%` }}
                  onMouseDown={handleMinSliderMouseDown}
                >
                  <div className="range-handle-inner"></div>
                  <div className="range-tooltip">
                    {minPrice.toLocaleString()}
                  </div>
                </div>

                {/* Max handle */}
                <div
                  className="range-handle range-handle-max"
                  style={{ left: `${(maxPrice / 741362) * 100}%` }}
                  onMouseDown={handleMaxSliderMouseDown}
                >
                  <div className="range-handle-inner"></div>
                  <div className="range-tooltip">
                    {maxPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Labels */}
            <div className="price-labels">
              <span>0</span>
              <span>185,341</span>
              <span>370,681</span>
              <span>556,022</span>
              <span>741,362</span>
            </div>

            {/* Price Inputs */}
            <div className="price-inputs">
              <div className="price-input-group">
                <label>AED</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceInputChange}
                  className="price-input"
                  min="0"
                  max="741362"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceInputChange}
                  className="price-input"
                  min="0"
                  max="741362"
                />
              </div>
            </div>

            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleFilter}
            >
              FILTER
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}
      </div>

      <style jsx>{`
        .species-section {
          padding: 0;
          margin-top: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .species-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }

        .species-header h6 {
          margin: 0;
          font-weight: 500;
          color: #495057;
          font-size: 14px;
          text-transform: uppercase;
          font-family: "Inter", sans-serif;
        }

        .species-count {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          min-width: 24px;
          text-align: center;
          font-family: "Inter", sans-serif;
        }

        /* Brand Section Styles */
        .brand-section {
          margin-top: 15px;
        }

        .brand-section h6 {
          color: #262941;
          font-family: "DMSans-Medium", sans-serif;
          font-weight: 500;
          margin-bottom: 15px;
          font-size: 14px;
          text-transform: uppercase;
        }

        .brand-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: white;
        }

        .brand-item {
          border-bottom: 1px solid #f1f3f4;
        }

        .brand-item:last-child {
          border-bottom: none;
        }

        .brand-checkbox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 12px 15px;
          position: relative;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .brand-checkbox:hover {
          background: #f8f9fa;
        }

        .brand-checkbox input[type="checkbox"] {
          opacity: 0;
          width: 18px;
          height: 18px;
          cursor: pointer;
          position: absolute;
          z-index: 1;
          left: 15px;
        }

        .brand-checkbox::before {
          content: "";
          width: 18px;
          height: 18px;
          border: 2px solid #dee2e6;
          border-radius: 3px;
          background: white;
          margin-right: 12px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .brand-checkbox input[type="checkbox"]:checked + .brand-name {
          color: #ff4000;
          font-weight: 500;
        }

        .brand-checkbox:has(input[type="checkbox"]:checked)::before {
          background: #ff4000;
          border-color: #ff4000;
        }

        .brand-checkbox:has(input[type="checkbox"]:checked)::after {
          content: "✓";
          position: absolute;
          left: 19px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
          z-index: 2;
        }

        .brand-name {
          flex: 1;
          font-size: 14px;
          color: #495057;
          font-weight: 400;
          font-family: "Inter", sans-serif;
          transition: all 0.2s ease;
          margin-left: 30px;
        }

        .brand-count {
          font-size: 12px;
          color: #6c757d;
          font-weight: normal;
        }

        .loading-brands {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
          font-style: italic;
          font-family: "Inter", sans-serif;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .no-brands {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .no-brands p {
          margin: 0 0 5px 0;
          font-weight: 500;
        }

        .no-brands small {
          color: #adb5bd;
          font-size: 12px;
        }

        .filter-button {
          width: 100%;
          padding: 12px 20px;
          background: #e9ecef;
          color: #495057;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: "Inter", sans-serif;
          transition: all 0.2s ease;
        }

        .filter-button:hover {
          background: #dee2e6;
          border-color: #adb5bd;
          transform: translateY(-1px);
        }

        .filter-button:active {
          transform: translateY(0);
        }

        /* Price Range Styles */
        .progress-section h6 {
          margin: 0 0 20px 0;
          font-weight: normal;
          color: #000;
          font-size: 14px;
          text-transform: uppercase;
        }

        .price-range-container {
          position: relative;
          height: 40px;
          margin: 20px 0;
        }

        .price-range-track {
          position: relative;
          height: 4px;
          top: 18px;
          background: #ddd;
          cursor: pointer;
        }

        .range-track-bg {
          width: 100%;
          height: 100%;
          background: #ddd;
        }

        .range-track-active {
          position: absolute;
          top: 0;
          height: 100%;
          background: #ff4444;
        }

        .range-handle {
          position: absolute;
          top: -6px;
          width: 16px;
          height: 16px;
          cursor: pointer;
          z-index: 2;
        }

        .range-handle-inner {
          width: 100%;
          height: 100%;
          background: #ff4444;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .range-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          color: white;
          padding: 3px 6px;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .range-handle:hover .range-tooltip {
          opacity: 1;
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
          margin-top: 10px;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
        }

        .price-input-group {
          display: flex;
          align-items: center;
          gap: 5px;
          border: 1px solid #ddd;
          padding: 5px 8px;
          flex: 1;
        }

        .price-input-group label {
          font-size: 12px;
          color: #000;
          font-weight: normal;
        }

        .price-input {
          border: none;
          outline: none;
          font-size: 12px;
          background: transparent;
          width: 100%;
          text-align: right;
        }

        .price-separator {
          color: #000;
          font-weight: normal;
          padding: 0 5px;
        }

        /* Category Styles */
        .category h6 {
          color: #262941;
          font-family: "DMSans-Medium", sans-serif;
          font-weight: 500;
        }

        .category-item {
          color: #262941;
          font-family: "DMSans-Regular", sans-serif;
          transition: color 0.3s ease;
          cursor: pointer;
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-item:hover {
          color: #ff4000;
        }

        .category-item.active {
          color: #ff4000;
          font-family: "DMSans-Medium", sans-serif;
        }

        .category-icon {
          transition: transform 0.3s ease;
        }

        .category-item.expanded .category-icon {
          transform: rotate(180deg);
        }

        .sub-category-list {
          list-style: none;
          padding-left: 20px;
          margin: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .sub-category-list.visible {
          max-height: 500px;
        }

        .sub-category-item {
          color: #888c99;
          font-family: "DMSans-Regular", sans-serif;
          transition: color 0.3s ease;
          cursor: pointer;
          padding: 5px 0;
        }

        .sub-category-item:hover {
          color: #ff4000;
        }

        .sub-category-item.active {
          color: #ff4000;
          font-family: "DMSans-Medium", sans-serif;
        }

        /* Stock Section */
        .stock-section h6 {
          color: #262941;
          font-family: "DMSans-Medium", sans-serif;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .stock-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stock-buttons button {
          background: #f7f7f7;
          color: #262941;
          border: 1px solid #d9d9d9;
          padding: 8px 15px;
          border-radius: 4px;
          font-family: "DMSans-Regular", sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .stock-buttons button:hover {
          background: #ff4000;
          color: #ffffff;
          border-color: #ff4000;
        }

        /* Mobile Styles */
        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: #262941;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
        }

        .sidebar-close-btn {
          display: none;
          position: absolute;
          top: 15px;
          right: 15px;
          cursor: pointer;
          color: #262941;
          font-size: 18px;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }

        /* Scrollbar styles */
        .brand-list-container::-webkit-scrollbar {
          width: 4px;
        }

        .brand-list-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .brand-list-container::-webkit-scrollbar-thumb {
          background: #ccc;
        }

        .brand-list-container::-webkit-scrollbar-thumb:hover {
          background: #999;
        }

        /* Responsive adjustments */
        @media (max-width: 991px) {
          .sidebar-toggle {
            display: block;
          }

          .page-sider {
            position: fixed;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100vh;
            background: white;
            z-index: 999;
            overflow-y: auto;
            transition: left 0.3s ease;
            padding: 20px;
          }

          .page-sider.open {
            left: 0;
          }

          .sidebar-close-btn {
            display: block;
          }

          .sidebar-overlay {
            display: block;
          }

          .brand-list-container {
            max-height: 150px;
          }
        }

        @media (max-width: 768px) {
          .page-sider {
            width: 280px;
          }

          .sidebar-toggle {
            top: 15px;
            left: 15px;
            padding: 8px;
          }
        }

        /* Border and spacing utilities */
        .border-top {
          border-top: 1px solid #e9ecef;
        }

        .pt-5 {
          padding-top: 2rem;
        }

        /* Sidebar wrapper */
        .sidebar-wrapper {
          position: relative;
        }

        .main-sidebar {
          padding: 20px 0;
        }

        .category {
          padding: 20px 0;
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list > li {
          margin-bottom: 5px;
        }

        /* Enhanced focus states for accessibility */
        .brand-checkbox input[type="checkbox"]:focus {
          outline: 2px solid #ff4000;
          outline-offset: 2px;
        }

        .filter-button:focus {
          outline: 2px solid #ff4000;
          outline-offset: 2px;
        }

        .price-input:focus {
          outline: 1px solid #ff4000;
        }

        /* Loading and empty states */
        .loading-brands,
        .no-brands {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }

        /* Improved button states */
        .filter-button:active {
          transform: translateY(1px);
        }

        .filter-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Enhanced mobile experience */
        @media (max-width: 480px) {
          .page-sider {
            width: 100vw;
            left: -100vw;
          }

          .price-inputs {
            flex-direction: column;
            gap: 15px;
          }

          .price-separator {
            display: none;
          }

          .price-input-group {
            width: 100%;
          }
        }

        /* Utility classes */
        .d-none {
          display: none;
        }
      `}</style>
    </>
  );
};

export default PageSider;
