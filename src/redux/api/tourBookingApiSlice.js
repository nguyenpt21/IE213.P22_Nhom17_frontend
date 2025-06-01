import { apiSlice } from "./apiSlice";
import { TOUR_BOOKING_URL, PAYPAL_URL, STRIPE_URL } from "../constants";

export const tourBookingSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        capturePaypalOrderAndSaveTourBooking: builder.mutation({
            query: (bookingData) => ({
                url: `${PAYPAL_URL}/capture-tour-booking`,
                method: "POST",
                body: bookingData,
            }),
        }),
        createPaypalOrder: builder.mutation({
            query: (paypalOrder) => ({
                url: `${PAYPAL_URL}/create-tour-booking`,
                method: "POST",
                body: paypalOrder,
            }),
        }),
        createTourCheckoutSession: builder.mutation({
            query: (bookingData) => ({
                url: `${STRIPE_URL}/create-tour-checkout-session`,
                method: "POST",
                body: bookingData,
            }),
        }),
        getStripeBookingStatus: builder.query({
            query: (sessionId) => `${STRIPE_URL}/booking-status?session_id=${sessionId}`,
        }),
        getMyTourBookings: builder.query({
            query: () => {
                const token = localStorage.getItem('token');
                return {
                    url: `${TOUR_BOOKING_URL}/`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
            },
        }),
        cancelTourBooking: builder.mutation({
            query: (id) => ({
                url: `${TOUR_BOOKING_URL}/${id}/cancel`,
                method: "PUT",
            }),
        })
    }),
});

export const {
    useCapturePaypalOrderAndSaveTourBookingMutation,
    useCreatePaypalOrderMutation,
    useCreateTourCheckoutSessionMutation,
    useLazyGetStripeBookingStatusQuery,
    useGetMyTourBookingsQuery,
    useCancelTourBookingMutation
} = tourBookingSlice;
