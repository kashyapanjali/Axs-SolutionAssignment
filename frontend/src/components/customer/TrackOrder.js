import React, { useState } from "react";
import "./TrackOrder.css";
import { orderAPI } from "../../services/api";

const TrackOrder = () => {
	const [input, setInput] = useState("");
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState("");

	//call api to track order
	const handleTrack = async () => {
		setError("");
		setOrders([]);

		try {
			const response = await orderAPI.trackOrder({
				contactNumber: input,
				email: input,
			});

			setOrders(response.data.orders);
		} catch (err) {
			setError(err.response?.data?.message || "No order found");
		}
	};

	return (
		<div className='track-container'>
			<div className='track-box'>
				<h2 className='track-title'>Track Your Order</h2>

				<input
					type='text'
					placeholder='Enter Mobile Number or Email'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className='track-input'
				/>

				<button
					className='track-btn'
					onClick={handleTrack}>
					Track Order
				</button>

				{error && <p className='track-error'>{error}</p>}

				{orders.map((order) => (
					<div
						key={order._id}
						className='track-card'>
						<p>
							<b>Order ID:</b> {order._id}
						</p>
						<p>
							<b>Status:</b> {order.status}
						</p>
						<p>
							<b>Total:</b> ₹{order.total}
						</p>
						<p>
							<b>Address:</b> {order.shippingAddress}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default TrackOrder;
