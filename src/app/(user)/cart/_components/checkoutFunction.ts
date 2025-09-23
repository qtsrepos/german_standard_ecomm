interface responseType {
    eligibleItems: any[];
    nonEligibleItems: any[];
    status: boolean;
  }
  export const checkoutCartItems = async (data: any[]) => {
    try {
      if (Array.isArray(data) === true) {
        const checkoutItems: responseType = data.reduce(
          (items: responseType, item: any) => {
            const product = {
              ...item,
              buyPrice: Number(item?.price),
              name: item?.name,
              totalPrice: Number(item?.price * item.quantity),
            };

            // Always add items to eligibleItems for checkout
            items.eligibleItems?.push(product);
            items.status = true; // Always allow checkout

            return items;
          },
          { eligibleItems: [], nonEligibleItems: [], status: true }
        );
        return checkoutItems;
      }
      return { eligibleItems: [], nonEligibleItems: [], status: false };
    } catch (err) {
      return { eligibleItems: [], nonEligibleItems: [], status: false };
    }
  };
  