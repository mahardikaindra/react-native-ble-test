package com.reactnativeproject

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class BleModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var bluetoothAdapter: BluetoothAdapter? = null
    private var isScanning: Boolean = false
    private val devices: MutableList<BluetoothDevice> = mutableListOf()

    init {
        val bluetoothManager = reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
    }

    override fun getName(): String {
        return "BleModule"
    }

    @ReactMethod
    fun startScan() {
        if (bluetoothAdapter == null || isScanning) {
            return
        }
        isScanning = true
        devices.clear()
        bluetoothAdapter?.startLeScan(leScanCallback)
    }

    @ReactMethod
    fun stopScan() {
        if (bluetoothAdapter == null || !isScanning) {
            return
        }
        isScanning = false
        bluetoothAdapter?.stopLeScan(leScanCallback)
        sendEvent("BleScanStopped", Arguments.createMap())
    }

    private val leScanCallback = BluetoothAdapter.LeScanCallback { device, rssi, scanRecord ->
        devices.add(device)
        val deviceMap = Arguments.createMap()
        deviceMap.putString("name", device.name)
        deviceMap.putString("address", device.address)
        deviceMap.putInt("rssi", rssi)
        deviceMap.putString("scanRecord", scanRecord.toString())
        sendEvent("BleDeviceFound", deviceMap)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}