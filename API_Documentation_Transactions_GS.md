> **[API Documentation - Transaction Endpoints]{.underline}**

**POST Endpoint for Inserting or Updating Order**

This endpoint allows to insert or update Order.

Endpoint:

![](media/image1.png){width="6.268055555555556in" height="0.49375in"}

**Request Body Fields**

-   **transId** *(int)* → Transaction ID of the order. Pass 0 for
    Insert. Transaction ID for Update

-   **date** *(date)* → Date of the order. Should be passed in
    "yyyy-MM-dd" format.

-   **country** *(int)* → Country Id.

-   **be** *(int, optional)* → Business Entity.

-   **customer** *(int, optional)* → Customer Id.

-   **deliveryAddress** *(string, optional)* → Address where goods will
    be delivered.

-   **eventName** *(string, optional)* → Event name associated with the
    order.

-   **remarks** *(string, optional)* → General remarks or comments about
    the order.

-   **discountType** *(int, optional)* → Type of discount applied.

-   **payTerms** *(int, optional)* → Payment terms identifier.

-   **discountCouponRef** *(string, optional)* → Reference code for
    discount coupon, if any.

-   **discountRef** *(string, optional)* → Reference identifier for
    discount campaign/promotion.

-   **sampleRequestBy** *(int, optional)* → Employee/User ID who
    requested sample order (if applicable).

-   **deliveryTerms** *(string, optional)* → Special delivery
    instructions or terms.

-   **deliveryDate** *(date, optional)* → Expected delivery date.

**Order Body (Items List → body)**

-   **transId** *(int, optional)* → Transaction ID reference for the
    line item (if linked).

-   **product** *(int, required)* → Product ID

-   **qty** *(decimal, required)* → Quantity of the product ordered.

-   **headerId** *(int, optional)* → Reference Header ID.please pass
    zero

-   **voucherType** *(int, optional)* → Voucher type reference. please
    pass zero

-   **rate** *(decimal, optional)* → Unit price of the product.

-   **unit** *(int, optional)* → Unit ID.

-   **vat** *(decimal, optional)* → VAT/Tax percentage applied to the
    item.

-   **addcharges** *(decimal, optional)* → Additional charges

-   **discount** *(decimal, optional)* → Discount percentage applied on
    item level.

-   **discountAmt** *(decimal, optional)* → Discount amount applied on
    item level.

-   **discountRemarks** *(string, optional)* → Remarks/reason for
    item-level discount.

-   **remarks** *(string, optional)* → Any remarks specific to the
    product/item.

Request Body:

{

\"transId\": 0,

\"date\": \"2025-08-22\",

\"country\": 0,

\"be\": 0,

\"iCustomer\": 0,

\"deliveryAddress\": \"string\",

\"eventName\": \"string\",

\"remarks\": \"string\",

\"discountType\": 0,

\"payTerms\": 0,

\"discountCouponRef\": \"string\",

\"discountRef\": \"string\",

\"sampleRequestBy\": 0,

\"deliveryTerms\": \"string\",

\"deliveryDate\": \"2025-08-22\",

\"body\": \[

{

\"transId\": 0,

\"product\": 0,

\"qty\": 0,

\"headerId\": 0,

\"voucherType\": 0,

\"rate\": 0,

\"unit\": 0,

\"vat\": 0,

\"addcharges\": 0,

\"discount\": 0,

\"discountAmt\": 0,

\"discountRemarks\": \"string\",

\"remarks\": \"string\"

}

\]

}

Sample Request:

{

  \"transId\": 0,

  \"date\": \"2025-08-22\",

  \"country\": 1,  

  \"be\": 1,

  \"customer\": 0,

  \"deliveryAddress\": \"test\",

  \"eventName\": \"chk\",

  \"remarks\": \"event\",

  \"discountType\": 0,

  \"payTerms\": 0,

  \"discountCouponRef\": null,

  \"discountRef\": null,

  \"sampleRequestBy\": 0,

  \"deliveryTerms\": null,

  \"deliveryDate\": null,

  \"body\": \[

    {

      \"transId\": 0,

      \"product\": 1,

      \"qty\": 5,

      \"headerId\": 0,

      \"voucherType\": 1,

      \"rate\": 10,

       \"unit\": 1,

      \"vat\": 5,

      \"addcharges\": 1,

      \"discount\": 0,

      \"discountAmt\": 0,

      \"discountRemarks\": null,

      \"remarks\": null

    }

  \]

}

**Response:**

**On Successful Insertion:**

![](media/image2.png){width="6.268055555555556in"
height="2.546527777777778in"}

**On Successful Updation:**

![](media/image3.png){width="6.268055555555556in"
height="2.3965277777777776in"}

**Note:** In Success response, the value in "result" field of API
response is the transId (Transaction ID) of the inserted or updated
transaction.

**GET Endpoint for getting Transaction Summary**

This endpoint retrieves the Summary view of Transactions based on
DocType. For Order pass docType as 2.

Rest of the parameters are to facilitate caching, pagination and search.

Endpoint:

![](media/image4.png){width="6.268055555555556in"
height="0.4111111111111111in"}

Parameters:

![](media/image5.png){width="6.268055555555556in"
height="5.561111111111111in"}

  -----------------------------------------------------------------------
  **Parameter    **Description**
  Name**         
  -------------- --------------------------------------------------------
  docType        Unique identifier assigned to specific Transaction
                 Type.\
                 doctype is 1 for Order.

  refreshFlag    When passed as false, data will be pulled from cache. To
                 be passed as True always first time

  be             Reserved for Business Entity

  pageNumber     Page Number

  pageSize       No. of records needed to be displayed per page

  search         Search string
  -----------------------------------------------------------------------

Response:

![](media/image6.png){width="6.268055555555556in"
height="1.6444444444444444in"}

**GET Endpoint for getting Transaction Details**

This endpoint is to retrieve details of specified Transaction based on
DocType.

Endpoint:

![](media/image7.png){width="6.268055555555556in"
height="0.4048611111111111in"}

Parameters:![](media/image8.png){width="6.268055555555556in"
height="3.4277777777777776in"}

Response:

![](media/image9.png){width="6.268055555555556in" height="0.99375in"}

**DELETE Endpoint for Deleting Transactions**

This endpoint allows to delete one or more Transactions.

Endpoint:

![](media/image10.png){width="6.268055555555556in"
height="0.41458333333333336in"}

Request Body:

![](media/image11.png){width="4.531882108486439in"
height="3.2817082239720037in"}

Sample Request:

![](media/image12.png){width="3.17752624671916in"
height="3.4692344706911635in"}

Success Response:

![](media/image13.png){width="6.1779451006124235in"
height="2.1461329833770777in"}

Failure Response:

![](media/image14.png){width="6.268055555555556in"
height="2.001388888888889in"}

**POST Endpoint for Inserting or Updating WishList**

This endpoint allows to insert or update WishList.

Endpoint:

![](media/image15.png){width="6.268055555555556in"
height="0.45902777777777776in"}

**Request Body Fields**

-   **TransId** (INT): 0 = Transaction ID of the wishlist. Pass 0 for
    Insert. Transaction ID for Update.

```{=html}
<!-- -->
```
-   **Product** (INT): Product ID.

-   **Quantity** (INT): Quantity requested.

-   **Customer** (INT): Customer ID.

-   **Remarks** ( string ): Remarks.

-   **BE** (INT): Business Entity .

> **Request Body**
>
> {
>
> \"transId\": 0,
>
> \"product\": 1,
>
> \"quantity\": 10,
>
> \"customer\": 1,
>
> \"remarks\": \"test\",
>
> \"be\": 0
>
> }
>
> **Response**
>
> ![](media/image16.png){width="6.268055555555556in"
> height="1.5645833333333334in"}

![](media/image17.png){width="6.275in" height="1.1298611111111112in"}

**GET Endpoint for getting Transaction Summary**

This endpoint retrieves the Summary view of Transactions based on
DocType. For WisList pass docType as 2.

Rest of the parameters are to facilitate caching, pagination and search.

Endpoint:

![](media/image4.png){width="6.268055555555556in"
height="0.4111111111111111in"}

Request

**http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/gettransactionsummary?docType=2&be=0&pageNumber=0&pageSize=10&search=**

**Response**

![](media/image18.png){width="6.268055555555556in"
height="1.1333333333333333in"}

**GET Endpoint for getting Transaction Details**

This endpoint is to retrieve details of specified Transaction based on
DocType.

Endpoint:

![](media/image7.png){width="6.268055555555556in"
height="0.4048611111111111in"}

Parameters:

![](media/image19.png){width="6.268055555555556in"
height="2.4402777777777778in"}

Response :

![](media/image20.png){width="6.268055555555556in"
height="0.7833333333333333in"}

**DELETE Endpoint for Deleting Transactions**

This endpoint allows to delete one or more Transactions.

Endpoint:

![](media/image10.png){width="6.268055555555556in"
height="0.41458333333333336in"}

Request Body:

![](media/image21.png){width="6.268055555555556in"
height="2.4166666666666665in"}

Response

![](media/image22.png){width="6.268055555555556in"
height="0.9701388888888889in"}

![](media/image23.png){width="6.268055555555556in"
height="0.9791666666666666in"}

**POST Endpoint for Inserting or Updating Cart**

This endpoint allows to insert or update Cart items.

Endpoint:

![](media/image24.png){width="6.268055555555556in" height="0.675in"}

## **Request Body**

## Request Body

The request body must be sent in **JSON** format.

-   transId → The transaction ID. Use 0 for new records.

-   date → The transaction date .

-   customer → The customer ID for whom the cart is being created.

-   warehouse → The warehouse ID from which the stock will be allocated.

-   remarks → Any remarks for this cart.

-   discountType → Type of discount, if any.

-   discountCouponRef and discountRef → References for discounts.

-   sampleRequestedBy → ID of the person who requested a sample (if
    applicable).

-   product → The product ID being added to the cart.

-   qty → Quantity of the product.

-   rate → The rate per unit of the product.

-   unit → The unit of measurement.

-   totalRate → The calculated total (qty × rate).

-   addCharges → Any additional charges applied.

-   discount, discountAmt, discountRemarks → Discount details.

-   be → Business entity identifier.

Sample Request :

{

\"transId\": 0,

\"date\": \"2025-08-23\",

\"customer\": 1,

\"warehouse\": 2,

\"remarks\": \"test\",

\"discountType\": 1,

\"discountCouponRef\": \"ref01\",

\"discountRef\": \"Ref809\",

\"sampleRequestedBy\": 1,

\"product\": 1,

\"qty\": 10,

\"rate\": 1,

\"unit\": 1,

\"totalRate\": 10,

\"addCharges\": 0,

\"discount\": 0,

\"discountAmt\": 0,

\"discountRemarks\": \"testre\",

\"be\": 0

}

Response :

![](media/image25.png){width="6.268055555555556in"
height="1.7083333333333333in"}

**GET Endpoint for getting Transaction Summary**

This endpoint retrieves the Summary view of Transactions based on
DocType. For Cart pass docType as 3.

Rest of the parameters are to facilitate caching, pagination and search.

Endpoint:

![](media/image4.png){width="6.268055555555556in"
height="0.4111111111111111in"}

Parameters:

![](media/image5.png){width="2.6142443132108486in"
height="2.3193952318460194in"}

Response :

![](media/image26.png){width="6.268055555555556in"
height="0.8868055555555555in"}

**GET Endpoint for getting Transaction Details**

This endpoint is to retrieve details of specified Transaction based on
DocType.

Endpoint:

![](media/image7.png){width="6.268055555555556in"
height="0.4048611111111111in"}

Parameters :

![](media/image27.png){width="6.268055555555556in"
height="3.3222222222222224in"}

Response :

![](media/image28.png){width="6.268055555555556in"
height="0.7638888888888888in"}

**DELETE Endpoint for Deleting Transactions**

This endpoint allows to delete one or more Transactions.

Endpoint:

![](media/image10.png){width="6.268055555555556in"
height="0.41458333333333336in"}

Request Body:

![](media/image29.png){width="4.354774715660542in"
height="4.542300962379702in"}

Response :

![](media/image30.png){width="6.268055555555556in"
height="1.6847222222222222in"}

**GET Endpoint for TagList**

Fetches a list of tags based on the given parameters such as tagId,
languageId, bE, and type.

![](media/image31.jpeg){width="2.7416666666666667in"
height="2.941666666666667in"}

Endpoint:

![](media/image32.png){width="6.268055555555556in"
height="0.44722222222222224in"}

Parameters

![](media/image33.png){width="5.341666666666667in" height="3.825in"}

Response

![](media/image34.png){width="6.268055555555556in"
height="1.2541666666666667in"}

**GET Endpoint for Master Details**

Endpoint :

![](media/image35.png){width="6.268055555555556in"
height="0.35138888888888886in"}

Fetches **detailed information** for a specific master record (such as
customer, product, or warehouse) by ID and tagId.Tagid mentioned above
end point

Parameters

![](media/image36.png){width="4.4in" height="3.316666666666667in"}

Response :

![](media/image37.png){width="6.483333333333333in"
height="1.5333333333333334in"}

**GET Endpoint to Retrieve Stock**

Endpoint :

![](media/image38.png){width="6.268055555555556in"
height="0.5277777777777778in"}

Fetches the **available stock balance** of a given product in a specific
warehouse.

Parameters :

![](media/image39.png){width="6.268055555555556in"
height="4.414583333333334in"}

Response :

![](media/image40.png){width="6.268055555555556in"
height="1.2208333333333334in"}

**GET Endpoint to Retrieve Product Rate**

Endpoint :

![](media/image41.png){width="6.268055555555556in"
height="0.5284722222222222in"}

Fetches the **product rate/pricing details** for a given product in a
specific unit, with optional filters for currency and account.

Parameters :

![](media/image42.png){width="5.3in" height="4.091666666666667in"}

Response :

![](media/image43.png){width="6.268055555555556in"
height="1.4333333333333333in"}

**GET Endpoint to Retrieve Product List**

Endpoint :

![](media/image44.png){width="6.268055555555556in"
height="0.5611111111111111in"}

Fetches a **paginated list of products** with support for search,
category, sub-category, brand, and type filters.

If category, sub-category, brand passing as zero all product
displayed.any value passing specicific parameter its corresponding
product displayed.

Type parameter included.if you filter anything special such as popular
product etc we can handle with type.if any thing needed please inform

Parameters :

![](media/image45.png){width="5.366666666666666in"
height="6.266666666666667in"}

Response :

![](media/image46.png){width="6.268055555555556in"
height="2.066666666666667in"}

**GET Endpoint to Retrieve SubCategory view based on Category**

Endpoint :

![](media/image47.png){width="6.268055555555556in"
height="0.47708333333333336in"}

Fetches **all subcategories** grouped under a specific category.

 If a **specific category ID** is passed, returns its direct
subcategories.

 If category = 0, it returns the **nested category tree.**

Parameters :

![](media/image48.png){width="5.466666666666667in"
height="2.808333333333333in"}

Response :

![](media/image49.png){width="6.268055555555556in" height="2.11875in"}
