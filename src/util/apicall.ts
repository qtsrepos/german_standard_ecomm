import API from "@/config/API";
import { store } from "@/redux/store/store";
import { message } from "antd";
import { getValidAccessToken } from "./tokenRefresh";
import { signOut } from "next-auth/react";
import { clearReduxData } from "@/lib/clear_redux";

// Helper function to handle API calls with direct logout on 401
const makeApiCall = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  try {
    const token = await getValidAccessToken();
    const response = await fetch(API.BASE_URL + url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
        ...options.headers,
      },
    });

    // If we get a 401, directly log out the user
    if (response.status === 401) {
      console.log("🔒 Access token expired, logging out user...");
      handleTokenExpiration();
      throw new Error("Authentication failed. Please login again.");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Helper function to handle token expiration
const handleTokenExpiration = () => {
  message.warning({
    content: "Your session has expired. Please login again.",
    duration: 2,
    onClose: async () => {
      await signOut({ callbackUrl: "/login" });
      clearReduxData(store.dispatch);
    },
  });
};

const GET = async (
  url: string,
  params: Record<string, any> = {},
  signal: AbortSignal | null = null
) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const URL = queryParams ? url + `?${queryParams}` : url;
    const response = await makeApiCall(URL, {
      ...(signal && { signal }),
      method: "GET",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Something went wrong");
      (error as any).status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const POST = async (
  url: string,
  body: Record<string, any> = {},
  signal: AbortSignal | null = null
) => {
  try {
    const response = await makeApiCall(url, {
      ...(signal && { signal }),
      method: "POST",
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Something went wrong");
      (error as any).status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const PUT = async (
  url: string,
  body: Record<string, any>,
  signal: AbortSignal | null = null
) => {
  try {
    const response = await makeApiCall(url, {
      ...(signal && { signal }),
      method: "PUT",
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Something went wrong");
      (error as any).status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const PATCH = async (
  url: string,
  body: Record<string, any>,
  signal: AbortSignal | null = null
) => {
  try {
    const response = await fetch(API.BASE_URL + url, {
      ...(signal && { signal }),
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Something went wrong");
      (error as any).status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const DELETE = async (url: string, signal: AbortSignal | null = null) => {
  try {
    const response = await makeApiCall(url, {
      ...(signal && { signal }),
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "Something went wrong");
      (error as any).status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
// const COMPRESS_IMAGE = async (file: File) => {
//   try {
//     if (!file) return Promise.reject(new Error("No Image Is selected.."));
//     const formData = new FormData();
//     formData.append("file", file);
//     const response = await fetch(`${API.BASE_URL}${API.IMAGE_COMPRESS}`, {
//       method: "POST",
//       body: formData,
//     });
//     const data = await response.json();
//     if (!response?.ok)
//       return Promise.reject(
//         new Error(data?.message ?? "Something went wrong..")
//       );
//     return { ...data, url: data.Location, status: true };
//   } catch (err: any) {
//     return Promise.reject(new Error(err.message));
//   }
// };
// const DOCUMENT_UPLOAD = async (file: any) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (file) {
//         message.loading({
//           type: "loading",
//           content: "Action in progress..",
//           duration: 1,
//         });
//         const formDataFiles = new FormData();
//         formDataFiles.append("file", file);
//         const fileUpload = await fetch(`${API.BASE_URL}/api/upload/file`, {
//           method: "POST",
//           body: formDataFiles,
//         });
//         if (fileUpload.ok) {
//           const jsonResponse = await fileUpload.text();
//           resolve(jsonResponse);
//         } else {
//           reject("Failed to upload file");
//         }
//       } else {
//         reject("no file selected");
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

export { GET, POST, PUT, PATCH, DELETE, 
  // COMPRESS_IMAGE, DOCUMENT_UPLOAD 
};
