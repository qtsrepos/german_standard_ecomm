import CONFIG from "@/config/configuration";
import { Metadata } from "next";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Breadcrumb } from "antd";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Privacy and Policy",
    description: `Thank you for using ${CONFIG?.NAME}! We are committed to providing you the best online shopping and delivery experience possible.`,
  };
};
function TermsService() {
  return (
    <div className="page-Box">
      <Container>
        <Breadcrumb
          items={[
            {
              title: <Link href="/">Home</Link>,
            },
            {
              title: "Terms Of Service",
            },
          ]}
        />
        <br />
        <h1 className="page-text1"> Terms Of Service </h1>
        <br />

        <Row>
          <Col sm={8} xs={12}>
            <h4 className="page-text2">Welcome to German Standard Group !</h4>
            <br />
            <p className="page-text3">
              Here you can find all the terms and conditions that we apply in
              order to perform our provided services at the highest level of our
              standards. If you’re here, that means you’re smart enough to read
              them carefully before using our services.
            </p>
            <p className="page-text3">
              Please read the following terms and conditions carefully. They
              contain important information about your rights and obligations,
              as well as limitations and exclusions that apply to your
              purchases.
            </p>
            <h4 className="page-text2">1.GENERAL SCOPE</h4>
            <p className="page-text3">
              German Standard Group  provides software-based delivery services for
              goods such as food, beverages and other grocery products
              (collectively, Groceries). These terms (Terms of Service) apply
              when you use the German Standard Group  mobile applications or websites
              (collectively, Services).
            </p>
            <p className="page-text3">
              {" "}
              By using the Services, you automatically agree to the Terms of
              Service.
            </p>
            <p className="page-text3">
              {" "}
              German Standard Group  is a platform for facilitating the exchange of
              services between individuals (User) who are willing to order
              Groceries via our partners (Shops) that are willing to collect and
              deliver the ordered Groceries.
            </p>

            <br />
            <h4 className="page-text2">2. REGISTRATION AND ORDERING PROCESS</h4>
            <h4 className="page-text2"> 2.1. REGISTRATION</h4>
            <p className="page-text3">
              You are the sole authorized User of any account (Account) you
              create using the Services. Your action of registration constitutes
              your acceptance of the Terms of Service and the Privacy Policy,
              and your state that you are not less than 21 (twenty-one) years of
              age. Registration is free of charge. No entitlement exists for
              admission to the Service. The data required for registration
              provided by the User must be complete and accurate. The User is
              responsible for updating his/her own data that can be amended at
              any time from the respective interface of the Service. German Standard Group 
              Fruits has no responsibility over the use of the User account and
              expressly disclaims any liability therefrom. Should you suspect
              that any unauthorized party might be using your Account, you are
              obligated for your own security to notify German Standard Group 
              immediately by emailing us at{" "}
              <a href="mailto:info@connect.com">
                contact@connect.com.sa
              </a>{" "}
              By providing your mobile phone number toConnect pursuant to the use
              of the Service, you hereby affirmatively consent to our use of
              your mobile phone number for contacting you directly in order to
              perform the Services, including but not limited to occasionally
              send notifications, text messages with promotional offers, service
              updates and reach out to you to survey regarding the quality of
              our services.
            </p>
            <br />
            <h4 className="page-text2">
              2.2. ORDER PLACEMENT / CONTRACTUAL RELATIONSHIP
            </h4>
            <p className="page-text3">
              By placing an order through the application or the website, the
              User confirms the accuracy of all the information he/she provides.
              Orders are confirmed to the User within Service interface. No
              contractual relationship exists between User and German Standard Group .
              German Standard Group  may decide for any reason whatsoever to not accept
              an order and to refuse to perform it. User may schedule the order
              for a selected time, date, week or month as per availability of
              Service.
            </p>
            <br />
            <h4 className="page-text2">2.3. VARIETY LIMITATIONS</h4>
            <p className="page-text3">
              The range and prices of Groceries may differ depending on the
              delivery location.
            </p>
            <h4 className="page-text2">2.4. VOLUME LIMITATIONS</h4>
            <p className="page-text3">
              User might be contacted by German Standard Group  to confirm the order in
              the following cases:
            </p>
            <p className="page-text3">
              * If the total items in an order exceed 100 items or if an order
              contains 15 or more same items
            </p>
            <p className="page-text3">
              * If the order placed requires more than one delivery personnel to
              be handled by due to volume limitations.
            </p>
            <p className="page-text3">
              In all cases, German Standard Group  reserves the right to limit the
              delivery quantity for particular products or, if needed, not to
              deliver a particular product at all as per the availability of the
              Groceries..
            </p>
            <br />
            <h4 className="page-text2">2.5. AMENDING AND CANCELLING ORDERS</h4>
            <p className="page-text3">
              The User may not be able to amend the order once it has been
              confirmed as per the technical features provided by the Service. A
              confirmed order is eligible for cancellation for a limited time
              period until it is disbursed for delivery post to its submission
              as per the technical specifications of the Service.
            </p>
            <br />
            <h4 className="page-text2">
              {" "}
              2.6. INCOMPLETE ORDER FULFILLMENT / SUBSTITUTION
            </h4>
            <p className="page-text3">
              The primary objective of German Standard Group  is to deliver all the
              products ordered in the right quantity and to a high quality
              standard. User acknowledges that the Groceries are subject to
              stock availability and to human errors. German Standard Group  reserves
              the right to amend your order in whole or in part, at any time and
              without liability or compensation remove any item that is out of
              stock, damaged, spoiled, or unavailable for any other reason, to
              successfully complete your order. It’s in our best intention to
              maintain the replaced item’s price the same as per the brand you
              ordered but in case of a higher valued replacement, the price may
              increase. We do our best to ensure that all items shown on our
              website are available to order. If, however any product you order
              is out of stock or unavailable we may send you a push notification
              enabling you to select a substitute. If an item is not delivered,
              despite being billed, the amount in question will be credited to
              the User at a reasonable time after German Standard Group  becomes aware of this.
              No subsequent delivery is obligatory to be made, and the customer
              is not entitled to claim any further compensation. If for any
              reason beyond our reasonable control, we are unable to supply a
              particular item, we will not be liable to the User. Please note
              that we will attempt to send the User push notification of
              substitute products in the event that selected products are
              unavailable, the User may reject these substitutes. Although we
              will always try to cater for your orders, an order of unusually
              large quantities of different or one product can only be fulfilled
              at the discretion of the Shop. German Standard Group  reserves the right to forward
              a user order to another shop then the one initially selected from
              the user without informing the user in the event that the initial
              shop fails to fulfil the order. In this case the new shop the
              total value of the goods ordered should be the same or lower than
              the value as per the pricelist of the initial shop. The payment
              method will remain the same.
            </p>
            <br />
            <h4 className="page-text2"> 3. DELIVERY</h4>
            <br />
            <h4 className="page-text2">3.1. DELIVERY OF GROCERIESY</h4>
            <p className="page-text3">
              Groceries will be delivered directly to the delivery address
              specified by the User. Deliveries are performed either by the Shop
              personal delivery service, by a delivery partner, or by
              German Standard Group  delivery team, depending on the nature of the goods and the
              delivery location. Goods will be delivered to the front door of
              private residences (as far as accessible) and to the reception
              desk of business Users.
            </p>
            <br />
            <h4 className="page-text2">
              3.2. DELIVERY TIMES AND ADHERENCE TO DELIVERY PERIODS
            </h4>
            <p className="page-text3">
              German Standard Group  endeavors to deliver Groceries within 30 (thirty)
              to 60 (sixty) minutes average delivery time location dependent or
              as scheduled. German Standard Group  does not and cannot guarantee that
              the delivery time frames will be met as there may be factors
              outside of German Standard Group ’s control that may result in early or delayed
              deliveries. You agree that German Standard Group  shall not be liable for
              any deliveries made outside the expected delivery time frame.
            </p>
            <br />
            <h4 className="page-text2">3.3. DELIVERY RECEIPT</h4>
            <p className="page-text3">
              The shop holds the responsibility to provide the user with the
              receipt upon delivery.
            </p>
            <br />
            <h4 className="page-text2">
              {" "}
              3.4. CANCELLATION OF A DELIVERY BY German Standard Group 
            </h4>
            <p className="page-text3">
              If, for reasons beyond German Standard Group ’s control - such as an
              incorrect delivery address, the recipient's absence, lack of an
              access permit, bad weather conditions, or similar, it should prove
              impossible or possible only with great difficulty, to carry-out
              the delivery successfully, German Standard Group  is entitled to cancel
              the User’s order. In this event, the User is not entitled to
              compensation or pecuniary of in kind, however; in case of online
              payment, the refund will be initiated by German Standard Group  at the
              soonest possible post the cancellation of the order, it is the
              responsibility of the bank to transfer the amount to the users
              account, which takes approximately 3-5 working days.
            </p>
            <br />
            <h4 className="page-text2">4.PRICES AND PAYMENT</h4>
            <p className="page-text3">
              German Standard Group  endeavors to provide you with accurate and
              up-to-date pricing, product availability and promotional
              information. Discrepancies are possible and you agree not to hold
              German Standard Group  liable in such instances.
            </p>
            <br />
            <h4 className="page-text2">4.1. PRICES</h4>
            <p className="page-text3">
              All prices are quoted in the country’s local currency where German Standard Group 
              is operating. For the countries where VAT is applicable the prices
              displayed on the app/website will be VAT inclusive. Where goods
              may be charged by weight (fruit, meat, cheese, etc.), the basic
              price per unit applies. The quantity of such goods actually
              delivered, and therefore the price charged, may differ from the
              quantity originally ordered. For pre-packed and price-labelled
              fresh products, the applicable price is the one in force when the
              order is prepared. German Standard Group  reserve the right to change
              prices as to update them at any moment.
            </p>
            <br />
            <h4 className="page-text2">4.2. ENVIRONMENTAL FEE</h4>
            <p className="page-text3">
              {" "}
              According to Law 4819/2021, consumers in Greece are required to
              pay an environmental fee of nine cents (0,09€) per plastic bag,
              including VAT per piece of plastic carrying bag regardless of wall
              thickness, with the exception of biodegradable and compostable
              plastic carrying bags. Moreover, from 1.1.2022 according to Law
              4736/2020, consumers are required to pay an environmental fee of
              five cents (0.05 €), including VAT, for each piece of disposable
              plastic product available as a package of ready-made drinks and
              food in mass catering and retail. In all cases, the responsibility
              for selling and charging the plastic bags as well as the plastic
              containers lies with our partners (Shops) that sell the products
              and not with German Standard Group . During the submission and delivery
              of an order, the environmental fees mentioned above are reflected
              in the order’s receipt and are returned, upon completion of the
              order, to our partners (Shops).
            </p>
            <br />
            <h4 className="page-text2">
              4.3. PAYMENT METHODS / CREDITWORTHINESS
            </h4>
            <p className="page-text3">
              {" "}
              You can choose from the following ways of paying on delivery,
              depending on the products, the means of dispatch and as per
              technical availability:
            </p>
            <p className="page-text3"> * Credit card reader on delivery</p>
            <p className="page-text3"> * Cash on delivery</p>
            <p className="page-text3"> * Online payment</p>
            <p className="page-text3">
              {" "}
              * We accept payments online using Visa, MasterCard and AMEX (valid
              for UAE only) credit or debit card in the currency of the country
              where the User is located at the time of ordering.
            </p>
            <p className="page-text3">
              * If you make a payment for our products or services on our
              website or application, the details you are asked to submit will
              be provided directly to our payment provider via a secured
              connection.
            </p>
            <p className="page-text3">
              * The cardholder must retain a copy of transaction records and
              Merchant policies and rules.
            </p>
            <br />
            <p className="page-text3">
              The User can select which payment method is preferred. The payment
              methods available are displayed for selection when the order is
              finalized. If for any reason the online payment transaction is
              declined, German Standard Group  is entitled, at its soles discretion, to
              offer the User cash on delivery payment option or credit card
              reader on delivery where available. In the event that you have
              paid for an order with Apple Pay, Samsung Pay or another wallet
              and such payment fails to process, you authorise German Standard Group 
              to charge the order in any authorised credit card you may have on
              our platform.
            </p>
            <br />
            <h4 className="page-text2">5. PRODUCT DECLARATION</h4>
            <br />
            <h4 className="page-text2">5.1. PRODUCT INFORMATION</h4>
            <p className="page-text3">
              We take care to update the product information in the Service
              regularly. In rare cases, the information may deviate from the
              details printed on the product packaging. In such an instance, the
              information on the packaging takes precedence. Because recipes may
              change anytime, we recommend that you regularly consult the
              ingredients list and allergy-related information on the packaging.
            </p>
            <br />
            <h4 className="page-text2">6. GUARANTEE of DATA COMMUNICATION</h4>
            <p className="page-text3">
              Given the current state of the technology, no guarantee can be
              given that data communication via the internet will be error-free
              and/or available at all times. German Standard Group  therefore accepts
              no liability in respect of the constant, uninterrupted
              availability of the online shop, nor for technical and electronic
              faults during sales transaction, in particular for any delay in
              processing or accepting orders.
            </p>
            <br />
            <h4 className="page-text2">7. SPECIAL PRODUCT CONDITIONS</h4>
            <br />
            <h4 className="page-text2">7.1. PREPAYED MOBILE PHONE CREDIT</h4>
            <p className="page-text3">
              German Standard Group  sells mobile phone credit of various providers as
              for example: Etisalat and DU. Mobile phone credit should be
              activated as soon as possible. The activation code is valid only
              once. No exchanges or refunds are permitted.
            </p>
            <br />
            <h4 className="page-text2">8. DISCOUNTS, PRIVILEGES & VOUCHERS</h4>
            <br />
            <h4 className="page-text2">8.1. SPECIAL OFFERS</h4>
            <p className="page-text3">
              The User accepts that offers available from German Standard Group  often
              differ from those available from Shop sales channels.
            </p>
            <br />
            <h4 className="page-text2">8.2 German Standard Group  POINTS</h4>
            <p className="page-text3">
              ConnectPoints is an innovative way of rewarding customers with
              points in the application or website that can be converted to
              credit in an upcoming grocery order.
            </p>
            <ol className="page-text3">
              <li>
                The value of 1 InstaPoint is displayed within the application or
                website and may be modified without prior notice and may differ
                from region to region and from country to country.
              </li>
              <li>
                Unless otherwise specified, all coupons or codes must be
                redeemed within one calendar month from the moment they are
                issued/communicated.
              </li>
              <li>
                ConnectPoints coupons cannot be exchanged for cash or any other
                alternatives and have no monetary value.{" "}
              </li>
              <li>
                ConnectPoints may be offered on an ad-hoc basis and will be added
                to the customer’s account to be used in an upcoming grocery
                order.
              </li>
              <li>
                ConnectPoints can only be redeemed through the application where
                they are supported and are applicable.{" "}
              </li>
              <li>Each ConnectPoints coupon can only be used once per user.</li>
              <li>
                ConnectPoints can be applied as a discount towards the purchase
                price of products available on our platform. However, it is
                important to note that ConnectPoints cannot be used to cover any
                service fees, preparation fees, or delivery charges incurred
                during the transaction. These fees will remain payable by the
                user and are not subject to be paid through the redemption
                ofConnectPoints.
              </li>
              <li>
                If an order, where an German Standard Group  Points coupon has been used, is
                cancelled for any reason the coupon(s) will be reimbursed to the
                user, either automatically or otherwise upon the user’s request.
              </li>
              <li>
                If the applicable ConnectPoints coupon exceeds the value of the
                items ordered, the execessive discount shall be forfeited.
              </li>
              <li>
                German Standard Group  may reward its loyal users by adding
                ConnectPoints to their account. However, German Standard Group  may also
                withdraw loyalty bonuses at any point and without warning or
                liability.
              </li>
              <li>
                Any attempt to manipulate the system and use of coupons or codes
                by participation via any party, camouflaging identity by
                manipulating IP addresses, using identities other than their own
                or any other automated means (including systems which can be
                programmed to do so), will render the associated orders and use
                ofConnectPoints invalid and may potentially lead to that account
                being deactivated or the parties responsible prosecuted within
                the framework of the applicable law.
              </li>
            </ol>
            <br />
            <h4 className="page-text2">8.3. PARTNERS (SHOPS) LOYALTY CARD</h4>
            <p className="page-text3">
              When making your purchases from shops that apply a customer reward
              system, through the App, you have the opportunity to enter your
              membership card number in the corresponding field when completing
              the order so as to ensure that the points corresponding to the
              purchases you made are credited to the account you have in the
              respective shop.
            </p>
            <br />
            <h4 className="page-text2">9. CUSTOMER SERVICE & COMPLAINTS</h4>
            <p className="page-text3">
              German Standard Group  Customer Service provides information regarding
              any questions, issues or complaints related to the German Standard Group 
              service. Users may contact German Standard Group  via e-mail{" "}
              <a href="mailto:contact@connect.com.sa">
                contact@connect.com.sa
              </a>{" "}
              , drop a message through the app or call the customer service line
              (+97148795000). Missing items must be reported immediately on
              reception of the Groceries, otherwise Groceries are considered to
              have been accepted by User as being in perfect condition. Latent
              defects must be reported to German Standard Group  customer Service
              immediately after they come to light, although in these cases
              there are limitations of error acknowledgement.
            </p>
            <br />
            <h4 className="page-text2"> 10. TIPPING</h4>
            <p className="page-text3">
              Tipping is a way German Standard Group  users can reward the drivers and
              pickers (staff) that are involved in executing their orders via
              theConnect mobile applications or websites. Users tip the staff
              directly via the credit/debit card they have registered. Any tip
              paid by the customer via the German Standard Group  mobile applications
              or websites will be non-refundable. All tips paid by the customer
              will be paid in the local currency of the country from where the
              orders are placed. Upon rating an order with German Standard Group , the
              customer will have the option to make a discretionary payment of a
              tip toConnect in addition to the purchase price of the items in the
              order. German Standard Group  will subtract any transactional fees
              related to the online payment gateway and bank transfer cost and
              shall transfer the remaining amount to staff involved in the
              execution of each specific order at a monthly or bimonthly basis.
              Therefore Any charges levied by the bank or payment gateway will
              be covered by the staff. Tipping is “voluntary” and at the sole
              discretion of each user. Connectmay at its sole discretion decide
              the exact allocation of the tip between the various staff members
              that contributed to the execution of the orders. It is the sole
              responsibility of the picker and driver to provide accurate bank
              details to German Standard Group  via the online verification/validation
              form. German Standard Group  will not be liable in case of inaccurate
              information provided or incorrect bank transactions.
            </p>
            <br />
            <h4 className="page-text2">11. GENERAL TERMS </h4>
            <br />
            <h4 className="page-text2">11.1. DATA PROTECTION</h4>
            <p className="page-text3">
              {" "}
              Data collected are treated as confidential and in good faith. When
              registration is made, your data is collected for business and
              marketing purposes in the form of personal information such as
              last name, first name, address, email address and phone number. In
              addition to data explicitly entered, information is gathered
              automatically from the log files when you access the Services
              interface. German Standard Group  makes a distinction between master data
              (e.g. IP address, time and date of access) and activity data (e.g.
              name of file accessed, paths clicked on). For statistical
              purposes, this data is anonymously assessed. German Standard Group  may
              share the address, phone number, and other required info with
              partner supermarkets for fulfillment of orders or to have CRM
              systems aligned.
            </p>
            <br />
            <h4 className="page-text2">11.2. RELEASE </h4>
            <p className="page-text3">
              You agree that neither German Standard Group  nor its affiliates or
              licensors are responsible for the fitness or conduct of any shop.
              NeitherConnect nor its affiliates or licensors will be liable for
              any claim, injury or damage arising in connection with the acts or
              omissions of any shop. In the event you have a dispute with any
              shop, you hereby release German Standard Group  and its officers,
              directors, employees, subsidiaries, affiliates, agents and
              representatives from any and all claims, liabilities, costs,
              including without limitation attorney's fees, loss or damage of
              every kind and nature, known and unknown, arising out of or in any
              way connected with such disputes.
            </p>
            <br />
            <h4 className="page-text2">11.3. SHOP LICENSE/ SUBMISSIONS</h4>
            <p className="page-text3">
              Service may now or in the future permit the submission, sharing or
              publishing of photographs, communications or other content
              submitted by you and other users ("User Submissions"). Other than
              personally identifiable information, which is covered under the
              ConnectPrivacy Policy available at{" "}
              <a href="connect.com.sa/privacy-policy ">
                connect.com.sa/privacy-policy{" "}
              </a>
              , any User Submission transmitted or posted to this Software
              Applications will be considered non-confidential. In addition, by
              submitting any User Submission to German Standard Group , you hereby grant German Standard Group 
              Fruits a perpetual, worldwide, non-exclusive, royalty-free,
              sub-licensable and transferable license to use, reproduce,
              distribute, prepare derivative works of, display and perform the
              User Submission in connection with the Services, the Support and
              German Standard Group 's business. We hereby grant each User of the
              Service a non-exclusive license to access their User Submissions
              through Service and to display and publicly perform such User
              Submissions as permitted through the functionality of Service and
              under these Terms and Conditions. In connection with the User
              Submissions, you agree that you will not submit material that: (i)
              is copyrighted, subject to privacy or publicity rights or
              otherwise subject to third party proprietary rights unless you are
              the owner of such rights or have permission from the owner to
              submit the material and to grant German Standard Group  all of the
              license rights granted herein; (ii) is unlawful, obscene,
              harassing, defamatory, libelous, pornographic, hateful, racially
              or ethnically offensive or is otherwise inappropriate; (iii) could
              damage the reputation ofConnect or any third party; or (iv)
              impersonates another person.German Standard Group  reserves the right to
              remove any User Submissions at its sole discretion and without
              notice or liability to you or to any other person. German Standard Group 
              does not endorse any User Submission or any opinion,
              recommendation or advice therein, and German Standard Group  expressly
              disclaims any and all liability in connection with any User
              Submission. You understand and agree that you may be exposed to
              User Submissions that are inaccurate, offensive or otherwise
              objectionable, and you hereby agree to waive and hereby do waive
              any legal or equitable rights or remedies you may have against
              Connectwith respect thereto. German Standard Group  may provide links to
              Software Applications owned or operated by third parties. German Standard Group 
              Fruits does not endorse the content or any products or services
              available on such Software Applications and is not responsible for
              such content or its security. Your linking to any other Software
              Applications from this Service is at your own risk.
            </p>
            <br />
            <h4 className="page-text2">11.4. DISCLAIMER</h4>
            <p className="page-text3">
              {" "}
              Use of the support is entirely at your own risk. Changes are
              periodically made to the software applications and may be made at
              any time without notice to you. The support is provided on an "as
              is" basis without warranties of any kind, either express or
              implied, including, but not limited to, warranties of
              merchantability, fitness for a particular purpose and
              non-infringement. Connectmakes no warranties or representations
              about the accuracy or completeness of the content provided through
              the support or the content of any software applications linked to
              the Connectsoftware applications. German Standard Group  assumes no
              liability or responsibility for any (i) errors, mistakes, or
              inaccuracies of content; (ii) personal injury or property damage,
              of any nature whatsoever, resulting from your access to and use of
              the Connectsoftware applications or the support; (iii) any
              unauthorized access to or use of German Standard Group 's secure servers
              and/or any and all personal information and/or financial
              information therein.German Standard Group  does not warrant that the
              software applications will operate error-free or that the software
              applications and its server are free of computer viruses and other
              harmful goods. If your use of the software applications results in
              the need for servicing or replacing equipment or data, German Standard Group 
              Fruits shall not be responsible for those costs. German Standard Group ,
              to the fullest extent permitted by law, disclaims all warranties,
              whether express or implied, including without limitation the
              warranty of merchantability, non-infringement of third party
              rights and the warranty of fitness for a particular purpose.
              German Standard Group  makes no warranties about the accuracy,
              reliability, completeness or timeliness of the content, services,
              support, software, text, graphics or links. German Standard Group  and
              its affiliates and licensors cannot and do not guarantee that any
              personal information supplied by you will not be misappropriated,
              intercepted, deleted, destroyed or used by others.
            </p>
            <br />
            <h4 className="page-text2">11.5. LIMITATION OF LIABILITY</h4>
            <p className="page-text3">
              You agree that German Standard Group  shall not be liable for any direct,
              indirect, incidental, special, consequential or exemplary damages
              arising out of or in connection with (i) your use of the support;
              (ii) the liability or fitness of any customer (iii) in connection
              with the performance of or browsing in the software applications
              or your links to other software applications from this software
              applications, even if German Standard Group  has been advised of the
              possibility of such damages. You further agree that German Standard Group 
              Fruits shall not be liable for any damages arising from
              interruption, suspension or termination of services, including
              without limitation any direct, indirect, incidental, special,
              consequential or exemplary damages, whether such interruption,
              suspension or termination was justified or not, negligent or
              intentional, inadvertent or advertent. In no event shall German Standard Group 
              Fruits's total liability to you for any losses arising hereunder
              exceed the amounts paid by you to Connecthereunder. Some
              jurisdictions do not allow the limitation or exclusion of
              warranties or of liability for incidental or consequential damages
              so some of the above limitations may not apply to you. Should a
              jurisdiction be adverse to a limitation or exclusion of
              warranties, such provision shall be deemed severable from this
              agreement and the other provisions shall remain in full force and
              effect.
            </p>
            <br />
            <h4 className="page-text2">11.6. WAIVER</h4>
            <p className="page-text3">
              No waiver of any rights or remedies by German Standard Group  shall be
              effective unless made in writing and signed by an authorized
              representative ofConnect. A failure by German Standard Group  to exercise
              or enforce any rights conferred upon us by Terms of Service shall
              not be deemed to be a waiver or variation of any such rights or
              operate so as to bar the exercise or enforcement thereof at any
              subsequent time or times.
            </p>
            <br />
            <h4 className="page-text2"> 11.7. INDEMNITY </h4>
            <p className="page-text3">
              You agree to defend, indemnify and hold harmless German Standard Group 
              and its officers, directors, employees, agents and affiliates
              (each, an Indemnified Party), from and against any losses, claims,
              actions, costs, damages, penalties, fines and expenses, including
              without limitation attorneys' fees and expenses, that may be
              incurred by an Indemnified Party arising out of, relating to or
              resulting from your unauthorized use of the Software Applications
              or from any breach by you of Terms of Service, including without
              limitation any actual or alleged violation of any federal, state
              or local statute, ordinance, administrative order, rule or
              regulation. German Standard Group  shall provide notice to you promptly
              of any such claim, suit or proceeding and shall have the right to
              control the defense of such action, at your expense, in defending
              any such claim, suit or proceeding.
            </p>
            <br />
            <h4 className="page-text2">11.8. TERMINATION </h4>
            <p className="page-text3">
              At its sole discretion, German Standard Group  may modify or discontinue
              Service, or may modify, suspend or terminate your access to
              Service or the Support, for any reason, with or without notice to
              you and without liability to you or any third party. In addition
              to suspending or terminating your access to Service or the
              Support, Connectreserves the right to take appropriate legal
              action, including without limitation pursuing civil, criminal or
              injunctive redress. Even after your right to use the Support is
              terminated, your Account will remain enforceable against you. You
              may terminate Account at any time, however German Standard Group  do not
              guarantee its termination due to technical availability. All
              provisions which by their nature should survive to give effect to
              those provisions shall survive the termination of Account.
            </p>
            <br />
            <h4 className="page-text2">
              11.9. GOVERNING LAW AND DISPUTE RESOLUTION
            </h4>
            <p className="page-text3">
              Governing Law. This Agreement and your use of the Services of
              German Standard Group  are governed by and construed in accordance with
              the applicable laws in the country where the User is located at
              the time of ordering or using the Services of German Standard Group {" "}
            </p>
            <p className="page-text3">
              {" "}
              Without regards to its conflict of laws principles, If any
              provision of this Agreement is found to be invalid in any court
              having competent jurisdiction, or if any provision of this
              Agreement violates any applicable laws and regulations of any
              court having competent jurisdiction, the invalidity of such
              provision shall not affect the validity of the remaining
              provisions of this Agreement, which shall remain in full force and
              effect.
            </p>
            <p className="page-text3">
              {" "}
              If any dispute of any kind arises between the Parties in
              connection with this Agreement, the Parties shall seek to resolve
              any such dispute by mutual consultation and in an amicable way.
            </p>
            <p className="page-text3">
              {" "}
              If the Parties fail to resolve such dispute by mutual consultation
              or in an amicable way within sixty (60) days from the date of
              notification of one Party to the other of the existence of such
              dispute, the dispute shall be submitted to the exclusive
              jurisdiction of the competent Courts of the country where the User
              is located at the time of ordering or using the Services ofConnect
              (excluding Free Zone courts).
            </p>
            <p className="page-text3">
              {" "}
              The foregoing provisions of this clause are without prejudice to
              the right of German Standard Group  to seek interim relief at any time
              from any court of competent jurisdiction and German Standard Group  shall
              not be deemed to have breached this clause. This “Dispute
              Resolution” section will survive any termination of this
              Agreement.
            </p>
            <br />
            <h4 className="page-text2"> 11.10. NO AGENCY</h4>
            <p className="page-text3">
              No independent contractor, agency, partnership, joint venture,
              employer-employee or franchiser-franchisee relationship is
              intended or created by this Agreement.
            </p>
            <br />
            <h4 className="page-text2">11.11. CHANGES TO THE AGREEMENT </h4>
            <p className="page-text3">
              German Standard Group  reserves the right, at its sole and absolute
              discretion, to change, modify, add to, supplement or delete any of
              the terms and conditions of this Agreement, effective with or
              without prior notice. Your continued use of the Software
              Applications or the Support following any revision to this
              Agreement constitutes your complete and irrevocable acceptance of
              any and all such changes. Contact us If you have any comments or
              questions, please do not hesitate to reach out to us at{" "}
              <a href="mailto:contact@connect.com.sa">
                contact@connect.com.sa
              </a>{" "}
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

export default TermsService;
