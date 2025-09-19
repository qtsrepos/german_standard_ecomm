import React from "react";
import { Metadata } from "next";
import { Col, Container, Row } from "react-bootstrap";
import CONFIG from "@/config/configuration";
import Link from "next/link";
import { Breadcrumb } from "antd";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Privacy and Policy",
    description: `Thank you for using ${CONFIG?.NAME}! We are committed to providing you the best online shopping and delivery experience possible.`,
  };
};

function PrivacyPpolicy() {
  return (
    <div className="page-Box">
      <Container>
        <Breadcrumb
          items={[
            {
              title: <Link href="/">Home</Link>,
            },
            {
              title: "Privacy and Policy",
            },
          ]}
        />
        <br />
        <h1 className="page-text1">Privacy and Policy</h1>
        <br />
        <Row>
          <Col sm={8} xs={12}>
            <h4 className="page-text2">{CONFIG?.NAME} PRIVACY POLICY</h4>
            <p className="page-text3">
              Thank you for using {CONFIG?.NAME}! We are committed to providing
              you the best online shopping and delivery experience possible.
              This Privacy Policy explains what information we collect, how that
              information is used, under what circumstances we share
              information, and the choices you can make about that information.
              This Policy applies whether you access
              {CONFIG?.NAME} through a browser, through a mobile app, or through
              some other method.
              <br />
              <br />
              <br />
              This notice applies to users of {CONFIG?.NAME}’s services anywhere
              in the world, including users of {CONFIG?.NAME} app and website.
            </p>
            <br />
            <h4 className="page-text2">INFORMATION WE COLLECT</h4>
            <br />
            <p className="page-text3">
              {" "}
              <li>
                Information you provide to us or allow others to provide to us
              </li>
              At various points in the {CONFIG?.NAME} experience, you may
              provide us brwith information about yourself. For example, when
              you create an account with {CONFIG?.NAME}, you provide us with
              personal information like your name, email address, and zip code.
              And if you place an order with {CONFIG?.NAME}, we collect
              information including your address, phone number and the details
              of your order.
            </p>
            <br />
            <p className="page-text3">
              f you log into the {CONFIG?.NAME} service through a third-party,
              we may receive some information about you through them. For
              example, if you choose to log into {CONFIG?.NAME} with your
              Facebook account, we may receive information about your contacts.
              We may also offer social sharing tools (such as the Facebook Like
              button) that let you share actions on
              {CONFIG?.NAME} with other sites and vice versa. You should check
              the privacy policies of these services and your settings there for
              more information.
            </p>
            <br />
            <p className="page-text3">
              <li>Technical information about usage of {CONFIG?.NAME}</li>When
              you use the
              {CONFIG?.NAME} services, either through a browser or mobile app,
              we automatically receive some technical information about the
              hardware and software that is being used.
            </p>
            <br />
            <h4 className="page-text2">
              {" "}
              COOKIES AND OTHER TRACKING TECHNOLOGIES:
            </h4>
            <br />
            <p className="page-text3">
              We and our partners use various technologies to collect
              information, including cookies and device identifiers. Cookies are
              small text files that are sent by your computer when you access
              our services through a browser. We may use session cookies (which
              expire when you close your browser), persistent cookies (which
              expire when you choose to clear them from your browser), and other
              identifiers to collect information from your browser or device
              that helps us personalize your experience and remember things like
              your current zip code or that you have already logged in to{" "}
              {CONFIG?.NAME}.
            </p>
            <br />
            <p className="page-text3">
              We employ some third-party services to help us understand the
              usage of
              {CONFIG?.NAME}, and these third-parties may also deploy cookies on
              our site or collect information through our mobile applications.
              For example, we use Google Analytics to understand, in a
              non-personal way, how users interact with various portions of our
              site you can learn more about information that Google may collect
              here{" "}
              <a href="https://policies.google.com/privacy">
                Google Privay Privacy.
              </a>
            </p>
            <br />
            <h4 className="page-text2">LOG INFORMATION:</h4>
            <br />
            <p className="page-text3">
              When you use {CONFIG?.NAME}, our servers will record information
              about your usage of the service and information that is sent by
              your browser or device. Logs information can include things like
              the IP address of your device, information about the browser,
              operating system and/or app you are using, unique device
              identifiers, pages that you navigate to and links that you click,
              searches that you run on {CONFIG?.NAME}, and other ways you
              interact with the service. If you are logged into the
              {CONFIG?.NAME} service, this information is stored with your
              account information.
            </p>
            <br />
            <p className="page-text3">
              Some of the advertisements you see on the Site are selected and
              delivered by third parties, such as ad networks, advertising
              agencies, advertisers, and audience segment providers. These third
              parties may collect information about you and your online
              activities, either on the Site or on other websites, through
              cookies, web beacons, and other technologies in an effort to
              understand your interests and deliver to you advertisements that
              are tailored to your interests. Please remember that we do not
              have access to, or control over, the information these third
              parties may collect. The information practices of these third
              parties are not covered by this privacy policy.
            </p>
            <br />
            <h4 className="page-text2">HOW WE USE YOUR INFORMATION</h4>
            <br />
            <p className="page-text3">
              We may use the information we collect for various purposes,
              including to:
            </p>
            <ol className="page-text3">
              <li>
                Provide the {CONFIG?.NAME} service to you and to improve the
                quality of the service we’re able to offer.
              </li>
              <li>
                Allow your Personal Shopper (which includes those that shop for
                and deliver the order on your behalf) to choose your items at a
                retailer site, deliver your items to you, and call or text you
                with any updates or problems
              </li>
              <li>
                Charge you for the purchase and service costs through one or
                more payment processing partners{" "}
              </li>
              <li>
                Offer you customized content (including advertising and
                promotions), such as prominently displaying items you purchase
                frequently.{" "}
              </li>
              <li>
                Understand how users interact with our service as a whole in
                order to test new features and improve {CONFIG?.NAME} for
                everyone{" "}
              </li>
              <li>
                Provide customer service, respond to your communications and
                requests, and contact you about your use of {CONFIG?.NAME}{" "}
                (Note: You can opt-out of receiving promotional communications
                from {CONFIG?.NAME}by using the settings on the Account Info
                page)
              </li>
            </ol>
            <br />
            <h4 className="page-text2"> WHAT WE SHARE</h4>
            <p className="page-text3">
              {CONFIG?.NAME} is a platform that may connects users with Personal
              Shoppers who shop for and deliver the goods that you want from
              retailers. In order to make this work, we need to share
              information about you and your order with the other parties who
              help enable the service. This includes, for example, the Personal
              Shopper(s) who pick and deliver your order. We also share
              information under the following principles:
            </p>
            <ol className="page-text3">
              <li>
                {" "}
                With your consent or at your direction We will share your
                information with entities outside of {CONFIG?.NAME} when we have
                your consent to do so or it is done at your direction. For
                example:
              </li>
              <li>
                If you enter loyalty card information from a particular
                retailer, we share that information with the retailer you chose
                along with your order so that information can update your
                loyalty card account.
              </li>
              <li>
                If you share a recipe publicly on {CONFIG?.NAME}, it is viewable
                by anyone along with your first name and last initial.
              </li>
              <li>
                If you invite friends to use {CONFIG?.NAME} through our referral
                program InstaFriend, we will share some information with the
                friends you invite like your name and phone number.
              </li>
              <li>
                For external processing We sometimes employ third parties
                outside of
                {CONFIG?.NAME} to process information on our behalf in
                compliance with this Privacy Policy and using other appropriate
                security and confidentiality measures{" "}
              </li>
              <li>
                For legal purposes We share your information when we believe
                that the disclosure is reasonably necessary to (a) comply with
                applicable laws, regulations, legal process, or requests from
                law enforcement or regulatory authorities, (b) prevent, detect,
                or otherwise handle fraud, security, or technical issues, and
                (c) protect the safety, rights, or property of any person, the
                public, or {CONFIG?.NAME}.
              </li>
              <li>
                On a non-personal or aggregate basis We share information with
                retailers and advertisers on both a non-personally identifying
                basis (including order and delivery details but not including
                credit card information) and an aggregate basis.
              </li>
              <li>
                For business purposes We may share your information in
                connection with, or during negotiations of, any merger, sale of
                company assets, financing or acquisition of all or a portion of
                our business by another company. We may also share your
                information between and among {CONFIG?.NAME}, and its current
                and future parents, affiliates, subsidiaries, and other
                companies under common control and ownership.
              </li>
            </ol>
            <br />
            <h4 className="page-text2">
              APPLICABLE ONLY TO USERS IN THE MENA REGION:{" "}
            </h4>
            <br />
            <p className="page-text3">
              You agree that we may allow carefully selected third parties,
              including without limitation to marketing and advertising
              companies, our affiliates and associates, to contact you about
              services that may be of interest to you. They may contact you by
              telephone, SMS as well as by e-mail.
            </p>
            <br />
            <p className="page-text3">
              If you change your mind about being contacted by these companies
              in the future, please let us know by using the mentioned email
              address set out below and/or by amending your profile accordingly.
            </p>
            <br />
            <p className="page-text3">
              We may use the information that you provide to us if we are under
              a duty to disclose or share your information in order to comply
              with (and/or where we believe we are under a duty to comply with)
              any legal obligation, or in order to enforce our website Terms of
              Service and any other agreement, or to protect the rights of
              {CONFIG?.NAME}. This includes exchanging information with other
              companies and organisations for the purposes of fraud protection
              and prevention.
            </p>
            <br />
            <p className="page-text3">
              We may share or need to transfer to or store data we have received
              from you with affiliates and subsidiaries of {CONFIG?.NAME}
              (“Affiliates”) which are located in countries or jurisdictions
              other than the UAE. The laws governing data protection in these
              countries or jurisdictions may differ from the laws in the UAE. We
              will comply with the laws applicable in the UAE and take all steps
              reasonably necessary to ensure that similar and/or comparable
              standards for data protection are maintained by any Affiliates
              which are recipients of your information.
            </p>
            <br />
            <p className="page-text3">
              {" "}
              By your voluntary submission of you personal information to us,
              you are consenting to the disclosure, transfer and use of your
              personal information outside of the UAE for the purposes described
              in this Privacy Policy.
            </p>
            <br />
            <h4 className="page-text2">{CONFIG?.NAME} APP</h4>
            <p className="page-text3">
              This section applies to Delivery personnel, individuals who
              provide delivery of goods from a retailer registered on{" "}
              {CONFIG?.NAME} to a user who is using the service and has
              requested through the app or website to be delivered specific
              goods.
            </p>
            <br />
            <h4 className="page-text2">DATA COLLECTION AND USAGE</h4>
            <p className="page-text3">
              The following data is shared from {CONFIG?.NAME}’s main
              application and website to the {CONFIG?.NAME} Driver app to
              facilitate the delivery service:
            </p>
            <ol className="page-text3">
              <li>
                Data provided by users. This includes: name, email, phone
                number, address, payment method chosen for a specific
                transaction.
              </li>
              <li>
                Data created during usage of the service by the Driver. This
                includes: Location data: {CONFIG?.NAME} collects this data when
                the Driver app is running in the foreground (app open and
                on-screen) or background (app open but not on-screen) of the
                Driver’s mobile device.
              </li>
              <li>
                Location data (Drivers and delivery recipients). We collect
                precise or approximate location data from drivers mobile devices
                if they enable us to do so. {CONFIG?.NAME} collects this data
                from the time a ride or delivery is requested until it is
                finished, and any time the app is running in the foreground of
                their mobile device. We use this data to enhance the use of the{" "}
                {CONFIG?.NAME} service, so our users can track the progress of
                their delivery in real time, improve the pick up and drop off
                process and detect possible fraud.
              </li>
              <li>
                Transaction information: We collect transaction information
                related to the use of our services during the drop off,
                including the type of services requested or provided, order
                details, delivery information, date and time the service was
                provided, amount charged, distance traveled, and payment method.
              </li>
              <li>
                Device data: We may collect data about the devices used by the
                Driver to access our services, including the hardware models,
                device IP address, operating systems and versions, software,
                preferred languages, unique device identifiers, advertising
                identifiers, serial numbers, device motion data, and mobile
                network data.
              </li>
            </ol>
            <br />
            <p className="page-text3">
              {CONFIG?.NAME} collects and uses data to enable reliable and
              convenient delivery, and other products and services. We also use
              the data we collect:
            </p>
            <ul className="page-text3">
              <li>
                To enhance the safety and security of our Drivers and users
              </li>
              <li>
                Using data from drivers’ or delivery persons’ devices to help
                identify unsafe driving behavior such as speeding or harsh
                braking and acceleration, and to inform them of safer driving
                practices. We also use data from delivery persons’ devices to
                verify the type of vehicles they used to provide deliveries.
              </li>
              <li>
                Using device, location, profile, usage, and other data to
                prevent, detect, and combat fraud or unsafe activities.
              </li>
              <li>
                To provide a personalized service to each user so each user can
                track the progress of the delivery of the goods ordered and have
                an as accurate as possible estimated time of arrival
              </li>
              <li>
                To enable, track and share the progress of rides or deliveries{" "}
              </li>
              <li>
                To confirm service execution in a timely and satisfactory manner
                by tracking the driver’s route and delivery speed
              </li>
              <li>
                For customer support data when needed, to investigate and
                address user concerns
              </li>
              <li>
                For customer support data when needed, to investigate and
                address user concerns
              </li>
            </ul>
            <br />
            <h4 className="page-text2">{CONFIG?.NAME} PICKER APP</h4>
            <p className="page-text3">
              This section applies to Delivery personnel, individuals who
              provide delivery of goods from a retailer registered on{" "}
              {CONFIG?.NAME} to a user who is using the service and has
              requested through the app or website to be delivered specific
              goods.
            </p>
            <br />
            <h4 className="page-text2">DATA COLLECTION AND USAGE</h4>
            <p className="page-text3">
              The following data is shared from {CONFIG?.NAME}’s main
              application and website to the {CONFIG?.NAME} Picker app to
              facilitate the delivery service:
            </p>
            <ol className="page-text3">
              <li>
                Data provided by users. This includes: name, email, phone
                number, address, payment method chosen for a specific
                transaction.
              </li>
              <li>
                Data created during usage of the service by the Picker. This
                includes: Location data: {CONFIG?.NAME} collects this data when
                the Picker app is running in the foreground (app open and
                on-screen) or background (app open but not on-screen) of the
                Picker’s mobile device.
              </li>
              <li>
                Location data (Pickers and delivery recipients). We collect
                precise or approximate location data from pickers mobile devices
                if they enable us to do so. {CONFIG?.NAME} collects this data
                from the time a ride or delivery is requested until it is
                finished, and any time the app is running in the foreground of
                their mobile device. We use this data to enhance the use of the{" "}
                {CONFIG?.NAME} service, so our users can track the progress of
                their delivery in real time, improve the pick up and drop off
                process and detect possible fraud.
              </li>
              <li>
                Transaction information: We collect transaction information
                related to the use of our services during the drop off,
                including the type of services requested or provided, order
                details, delivery information, date and time the service was
                provided, amount charged, distance traveled, and payment method.
              </li>
              <li>
                Device data: We may collect data about the devices used by the
                Picker to access our services, including the hardware models,
                device IP address, operating systems and versions, software,
                preferred languages, unique device identifiers, advertising
                identifiers, serial numbers, device motion data, and mobile
                network data.
              </li>
            </ol>
            <br />
            <p className="page-text3">
              {CONFIG?.NAME} collects and uses data to enable reliable and
              convenient delivery, and other products and services. We also use
              the data we collect:
            </p>
            <ul className="page-text3">
              <li>
                To enhance the safety and security of our Pickers and users.
              </li>
              <li>
                Using device, location, profile, usage, and other data to
                prevent, detect, and combat fraud or unsafe activities.
              </li>
              <li>
                For customer support data when needed, to investigate and
                address user concerns.
              </li>
              <li>For research and development.</li>
            </ul>
            <br />
            <h4 className="page-text2">DATA SHARING AND DISCLOSURE</h4>
            <p className="page-text3">
              {CONFIG?.NAME} may share the data we collect via the Picker app:
              With business partners (retailers, service providers), this
              includes sharing:
            </p>
            <ul className="page-text3">
              <li>Riders’ first name, pickup and/or dropoff locations</li>
              <li>
                Delivery recipients’ first name, delivery address, and order
                information with their delivery person and business partner.
              </li>
              <li>
                We also provide riders and delivery recipients with receipts
                containing information such as a breakdown of amounts charged,
                driver or delivery person first name, route map, and such other
                information required on invoices in the country or region where
                the picker operates.
              </li>
            </ul>
            <br />
            <h4 className="page-text2">CHANGES TO THIS POLICY</h4>
            <p className="page-text3">
              This policy may change from time to time and any revised Policy
              will be posted at this page, so we encourage you to review it
              regularly. If we make changes, we will notify you by revising the
              date at the top of this Policy and, in some cases, we may provide
              you with additional notice (such as a notice on our homepage or
              sending you a notification).
            </p>
          </Col>
          <Col sm={1} xs={12}></Col>
          <Col sm={3} xs={12}>
            <div className="page-stickeyBox">
              <div className="Footer-text2">
                <Link href="privacy-policy">Privacy and Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="cookies-policy">Cookies Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="terms_of_service">Terms of Service</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="cancellation_return">Refund Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="access_statement">Accessibility Statement</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="fa-questions">FAQ,S</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="contact_us">Contact</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PrivacyPpolicy;
