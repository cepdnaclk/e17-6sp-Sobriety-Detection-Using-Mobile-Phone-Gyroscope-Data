import { 
  View, 
  StyleSheet ,
} from 'react-native'
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

// importing auth context
import { AuthContext } from './screens/context';
// importing the Root stack
import RootStackScreen from './screens/RootStcak';
// importing main screens
import Home from './screens/Home';
import Gyro_ from './screens/Gyro';

// initializing the stact navigator 
const Stack = createNativeStackNavigator();

// main app
export default function App(){

  initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ){
      case 'RETRIVE_TOKEN':
        return{
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return{
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return{
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return{
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };               
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(TokenFromServer) => {
      console.log(TokenFromServer);
      await SecureStore.setItemAsync("Token", TokenFromServer);
      let result = await SecureStore.getItemAsync("Token");
      console.log(result);
      dispatch({type:'LOGIN', token: TokenFromServer});
    },
    signOut: async() => {
      let result = await SecureStore.getItemAsync("Token");
      dispatch({type:'LOGOUT'});
    },
    signUp: async(TokenFromServer) => {
      console.log(TokenFromServer);
      await SecureStore.setItemAsync("Token", TokenFromServer);
      let result = await SecureStore.getItemAsync("Token");
      console.log(result);
      dispatch({type:'REGISTER', token: TokenFromServer});
    }
  }));

  useEffect(() => {
    setTimeout(async() => {
      dispatch({type:'RETRIVE_TOKEN', token: loginState.userToken});
    }, 1000);
  }, []);

  if( loginState.isLoading ){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        
      </View>
    )
  }

  return (
    <AuthContext.Provider value = {authContext}>
      <NavigationContainer>
        {loginState.userToken != null ? (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="gyro" component={Gyro_}/>
          </Stack.Navigator>
        )
        :
          <RootStackScreen/>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});