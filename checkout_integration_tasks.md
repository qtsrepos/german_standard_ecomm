# Checkout Page Integration Tasks

## 🛒 **Current State Analysis**
- **Status**: Checkout page exists and partially functional
- **Location**: `src/app/(screens)/checkout/page.tsx`
- **Current Integration**: Uses legacy APIs, not German Standard
- **Components**: Address, payment, and summary components exist
- **Critical Gap**: No German Standard API integration for order creation

## 🔧 **German Standard API Integration**

### **Available Checkout APIs**
```typescript
// German Standard APIs (Primary)
GERMAN_STANDARD_UPSERT_ORDER: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertorder"
GERMAN_STANDARD_UPSERT_ADDRESS: "http://103.120.178.195/Sang.GermanStandard.API/tag/upsertaddress"
GERMAN_STANDARD_GET_ADDRESS_DETAILS: "http://103.120.178.195/Sang.GermanStandard.API/tag/getaddressdetails"

// Legacy APIs (Current)
ORDER: "order/" // post
CALCULATE_DELIVERY_CHARGE: "calculate_delivery" // POST
PAYMENT_GATEWAY_GETTOKEN: "payment_gateway/token" // GET
PAYMENT_GATEWAY_ORDER: "payment_gateway/order/" // GET
```

## 📋 **Implementation Tasks**

### **Phase 1: Core Checkout Integration** ⭐ HIGH PRIORITY

#### **Task 1: German Standard Order Creation**
- **File**: `src/app/(screens)/checkout/page.tsx`
- **Current Issue**: `PlaceOrder()` function uses legacy order API
- **Action**: Replace with German Standard `upsertOrder`
- **Implementation**:
  ```typescript
  const PlaceOrder = async () => {
    try {
      const orderData: OrderRequest = {
        transId: 0, // New order
        customerInfo: {
          customerId: session.user.id,
          name: `${session.user.first_name} ${session.user.last_name}`,
          email: session.user.email,
          phone: session.user.phone
        },
        items: Checkout.Checkout.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          variantId: item.variantId
        })),
        shipping: {
          addressId: Checkout.address.id,
          method: "standard",
          cost: delivery_charge
        },
        payment: {
          method: payment_method,
          status: "pending",
          amount: grand_total
        }
      };

      const result = await germanStandardApi.upsertOrder(orderData);

      if (result.status === "Success") {
        // Clear cart after successful order
        await germanStandardApi.clearCart();
        navigation.replace(`/checkoutsuccess/${result.result}`);
      }
    } catch (error) {
      notificationApi.error({
        message: "Order Creation Failed",
        description: error.message
      });
    }
  };
  ```

#### **Task 2: Address Management Integration**
- **Files**:
  - `src/app/(screens)/checkout/_components/addressBox.tsx`
  - `src/app/(screens)/checkout/_components/addressForm.tsx`
  - `src/app/(screens)/checkout/_components/addressItem.tsx`
- **Actions**:
  - Replace legacy address APIs with German Standard address APIs
  - Implement address validation through German Standard
  - Connect address selection to German Standard address details

#### **Task 3: Cart Integration with Checkout**
- **File**: `src/app/(screens)/checkout/page.tsx`
- **Action**: Ensure checkout loads cart data from German Standard
- **Dependencies**: Requires functional cart system (see cart_page_tasks.md)
- **Implementation**:
  ```typescript
  const loadCheckoutData = async () => {
    // Load cart items from German Standard
    const cartItems = await germanStandardApi.getCartItems();

    // Load user addresses from German Standard
    const addresses = await germanStandardApi.getUserAddresses();

    // Update checkout state
    dispatch(storeCheckout({
      Checkout: cartItems,
      address: addresses[0] // Default address
    }));
  };
  ```

#### **Task 4: Order Confirmation Enhancement**
- **File**: `src/app/(screens)/checkoutsuccess/[id]/page.tsx`
- **Action**: Load order details from German Standard transaction details
- **Implementation**:
  ```typescript
  const loadOrderConfirmation = async (orderId: string) => {
    const orderDetails = await germanStandardApi.getTransactionDetails(orderId);
    setOrderDetails(orderDetails);
  };
  ```

### **Phase 2: Enhanced Checkout Features** 🔶 MEDIUM PRIORITY

#### **Task 5: Real-time Inventory Validation**
- **Implementation**: Validate cart items against current inventory before checkout
- **Features**:
  - Stock availability checking
  - Price validation
  - Product discontinuation alerts
  - Automatic cart updates for out-of-stock items

#### **Task 6: Delivery Charge Calculation**
- **Current State**: Uses legacy `CALCULATE_DELIVERY_CHARGE` API
- **Enhancement**: Integrate with German Standard shipping calculations
- **Features**:
  - Real-time shipping cost calculation
  - Multiple shipping option support
  - Delivery time estimation
  - Shipping method selection

#### **Task 7: Payment Processing Enhancement**
- **Files**:
  - `src/app/(screens)/checkout/_components/paymentBox.tsx`
- **Actions**:
  - Enhance payment method selection
  - Add payment validation
  - Implement payment security features
  - Connect to German Standard payment tracking

#### **Task 8: Checkout Validation System**
- **Implementation**: Comprehensive checkout validation
- **Features**:
  - Address completeness checking
  - Payment method validation
  - Order total verification
  - Terms and conditions acceptance

### **Phase 3: Advanced Checkout Features** 🔷 LOW PRIORITY

#### **Task 9: Guest Checkout Support**
- **Implementation**: Allow checkout without account creation
- **Features**:
  - Guest user information collection
  - Optional account creation post-checkout
  - Guest order tracking
  - Email-based order management

#### **Task 10: Checkout Optimization**
- **Implementation**: Performance and UX improvements
- **Features**:
  - One-page checkout option
  - Auto-save checkout progress
  - Quick checkout for returning customers
  - Mobile checkout optimization

#### **Task 11: Promotional Code System**
- **Implementation**: Discount and coupon code support
- **Features**:
  - Coupon code validation
  - Discount calculation
  - Promotional offer display
  - Bulk discount support

#### **Task 12: Order Notes and Instructions**
- **Implementation**: Custom order instructions
- **Features**:
  - Delivery instructions
  - Gift message support
  - Special handling requests
  - Order customization options

## 🔗 **API Integration Details**

### **German Standard Checkout API Schema**
```typescript
interface CheckoutRequest {
  cartItems: CartItem[];
  shippingAddress: AddressDetails;
  billingAddress?: AddressDetails;
  paymentMethod: PaymentMethodDetails;
  shippingMethod: ShippingMethodDetails;
  specialInstructions?: string;
  promoCode?: string;
}

interface OrderRequest {
  transId: number; // 0 for new order
  customerInfo: CustomerInfo;
  items: OrderItem[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  notes?: string;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount?: number;
}
```

### **Required API Methods**
```typescript
// To implement in germanStandardApi.ts
async validateCheckout(checkoutData: CheckoutRequest): Promise<ValidationResult>
async calculateShipping(addressId: number, items: CartItem[]): Promise<ShippingOptions>
async upsertOrder(orderRequest: OrderRequest): Promise<OrderResponse>
async clearCart(): Promise<boolean>
async getUserAddresses(): Promise<AddressDetails[]>
async validatePaymentMethod(paymentData: PaymentDetails): Promise<boolean>
```

## 📁 **Files to Modify**

### **Primary Files**
- `src/app/(screens)/checkout/page.tsx` - Main checkout logic
- `src/app/(screens)/checkout/_components/addressBox.tsx` - Address selection
- `src/app/(screens)/checkout/_components/paymentBox.tsx` - Payment methods
- `src/app/(screens)/checkout/_components/summaryCard.tsx` - Order summary

### **Supporting Files**
- `src/app/(screens)/checkout/_components/addressForm.tsx` - Address management
- `src/app/(screens)/checkout/_components/checkoutItem.tsx` - Cart item display
- `src/app/(screens)/checkoutsuccess/[id]/page.tsx` - Order confirmation
- `src/redux/slice/checkoutSlice.ts` - Checkout state management

## 🎯 **Success Criteria**

1. **German Standard Integration**: All checkout operations use German Standard APIs
2. **Seamless Order Creation**: Orders created successfully through German Standard
3. **Address Management**: Addresses managed through German Standard system
4. **Payment Integration**: Payment processing connected to order creation
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Performance**: Fast and responsive checkout experience

## ⚠️ **Critical Dependencies**

1. **Authentication**: Checkout requires valid German Standard session
2. **Cart System**: Functional cart integration (see cart_page_tasks.md)
3. **Address System**: German Standard address management
4. **Payment Gateway**: Payment processing integration
5. **Inventory System**: Real-time stock validation
6. **Email System**: Order confirmation emails

## 🔄 **Integration Points**

### **Cart Integration**
- Load cart items from German Standard cart system
- Real-time cart updates during checkout
- Cart clearing after successful order placement
- Cart validation before checkout

### **Address Integration**
- Load user addresses from German Standard
- Address validation and formatting
- New address creation during checkout
- Shipping cost calculation based on address

### **Payment Integration**
- Payment method validation
- Payment processing coordination
- Payment status tracking
- Refund processing capabilities

### **Order Integration**
- Order creation through German Standard
- Order confirmation and tracking
- Order status updates
- Order history integration

## 📋 **Validation Requirements**

### **Pre-Checkout Validation**
- Cart not empty
- All items in stock
- Valid shipping address
- Valid payment method
- User authentication (if required)

### **During Checkout Validation**
- Inventory availability
- Shipping cost calculation
- Payment authorization
- Order total verification
- Terms acceptance

### **Post-Checkout Actions**
- Order confirmation
- Cart clearing
- Email notifications
- Inventory updates
- Payment processing