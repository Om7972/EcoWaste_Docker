import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SmartBin, BinAlert } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinUser = useCallback((userId: string) => {
    socketRef.current?.emit('join:user', userId);
  }, []);

  const subscribeToBins = useCallback(() => {
    socketRef.current?.emit('bins:subscribe');
  }, []);

  const onBinsUpdate = useCallback((callback: (bins: SmartBin[]) => void) => {
    socketRef.current?.on('bins:update', callback);
    return () => {
      socketRef.current?.off('bins:update', callback);
    };
  }, []);

  const onNewAlert = useCallback((callback: (alert: BinAlert) => void) => {
    socketRef.current?.on('alert:new', callback);
    return () => {
      socketRef.current?.off('alert:new', callback);
    };
  }, []);

  const onNotification = useCallback((callback: (notification: unknown) => void) => {
    socketRef.current?.on('notification:new', callback);
    return () => {
      socketRef.current?.off('notification:new', callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinUser,
    subscribeToBins,
    onBinsUpdate,
    onNewAlert,
    onNotification,
  };
};
