"use client";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "@/config/API";
import { GET } from "@/util/apicall";
import { Skeleton } from "antd";

import Recomandation from "./_components/Recomandation";
import CatItem from "./_components/CatItem";
import { useRouter } from "next/navigation";

function SearchCard(props: any) {
  const Settings = useSelector((state: any) => state?.Settings?.settings);
  const Location = useSelector((state: any) => state?.Location?.location);
  const Category = useSelector((state: any) => state?.Category?.categries);
  const router = useRouter();
  const [text, setText] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  const [recommendation, setRecommendation] = useState<string[]>([]);
  console.log(recommendation,"recommendation")
  const [subRecommandation, setsubRecommandation] = useState<string[]>([]);

  useEffect(() => {
    searchProduct(props?.text);
  }, [props?.text]);

  useEffect(() => {
    getAllSubcategories();
  }, []);

  const getAllSubcategories = async () => {
    const subcategories: string[] = [];
    const category_subcategory: string[] = [];
    Category?.forEach((item: any) => {
      category_subcategory.push(item.name);
      item?.sub_categories?.forEach((item: any) => {
        subcategories.push(item);
      });
    });
    setSubCategories(subcategories);
  };

  const searchProduct = async (value: any) => {
    try {
      setText(value);
      filterSubCategories(value);
      if (value?.length > 2) {
        setLoading(true);
        var locaton = `&lattitude=${Number(
          Location?.latitude
        )}&longitude=${Number(Location?.longitude)}&radius=${Settings?.radius}`;
        var url = // API.PRODUCT_SEARCH_AUTOCOMPLETE + 
        "?query=" + value + locaton;
        var respose: any = await GET(url);
        if (respose?.data?.length) {
          setRecommendation(respose?.data);
        }
      } else {
        setRecommendation([]);
      }
      setLoading(false);
    } catch (err) {
      console.log("searchProduct", err);
    }
  };

  const filterSubCategories = async (value: any) => {
    try {
      if (value?.length) {
        const filtered = subCategories.filter(function (str: any) {
          return str?.name?.toLowerCase().includes(value.toLowerCase());
        });
        if (filtered?.length) {
          setsubRecommandation(filtered);
        } else {
          setsubRecommandation([]);
        }
      } else {
        setsubRecommandation([]);
      }
    } catch (error) {
      console.log("filterSubCategories", error);
    }
  };

  return (
    <div>
      {recommendation?.length === 0 && subRecommandation?.length === 0 ? (
        <div></div>
      ) : (
        <div className="search-text1">Suggestions " {text} "</div>
      )}
      {loading ? (
        <div style={{ padding: 10 }}>
          <Skeleton />
        </div>
      ) : null}
      {recommendation?.map((item: any, index: number) => {
        return (
          <div
            key={index}
            onClick={() => {
              props.setText("")
              const productName = encodeURIComponent(
                item?.name.split(" ").join("-")
              );
              router.push(`/search/${productName}`);
            }}
          >
            <Recomandation item={item}  />
          </div>
        );
      })}

      {subRecommandation?.map((item: any, index: number) => {
        return (
          <div
            key={index}
            onClick={() => {
              const productName = encodeURIComponent(
                item?.name.split(" ").join("-")
              );
              router.push(`/search/${productName}`);
            }}
          >
            <CatItem item={item}/>
          </div>
        );
      })}
    </div>
  );
}

export default SearchCard;
