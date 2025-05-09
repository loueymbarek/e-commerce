import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import { customFetchwithCred, customFetch, formatPrice } from "../utils";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { BsStripe } from "react-icons/bs";

import React, { useState } from "react";

export const action =
    (store, queryClient) =>
    async ({ request }) => {
        const formData = await request.formData();
        const { name, address } = Object.fromEntries(formData);
        const user = store.getState().userState.user;
        const { cartItems, orderTotal, numItemsInCart, tax, shipping } = store.getState().cartState;

        const info = {
            name,
            address,
            chargeTotal: orderTotal,
            orderTotal: orderTotal,
            cartItems,
            numItemsInCart,
            tax: tax,
            shippingFee: shipping,
        };

        try {
            const response = await customFetchwithCred.post("/orders", { data: info });
            queryClient.removeQueries(["orders"]);
            store.dispatch(clearCart());
            toast.success("order placed successfully");
            return redirect("/orders");
        } catch (error) {
            console.log(error);
            const errorMessage =
                error?.response?.data?.msg || "there was an error placing your order";
            toast.error(errorMessage);
            //if (error?.response?.status === 401 || 403) return redirect('/login');
            return null;
        }
    };

const CheckoutForm = () => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [error, setError] = useState(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <Form method="POST" className="flex flex-col gap-y-4">
            <h4 className="font-medium text-xl capitalize">shipping information</h4>
            <FormInput label="first name" name="name" type="text" />
            <div className="flex gap-x-4 items-center justify-between">
                <FormInput
                    label="address"
                    name="address"
                    type="text"
                    value={latitude + "," + longitude}
                    className="w-[180%]"
                />

                {/* Get My Location button */}
                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-[35px]"
                    onClick={getLocation}
                >
                    My Location
                </button>
            </div>

            <div className="mt-4">
                <SubmitBtn text="place your order" />
            </div>
        </Form>
    );
};
export default CheckoutForm;
