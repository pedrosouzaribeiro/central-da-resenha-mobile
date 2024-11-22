import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/pages/login';
import SignUpScreen from './src/pages/signup';
import CodeScreen from './src/pages/code';
import ProfileEditor from './src/pages/edit';
import MenuScreen from './src/pages/menu';
import ProfileScreen from './src/pages/profile';
import FieldsScreen from './src/pages/fields';
import Teams from './src/pages/teams';
import AgendamentosScreen from './src/pages/agendamentos';

const Stack = createStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'montserrat': require('./src/assets/fonts/montserrat.ttf')
    // Adicione outros estilos conforme necessário
  });
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: 'transparent',
  },
};

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'timing',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Code" component={CodeScreen} />
        <Stack.Screen name="ProfileEditor" component={ProfileEditor} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Fields" component={FieldsScreen} />
        <Stack.Screen name="Teams" component={Teams} />
        <Stack.Screen name="Agendamentos" component={AgendamentosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;