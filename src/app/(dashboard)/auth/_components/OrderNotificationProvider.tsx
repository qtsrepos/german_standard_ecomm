'use client'
import React from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import useOrderNotification from '@/shared/hook/useOrderNotification';

interface OrderNotificationProviderProps {
  children: React.ReactNode;
}

export default function OrderNotificationProvider({ children }: OrderNotificationProviderProps) {
  const {
    modalVisible,
    newOrder,
    handleModalOk
  } = useOrderNotification();


  return (
    <>
      {children}

      {/* New Order Notification Modal */}
      <Modal
        title={<div style={{ color: '#1890ff', fontWeight: 'bold' }}>🔔 New Order Alert!</div>}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk}>
            Acknowledge Order
          </Button>,
        ]}
      >
        {newOrder && (
          <div>
            <h3>Order #{newOrder.id} has been placed</h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>Date:</strong> {dayjs(newOrder.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Customer:</strong> {newOrder?.name || 'N/A'}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Status:</strong> <span style={{ color: '#52c41a' }}>{newOrder.status}</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Total Amount:</strong> ${newOrder.grandTotal?.toFixed(2) || '0.00'}
            </div>
            {newOrder.items && newOrder.items.length > 0 && (
              <div>
                <strong>Items:</strong>
                <ul>
                  {newOrder.items.map((item: any, index: number) => (
                    <li key={index}>
                      {item.quantity}x {item.product?.name || 'Unknown Product'} - ${item.price?.toFixed(2) || '0.00'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}