"use client";
import API from "@/config/API";
import { GET } from "@/util/apicall";
import { notification, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import OrderStatusList from "./components/OrderStatusList";
import OrderImages from "./components/OrderImg";
import BannerHead from "@/app/(screens)/banner_path/page";


const TrackOrder = () => {
  const params = useParams();
  const [order, setOrder] = useState<any>({});
  const [Notifications, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);

  const getOrderDetails = async () => {
    const url = API.ORDER_GETONE_USER + params.id;
    if (params.id) {
      try {
        const response: any = await GET(url);
        if (response?.status) {
          setOrder(response?.data);
        } else {
          Notifications["error"]({
            message: response?.message ?? "",
            description:
              "The order you selected doesn't exist.. please contact admin for more info..",
          });
        }
      } catch (err) {
        Notifications["error"]({
          message: "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, []);
  console.log("sdfghj", order);

  return (
    <>
    <BannerHead head="Track Order" path="/ TRACK ORDER"/>
    <Container  className="mb-5">
      {loading ? <div>loading</div> :
        <div>
          <OrderImages order={order}/>
          {order?.orderStatus?.map((item: any, index: number) => (
          <OrderStatusList item={item} />
          ))}
        </div>
      }
    </Container>
    </>
  )
}
export default TrackOrder