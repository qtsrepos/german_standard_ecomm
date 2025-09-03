

import { Col, Row } from "react-bootstrap"
import "../style.scss"
import Image from "next/image";


const OrderImages = (props:any)=>{

    const pending = props?.order?.orderStatus.some((item: any) => item.status === "pending");
    const out_of_delivery = props?.order?.orderStatus.some((item: any) => item.status === "out_of_delivery");
    const deliverd = props?.order?.orderStatus.some((item: any) => item.status === "deliverd");
    const cancelled = props?.order?.orderStatus.some((item: any) => item.status === "cancelled");

    return(<>
    <div className="image-div mt-5">
        <Row className="d-flex justify-content-center" >
            <Col md={2}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Image alt="german" 
               width={100}
               height={100}
                src={`https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/placed${!pending?"-b&w":""}.png`} />
                <h6>PLACED</h6>
            </div>
            </Col>
            <Col  md={2}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Image
                alt="german" 
                width={100}
                height={100}
                 src={`https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/approved${!pending?"-b&w":""}.png`} />
                <h6>APPROVAL</h6>
            </div>
            </Col >
            <Col  md={2}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Image
                alt="german" 
                width={100}
                height={100}
                 src={`https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/processing${!pending?"-b&w":""}.png`} />
                <h6>PROCESSING</h6>
            </div>
            </Col>
            <Col  md={2}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Image
                alt="german" 
                width={100}
                height={100}
                 src={`https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/shipping${!out_of_delivery?"-b&w":""}.png`} />
                <h6>SHIPPING</h6>
            </div>
            </Col>
            <Col  md={2}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Image
                alt="german" 
                width={100}
                height={100}
                 src={cancelled?"https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/cancel-ani.gif":
                    `https://shop.gsgroup.co/wp-content/plugins/woocommerce-order-tracker/assets/images/deliver${!deliverd?"-b&w":""}.png`} />
                <h6>{cancelled?"CANCELLED":"DELIVERY"}</h6>
            </div>
            </Col>
        </Row>
    </div>
    </>)
}

export default OrderImages