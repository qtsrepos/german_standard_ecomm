http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertcart

Resquest body
{
  "transId": 0,
  "date": "2025-08-23",
  "customer": 1,
  "warehouse": 2,
  "remarks": "test",
  "discountType": 1,
  "discountCouponRef": "ref01",
  "discountRef": "Ref809",
  "sampleRequestedBy": 1,
  "product": 1,
  "qty": 10,
  "rate": 1,
  "unit": 1,
  "totalRate": 10,
  "addCharges": 0,
  "discount": 0,
  "discountAmt": 0,
  "discountRemarks": "testre",
  "be": 0
}


Response Body

{
  "status": "Success",
  "statusCode": 2001,
  "message": "Inserted successfully",
  "result": "8"
}


http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertwishlist


Request Body
{
  "transId": 0,
  "product": 13812,
  "quantity": 1,
  "customer": 0,
  "remarks": "string",
  "be": 1
}

Response Body
{
  "status": "Success",
  "statusCode": 2001,
  "message": "Inserted successfully",
  "result": "1006"
}


http://103.120.178.195//Sang.GermanStandard.API/gsgtransaction/insertOrUpdateOrder

Request Body

{
  "transId": 0,                        // 0 for new order, or pass existing ID for update
  "date": "2025-08-22",                // Order date (format: yyyy-MM-dd)
  "country": 1,                        // Country ID
  "be": 1,                             // Business Entity ID
  "customer": 101,                     // Customer ID mentioned as nameid in the jwt token
  "deliveryAddress": "123 Test Street",
  "eventName": "Birthday Party",       // can be null
  "remarks": "Deliver before 5 PM",
  "discountType": 0,                   // Discount type code
  "payTerms": 0,                       // Payment terms code
  "discountCouponRef": null,           // Coupon code (if any)
  "discountRef": null,                 // Discount campaign ref (if any)
  "sampleRequestBy": 0,                // Employee/User ID (for sample orders)
  "deliveryTerms": "Handle with care",
  "deliveryDate": "2025-08-23",        // Expected delivery date
  "body": [
    {
      "transId": 0,                    // Line item transaction ID (usually 0 for new)
      "product": 501,                  // Product ID
      "qty": 3,                        // Quantity
      "headerId": 0,                   // Always pass 0
      "voucherType": 0,                // Always pass 0
      "rate": 150,                     // Unit price
      "unit": 1,                       // Unit ID
      "vat": 5,                        // VAT percentage
      "addcharges": 20,                // Extra charges
      "discount": 0,                   // Discount percentage
      "discountAmt": 0,                // Discount amount
      "discountRemarks": null,         // Reason for discount (if any)
      "remarks": "Urgent item"         // Item-level remarks
    }
  ]
}


Response body 

{
  "success": true,
  "result": 12345
}



or 

{
  "status": "Failure",
  "statusCode": 5000,
  "message": "Saved Successfully. But failed Posting to Focus",
  "result": "2035"
}