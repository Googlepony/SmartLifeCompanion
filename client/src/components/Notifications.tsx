import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import GlassContainer from "./GlassContainer";
import { Code, DollarSign, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  time: string;
}

const NotificationItem = ({ notification }: { notification: NotificationProps }) => {
  return (
    <GlassContainer className="hover:shadow-md transition-all cursor-pointer">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <div className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center`}>
            <span className={notification.iconColor}>{notification.icon}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm">{notification.title}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
        </div>
      </div>
    </GlassContainer>
  );
};

const NotificationSkeleton = () => (
  <GlassContainer>
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    </div>
  </GlassContainer>
);

const Notifications = () => {
  const { user } = useUser();
  const { markAllAsRead } = useNotifications();
  
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications', user?.uid],
    enabled: !!user?.uid,
  });

  const handleViewAll = () => {
    markAllAsRead();
    // Navigate to notifications page (could be implemented)
  };

  if (isLoading) {
    return (
      <section className="mb-8 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Button variant="link" size="sm" className="text-primary">View all</Button>
        </div>
        
        <div className="space-y-3">
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </div>
      </section>
    );
  }

  // Map notification types to proper icons
  const getNotificationProps = (notification: any): NotificationProps => {
    const types: Record<string, Partial<NotificationProps>> = {
      'coding_tip': {
        icon: <Code className="h-5 w-5" />,
        iconBg: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-500'
      },
      'finance': {
        icon: <DollarSign className="h-5 w-5" />,
        iconBg: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-500'
      },
      'quote': {
        icon: <BookOpen className="h-5 w-5" />,
        iconBg: 'bg-purple-100 dark:bg-purple-900',
        iconColor: 'text-purple-500'
      }
    };

    const defaults = types[notification.type] || {
      icon: <Code className="h-5 w-5" />,
      iconBg: 'bg-gray-100 dark:bg-gray-900',
      iconColor: 'text-gray-500'
    };

    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      time: notification.time,
      ...defaults
    } as NotificationProps;
  };

  return (
    <section className="mb-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary"
          onClick={handleViewAll}
        >
          View all
        </Button>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 3).map((notification: any) => (
            <NotificationItem 
              key={notification.id} 
              notification={getNotificationProps(notification)} 
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Notifications;
