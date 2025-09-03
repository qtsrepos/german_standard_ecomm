import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import API from "@/config/API";

async function page() {
  const session: any = await getServerSession(options);
  if (session?.role == "admin") {
    redirect("/auth/dashboard");
  } else if (session?.role == "seller") {
    const response = await fetch(
      API.BASE_URL + API.CORPORATE_STORE_CHECKSTORE,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token ?? ""}`,
        },
      }
    );
    const data = await response?.json();
    if (data?.data?.status == "approved" && data?.status) {
      redirect("/auth/overview");
    } else {
      redirect(
        `/error?msg${data?.data?.status_remark}&status=${data?.data?.status}`
      );
    }
  } else {
    redirect("/");
  }
}
export default page;
