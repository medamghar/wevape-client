import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const PHONE_KEY = '@user_phone';

export class AuthStorage {
  // Save token and phone after successful login
  static async storeAuthData(token: string, phone: string) {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [PHONE_KEY, phone],
      ]);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  }

  // Get stored token
  static async getToken() {
    try {
       
      

      return await AsyncStorage.getItem(TOKEN_KEY);

    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get stored phone number
 static async getPhone() {
    try {
      return await AsyncStorage.getItem(PHONE_KEY);
    } catch (error) {
      console.error('Error getting phone:', error);
      return null;
    }
  }

  // Check if user is logged in
  static async isAuthenticated() {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Clear stored auth data on logout
  static async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, PHONE_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }
}
