import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const {BleModule} = NativeModules;
const bleManagerEvents = new NativeEventEmitter(BleModule);

export const startScan = () => {
  BleModule.startScan();
};

export const stopScan = () => {
  BleModule.stopScan();
};

export const subscribeToScanStarted = (callback: any) => {
  const subscription = bleManagerEvents.addListener('ScanStarted', callback);
  return () => subscription.remove();
};

export const subscribeToScanStopped = (callback: any) => {
  const subscription = bleManagerEvents.addListener('ScanStopped', callback);
  return () => subscription.remove();
};

export const requestBluetoothPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ];

      // Filter out null permissions
      const availablePermissions = permissions.filter(
        permission => permission !== null,
      );

      const granted = await PermissionsAndroid.requestMultiple(
        availablePermissions,
      );

      if (
        granted['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the Bluetooth');
        return true;
      } else {
        console.log('Bluetooth permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    console.log('Bluetooth permission is not required on this platform');
    return true;
  }
};
