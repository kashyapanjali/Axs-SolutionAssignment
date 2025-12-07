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
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity. Long battery life and precise tracking. Compatible with Windows and Mac.',
    price: 799,
    stock: 80,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/61LtuGzXeaL._SL1500_.jpg'
  },
  {
    name: 'Bluetooth Headphones',
    description: 'Over-ear Bluetooth headphones with deep bass, noise isolation and 20-hour battery backup.',
    price: 2499,
    stock: 50,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/51FNnHjzhQL._SL1500_.jpg'
  },
  {
    name: 'Smart Watch',
    description: 'Smart fitness watch with heart rate monitor, sleep tracking and waterproof design.',
    price: 3499,
    stock: 40,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/61ZjlBOp+rL._SL1500_.jpg'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with blue switches and anti-ghosting keys.',
    price: 2999,
    stock: 35,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/61SwPl+94AL.jpg'
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Loud portable Bluetooth speaker with deep bass and 12-hour playtime.',
    price: 1999,
    stock: 60,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/61K8FS335JL._SL1500_.jpg'
  },
  {
    name: 'USB Power Bank',
    description: '10000mAh fast charging power bank with dual USB output.',
    price: 1299,
    stock: 70,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/61s+OTDUsKL._AC_UF894,1000_QL80_.jpg'
  },
  {
    name: 'Web Camera',
    description: 'Full HD 1080p webcam with built-in microphone for online classes and meetings.',
    price: 1799,
    stock: 45,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/51GD-1D3ocL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with touch controls, noise cancellation and fast charging.',
    price: 2699,
    stock: 55,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0515/5553/2976/files/A3955Z11_TD01_V1_3840x.png?v=1759992519'
  },
  {
    name: 'Laptop Cooling Pad',
    description: 'High-speed dual fan laptop cooling pad with adjustable height.',
    price: 999,
    stock: 65,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW4QLmXHLJuOXqAx93tf8NaRn00m7MDNTqTg&s'
  },
  {
    name: 'Smart LED Bulb',
    description: 'WiFi enabled smart LED bulb with color changing and mobile app control.',
    price: 699,
    stock: 90,
    category: 'Electronics',
    status: 'Active',
    imageUrl: 'https://m.media-amazon.com/images/I/51yBOvORkPL.jpg'
  },  
  {
    name: 'Men\'s Elegant Brocade Suit Set',
    description: 'Manyavar Men Elegant Brocade Suit Set.',
    price: 5000,
    stock: 30,
    category: 'Clothing',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQEuhQhARZhSGZYsQ7h0Xz3WK5S_RBoNly5RekesaX-i1BuU6dzX7YUUDlZZahBCaA9R09zeLbVmxKfDE7k1z0C04tjmz7K_mE-t0P7i7LaBXu1uafm0dGy'
  },
  {
    name: 'Kurta Pant Dupatta Set',
    description: 'KLOSIA Women Viscose Printed Kurta Pant Dupatta Set',
    price: 3000,
    stock: 30,
    category: 'Clothing',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSe0gd1tPba3E59jOmPxc87ryLb5g2W5GtsBmLUAEbS0bnuPWW5yp0auzisyvreiIc4jHX3KWXSrVgohjDIR_0WHRD8en4_2BidvDlOd23Mo5I1CJtLzydmakzV6aB_rXGx941Oatz5t6A&usqp=CAc'
  },
  {
    name: 'Black Suit Women',
    description: 'Buy CUSTOM WOMEN SUIT, Black Suit Women,tailored Suit,personalized Business Women.',
    price: 8000,
    stock: 20,
    category: 'Clothing',
    status: 'Active',
    imageUrl: 'https://i.etsystatic.com/26336635/r/il/029fd6/4152225379/il_570xN.4152225379_arq4.jpg'
  },{
    name: "Men's Formal Slim Fit Blazer",
    description: "Premium slim fit formal blazer for men. Perfect for office, weddings, and formal occasions.",
    price: 4200,
    stock: 25,
    category: "Clothing",
    status: "Active",
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3UMSTxJD0Qdlq8xuNgnjsbr7TMhFfeY_sgfWJH93ZXZb-P1RHz8eC3dchZDRGKeAzMB_xE9sqWNfG1SltgpeGMc1TRqVIhmCBkiGoqRov6g8usUXMow56QCj6P1BQwZbe6DEBFR4&usqp=CAc"
  },
  {
    name: "Women's Floral Printed Kurti",
    description: "Stylish floral printed kurti made with soft breathable fabric. Perfect for daily wear.",
    price: 1299,
    stock: 40,
    category: "Clothing",
    status: "Active",
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxWAUwOe8K4QehWnnShC1fv3C-1r7syxt0PwVqal26a50fppwaGoS98CTegKHqp1cd8ysBmqYjuWTNDdGXEFujDOmoWakeiT7nDbztBkA&usqp=CAc"
  },
  {
    name: "Men's Denim Blue Jeans",
    description: "Classic stretchable denim jeans for men with perfect slim fit and long-lasting fabric.",
    price: 1899,
    stock: 50,
    category: "Clothing",
    status: "Active",
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT2ZhCl5I4SkLp5n0VWdxH9S-oGo3yXjtC2bgWKCllV3B5fSQ0N5DQNrFrL2X77r_gbi0Tm9MuF-se0mpUibfA35VXyWc0GehWX_OO-TFvzf7IdSt9zGHcE_ukYbmRwctVzI25-QBix7iM&usqp=CAc"
  },
  {
    name: "Women's Cotton Saree",
    description: "Elegant cotton saree with traditional print. Lightweight and perfect for festive occasions.",
    price: 2499,
    stock: 20,
    category: "Clothing",
    status: "Active",
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRuORTKYITYpp66fCdj7uWfm7kTb6m5TM2CJGs6ROwF4o5ayXbu7bHGNiURQ12e0TgWqM8-2QRAprsjFgL6NPSFhhwrc5cBcDILPkJ67IAe7PDpNcQOhQ2l0U8&usqp=CAc"
  },  
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity. Auto shut-off feature and reusable filter included.',
    price: 2499,
    stock: 25,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTnXi5BMLKUX7vEsUgaJQ_tWrCe0DMl_X5iuwRad_472fuvS3U0veH0cWDXWOpw_gPk2JVVpMkp3mBtm11tMNYEPU0Fre72VOviQvvQgIOMAXRCCBhacQeAwDxEWS4MeeZPAREWwMA&usqp=CAc'
  },
  {
    name: 'Electric Kettle',
    description: 'Fast boiling electric kettle with 1.5L capacity and auto shut-off safety feature.',
    price: 1299,
    stock: 40,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSAF3ZyvT1HaZGWFBQSqxldjp6Tg9tHiWLNneP2gCQZVLmItFxVn-r5mIhyjMdeNscdEW78TLL3331IrVApF5lGYsPJqcrLodmb7n5blVXuCDWKnpaTTUB5Qv6EGURYAdQiBNc9b0w&usqp=CAc'
  },
  {
    name: 'Mixer Grinder',
    description: '750W powerful mixer grinder with stainless steel jars and overload protection.',
    price: 3799,
    stock: 20,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsbDiqAnRLy6U3XsZzr8clDeiVpE9yipM3ug&s'
  },
  {
    name: 'Non-Stick Cookware Set',
    description: '5-piece non-stick cookware set with heat-resistant handles.',
    price: 2999,
    stock: 15,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTDMw8fupIg5QBh03EUWFuWdctLJSKAp4EYSlD0EMDWj3uayhM0ZHR_azbW3U2HXglZH9enaAB0hmJ8tBeTyCchrOWC9hXU0wz3kemPW4yK2VkKJelDJY3395coTcz8&usqp=CAc'
  },
  {
    name: 'Dinner Set (24 Pieces)',
    description: 'Premium ceramic 24-piece dinner set for daily use.',
    price: 3499,
    stock: 12,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://images.meesho.com/images/products/406075412/rwmbx_512.webp?width=512'
  },
  {
    name: 'Air Fryer',
    description: 'Oil-free 4L air fryer with digital temperature control and timer.',
    price: 5999,
    stock: 18,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiZ8ONX2d006NJQ3Rqw6Pc3ALuaR1iHUnD7A&s'
  },
  {
    name: 'Water Purifier',
    description: 'RO+UV water purifier with 8L storage and multiple purification stages.',
    price: 9999,
    stock: 10,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQZ_Wq_--gmNoZlMrjsrx8FASFGuFvYmFdbjF-hRMvJrCNqnjMYVJXNtO73gFbBHrULTSnFONOzdeCbXXFkSnwIBWyRkI-tNNxmZdwb5cFkG57aNSuWgFbKCFspmTDIdM2QvFdK3xk&usqp=CAc'
  },
  {
    name: 'Induction Cooktop',
    description: 'Portable induction cooktop with touch panel and energy-efficient heating.',
    price: 2799,
    stock: 22,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSSmkuMToL6A4Njp0J5JGlA5SZSGoxLw6ysVsI44yrUy23kye7l_4zZm_Es7A2pYfydCxRBh9Nv_5E14orX6Iquyvlqt2ZatHHoEU2jeHRHK0zCPHWcvIifR-hXqYSSIqdITFCPROtPOg&usqp=CAc'
  },
  {
    name: 'Vegetable Chopper',
    description: 'Manual stainless-steel vegetable chopper for fast and easy cutting.',
    price: 499,
    stock: 60,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQGbS37SPnBuYQGxa0Ew9M6jYTu5WtfsTKCsxuO5h5NGKtp_haLA92a8FhTM2KridVc1IveEdc6zHhrnT7VluxO-9sDXEH7jZLuSLPlsYmCrpYx_aUuZ3oFK5XJjC08Xr9tIa8c7g&usqp=CAc'
  },
  {
    name: 'Gas Stove (2 Burner)',
    description: 'Toughened glass 2-burner gas stove with high-efficiency brass burners.',
    price: 3299,
    stock: 14,
    category: 'Home & Kitchen',
    status: 'Active',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPiUAqDcl-24Hac0Lbc9RawjCxx4qehRwbbdplThLQlogNSLyLyw2z7gMYAra4IbvKoV2lvcQdxV_dY6od3py5ig5oS5O0QWu6PBgzchlBCXEHUywdWMRyBIiUBsR9PkhfKKFT4vY&usqp=CAc'
  },  
];

//admin user credentials ---> manual credentials
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
    // Clearing existing data...');
    await Product.deleteMany({});
    await AdminUser.deleteMany({});

    // Insert products
    // Seeding products...
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    // Insert admin users (need to save individually to trigger password hashing)
    for (const adminData of adminUsers) {
      const admin = new AdminUser(adminData);
      await admin.save();
    }
    console.log(`✓ Created ${adminUsers.length} admin users`);

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

