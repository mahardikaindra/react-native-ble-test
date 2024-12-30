import {NativeModules, NativeEventEmitter} from 'react-native';

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
