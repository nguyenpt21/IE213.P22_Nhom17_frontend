import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from '../constants';
import { GrLocation } from "react-icons/gr";
import UserDropdown from './UserDropdown';
import { logout } from '../redux/features/authSlice'

export const MainHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/');
    };

    function NavItem({ icon, children, href, Dropdown, notLink }) {
        const [open, setOpen] = useState(false);
        const handleClick = () => {
            if (href) {
                navigate(href);
            }
        };
        return (
            <div
                className="relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onClick={handleClick}
            >
                <div className="flex gap-2 items-center font-semibold text-[14px] px-3 py-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    {icon ? <div>{icon}</div> : null}
                    {notLink ? children : <Link to={href}>{children}</Link>}
                </div>
                {open && Dropdown}
            </div>
        );
    }

    return (
        <header className="top-0 sticky bg-white border-b z-50">
            <div className="container mx-auto flex items-center py-2">
                <Link to="/" className="flex items-center">
                    <h1 className="ml-2 font-bold text-xl">vagabond</h1>
                </Link>

                <div className="flex items-center gap-1 w-[360px] mx-4 rounded-full px-4 h-9 border">
                    <button>
                        <BsSearch className="w-[16px] h-[16px]" />
                    </button>
                    <input
                        type="text"
                        placeholder="Tìm theo điểm đến, hoạt động"
                        className="flex-1 h-full px-1 outline-none border-none bg-transparent text-[14px]"
                    />
                </div>

                <nav className="flex space-x-4 items-center ml-auto font-semibold">
                    {!user ? (
                        <>
                            <Link to="#" className="hover:text-primary transition-colors text-[14px] font-medium">
                                Xem gần đây
                            </Link>
                            <Link to="/sign-up" className="hover:text-primary transition-colors text-[14px]">
                                Đăng ký
                            </Link>
                            <Link
                                to="/sign-in"
                                className="bg-primary text-white rounded-full px-3 py-[6px] text-[14px]"
                            >
                                Đăng nhập
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 relative">
                            <div
                                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
                                onClick={() => setShowDropdown((prev) => !prev)}
                            >
                                <span className="text-blue-500 text-lg font-bold">
                                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <span
                                className="text-blue-500 font-semibold cursor-pointer"
                                onClick={() => setShowDropdown((prev) => !prev)}
                            >
                                {user.firstName} {user.lastName}
                            </span>
                            {showDropdown && (
                                <div className="absolute right-0 top-12 z-50">
                                    <UserDropdown onLogout={handleLogout} />
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <div className="bg-white">
                <div className="container mx-auto py-1">
                    <div className="flex items-center ">
                        <NavItem
                            icon={<GrLocation className="w-[16px] h-[16px]" />}
                            notLink={true}
                            children="Địa điểm muốn đến"
                            href="#"

                        />
                        {NAV_LINKS.map((item, index) => (
                            <NavItem
                                key={index}
                                children={item.title}
                                href={item.href}
                                Dropdown={
                                    item.services.length > 0 && (
                                        <Dropdown data={item.services} />
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}

const Dropdown = ({ data }) => {
    return (
        <div className="absolute pt-1">
            <div className="py-2 bg-white z-10 rounded-xl shadow-lg">
                <ul>
                    {data.map((service, key) => (
                        <li key={key}>
                            <Link
                                to={service.href}
                                className="py-2 px-4 text-[14px] whitespace-nowrap block hover:text-blue-500 transition-colors"
                            >
                                {service.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
