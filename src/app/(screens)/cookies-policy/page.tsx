import React from "react";
import { Col, Container } from "react-bootstrap";
import API from "@/config/configuration";
import CONFIG from "@/config/configuration";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Row } from "antd";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Privacy and Policy",
    description: `Thank you for using ${CONFIG?.NAME}! We are committed to providing you the best online shopping and delivery experience possible.`,
  };
};

function CookiesPolicy() {
  return (
    <div className="page-Box">
      <Container>
        <Breadcrumb
          items={[
            {
              title: <Link href="/">Home</Link>,
            },
            {
              title: " Cookies Policy",
            },
          ]}
        />

        <br />
        <h1 className="page-text1">Cookies Policy</h1>
        <br />
        <Row>
          <Col sm={8} xs={12}>
            <h4 className="page-text2">Cookies policy</h4>
            <br />
            <p className="page-text3">
              In order for your visit to {API.NAME} to be attractive and to
              allow some features to be used, we use so-called cookies on
              various pages. Cookies are small text files that are stored in
              your browser. Some of the cookies we use are deleted after the end
              of your browser session, i.e. after you close the browser. Other
              cookies remain in your browser and allow us to recognize your
              browser on your next visit (permanent cookies). You can configure
              your browser to know how to set cookies and decide individually
              whether or not to accept them for specific occasions or in
              general. Not accepting cookies may limit the functionality of our
              site.{" "}
            </p>
            <br />
            <h4 className="page-text2">
              We classify the cookies we use into three categories:
            </h4>
            <ul className="page-text3">
              <li> Required </li>
              <li> Functional</li>
              <li> Personalization</li>
            </ul>
            <p className="page-text3">
              {" "}
              Below you will find more information about your choices as well as
              a detailed list of cookies we use.
            </p>
            <br />
            <h4 className="page-text2"> Required cookies: </h4>
            <p className="page-text3">
              Αre necessary to navigate our site and use its features. Without
              the use of these cookies, the proper functioning of our site is
              not guaranteed (e.g. text input) when browsing the pages of the
              website. In addition, they are cookies that collect information
              about how visitors use our site, for example, which pages they
              visit more often and if they receive error messages. They also
              allow our site to remember your choices, such as language or area,
              to provide improved features. They are also used to store
              information about the consent option where required. No action is
              required from you to activate them.
            </p>
            <br />
            <h4 className="page-text2">Functional cookies: </h4>
            <p className="page-text3">
              Αllow us to continuously improve the services we offer, collecting
              and analyzing information about our website traffic. They can also
              be used to send ads and bids or to measure the effectiveness of
              our ad campaigns. So they give us the opportunity to suggest and
              help you find what you are looking for. This category also
              includes cookies from third parties.
            </p>
            <br />
            <h4 className="page-text2"> Personalization cookies: </h4>
            <p className="page-text3">
              Αre used to create tailor-made content for you to give you the
              best possible experience.
            </p>
            <br />
            <h4 className="page-text2">Objection to the use of cookie</h4>
            <p className="page-text3">
              {" "}
              If you do not want us to collect and analyze information about
              your visit, you can opt-out at any time for the future. For the
              technical implementation, an exception cookie will be set in your
              browser. This cookie is solely intended to map your objection.
              Please note that for technical reasons the opt-out cookie can only
              be used for the specific browser from which it is set. If you
              delete cookies or use a different browser or device, you will need
              to repeat this process.
            </p>
            <br />
            <h4 className="page-text2">Required cookies:</h4>
            <p className="page-text3">
              Required cookies are required to navigate our site, and in order
              to use the features provided. Without the use of such cookies,
              proper functioning of our site is not guaranteed. According to
              legal regulations, no action of yours is required to accept them.
            </p>
            <br />
            <table>
              <thead>
                <tr className="page-text3">
                  <th> Name</th>
                  <br />
                  <th>DESCRIPTION </th>
                </tr>
              </thead>
              <tbody>
                <tr className="page-text3">
                  <td>rc::a</td>
                  <br />
                  <td>
                    This cookie is used to distinguish between humans and bots.
                    This is beneficial for the website, in order to make valid
                    reports on the use of their website.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>rc::c</td>
                  <br />
                  <td>
                    This cookie is used to distinguish between humans and bots.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>CookieConsent</td>&nbsp;&nbsp;
                  <td>
                    Stores the user's cookie consent state for the current
                    domain.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>__cfduid</td>
                  <br />
                  <td>
                    Used by the content network, Cloudflare, to identify trusted
                    web traffic.
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <h4 className="page-text2">Functional cookies:</h4>
            <p className="page-text3">
              These cookies store your login information in your browser so you
              can automatically log in next time you visit {API.NAME}. They also
              allow us to continuously improve the services we offer, collecting
              and analyzing data on {API.NAME} website traffic. In addition,
              they give us the opportunity to help you find what you are looking
              for.
            </p>

            <table>
              <thead>
                <tr className="page-text3">
                  <th>Name</th>
                  <br />
                  &nbsp;&nbsp;&nbsp;
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="page-text3">
                  <td>collect</td>
                  <br />
                  <td>
                    Used to send data to Google Analytics about the visitor's
                    device and behavior. Tracks the visitor across devices and
                    marketing channels.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>_ga</td>
                  <br />
                  <td>
                    Registers a unique ID that is used to generate statistical
                    data on how the visitor uses the website.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>_gid</td>
                  <br />
                  <td>
                    Registers a unique ID that is used to generate statistical
                    data on how the visitor uses the website.
                  </td>
                </tr>
                <tr className="page-text3">
                  <td>_gat</td>
                  <br />
                  <td>Used by Google Analytics to throttle request rate.</td>
                </tr>

                <tr className="page-text3">
                  <td>fr</td>
                  <br />
                  <td>
                    Used by Facebook to deliver a series of advertisement
                    products such as real time bidding from third party
                    advertisers.
                  </td>
                </tr>

                <tr className="page-text3">
                  <td>tr</td>
                  <br />
                  <td>
                    Used by Facebook to deliver a series of advertisement
                    products such as real time bidding from third party
                    advertisers.
                  </td>
                </tr>

                <tr className="page-text3">
                  <td>ads/ga-audiences</td>
                  <br />
                  <td>
                    Used by Google AdWords to re-engage visitors that are likely
                    to convert to customers based on the visitor's online
                    behaviour across websites.
                  </td>
                </tr>

                <tr className="page-text3">
                  <td>_fbp</td>
                  <br />
                  <td>
                    Used by Facebook to deliver a series of advertisement
                    products such as real time bidding from third party
                    advertisers.
                  </td>
                </tr>

                <tr className="page-text3">
                  <td>_gcl_au</td>
                  <br />
                  <td>
                    Used by Google AdSense for experimenting with advertisement
                    efficiency across websites using their services.
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <h4 className="page-text2">Personalized cookies:</h4>
            <p className="page-text3">
              These cookies are used to create personalized content, tailor-made
              for you, to give you the best possible {API.NAME} experience.
            </p>
            <br />
            <table>
              <thead>
                <tr className="page-text3">
                  <th>NAME</th>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="page-text3">
                  <td>language</td>
                  <br />
                  <td>
                    Determines the preferred language of the visitor. Allows the
                    website to set the preferred language upon the visitor's
                    re-entry.
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <h4 className="page-text2">Third party cookies:</h4>
            <p className="page-text3">
              Our partners may also use cookies over which we have no control.
              For further information on how our partners use cookies please
              refer to the cookies policies on their respective websites.
            </p>
            <br />
            <h4 className="page-text2">How to manage cookies:</h4>
            <p className="page-text3">
              Most web browsers allow some control of most cookies through the
              browser settings. To find out more about cookies, including how to
              see what cookies have been set, visit{" "}
              <a href="www.aboutcookies.org ">www.aboutcookies.org </a> or
              <a href="www.allaboutcookies.org.">www.allaboutcookies.org.</a>
            </p>
            <p className="page-text3">
              Find out how to manage cookies on popular browsers:
            </p>
            <br />
            <ul className="page-text3">
              <li>
                <a href="Google Chrome">Google Chrome</a>
              </li>
              <li>
                <a href="Microsoft Edge">Microsoft Edge</a>
              </li>
              <li>
                <a href="Mozilla Firefox">Mozilla Firefox </a>
              </li>
              <li>
                <a href="Microsoft Internet Explorer">
                  Microsoft Internet Explorer
                </a>
              </li>
              <li>
                <a href="Opera">Opera</a>
              </li>
              <li>
                <a href="Apple Safari">Apple Safari </a>
              </li>
            </ul>
            <br />
            <p className="page-text3">
              {" "}
              To find information relating to other browsers, visit the browser
              developer’s website.
            </p>

            <p className="page-text3">
              To opt out of being tracked by Google Analytics across all
              websites, visit{" "}
              <a href="http://tools.google.com/dlpage/gaoptout">
                http://tools.google.com/dlpage/gaoptout.
              </a>
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

export default CookiesPolicy;
