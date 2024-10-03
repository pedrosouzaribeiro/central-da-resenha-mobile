import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import LoginScreen from './src/pages/login';
import SignUpScreen from './src/pages/signup';
import CodeScreen from './src/pages/code';
import ProfileEditor from './src/pages/edit';
import MenuScreen from './src/pages/menu';
import ProfileScreen from './src/pages/profile';
import FieldsScreen from './src/pages/fields';
import Teams from './src/pages/teams';

const Stack = createStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'montserrat': require('./src/assets/fonts/montserrat.ttf')
    // Adicione outros estilos conforme necessário
  });
};

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Teams">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Code" 
          component={CodeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfileEditor" 
          component={ProfileEditor} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="Fields" 
          component={FieldsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Teams" 
          component={Teams} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;