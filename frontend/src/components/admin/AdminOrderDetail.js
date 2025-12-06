import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageHelper';
import './AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getAdminOrder(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) {
      return;
    }

    setUpdating(true);
    try {
      await orderAPI.updateOrderStatus(id, newStatus);
      await fetchOrder();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order not found</h2>
        <button onClick={() => navigate('/admin/orders')} className="btn-back">
          Back to Orders
        </button>
      </div>
    );
  }

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  return (
    <div className="order-detail-container">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/admin/orders')} className="btn-back">
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>

        <div className="order-detail-content">
          <div className="order-info-section">
            <div className="info-card">
              <h2>Order Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{order._id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Amount:</span>
                  <span className="info-value total-amount">${order.total.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Customer Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{order.customerName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contact:</span>
                  <span className="info-value">{order.contactNumber}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Shipping Address:</span>
                  <span className="info-value">{order.shippingAddress}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Update Order Status</h2>
              <div className="status-buttons">
                {['New', 'Processing', 'Shipped', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={order.status === status || updating}
                    className={`status-btn ${order.status === status ? 'active' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h2>Order Items</h2>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item-card">
                    <div className="item-image">
                      {item.productId?.imageUrl ? (
                        <img
                          src={getImageUrl(item.productId.imageUrl)}
                          alt={item.productId.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="placeholder-small" style={{ display: item.productId?.imageUrl ? 'none' : 'flex' }}>No Image</div>
                    </div>
                    <div className="item-details">
                      <h3>{item.productId?.name || 'Product'}</h3>
                      <p className="item-meta">
                        Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.lineTotal.toFixed(2)}
                      </p>
                      {item.productId?.stock !== undefined && (
                        <p className="item-stock">Stock: {item.productId.stock}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No items found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

