import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { router } from 'expo-router';

// GraphQL operations
const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    myNotifications {
      id
      message
      imageUrl
      isRead
      createdAt
      route
    }
  }
`;
const GET_USER_ID = gql`
  query{getUserId{id}}
`;

const MARK_AS_READ = gql`
  mutation MarkAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`;

const BROADCAST_NOTIFICATION_SUBSCRIPTION = gql`
subscription{broadcastNotification{ id
      message
      imageUrl
      isRead
      title
      route}}
`;

const USER_NOTIFICATION_SUBSCRIPTION = gql`
  subscription UserNotification($userId: Int!) {
    userNotification(userId: $userId) {
      id
      message
      imageUrl
      createdAt
      isRead
      title
      route
    }
  }
`;



// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Background Fetch Task Identifier
const BACKGROUND_FETCH_TASK = 'background-fetch-notifications';

const NotificationsContext = createContext<{
  notifications: any[];
  markAsRead: (id: string) => Promise<void>;
}>({
  notifications: [],
  markAsRead: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const { data:getUserId } = useQuery(GET_USER_ID);

  const { data, refetch } = useQuery(GET_NOTIFICATIONS);
  const [markNotificationAsRead] = useMutation(MARK_AS_READ);

  // Subscribe to user-specific notifications
  const { data: userNotificationData } = useSubscription(USER_NOTIFICATION_SUBSCRIPTION,{
    variables:{userId:getUserId?.getUserId?.id}
  });
  // Subscribe to broadcast notifications
  const { data: broadcastNotificationData } = useSubscription(BROADCAST_NOTIFICATION_SUBSCRIPTION);
  // Handle new notifications from subscriptions
  useEffect(() => {
    const handleNewNotification = async (notification: any) => {
      // Schedule local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.message,
          body: notification.message,
          data: { id: notification.id, isRead: notification.isRead , route:notification.route },
        },
        trigger: null, // Trigger immediately
      });
      
      // Refetch notifications list to update UI
      refetch();
    };

    if (userNotificationData?.userNotification) {
      handleNewNotification(userNotificationData.userNotification);
    }
    
    if (broadcastNotificationData?.broadcastNotification) {
      handleNewNotification(broadcastNotificationData.broadcastNotification);
    }
  }, [userNotificationData, broadcastNotificationData]);

  useEffect(() => {
    registerForPushNotifications();
    setupNotificationListeners();
    registerBackgroundFetchTask();

    return () => {
      cleanup();
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    };
  }, []);

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

    } catch (error) {
      console.error('Error getting push token:', error);
    }
  }

  function setupNotificationListeners() {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      refetch();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationData = response.notification.request.content.data;
      if (notificationData.id) {
        markAsRead(notificationData.id);
      }
    });
  }

  function cleanup() {
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead({ variables: { id } });
      refetch();
    } catch (error) {
    }
  };

  async function backgroundFetchTask() {
    try {
      const notifications = await fetchNotificationsFromServer();
      notifications.forEach(async (notification:any) => {
        if (!notification.isRead) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.title,
              sound:'default',
              body: notification.message,
              data: { id: notification.id, isRead: notification.isRead , route:notification.route },
            },
            trigger: null,
          });
         
        }
      });
    } catch (error) {
    }
  }

  async function fetchNotificationsFromServer() {
    try {
      const { data } = await refetch();
      return data.myNotifications || [];
    } catch (error) {
    ;
      return [];
    }
  }

  function registerBackgroundFetchTask() {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      await backgroundFetchTask();
    });

    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationData = response.notification.request.content.data;
      if (notificationData?.route) {
        router.push(notificationData.route); // Navigate only if route exists
      }// Navigate to the Cart page
      
    });

    return () => subscription.remove(); // Cleanup listener
  }, []);
  return (
    <NotificationsContext.Provider
      value={{
        notifications: data?.myNotifications || [],
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);