import { useDispatch, useSelector } from "react-redux";
import API from "@/config/API";
import { POST, GET } from "@/util/apicall";
import { storeCart } from "@/redux/slice/cartSlice";
import { notification } from "antd";
import { clearLocalCart } from "@/redux/slice/localcartSlice";
import { useEffect } from "react";
import { useSession } from "next-auth/react";


const MergeLocalcartToLogin = async () => {
    const { data: session }: any = useSession();
    const LocalCart = useSelector((state: any) => state.LocalCart.items || { items: [] });
    const dispatch = useDispatch();

    useEffect(() => {
        if (session?.token) {
            mergeData()
        }
    }, [session?.token])
    
    const mergeData = async () => {

        if (LocalCart.length == 0) {
            try {
                const url = API.CART_GET_ALL;
                const cartItems: any = await GET(url);
                if (cartItems.status) {
                    dispatch(storeCart(cartItems.data));
                }
            } catch (err) { }
        } else {
            LocalCart.forEach(async (item: any) => {
                const obj = {
                    productId: item?.pid || item?._id,
                    quantity: item.quantity,
                    variantId: null
                }
                try {
                    const newCart: any = await POST(API.CART, obj)
                } catch (err: any) {
                    notification.error({ message: "Something went wrong!" });
                }
            });
            dispatch(clearLocalCart());
            try {
                const cartItems: any = await GET(API.CART_GET_ALL);
                if (cartItems.status) {
                    dispatch(storeCart(cartItems.data));
                }
            } catch (err) { }
        }
    }

}

export default MergeLocalcartToLogin;