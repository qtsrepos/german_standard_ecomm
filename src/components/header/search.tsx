"use client";
import React, { useEffect, useState, useRef, FocusEvent } from "react";
import { Form, Input, Select } from "antd";
import { IoSearch, IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import SearchCard from "../../app/(screens)/product-search/searchCard";
import { usePathname } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import "./style.scss"
import { useSelector } from "react-redux";

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Animal Food", value: "animal_food" },
  { label: "Fruits", value: "fruits" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Snacks", value: "snacks" },
  { label: "Juice", value: "juice" },
];

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}
interface CategoryItem {
  _id: string;
  name: string;
  slug?: string;
  sub_categories?: SubCategory[];
}
interface RootState {
  Category: {
    categries: CategoryItem[];
  };
}

function SearchBar() {
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const Category = useSelector((state: RootState) => state.Category.categries);
  const router = useRouter();
  const [form] = useForm();
  const { Option, OptGroup } = Select;
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    form.setFieldsValue({ search: "" });
  }, [pathname, form]);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setFieldsValue({ category: value });
  };

  const handleSearch = (values: { search: string; category: string }) => {
    const searchQuery = values.search?.trim();
    const category = values.category || selectedCategory;
    if (!searchQuery) {
      // router.push("/");
       const route =
      searchQuery==""?`/search/${category}`: `/search/${category}/${searchQuery}`
      router.push(route)
    } else {
      const route =
        (category === "all" ? `/search/${searchQuery}` : `/search/${category}/${searchQuery}`)
        
      router.push(route);
    }
    console.log("Search values:", { category, search: searchQuery });
  };

  return (
    <div >
      <Row className="" style={{ marginTop: 10 }}>
        <Form form={form} onFinish={handleSearch}>
          <div className="search-bar"
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <Col md={4} className="d-flex align-items-center" style={{ backgroundColor: "#f3f3f3", height: "45px" }}>
              <Form.Item name="search" className="mb-0" style={{ flex: 1, margin: 0 }}>
                <Input
                  size="large"
                  placeholder="Search for products"
                  defaultValue={""}
                  onFocus={handleFocus}
                  onChange={(e) => form.setFieldsValue({ search: e.target.value })}
                  value={form.getFieldValue("search")}
                  bordered={false}
                  suffix={
                    form.getFieldValue("search") ? (
                      <IoClose
                        onClick={() => {
                          form.setFieldsValue({ search: "" });
                          // router.push("/");
                        }}
                        style={{ cursor: "pointer", marginRight: 10, fontSize: "13px" }}
                      />
                    ) : null
                  }
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px 15px",
                    boxShadow: "none",
                  }}
                />
              </Form.Item>

              <div
                style={{
                  width: "1px",
                  height: "43px",
                  backgroundColor: "#d9d9d9",
                  margin: "0 5px",
                }}
              />
            </Col>
            <Col md={4} className="d-flex align-items-center" style={{
              backgroundColor: "#f3f3f3",
              borderRadius: "0px 20px 20px 0px",
            }}>
              <Form.Item name="category" className="mb-0" style={{
                width: " 100%", margin: 0,
                fontSize: "13px",
                fontWeight: "bold",
              }}>
                {/* <Select
                  value={selectedCategory}
                  options={categories}
                  onChange={handleCategoryChange}
                  size="large"
                  bordered={false}
                  style={{
                    backgroundColor: "#f5f5f5",
                    width: "100%",
                     
                  }}
                  dropdownStyle={{ borderRadius: "8px" }}
                /> */}
                <Select
                  placeholder="Select Category"
                  // onChange={handleChange}
                  size="large"
                  bordered={false}
                  style={{
                    backgroundColor: "#f5f5f5",
                    width: "100%",
                    fontSize:"13px !important"
                     
                  }}
                  dropdownStyle={{ borderRadius: "8px" }}
                >
                  {Category?.map((cat: any) => (
                    <OptGroup key={cat.name} label={cat.name}>
                      {cat.sub_categories.length > 0 ? (
                        cat.sub_categories.map((sub: any) => (
                          <Option value={sub.name}>
                            {sub.name}
                          </Option>
                        ))
                      ) : (
                        <Option value={cat.name}>{cat.name}</Option>
                      )}
                    </OptGroup>
                  ))}
                </Select>
              </Form.Item>
              <button
                type="submit"
                className="btn-search"
              >
                <IoSearch size={23} color="white" />
              </button>
            </Col>
          </div>
          <Col md={4}></Col>
        </Form>

        {/* {form.getFieldValue("search")?.length > 2 && isFocused && (
          <div ref={suggestionsRef} className="Header-search-suggestions">
            <SearchCard
              text={form.getFieldValue("search")}
              setText={(val: any) => form.setFieldsValue({ search: val })}
            />
          </div>
        )} */}
      </Row>
    </div>
  );
}

export default SearchBar;