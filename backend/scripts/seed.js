const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const AdminUser = require('../models/AdminUser');
const connectDB = require('../config/db');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 79.99,
    stock: 50,
    category: 'Electronics',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with heart rate monitor, GPS tracking, and 7-day battery life. Compatible with iOS and Android.',
    price: 199.99,
    stock: 30,
    category: 'Electronics',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt. Available in multiple colors. Perfect for everyday wear.',
    price: 24.99,
    stock: 100,
    category: 'Clothing',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans made from premium quality denim. Durable and stylish for any occasion.',
    price: 59.99,
    stock: 75,
    category: 'Clothing',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for jogging and daily workouts.',
    price: 89.99,
    stock: 60,
    category: 'Footwear',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and cash compartment. Sleek design for modern professionals.',
    price: 39.99,
    stock: 45,
    category: 'Accessories',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity. Auto shut-off feature and reusable filter included.',
    price: 49.99,
    stock: 25,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises. Easy to clean.',
    price: 29.99,
    stock: 40,
    category: 'Sports & Fitness',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and multiple pockets. Water-resistant material. Perfect for students and professionals.',
    price: 69.99,
    stock: 35,
    category: 'Accessories',
    status: 'Active',
    imageUrl: ''
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity. Long battery life and precise tracking. Compatible with Windows and Mac.',
    price: 19.99,
    stock: 80,
    category: 'Electronics',
    status: 'Active',
    imageUrl: ''
  }
];

const adminUsers = [
  {
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin'
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await AdminUser.deleteMany({});

    // Insert products
    console.log('Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    // Insert admin users
    console.log('Seeding admin users...');
    const createdAdmins = await AdminUser.insertMany(adminUsers);
    console.log(`✓ Created ${createdAdmins.length} admin users`);

    console.log('\n Seed data created successfully!');
    console.log('\nDefault Admin Credentials:');
    console.log('Email: admin@store.com');
    console.log('Password: admin123');
    console.log('\n Products created across categories:');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const count = products.filter(p => p.category === cat).length;
      console.log(`  - ${cat}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

