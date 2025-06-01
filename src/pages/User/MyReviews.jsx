import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAddReviewMutation, useDeleteReviewMutation, useGetHotelBookingCanReviewQuery, useGetMyReviewsQuery, useGetTourBookingCanReviewQuery, useUpdateReviewMutation } from '../../redux/api/reviewApiSlice';
import { Tabs, message } from "antd";
import { FaRegCommentDots } from "react-icons/fa";
import { CLOUDINARY_BASE_URL } from '../../constants/hotel';
import dayjs from "dayjs";
import { FaBuilding } from "react-icons/fa6";
import ReviewModal from '../../components/ReviewModal';
import { toast } from 'react-toastify';
import { IoTicketSharp } from "react-icons/io5";
import { FaStar, FaRegStar, FaStarHalfAlt, FaEdit, FaTrash } from "react-icons/fa";

const UnreviewedTab = () => {
    const { user } = useSelector((state) => state.auth);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);
    const [itemId, setItemId] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [type, setType] = useState(null);

    const { data: hotelBookings, isLoading: isHotelBookingLoading, refetch: refetchHotel } = useGetHotelBookingCanReviewQuery(user._id);
    const { data: tourBookings, isLoading: isTourBookingLoading, refetch: redetchTour } = useGetTourBookingCanReviewQuery(user._id);
    const [addReview] = useAddReviewMutation();

    const handleOpenReviewModal = (itemId, bookingId, type) => {
        setItemId(itemId);
        setBookingId(bookingId);
        setType(type);
        setModalKey(prevKey => prevKey + 1);
        setIsReviewModalOpen(true);
    };
    const handleCloseReviewModal = () => {
        setItemId(null);
        setBookingId(null);
        setType(null);
        setIsReviewModalOpen(false);
    };

    const handleAddReview = async (review) => {
        const reviewData = {
            userId: user._id,
            ...review,
            reviewableId: itemId,
            reviewableType: type,
            bookingId: bookingId,
        };
        try {
            const res = await addReview(reviewData).unwrap();
            console.log("Review added successfully:", reviewData);
            toast.success("Thêm review thành công");
            refetchHotel();
            redetchTour();
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error("Thêm review thất bại");
        }
        handleCloseReviewModal();
    }

    if (isHotelBookingLoading || isTourBookingLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Đơn khách sạn</h2>
            {hotelBookings?.length === 0 ? (
                <p className="text-center text-gray-500 mb-4">Không có đơn khách sạn nào có thể đánh giá.</p>
            ) : (
                hotelBookings.map((booking, index) => (
                    <div
                        key={`hotel-${index}`}
                        className="bg-white rounded-md py-4 px-8 hover:shadow-lg duration-300 flex mb-6"
                    >
                        <div className="flex items-start mb-4 flex-1">
                            <FaBuilding className="text-[18px] mr-2 mt-2 text-blue-400" />
                            <div>
                                <p className="font-semibold text-[18px]">{booking.hotelId.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {dayjs(booking.checkin).format("DD/MM/YYYY")} -{" "}
                                    {dayjs(booking.checkout).format("DD/MM/YYYY")} (
                                    {dayjs(booking.checkout).diff(dayjs(booking.checkin), "day")} đêm)
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {booking.numGuests} khách, {booking.numRooms} phòng
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleOpenReviewModal(booking.hotelId._id, booking._id, 'Hotel')}
                                        className="text-orange-600 text-[14px] font-medium mt-2 bg-orange-100 border-2 border-orange-400 px-3 py-1 rounded-md hover:bg-orange-200 transition-colors duration-200"
                                    >
                                        Viết đánh giá
                                    </button>
                                </div>

                                <ReviewModal
                                    visible={isReviewModalOpen}
                                    onCancel={handleCloseReviewModal}
                                    onAddReview={handleAddReview}
                                    key={modalKey}
                                />
                            </div>
                        </div>
                        <div className="rounded-xl overflow-hidden h-[100px] w-[140px]">
                            <img
                                src={`${CLOUDINARY_BASE_URL}/${booking.hotelId.img[0]}`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))
            )}

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Đơn tour</h2>
            {tourBookings?.length === 0 ? (
                <p className="text-center text-gray-500">Không có đơn tour nào có thể đánh giá.</p>
            ) : (
                tourBookings.map((booking, index) => (
                    <div
                        key={`tour-${index}`}
                        className="bg-white rounded-md py-4 px-8 hover:shadow-lg duration-300 flex mb-6"
                    >
                        <div className="flex items-start mb-4 flex-1">
                            <IoTicketSharp className="text-[18px] mr-2 mt-2 text-blue-400" />
                            <div>
                                <p className="font-semibold text-[18px]">{booking.tourId.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {dayjs(booking.useDate).format("DD/MM/YYYY")}
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleOpenReviewModal(booking.tourId._id, booking._id, 'Tour')}
                                        className="text-orange-600 text-[14px] font-medium mt-2 bg-orange-100 border-2 border-orange-400 px-3 py-1 rounded-md hover:bg-orange-200 transition-colors duration-200"
                                    >
                                        Viết đánh giá
                                    </button>
                                </div>

                                <ReviewModal
                                    visible={isReviewModalOpen}
                                    onCancel={handleCloseReviewModal}
                                    onAddReview={handleAddReview}
                                    key={modalKey}
                                />
                            </div>
                        </div>
                        <div className="rounded-xl overflow-hidden h-[100px] w-[140px]">
                            <img
                                src={`${CLOUDINARY_BASE_URL}/${booking.tourId.images[0]}`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const ReviewedTab = () => {
    const [messageApi, contextMessageHolder] = message.useMessage();
    const { user } = useSelector((state) => state.auth);
    const { data: myReviews, isLoading: isReviewsLoading, refetch } = useGetMyReviewsQuery(user._id);
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview, { isLoading: isDeleting, isSuccess }] = useDeleteReviewMutation();

    const [editingReview, setEditingReview] = useState(null);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);


    const handleOpenEditModal = (editingReview, editingReviewId) => {
        setEditingReview(editingReview);
        setEditingReviewId(editingReviewId);
        setModalKey(prevKey => prevKey + 1);
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setEditingReview(null);
        setEditingReviewId(null);
        setIsEditModalOpen(false);
    }

    const handleUpdateReview = async (updatedReview) => {
        try {
            const res = await updateReview({ id: editingReviewId, review: updatedReview }).unwrap();
            toast.success("Cập nhật đánh giá thành công");
            console.log("Review updated successfully:", res);
            refetch();
        } catch (error) {
            console.error("Error updating review:", error);
            toast.error("Cập nhật đánh giá thất bại");
        }
        handleCloseModal();
    }

    const handleDeleteReview = async (reviewId) => {
        const confirm = window.confirm("Xác nhận xoá?");
        if (!confirm) return;
        try {
            const res = await deleteReview(reviewId).unwrap();
            console.log("Review deleted successfully:", res);
            toast.success("Xoá đánh giá thành công");
            refetch();
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Xoá đánh giá thất bại");
        }
    }

    useEffect(() => {
        if (isDeleting) {
            messageApi.open({
                key: 'deleting',
                type: 'loading',
                content: 'Đang xoá...',
                duration: 0,
            });
        }
        if (isSuccess) {
            messageApi.destroy('deleting');
        }
    }, [isDeleting, isSuccess]);

    if (isReviewsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!myReviews || myReviews.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-6">Bạn chưa có đánh giá nào.</div>
        );
    }

    return (
        <div className="space-y-4">
            {contextMessageHolder}
            {myReviews.map((review) => (
                <div
                    key={review._id}
                    className="bg-white shadow-md rounded-md p-5 flex flex-col sm:flex-row justify-between gap-4 relative"
                >
                    <div className="absolute top-4 right-4 flex gap-3 text-gray-500">
                        <button
                            onClick={() => handleOpenEditModal(review, review._id)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            <FaEdit className='text-[16px]' />
                        </button>
                        <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <FaTrash />
                        </button>

                        <ReviewModal
                            visible={isEditModalOpen}
                            onCancel={handleCloseModal}
                            onUpdateReview={handleUpdateReview}
                            editingReview={editingReview}
                            key={modalKey}
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                            {review.reviewableId?.name}
                        </h3>

                        <div className="flex items-center text-yellow-500 mb-1">
                            {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                                <FaStar key={`full-${i}`} />
                            ))}
                            {review.rating % 1 === 0.5 && <FaStarHalfAlt key="half" />}
                            {Array.from({
                                length:
                                    5 -
                                    Math.floor(review.rating) -
                                    (review.rating % 1 === 0.5 ? 1 : 0),
                            }).map((_, i) => (
                                <FaRegStar key={`empty-${i}`} />
                            ))}
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold text-orange-500 text-[15px]">
                                {Number(review.rating).toFixed(1)}
                            </span> /5.0 –
                            {review.rating >= 4 ? "Tuyệt vời"
                                : review.rating >= 3 ? "Tốt"
                                    : "Trung bình"}
                        </p>

                        <p className="text-gray-600 text-[16px]">{review.comment}</p>

                        {review.images.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {review.images.slice(0, 3).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${CLOUDINARY_BASE_URL}/${img}`}
                                        alt={`review-img-${idx}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                ))}
                                {review.images.length > 3 && (
                                    <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 text-sm font-medium">
                                        +{review.images.length - 3}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="text-sm text-gray-400 mt-3">
                            {review.reviewableType} | Đánh giá vào{" "}
                            {dayjs(review.createdAt).format("DD/MM/YYYY")}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MyReviews = () => {

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FaRegCommentDots className="w-7 h-7 text-blue-500" />
                        Đánh giá
                    </h2>
                    <Tabs
                        defaultActiveKey="hotel"
                        tabBarGutter={32}
                        type="line"
                        size="large"
                        className="px-4 rounded-lg"
                        items={[
                            {
                                key: "unreviewed",
                                label: "Thêm đánh giá",
                                children: <UnreviewedTab />
                            },
                            {
                                key: "reviewed",
                                label: "Đã đánh giá",
                                children: <ReviewedTab />
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyReviews