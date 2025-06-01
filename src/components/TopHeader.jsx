import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { logout } from "../redux/features/authSlice";
const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
    };
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
                            <Link
                                to="#"
                                className="hover:text-primary transition-colors text-[12px] font-medium"
                            >
                                Xem gần đây
                            </Link>
                            <Link
                                to="/sign-up"
                                className="hover:text-primary transition-colors text-[14px]"
                            >
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
                                    {user.firstName?.charAt(0) ||
                                        user.email?.charAt(0) ||
                                        "U"}
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
        </header>
    );
};

export default TopHeader;
