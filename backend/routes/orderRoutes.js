const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const {
	validateOrder,
	validateOrderStatus,
} = require("../middleware/validation");

// Async handler wrapper to catch errors
const asyncHandler = (fn) => {
	return (req, res, next) => {
		try {
			const result = Promise.resolve(fn(req, res, next));
			if (result && typeof result.catch === "function") {
				result.catch((err) => {
					console.error("AsyncHandler caught error:", err);
					if (typeof next === "function") {
						next(err);
					} else {
						console.error("next is not a function!", typeof next);
						res.status(500).json({
							success: false,
							message: "Internal server error: next is not a function",
						});
					}
				});
			}
		} catch (err) {
			console.error("AsyncHandler sync error:", err);
			if (typeof next === "function") {
				next(err);
			} else {
				console.error("next is not a function!", typeof next);
				res.status(500).json({
					success: false,
					message: "Internal server error: next is not a function",
				});
			}
		}
	};
};

// Customer route - Create order
router.post(
	"/customer",
	validateOrder,
	asyncHandler(async (req, res, next) => {
		try {
			const { customerName, email, contactNumber, shippingAddress, items } =
				req.body;

			if (!items || !Array.isArray(items) || items.length === 0) {
				return res.status(400).json({
					success: false,
					message: "Order must contain at least one item",
				});
			}

			// Calculate total and validate stock
			let total = 0;
			const orderItems = [];

			for (const item of items) {
				const product = await Product.findById(item.productId);
				if (!product) {
					return res.status(404).json({
						success: false,
						message: `Product ${item.productId} not found`,
					});
				}

				if (product.status !== "Active") {
					return res.status(400).json({
						success: false,
						message: `Product ${product.name} is not available`,
					});
				}

				if (product.stock < item.quantity) {
					return res.status(400).json({
						success: false,
						message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
					});
				}

				const lineTotal = product.price * item.quantity;
				total += lineTotal;

				orderItems.push({
					productId: product._id,
					quantity: item.quantity,
					unitPrice: product.price,
					lineTotal,
				});
			}

			// Apply tax (simple fixed % - 10%)
			const tax = total * 0.1;
			const finalTotal = total + tax;

			// Create order
			const order = new Order({
				customerName,
				email,
				contactNumber,
				shippingAddress,
				total: finalTotal,
				status: "New",
			});
			await order.save();

			// Create order items and update stock
			for (const item of orderItems) {
				const orderItem = new OrderItem({
					orderId: order._id,
					productId: item.productId,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					lineTotal: item.lineTotal,
				});
				await orderItem.save();

				// Reduce stock
				await Product.findByIdAndUpdate(item.productId, {
					$inc: { stock: -item.quantity },
				});
			}

			// Populate order with items
			const populatedOrder = await Order.findById(order._id);
			const orderItemsData = await OrderItem.find({
				orderId: order._id,
			}).populate("productId", "name imageUrl");
			res.status(201).json({
				success: true,
				order: {
					...populatedOrder.toObject(),
					items: orderItemsData,
				},
			});
		} catch (error) {
			console.error("=== ERROR IN ORDER CREATION ===");
			console.error("Error name:", error?.name);
			console.error("Error message:", error?.message);
			console.error("Error stack:", error?.stack);
			console.error("Full error:", error);
			throw error; // Let asyncHandler catch it and pass to next
		}
	})
);

// Customer route - Get order by ID
router.get("/customer/:id", async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		const items = await OrderItem.find({ orderId: order._id }).populate(
			"productId",
			"name imageUrl price"
		);

		res.json({
			success: true,
			order: {
				...order.toObject(),
				items,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin routes - Get all orders
router.get("/admin", authMiddleware, async (req, res) => {
	try {
		const { page = 1, limit = 12, status, startDate, endDate } = req.query;
		const query = {};

		if (status) query.status = status;
		if (startDate || endDate) {
			query.createdAt = {};
			if (startDate) query.createdAt.$gte = new Date(startDate);
			if (endDate) query.createdAt.$lte = new Date(endDate);
		}

		const skip = (parseInt(page) - 1) * parseInt(limit);
		const orders = await Order.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Order.countDocuments(query);

		res.json({
			success: true,
			orders,
			totalPages: Math.ceil(total / parseInt(limit)),
			currentPage: parseInt(page),
			total,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin route - Get single order
router.get("/admin/:id", authMiddleware, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		const items = await OrderItem.find({ orderId: order._id }).populate(
			"productId",
			"name imageUrl price stock"
		);

		res.json({
			success: true,
			order: {
				...order.toObject(),
				items,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin route - Update order status
router.patch(
	"/admin/:id/status",
	authMiddleware,
	validateOrderStatus,
	async (req, res) => {
		try {
			const { status } = req.body;
			const order = await Order.findById(req.params.id);

			if (!order) {
				return res
					.status(404)
					.json({ success: false, message: "Order not found" });
			}

			// Handle stock restoration if order is cancelled
			if (status === "Cancelled" && order.status !== "Cancelled") {
				const items = await OrderItem.find({ orderId: order._id });
				for (const item of items) {
					await Product.findByIdAndUpdate(item.productId, {
						$inc: { stock: item.quantity },
					});
				}
			}

			// Handle stock restoration if order was cancelled and now being reactivated
			if (order.status === "Cancelled" && status !== "Cancelled") {
				const items = await OrderItem.find({ orderId: order._id });
				for (const item of items) {
					const product = await Product.findById(item.productId);
					if (product.stock < item.quantity) {
						return res.status(400).json({
							success: false,
							message: `Cannot reactivate order. Insufficient stock for ${product.name}`,
						});
					}
					await Product.findByIdAndUpdate(item.productId, {
						$inc: { stock: -item.quantity },
					});
				}
			}

			order.status = status;
			await order.save();

			const items = await OrderItem.find({ orderId: order._id }).populate(
				"productId",
				"name imageUrl price stock"
			);

			res.json({
				success: true,
				order: {
					...order.toObject(),
					items,
				},
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
);

module.exports = router;
