import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrder(orderId);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order not found</h2>
        <Link to="/" className="home-link">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>
          
          <div className="order-info">
            <h2>Order Details</h2>
            <div className="info-row">
              <span className="info-label">Order ID:</span>
              <span className="info-value">{order._id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Customer Name:</span>
              <span className="info-value">{order.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{order.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact Number:</span>
              <span className="info-value">{order.contactNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Shipping Address:</span>
              <span className="info-value">{order.shippingAddress}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Status:</span>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Amount:</span>
              <span className="info-value total-amount">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="order-items-section">
              <h3>Order Items</h3>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <span className="item-name">
                      {item.productId?.name || 'Product'}
                    </span>
                    <span className="item-details">
                      Qty: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.lineTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/admin/orders" className="btn-secondary">
              View in Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

