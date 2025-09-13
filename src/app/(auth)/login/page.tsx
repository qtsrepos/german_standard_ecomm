"use client";
import { useEffect, useRef, useState } from "react";
import "./style.scss";
import EmailLogin from "./emailLogin";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import img1 from "@/assets/images/logopageimg.jpg";
import { Col, Container, Row } from "react-bootstrap";

function LoginScreen() {
  const navigation = useRouter();
  const { data: session } = useSession();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [distanceFromCenter, setDistanceFromCenter] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (session) {
      navigation.push('/home'); // or your desired home route
    }
  }, [session, navigation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });

    // Corrected distance calculation
    const centerX = 50;
    const centerY = 50;
    const currentDistance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(50, 2) + Math.pow(50, 2));
    const normalizedDistance = Math.pow(currentDistance / maxDistance, 0.7); // Non-linear falloff

    setDistanceFromCenter(normalizedDistance);
  };

  return (
    <>
      <div className="login-page-wrapper">
        <Container fluid className="login-container">
          <Row className="login-card mx-auto">
            <Col md={6} className="left-pane d-flex image-wrapper">
              <div
                ref={imageContainerRef}
                className={`image-container w-100 ${
                  isHovered ? "hovered" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setDistanceFromCenter(0);
                }}
                onMouseMove={handleMouseMove}
                style={{
                  transform: isHovered
                    ? `
                      scale(${1 + (1 - distanceFromCenter) * 0.25})
                      translateZ(${(1 - distanceFromCenter) * 80}px)
                      rotateX(${(mousePosition.y - 50) * -0.5}deg)
                      rotateY(${(mousePosition.x - 50) * 0.5}deg)
                    `
                    : "none",
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              >
                <Image src={img1} alt="GSG Logo" className="gsg-logo" />
              </div>
            </Col>
            <Col
              md={6}
              className="right-pane d-flex justify-content-center align-items-center"
            >
              <div className="form-section">
                <EmailLogin />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default LoginScreen;
