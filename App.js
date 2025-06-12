import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native'; // 👈 Add this


import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ViewGrades from './screens/ViewGrades';
import VoirProject from './screens/VoirProject';
import AbScreen from './screens/AbScreen';
import UploadProjects from './screens/UploadProjects';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const student = await AsyncStorage.getItem('student');
      setInitialRoute(student ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null; // Wait for login check

  return (
      <>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Notes" component={ViewGrades} />
          <Stack.Screen name="Projets" component={VoirProject} />
          <Stack.Screen name="AbScreen" component={AbScreen} />
          <Stack.Screen name="UploadProjects" component={UploadProjects} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
