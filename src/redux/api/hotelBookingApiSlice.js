import { HOTEL_BOOKING_URL, PAYPAL_URL, STRIPE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const hotelBookingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyHotelBookings: builder.query({
            query: () => {
                const token = localStorage.getItem("token");
                return {
                    url: `${HOTEL_BOOKING_URL}/`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
            },
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `${HOTEL_BOOKING_URL}/${id}/cancel`,
                method: "PUT",
            }),
        }),
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: `${HOTEL_BOOKING_URL}/`,
                method: "POST",
                body: bookingData,
            }),
        }),
        captureHotelPaypalOrderAndSaveHotelBooking: builder.mutation({
            query: (bookingData) => ({
                url: `${PAYPAL_URL}/capture-hotel-booking`,
                method: "POST",
                body: bookingData,
            }),
        }),
        createHotelPaypalOrder: builder.mutation({
            query: (paypalOrder) => ({
                url: `${PAYPAL_URL}/create-hotel-booking`,
                method: "POST",
                body: paypalOrder,
            }),
        }),
        createHotelCheckoutSession: builder.mutation({
            query: (bookingData) => ({
                url: `${STRIPE_URL}/create-hotel-checkout-session`,
                method: "POST",
                body: bookingData,
            }),
        }),
    }),
});

export const {
    useGetMyHotelBookingsQuery,
    useCancelBookingMutation,
    useCreateBookingMutation,
    useCaptureHotelPaypalOrderAndSaveHotelBookingMutation,
    useCreateHotelPaypalOrderMutation,
    useCreateHotelCheckoutSessionMutation,
} = hotelBookingApiSlice;
