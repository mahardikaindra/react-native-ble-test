import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  startScan,
  stopScan,
  subscribeToScanStarted,
  subscribeToScanStopped,
} from './BleModule';

type Device = {
  id: string;
  name: string | null;
  rssi: number | null;
};

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const onScanStarted = () => {
      setIsScanning(true);
      setDevices([]);
      console.log('Scanning started');
    };

    const onScanStopped = (scannedDevices: Device[]) => {
      setIsScanning(false);
      setDevices(scannedDevices);
      console.log('Scanning stopped', scannedDevices);
    };

    const scanStartedSubscription = subscribeToScanStarted(onScanStarted);
    const scanStoppedSubscription = subscribeToScanStopped(onScanStopped);

    return () => {
      scanStartedSubscription();
      scanStoppedSubscription();
    };
  }, []);

  const renderDevice = ({item}: {item: Device}) => (
    <View style={styles.deviceContainer}>
      <Text style={styles.deviceText}>Name: {item.name || 'Unknown'}</Text>
      <Text style={styles.deviceText}>ID: {item.id}</Text>
      <Text style={styles.deviceText}>RSSI: {item.rssi}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isScanning ? 'light-content' : 'dark-content'} />
      <Text style={styles.title}>Bluetooth Low Energy Scanner</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isScanning ? 'Scanning...' : 'Start Scan'}
          onPress={isScanning ? undefined : startScan}
          disabled={isScanning}
        />
        <Button
          title="Stop Scan"
          onPress={stopScan}
          disabled={!isScanning}
          color="red"
        />
      </View>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={renderDevice}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No devices found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  deviceContainer: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  deviceText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default App;
