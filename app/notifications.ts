import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const registerForPushNotificationsAsync = async () => {
  try {
    if (!Device.isDevice) {
      alert('Must use a physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Get the push token for Expo
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: '8c559995-6c01-48d7-96b6-84e89eeaf562', // Required for iOS FCM (if using EAS)
    })).data;


    // Android-specific settings
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;

  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
};

export default registerForPushNotificationsAsync;
