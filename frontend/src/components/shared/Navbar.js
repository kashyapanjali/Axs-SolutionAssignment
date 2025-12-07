import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { getCartCount } = useCart();
	const { admin, logout } = useAuth();
	const cartCount = getCartCount();
	const isAdminRoute = location.pathname.startsWith("/admin");

	const handleLogout = () => {
		logout();
		navigate("/admin/login");
	};

	if (isAdminRoute && !location.pathname.includes("/login")) {
		return (
			<nav className='navbar admin-navbar'>
				<div className='container'>
					<Link
						to='/admin/dashboard'
						className='navbar-brand'>
						Admin Portal
					</Link>
					<div className='navbar-menu'>
						<Link
							to='/admin/dashboard'
							className={
								location.pathname === "/admin/dashboard" ? "active" : ""
							}>
							Dashboard
						</Link>
						<Link
							to='/admin/products'
							className={
								location.pathname === "/admin/products" ? "active" : ""
							}>
							Products
						</Link>
						<Link
							to='/admin/orders'
							className={location.pathname === "/admin/orders" ? "active" : ""}>
							Orders
						</Link>
						<Link
							to='/'
							className='nav-link'>
							Storefront
						</Link>
						<button
							onClick={handleLogout}
							className='btn-logout'>
							Logout
						</button>
					</div>
				</div>
			</nav>
		);
	}

	if (isAdminRoute && location.pathname.includes("/login")) {
		return null;
	}

	return (
		<nav className='navbar'>
			<div className='container'>
				<Link
					to='/'
					className='navbar-brand'>
					Retail Store
				</Link>
				<div className='navbar-menu'>
					<Link
						to='/'
						className={location.pathname === "/" ? "active" : ""}>
						Home
					</Link>
					<Link
						to='/cart'
						className='cart-link'>
						Cart ({cartCount})
					</Link>
					<Link
						to='/track-order'
						className='nav-link'>
						Track Order
					</Link>
					{admin && (
						<Link
							to='/admin/dashboard'
							className='admin-link'>
							Admin
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
