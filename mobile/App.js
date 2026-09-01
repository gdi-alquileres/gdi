
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import PeopleScreen from './src/screens/PeopleScreen';
import ContractScreen from './src/screens/ContractScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertiesScreen from './src/screens/PropertiesScreen';
import AccountScreen from './src/screens/AccountScreen';
import MercadoPagoScreen from './src/screens/MercadoPagoScreen';
import MoraScreen from './src/screens/MoraScreen';
import { colors } from './src/theme';

const Stack=createNativeStackNavigator();
const Tab=createBottomTabNavigator();

function Tabs(){
  return (
    <Tab.Navigator screenOptions={{headerStyle:{backgroundColor:colors.primary},headerTintColor:'white',tabBarActiveTintColor:colors.primary}}>
      <Tab.Screen name="Inicio" component={HomeScreen}/>
      <Tab.Screen name="Propiedades" component={PropertiesScreen}/>
      <Tab.Screen name="Cuenta" component={AccountScreen} options={{title:'Estado de cuenta'}}/>
      <Tab.Screen name="Personas" component={PeopleScreen} options={{title:'Inquilino / Garante'}}/>
      <Tab.Screen name="Perfil" component={ProfileScreen}/>
    </Tab.Navigator>
  );
}

export default function App(){
  return (
    <NavigationContainer>
      <StatusBar style="light"/>
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:colors.primary},headerTintColor:'white'}}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Principal" component={Tabs} options={{headerShown:false}}/>
        <Stack.Screen name="MercadoPago" component={MercadoPagoScreen} options={{title:'Mercado Pago'}}/>
        <Stack.Screen name="Mora" component={MoraScreen} options={{title:'Cálculo de mora'}}/>
        <Stack.Screen name="Contrato" component={ContractScreen} options={{title:'Contrato'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
