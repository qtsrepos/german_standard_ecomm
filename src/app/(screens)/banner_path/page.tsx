import { FaArrowLeft } from "react-icons/fa6"
import "./style.scss"
import Link from "next/link";

const BannerHead =({head,path}:any)=>{

    return(<>
    {/* page title component */}
  <div className="page-title">
            <div className="container-page-title">
              <div className="container">
                <h3>
                {/* <span className="icon"><FaArrowLeft /></span> */}
                {head}
                </h3>
                <Link href={"/"} style={{textDecoration:"none"}}>HOME</Link>
                <span className="path">{` ${path}`}</span>
              </div>
            </div>
          </div>
    </>)
}

export default BannerHead;