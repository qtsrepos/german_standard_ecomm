import API from "@/config/API";
import { store } from "@/redux/store/store";
import { message } from "antd";
import { getValidAccessToken } from "./tokenRefresh";

const GET = async (
  url: string,
  params: Record<string, any> = {},
  signal: AbortSignal | null = null
) => {
  try {
    const token = await getValidAccessToken();
    const queryParams = new URLSearchParams(params).toString();
    const URL = queryParams ? url + `?${queryParams}` : url;
    const response = await fetch(API.BASE_URL + URL, {
      ...(signal && { signal }),
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
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
    const token = await getValidAccessToken();
    const response = await fetch(API.BASE_URL + url, {
      ...(signal && { signal }),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
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

const PUT = async (
  url: string,
  body: Record<string, any>,
  signal: AbortSignal | null = null
) => {
  try {
    const token = await getValidAccessToken();
    const response = await fetch(API.BASE_URL + url, {
      ...(signal && { signal }),
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
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
    const token = await getValidAccessToken();
    const response = await fetch(API.BASE_URL + url, {
      ...(signal && { signal }),
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
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
const COMPRESS_IMAGE = async (file: File) => {
  try {
    if (!file) return Promise.reject(new Error("No Image Is selected.."));
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API.BASE_URL}${API.IMAGE_COMPRESS}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response?.ok)
      return Promise.reject(
        new Error(data?.message ?? "Something went wrong..")
      );
    return { ...data, url: data.Location, status: true };
  } catch (err: any) {
    return Promise.reject(new Error(err.message));
  }
};
const DOCUMENT_UPLOAD = async (file: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        message.loading({
          type: "loading",
          content: "Action in progress..",
          duration: 1,
        });
        const formDataFiles = new FormData();
        formDataFiles.append("file", file);
        const fileUpload = await fetch(`${API.BASE_URL}${API.FILE_UPLOAD}`, {
          method: "POST",
          body: formDataFiles,
        });
        if (fileUpload.ok) {
          const jsonResponse = await fileUpload.text();
          resolve(jsonResponse);
        } else {
          reject("Failed to upload file");
        }
      } else {
        reject("no file selected");
      }
    } catch (err) {
      reject(err);
    }
  });
};

export { GET, POST, PUT, PATCH, DELETE, COMPRESS_IMAGE, DOCUMENT_UPLOAD };
