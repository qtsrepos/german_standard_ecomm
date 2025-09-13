const API_ADMIN = {
  // German Standard API Base URL
  GERMAN_STANDARD_BASE: "http://103.120.178.195/Sang.GermanStandard.API/",

  // Login APIs (from Swagger)
  GERMAN_STANDARD_LOGIN: "http://103.120.178.195/Sang.GermanStandard.API/login/login",
  GERMAN_STANDARD_REFRESH_TOKEN: "http://103.120.178.195/Sang.GermanStandard.API/login/regeneratetokens",
  GERMAN_STANDARD_GET_COMPANY: "http://103.120.178.195/Sang.GermanStandard.API/login/getcompany",

  // Tag APIs (from Swagger)
  GERMAN_STANDARD_TAG_LIST: "http://103.120.178.195/Sang.GermanStandard.API/tag/gettaglist",
  GERMAN_STANDARD_STOCK: "http://103.120.178.195/Sang.GermanStandard.API/tag/getstock",
  GERMAN_STANDARD_MASTER_DETAILS: "http://103.120.178.195/Sang.GermanStandard.API/tag/getmasterdetails",
  GERMAN_STANDARD_PRODUCT_RATE: "http://103.120.178.195/Sang.GermanStandard.API/tag/getproductrate",
  GERMAN_STANDARD_PRODUCTS: "http://103.120.178.195/Sang.GermanStandard.API/tag/getproducts",
  GERMAN_STANDARD_CATEGORIES: "http://103.120.178.195/Sang.GermanStandard.API/tag/getsubcategorybycategory",
  GERMAN_STANDARD_UPSERT_ADDRESS: "http://103.120.178.195/Sang.GermanStandard.API/tag/upsertaddress",
  GERMAN_STANDARD_GET_ADDRESS_DETAILS: "http://103.120.178.195/Sang.GermanStandard.API/tag/getaddressdetails",

  // User APIs (from Swagger)
  GERMAN_STANDARD_GET_SCREENS: "http://103.120.178.195/Sang.GermanStandard.API/user/getscreens",
  GERMAN_STANDARD_GET_USER_ACTION: "http://103.120.178.195/Sang.GermanStandard.API/user/getuseraction",

  // GsgTransaction APIs (from Swagger)
  GERMAN_STANDARD_TRANSACTION_SUMMARY: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/gettransactionsummary",
  GERMAN_STANDARD_TRANSACTION_DETAILS: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/gettransactiondetails",
  GERMAN_STANDARD_DELETE_TRANSACTION: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/deletetransaction",
  GERMAN_STANDARD_UPSERT_ORDER: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertorder",
  GERMAN_STANDARD_UPSERT_WISHLIST: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertwishlist",
  GERMAN_STANDARD_UPSERT_CART: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertcart",
} as const;
export default API_ADMIN;
