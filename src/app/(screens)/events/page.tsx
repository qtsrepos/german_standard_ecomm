import { Container } from "react-bootstrap";
import BannerHead from "../banner_path/page";
import Image from "next/image";

const Events = () => {
    return (<>
        <BannerHead head={"Events"} path={`/ Events`} />
        <Container>
            <h5 className="mt-3 fw-bold text-center">Download our new app, GSG Vet to register for events now</h5>
            <Image
                src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/592758ed-49a6-4371-5449-8493d4d72500/w=768,h=949"
                width={768}
                height={949}
                alt="GSG Vet App"
                style={{ width: "70%", height: "auto" }}
            />
            <h6 className="fw-bold">Download App</h6>
            <div className=" row d-flex justify-content-center">
                <div className="col-md-6 mt-2 d-flex justify-content-center">
                    <a href="https://apps.apple.com/ae/app/gsg-vet/id6740236140"><Image
                        src="	https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/18a4c6ea-516a-46de-180e-d1c6efcd7f00/w=200,h=65"
                        width={200}
                        height={65}
                        alt="GSG Vet App"
                    />
                    </a>
                </div>
                <div className="col-md-6 mt-2 d-flex justify-content-center">
                    <a href="https://play.google.com/store/apps/details?id=com.gsgapp&pli=1"><Image
                        src="	https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/cabc2601-8c93-4d90-67ba-b5dbfcd4a200/w=200,h=65"
                        width={200}
                        height={65}
                        alt="GSG Vet App"
                    />
                    </a>
                </div>
                </div>
        </Container>
    </>)
}

export default Events;