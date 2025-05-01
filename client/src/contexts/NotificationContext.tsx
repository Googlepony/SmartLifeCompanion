import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  isLoading: true
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, mockMode } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications', user?.uid],
    enabled: !!user?.uid && !mockMode,
  });
  
  // Calculate unread count whenever notifications change
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      const count = notifications.filter((note: any) => !note.read).length;
      setUnreadCount(count);
    }
  }, [notifications]);
  
  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/notifications/${id}`, {
        userId: user?.uid,
        read: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications', user?.uid] });
    }
  });
  
  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PATCH', '/api/notifications/read-all', {
        userId: user?.uid
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications', user?.uid] });
    }
  });
  
  const markAsRead = (id: string) => {
    if (user) {
      markAsReadMutation.mutate(id);
    }
  };
  
  const markAllAsRead = () => {
    if (user) {
      markAllAsReadMutation.mutate();
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        isLoading 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
