import axios from "axios";
import API from "@/config/API";
import { getSession } from "next-auth/react";

// Interface for category data
interface SubCategory {
  CategoryId: number;
  Id: number;
  Name: string;
  Code: string;
  Description: string;
  Image: string;
}

interface Category {
  Id: number;
  Name: string;
  Code: string;
  Description: string;
  Image: string;
  SubCategories: SubCategory[];
}

interface CategoryResponse {
  status: string;
  statusCode: number;
  message: string;
  result: string; // This is a stringified JSON
}

/**
 * Fetch categories with subcategories from German Standard API
 * @param be - Business entity ID (default: 1)
 * @param category - Category ID (default: 1)
 * @returns Promise with parsed categories data
 */
export const fetchCategoriesWithSubcategories = async (
  be: number = 1,
  category: number = 1
): Promise<any[]> => {
  try {
    // Get the session to check for token
    const session: any = await getSession();
    const token = session?.token;

    const url = `${API.GERMAN_STANDARD_CATEGORIES}?be=${be}&category=${category}`;
    
    const headers: any = {
      "accept": "*/*",
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get<CategoryResponse>(url, { headers });

    if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
      // Parse the nested JSON strings in the response
      const parsedResult = JSON.parse(response.data.result);
      
      if (Array.isArray(parsedResult)) {
        // Further parse the data field which contains the categories
        const categories: Category[] = [];
        
        for (const item of parsedResult) {
          if (item.data) {
            const parsedCategories = JSON.parse(item.data);
            categories.push(...parsedCategories);
          }
        }
        
        // Transform the data to match our existing structure
        return categories.map((cat: any) => ({
          _id: cat.Id?.toString() || "0",
          name: cat.Name || "",
          slug: cat.Code?.toLowerCase().replace(/\s+/g, '-') || "",
          image: cat.Image || "/images/no-image.jpg",
          description: cat.Description || "",
          sub_categories: cat.SubCategories?.map((sub: any) => ({
            _id: sub.Id?.toString() || "0",
            name: sub.Name || "",
            slug: sub.Code?.toLowerCase().replace(/\s+/g, '-') || "",
            image: sub.Image || "/images/no-image.jpg",
            categoryId: sub.CategoryId || cat.Id,
          })) || []
        }));
      }
      
      return [];
    } else {
      console.error("Failed to fetch categories:", response.data?.message);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    
    // Return empty array on error to prevent app crash
    return [];
  }
};

/**
 * Transform category data for Redux store
 * This maintains compatibility with existing code
 */
export const transformCategoryForRedux = (categories: any[]) => {
  return categories.map(cat => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    position: cat.position || 0,
    status: true,
    sub_categories: cat.sub_categories || []
  }));
};