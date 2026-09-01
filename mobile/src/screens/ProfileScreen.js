
import React,{useEffect,useState} from 'react';
import {View,Text,Pressable,StyleSheet,Alert} from 'react-native';
import Card from '../components/Card';
import {colors} from '../theme';
import {getMe,logoutUser} from '../services/api';

export default function ProfileScreen({navigation}){
 const [me,setMe]=useState(null);
 useEffect(()=>{getMe().then(setMe).catch(e=>Alert.alert('Sesión',e.message))},[]);
 async function logout(){ await logoutUser(); navigation.getParent()?.replace?.('Login') || navigation.navigate('Inicio'); }
 return <View style={s.page}>
  <Card title="Mi cuenta">
   <Text style={s.name}>{me?.name||'Cargando...'}</Text>
   <Text style={s.muted}>{me?.email||''}</Text>
   <Text style={s.muted}>Rol: {me?.role||''}</Text>
   <Pressable style={s.btn} onPress={logout}><Text style={s.bt}>Cerrar sesión</Text></Pressable>
  </Card>
 </View>
}
const s=StyleSheet.create({page:{flex:1,padding:18,backgroundColor:colors.background},name:{fontSize:20,fontWeight:'800',color:colors.text},muted:{color:colors.muted,marginTop:7},btn:{backgroundColor:colors.primary,padding:14,borderRadius:12,alignItems:'center',marginTop:18},bt:{color:'#fff',fontWeight:'800'}})
