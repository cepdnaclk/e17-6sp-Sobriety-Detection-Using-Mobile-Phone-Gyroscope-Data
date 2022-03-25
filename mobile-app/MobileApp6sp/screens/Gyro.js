import init from 'react_native_mqtt';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage'


// creating a localStorage to store the state
init({
  size: 10000,
  storageBackend: AsyncStorage,
  enableCache: true,
  sync: {},
});

// class gyro
export default class Gyro_ extends Component {
  
  // constructor 
  constructor() {
    super();
    this.onMessageArrived = this.onMessageArrived.bind(this);
    this.onConnectionLost = this.onConnectionLost.bind(this);
    
    const client = new Paho.MQTT.Client(
      global.host,
      8884,
      'Client-' + Math.random() * 9999 + 1,
    );
    client.onMessageArrived = this.onMessageArrived;
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: true,
      userName: 'e17251',
      password: '@Mahanama1998',
      onFailure: (e) => {
        console.log('Error: ', e);
      },
    });

    this.state = {
      message: [''],
      isLoading: true,
      client,
      messageToSend: [],
      isConnected: false,
      time: '',
      data: {x:0, y:0, z:0},
      Arr: [],
    };
  }

  // function to change the state after connectiong to a mqtt broker
  onConnect = () => {
    console.log('Connected');
    const {client} = this.state;
    // client.subscribe('gyroData/user/6233161be54d65b84ea6acb6');
    this.setState({
      isConnected: true,
      error: [],
      isLoading: true,
      messageToSend: [],
    });
    this.sendMessage();
  };

  // function to change the state when a subscriber sends a massage to the topic
  onMessageArrived(entry) {
    console.log("MessageArrived")
    console.log("Payload tostring: "+entry.payloadString.toString())
  }

  // function to send data to a topic.
  sendMessage = () => {
    console.log('message send.');
    var message = new Paho.MQTT.Message(JSON.stringify(this.state.Arr));
    message.destinationName = 'gyroData/user/6233161be54d65b84ea6acb6';

    if (this.state.isConnected) {
      this.state.client.send(message);
    } else {
      console.log("massage processing")
    }
  };

  // function to change the state when the mqtt connection is lost
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      this.setState({error: 'Lost Connection', isConnected: false});
    }
  }

  componentDidMount(){
    this._subscribe();
  }

  // checks whether the component is unmount
  componentWillUnmount() {
    this._unsubscribe();
  } 

  // mounting the expo gyroscope and sends JSON Array(stringified) 
  _subscribe = () => {
    this._subscription = Gyroscope.addListener(gyroscopeData => {

        this.setState({
            data: gyroscopeData,
        });

        if(this.state.Arr.length < 3){
            let {Arr, data} = this.state;
            Arr.push({data,'timestamp':Date.now()});
        }
        else{
            let {Arr, data} = this.state;
            Arr.push({data,'timestamp':Date.now()});
            this.sendMessage();
            this.setState({Arr: []});
        } 
      });
    Gyroscope.setUpdateInterval(250);
  };

  // unmounting the expo gyroscope
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  // render
  render() {
    return (
        <View style={styles.container}>
          <Text>gyro</Text>
          <Text style={styles.text}>
          x: {this.state.data.x}
          </Text>
          <Text style={styles.text}>
          y: {this.state.data.y}
          </Text>
          <Text style={styles.text}>
          z: {this.state.data.z}
          </Text>
        </View>
      );
  }
}

// styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});