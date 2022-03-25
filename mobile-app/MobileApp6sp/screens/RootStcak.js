import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './splash_login_registration/Splash';
import Login from './splash_login_registration/Login';
import Registration from './splash_login_registration/Registration';

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="Splash" component={Splash}/>
        <RootStack.Screen name="Registration" component={Registration}/>
        <RootStack.Screen name="Login" component={Login}/>
    </RootStack.Navigator>
);

export default RootStackScreen;