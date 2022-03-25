import { Button, StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { AuthContext } from "./context";
import * as SecureStore from 'expo-secure-store';

const Home = ({navigation}) => {

  const { signOut } = React.useContext(AuthContext);
  const [host, setHost] = useState('');

  useEffect(() => {
    console.log("Home");
    async function MQTT_Details(){
          
      let result = await SecureStore.getItemAsync("Token");
      console.log(result)
      setHost(result);
      const config = {
          headers: {
              authorization: `bearer ${result}`
          }
      }
  }
  MQTT_Details();
  },[]);

  global.host = host;
  console.log(global.host);
  return (
    <View style={styles.container}>
    <Text>Home</Text>
    <Button
    title='gyro'
    onPress={() => navigation.navigate("gyro")}
    />
    <Button
    title='signOut'
    onPress={() => {signOut()}}
    />
  </View>
  );
}

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });