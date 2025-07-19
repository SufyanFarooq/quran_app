import { ToastAndroid, Platform } from 'react-native';

const showToast = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    // For iOS, you can use a 3rd party toast library if needed
    // For now, do nothing
  }
};

export default showToast;
