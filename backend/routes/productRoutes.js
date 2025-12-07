const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const { validateProduct } = require("../middleware/validation");
const upload = require("../middleware/upload");

// Customer routes - Get all active products
router.get("/customer", async (req, res) => {
	try {
		const { search, category, page = 1, limit = 12 } = req.query;
		const query = { status: "Active" };

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		if (category) {
			query.category = category;
		}

		const skip = (parseInt(page) - 1) * parseInt(limit);
		const products = await Product.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Product.countDocuments(query);

		res.json({
			success: true,
			products,
			totalPages: Math.ceil(total / parseInt(limit)),
			currentPage: parseInt(page),
			total,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Customer route - Get single product
router.get("/customer/:id", async (req, res) => {
	try {
		const product = await Product.findOne({
			_id: req.params.id,
			status: "Active",
		});
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}
		res.json({ success: true, product });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin routes - Get all products
router.get("/admin", authMiddleware, async (req, res) => {
	try {
		const { page = 1, limit = 12, status, category } = req.query;
		const query = {};

		if (status) query.status = status;
		if (category) query.category = category;

		const skip = (parseInt(page) - 1) * parseInt(limit);
		const products = await Product.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Product.countDocuments(query);

		res.json({
			success: true,
			products,
			totalPages: Math.ceil(total / parseInt(limit)),
			currentPage: parseInt(page),
			total,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin route - Get single product
router.get("/admin/:id", authMiddleware, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}
		res.json({ success: true, product });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin route - Create product
router.post(
	"/admin",
	authMiddleware,
	(req, res, next) => {
		upload.single("image")(req, res, (err) => {
			if (err) {
				if (err instanceof multer.MulterError) {
					if (err.code === "LIMIT_FILE_SIZE") {
						return res.status(400).json({
							success: false,
							message: "File size too large. Maximum 2MB allowed.",
						});
					}
					return res.status(400).json({ success: false, message: err.message });
				}
				return res.status(400).json({ success: false, message: err.message });
			}
			next();
		});
	},
	validateProduct,
	async (req, res) => {
		try {
			const productData = {
				name: req.body.name?.trim() || "",
				description: req.body.description?.trim() || "",
				price: parseFloat(req.body.price),
				stock: parseInt(req.body.stock),
				category: req.body.category?.trim() || "",
				status: req.body.status || "Active",
			};

			// Validate required fields
			if (!productData.name) {
				return res
					.status(400)
					.json({ success: false, message: "Product name is required" });
			}
			if (!productData.description) {
				return res
					.status(400)
					.json({ success: false, message: "Product description is required" });
			}
			if (isNaN(productData.price) || productData.price < 0) {
				return res
					.status(400)
					.json({ success: false, message: "Valid price is required" });
			}
			if (isNaN(productData.stock) || productData.stock < 0) {
				return res
					.status(400)
					.json({ success: false, message: "Valid stock is required" });
			}
			if (!productData.category) {
				return res
					.status(400)
					.json({ success: false, message: "Product category is required" });
			}

			if (req.file) {
				productData.imageUrl = `/uploads/${req.file.filename}`;
			}

			const product = new Product(productData);
			await product.save();
			res.status(201).json({ success: true, product });
		} catch (error) {
			console.error("Error creating product - Full error:", error);
			console.error("Error stack:", error.stack);
			res.status(500).json({
				success: false,
				message: error.message || "Error creating product",
				error: process.env.NODE_ENV === "development" ? error.stack : undefined,
			});
		}
	}
);

// Admin route - Update product
router.put(
	"/admin/:id",
	authMiddleware,
	(req, res, next) => {
		upload.single("image")(req, res, (err) => {
			if (err) {
				if (err instanceof multer.MulterError) {
					if (err.code === "LIMIT_FILE_SIZE") {
						return res.status(400).json({
							success: false,
							message: "File size too large. Maximum 2MB allowed.",
						});
					}
					return res.status(400).json({ success: false, message: err.message });
				}
				return res.status(400).json({ success: false, message: err.message });
			}
			next();
		});
	},
	validateProduct,
	async (req, res) => {
		try {
			const productData = {
				name: req.body.name,
				description: req.body.description || "",
				price: parseFloat(req.body.price),
				stock: parseInt(req.body.stock),
				category: req.body.category,
				status: req.body.status || "Active",
			};

			if (req.file) {
				productData.imageUrl = `/uploads/${req.file.filename}`;
			}

			const product = await Product.findByIdAndUpdate(
				req.params.id,
				productData,
				{ new: true, runValidators: true }
			);
			if (!product) {
				return res
					.status(404)
					.json({ success: false, message: "Product not found" });
			}
			res.json({ success: true, product });
		} catch (error) {
			console.error("Error updating product:", error);
			res.status(500).json({
				success: false,
				message: error.message || "Error updating product",
			});
		}
	}
);

// Admin route - Delete product
router.delete("/admin/:id", authMiddleware, async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}
		res.json({ success: true, message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Admin route - Update product status
router.patch("/admin/:id/status", authMiddleware, async (req, res) => {
	try {
		const { status } = req.body;
		if (!["Active", "Inactive"].includes(status)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid status" });
		}
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}
		res.json({ success: true, product });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Get categories
router.get("/categories", async (req, res) => {
	try {
		const categories = await Product.distinct("category", { status: "Active" });
		res.json({ success: true, categories });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
