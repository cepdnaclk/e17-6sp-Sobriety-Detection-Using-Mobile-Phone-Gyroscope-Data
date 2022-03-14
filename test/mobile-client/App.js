import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Gyroscope, Accelerometer } from 'expo-sensors';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://192.168.1.3:3000';
const MIN_WINDOW_SIZE = 60; // 60 seconds (just for testing)
const data = require('./data_pb');

export default function App() {
	const [gyroData, setGyroData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});
	const [acceleroData, setAcceleroData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});
	const [subscription, setSubscription] = useState({gyro: null, accelero: null});
	const [gyroQueue, setGyroQueue] = useState([]);
	const [acceleroQueue, setAcceleroQueue] = useState([]);
	const [isGyroSending, setIsGyroSending] = useState(false);
	const [isAcceleroSending, setIsAcceleroSending] = useState(false);
	const [sendGyro, setSendGyro] = useState(false);
	const [sendAccelero, setSendAccelero] = useState(false);
	const [sendGyroData, setSendGyroData] = useState([]);
	const [sendAcceleroData, setSendAcceleroData] = useState([]);
	const [pid, setPid] = useState(null);
	const [sendWindowSize, setSendWindowSize] = useState(MIN_WINDOW_SIZE);

	const SAMPLING_RATE = 40;

	const getDeviceId = async () => {
		let uuid = uuidv4();
		await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuid));
		let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
		setPid(JSON.parse(fetchUUID));
	};

	const _slow = () => {
		Gyroscope.setUpdateInterval(1000);
		Accelerometer.setUpdateInterval(1000);
	};
	
	const _fast = () => {
		Gyroscope.setUpdateInterval(1000 / SAMPLING_RATE);
		Accelerometer.setUpdateInterval(1000 / SAMPLING_RATE);
	};
	
	const _subscribe = async () => {
		if (await Gyroscope.isAvailableAsync())
			subscription.gyro = Gyroscope.addListener(gyroscopeData => {
				setGyroData(gyroscopeData);
			})
		if (await Accelerometer.isAvailableAsync())
			subscription.accelero = Accelerometer.addListener(accelerometerData => {
				setAcceleroData(accelerometerData);
			})
		setSubscription(subscription);
	};
	
	const _unsubscribe = () => {
		subscription.gyro && subscription.gyro.remove();
		subscription.accelero && subscription.accelero.remove();
		setSubscription({gyro: null, accelero: null});
		setGyroQueue([]);
		setAcceleroQueue([]);
	};
	
	useEffect(() => {
		return () => _unsubscribe();
	}, []);

	useEffect(async () => {
		await getDeviceId();
	}, [sendWindowSize]);

	useEffect(() => {
		if (subscription.gyro) {
			setGyroQueue([...gyroQueue, {
				timestamp: Date.now(),
				x: gyroData.x,
				y: gyroData.y,
				z: gyroData.z,
			}]);
			setIsGyroSending(!isGyroSending);
		}
	}, [gyroData, subscription]);

	useEffect(() => {
		if (subscription.accelero) {
			setAcceleroQueue([...acceleroQueue, {
				timestamp: Date.now(),
				x: acceleroData.x,
				y: acceleroData.y,
				z: acceleroData.z,
			}]);
			setIsAcceleroSending(!isAcceleroSending);
		}
	}, [acceleroData, subscription]);

	useEffect(() => {
		// Send 40 rows of data at a time (25ms * 40 = 1s window of data)
		// But irl, sending 15min or 30min at a time is better => will have to store queue data in phone storage
		const length = sendWindowSize * SAMPLING_RATE;
		if (gyroQueue.length >= length) {
			var data = gyroQueue.splice(0, length);
			setSendGyroData(data);
			setGyroQueue(gyroQueue);
			console.log('Sending Gyroscope data');
			setSendGyro(true);
		}
		console.log('Gyroscope queue length: ' + gyroQueue.length);
	}, [isGyroSending]);

	useEffect(() => {
		const length = sendWindowSize * SAMPLING_RATE;
		if (acceleroQueue.length >= length) {
			var data = acceleroQueue.splice(0, length);
			setSendAcceleroData(data);
			setAcceleroQueue(acceleroQueue);
			console.log('Sending Accelerometer data');
			setSendAccelero(true);
		}
		console.log('Accelerometer queue length: ' + acceleroQueue.length);
	}, [isAcceleroSending]);

	// TODO: Send serialized protobuf data to server. => reduces data transfer size
	useEffect(() => {
		if (sendGyro && subscription.gyro) {
			// const gyroData = new data.DataList();
			// sendGyroData.forEach(_data => gyroData.addData(new data.Data(_data.timestamp, _data.x, _data.y, _data.z)));
			axios.post(`${API_URL}/gyroscope`, // API endpoint
			{
				// data: gyroData.serializeBinary(),
				data: sendGyroData,
				pid: pid,	// Must use some unique id for each phone
				length: sendGyroData.length,
				sample_frequency: SAMPLING_RATE,
			})
			.then((res) => {
				setSendGyro(false);
			})
			.catch(() => { // On error, data will be stored offline.
				console.log('error');
			});
		}
	}, [sendGyro, subscription]);

	useEffect(() => {
		if (sendAccelero && subscription.accelero) {
			// const acceleroData = new data.DataList();
			// sendAcceleroData.forEach(_data => acceleroData.addData(new data.Data(_data.timestamp, _data.x, _data.y, _data.z)));
			axios.post(`${API_URL}/accelerometer`, // API endpoint
			{
				// data: acceleroData.serializeBinary(),
				data: sendAcceleroData,
				pid: pid,	// Must use some unique id for each phone
				length: sendAcceleroData.length,
				sample_frequency: SAMPLING_RATE,
			})
			.then((res) => {
				setSendAccelero(false);
			})
			.catch(() => { // On error, data will be stored offline.
				console.log('error');
			});
		}
	}, [sendAccelero, subscription]);

	function round(n) {
		if (!n) {
		  return 0;
		}
		return Math.floor(n * 100) / 100;
	}

	return (
		<View style={styles.container}>
			<Text>Gyroscope Data:</Text>
			<Text>x: {round(gyroData.x)}</Text>
			<Text>y: {round(gyroData.y)}</Text>
			<Text>z: {round(gyroData.z)}</Text>
			<Text>Accelerometer Data:</Text>
			<Text>x: {round(acceleroData.x)}</Text>
			<Text>y: {round(acceleroData.y)}</Text>
			<Text>z: {round(acceleroData.z)}</Text>
			<Text style={{top: 10}}>Set the send window size:</Text>
			<Slider
				style={{ width: 250, height: 50 }}
				value={sendWindowSize}
				onValueChange={setSendWindowSize}
				maximumValue={60 * 15}
				minimumValue={MIN_WINDOW_SIZE}
				step={60}
			/>
			<Text>Window size: {sendWindowSize / 60} mins</Text>
			<StatusBar style="auto" />
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={subscription.gyro || subscription.accelero ? _unsubscribe : _subscribe} style={styles.button}>
					<Text>{subscription.gyro || subscription.accelero ? 'On' : 'Off'}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
					<Text>Slow</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={_fast} style={styles.button}>
					<Text>Fast</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		position: 'absolute',
		bottom: 0
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
		padding: 10,
	},
	middleButton: {
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: '#ccc',
	},
});
