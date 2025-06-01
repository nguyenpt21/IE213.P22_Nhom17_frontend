import { href } from "react-router";

export const NAV_LINKS = [
    {
        title: "Tour và trải nghiệm",
        href: "/tour",
        services: [],
    },

    {
        title: "Khách sạn",
        href: "/hotels",
        services: [],
    },
    {
        title: "Về chúng tôi",
        href: "#",
        services: [],
    },
    {
        title: "Liên hệ",
        href: "#",
        services: [],
    },
];

export const FOOTER_SOCIALS = {
    title: "Theo dõi chúng tôi trên",
    links: [
        { img: "/icons/facebook.svg", label: "Facebook", href: "/" },
        { img: "/icons/instagram.svg", label: "Instagram" },
        { img: "/icons/tiktok.svg", label: "TikTok" },
        { img: "/icons/youtube.svg", label: "YouTube" },
        { img: "/icons/telegram.svg", label: "Telegram" },
    ],
};

export const FOOTER_LINKS = [
    {
        title: "Về VagaBond",
        links: [
            "Cách đặt chỗ",
            "Liên hệ chúng tôi",
            "Trợ giúp",
            "Tuyển dụng",
            "Về chúng tôi",
        ],
    },
    {
        title: "Sản phẩm",
        links: ["Khách sạn", "Tour", "Du thuyền", "Massage & Suối nước nóng"],
    },
];

export const FOOTER_PAYMENT = {
    title: "Đối tác thanh toán",
    payments: [
        "/images/footer/payment-1.webp",
        "/images/footer/payment-2.webp",
        "/images/footer/payment-3.webp",
        "/images/footer/payment-4.webp",
        "/images/footer/payment-5.webp",
        "/images/footer/payment-6.webp",
    ],
};

export const PROMOTIONS = [
    {
        link: "/",
        img: "/images/promotion/promotion-1.png",
    },
    {
        link: "/",
        img: "/images/promotion/promotion-2.png",
    },
    {
        link: "/",
        img: "/images/promotion/promotion-3.png",
    },
    {
        link: "/",
        img: "/images/promotion/promotion-4.png",
    },
    {
        link: "/",
        img: "/images/promotion/promotion-5.png",
    },
    {
        link: "/",
        img: "/images/promotion/promotion-6.png",
    },
];
