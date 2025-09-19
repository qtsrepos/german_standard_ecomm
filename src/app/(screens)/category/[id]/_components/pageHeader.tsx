"use client";
import React from "react";
import { Col, Row } from "react-bootstrap";

interface PageHeaderProps {
  plain?: boolean;
  title: any;
  initial?: boolean;
  page?: number;
  meta?: {
    pageCount: number;
    itemCount: number;
  };
  pageSize?: number;
  count?: number;
  type?: "multi" | "single";
  children?: React.ReactNode;
  searchResults?: Array<any>;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <Row className="mx-0">
      <Col sm={6} xs={12} className="ps-md-0">
        <div className="productByCat-PageHeader">
          <div>
            <div className="productByCat-PageHeadertxt1">
              {props?.plain
                ? props?.title
                : `Results for "${props?.title.split('%')}"`}
            </div>
            <div className="productByCat-PageHeadertxt2">
              {props?.initial === false && (
                <>
                  {`${((props?.page || 1) - 1) * (props?.pageSize || 0) + (props?.count || 0)} 
                  of ${props?.meta?.itemCount || 0} 
                  ${props?.type === "multi" ? "Stores" : "Items"}`}
                </>
              )}
            </div>
          </div>
        </div>
      </Col>
      <Col sm={6} xs={12}>
        <div className="productByCat-PageHeaderBox">
          {props?.children}
        </div>
      </Col>
      
      {/* Display search results if available */}
      {props?.searchResults && props.searchResults.length > 0 && (
        <Col xs={12}>
          <div className="search-results-container">
            {props.searchResults.map((item) => (
              <div key={item.id} className="search-result-item">
                {/* Render your search result item here */}
                <h3>{item.name}</h3>
                {/* Add other item details as needed */}
              </div>
            ))}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default PageHeader;