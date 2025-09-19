"use client";
import React from "react";
import { Card, Rate, Tag, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: number;
    name: string;
    image: string;
    description: string;
    retail_rate: number;
    averageRating: number;
    totalReviews: number;
    is_vegetarian: boolean;
    slug: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card
      hoverable
      cover={
        <div style={{ height: "200px", position: "relative" }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      }
      actions={[
        <Button type="primary" icon={<ShoppingCartOutlined />} block>
          Add to Cart
        </Button>,
      ]}
    >
      <div>
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">${product.retail_rate.toFixed(2)}</div>
        
        <div className="product-rating">
          <Rate disabled allowHalf defaultValue={product.averageRating} />
          <span className="review-count">({product.totalReviews})</span>
        </div>
        
        {product.is_vegetarian && (
          <Tag color="green" className="veg-tag">
            Vegetarian
          </Tag>
        )}
        
        <p className="product-description">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;