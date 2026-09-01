
import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import { loginUser, registerUser } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !password || (mode === 'register' && !name)) {
      Alert.alert('Faltan datos', 'Completá los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') await registerUser({ name, email, password });
      else await loginUser({ email, password });
      navigation.replace('Principal');
    } catch (e) {
      Alert.alert('No se pudo ingresar', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.page}>
      <Image source={require('../../assets/gdi_logo.jpg')} style={s.logo}/>
      <Text style={s.title}>GDI Alquileres</Text>
      <Text style={s.sub}>Todo tu alquiler. En un solo lugar.</Text>

      {mode === 'register' ? (
        <TextInput placeholder="Nombre completo" value={name} onChangeText={setName} style={s.input}/>
      ) : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={s.input}/>
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={s.input}/>

      <Pressable style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.bt}>{mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</Text>}
      </Pressable>

      <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={s.link}>{mode === 'login' ? 'Crear una cuenta' : 'Ya tengo una cuenta'}</Text>
      </Pressable>
    </View>
  );
}

const s=StyleSheet.create({
  page:{flex:1,justifyContent:'center',padding:28,backgroundColor:'#fff'},
  logo:{width:210,height:210,resizeMode:'contain',alignSelf:'center'},
  title:{fontSize:28,fontWeight:'900',textAlign:'center',color:colors.text},
  sub:{textAlign:'center',color:colors.muted,marginBottom:28},
  input:{borderWidth:1,borderColor:colors.border,borderRadius:12,padding:14,marginBottom:12},
  btn:{backgroundColor:colors.primary,padding:15,borderRadius:12,alignItems:'center',minHeight:52,justifyContent:'center'},
  bt:{color:'#fff',fontWeight:'800'},
  link:{textAlign:'center',color:colors.primary,fontWeight:'700',marginTop:18}
});
