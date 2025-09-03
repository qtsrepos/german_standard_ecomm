import moment from "moment";
import { Col, Row } from "react-bootstrap";
import "../style.scss"


const OrderStatusList = (props: any) => {
    console.log(props?.item?.remark);

    return (<>
        <div className="status-div">
            <h6>{props?.item?.status}</h6>
            <Row>
                <Col md={4}>
                    <div>{props?.item?.status}</div>
                </Col>
                <Col md={4}><div>{moment(props?.item?.createdAt).format("MMM D, YYYY HH:mm")}</div></Col>
                <Col md={4}><div>{props?.item?.remark}</div></Col>
            </Row>
        </div>
    </>)
}

export default OrderStatusList