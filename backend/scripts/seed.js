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
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRjSLzJXMlr2rcnZ3z5UdwfHquUNj1BNV61rHxTc17o0jua7dePGiCYJY7qps6gEVz0_-JZ1XiRM-szavbpYyTYj16kjFxLOTHwjzGy2Ct0TrOpSdzA08Lfzg'
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with heart rate monitor, GPS tracking, and 7-day battery life. Compatible with iOS and Android.',
    price: 199.99,
    stock: 30,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt. Available in multiple colors. Perfect for everyday wear.',
    price: 24.99,
    stock: 100,
    category: 'Clothing',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820'
  },
  {
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans made from premium quality denim. Durable and stylish for any occasion.',
    price: 59.99,
    stock: 75,
    category: 'Clothing',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for jogging and daily workouts.',
    price: 89.99,
    stock: 60,
    category: 'Footwear',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSytJoEeiGXyu7EtCU-F9c5e6Bm5PsP_FQtA3QTgm46BwZZWqgqmyDLIe1AR2OchaOu06h2Tqe4YjmU0cDvAzHJ4_sXUsNFS5JrLZDBTLo5R11jIHXxiQ5nx08'
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and cash compartment. Sleek design for modern professionals.',
    price: 39.99,
    stock: 45,
    category: 'Accessories',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93'
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity. Auto shut-off feature and reusable filter included.',
    price: 49.99,
    stock: 25,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQhe7zPIvLjPtZ_r6YHomulOpFg4B9YNz3NVV1xVL-w4hIU4NkycMMlkao9X0u5rwPJ7Z2olzdNMwEHosLtwsUGZXq5fD1J3gz17ozkefEu7Wpd3JtpHlHN02p89GNL8l3-IzB4HqM&usqp=CAc'
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises. Easy to clean.',
    price: 29.99,
    stock: 40,
    category: 'Sports & Fitness',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ9jdpPjJaPhnojCHJb9PGG2V2Kqzfnjr5Zl_mrXGRImg1i2arbegS8GpfH3iL8g9unt99hMXUihj5sKPA17LRwiyUIeU4U_6Z3BpsheEyyulyxtpdIeiSS3A'
  },
  {
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and multiple pockets. Water-resistant material. Perfect for students and professionals.',
    price: 69.99,
    stock: 35,
    category: 'Accessories',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity. Long battery life and precise tracking. Compatible with Windows and Mac.',
    price: 19.99,
    stock: 80,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://assets.ajio.com/medias/sys_master/root/20250530/FUO5/6839af567a6cd4182f6db2fa/-1117Wx1400H-4944216760-multi-MODEL.jpg'
  }
];

//admin user credentials
const adminUsers = [
  {
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin'
  }
];

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await AdminUser.deleteMany({});

    // Insert products
    console.log('Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    // Insert admin users (need to save individually to trigger password hashing)
    console.log('Seeding admin users...');
    for (const adminData of adminUsers) {
      const admin = new AdminUser(adminData);
      await admin.save();
    }
    console.log(`✓ Created ${adminUsers.length} admin users`);

    // console.log('\n Seed data created successfully!');
    // console.log('\nDefault Admin Credentials:');
    // console.log('Email: admin@store.com');
    // console.log('Password: admin123');
    // console.log('\n Products created across categories:');

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

