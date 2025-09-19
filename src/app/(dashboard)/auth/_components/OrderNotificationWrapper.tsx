'use client'
import React from 'react';
import OrderNotificationProvider from './OrderNotificationProvider';

interface OrderNotificationWrapperProps {
  children: React.ReactNode;
}

/**
 * This wrapper component is needed to separate client-side code from server components.
 * It serves as a boundary between the server layout and the client-side notification system.
 */
export default function OrderNotificationWrapper({ children }: OrderNotificationWrapperProps) {
  return (
    <OrderNotificationProvider>
      {children}
    </OrderNotificationProvider>
  );
}