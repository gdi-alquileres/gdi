
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import Card from '../components/Card';
import { colors } from '../theme';
import { createTenant, listTenants } from '../services/api';

export default function PeopleScreen() {
  const [name,setName]=useState('');
  const [dni,setDni]=useState('');
  const [cuil,setCuil]=useState('');
  const [phone,setPhone]=useState('');
  const [email,setEmail]=useState('');
  const [items,setItems]=useState([]);

  async function load(){
    try { setItems(await listTenants()); }
    catch(e){ Alert.alert('Error',e.message); }
  }
  useEffect(()=>{load()},[]);

  async function save(){
    if(!name.trim()){ Alert.alert('Falta el nombre','Ingresá el nombre del inquilino.'); return; }
    try{
      await createTenant({name:name.trim(),dni,cuil,phone,email});
      setName('');setDni('');setCuil('');setPhone('');setEmail('');
      await load();
    }catch(e){ Alert.alert('No se pudo guardar',e.message); }
  }

  return <ScrollView contentContainerStyle={s.page}>
    <Card title="Nuevo inquilino">
      <TextInput value={name} onChangeText={setName} placeholder="Nombre completo" style={s.input}/>
      <TextInput value={dni} onChangeText={setDni} placeholder="DNI" style={s.input}/>
      <TextInput value={cuil} onChangeText={setCuil} placeholder="CUIL" style={s.input}/>
      <TextInput value={phone} onChangeText={setPhone} placeholder="Teléfono" style={s.input}/>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={s.input}/>
      <Pressable style={s.btn} onPress={save}><Text style={s.bt}>Guardar inquilino</Text></Pressable>
    </Card>

    <Text style={s.title}>Inquilinos cargados</Text>
    {items.map(t=><Card key={t.id}><Text style={s.item}>{t.name}</Text><Text style={s.muted}>{t.dni || 'Sin DNI'} · {t.phone || 'Sin teléfono'}</Text></Card>)}

    <Card title="Garantes">
      <Text style={s.muted}>El backend de garantes y documentación será el próximo módulo conectado. La interfaz queda reservada para revisión de garantía y estado documental.</Text>
    </Card>
  </ScrollView>
}
const s=StyleSheet.create({
  page:{padding:18,backgroundColor:colors.background,flexGrow:1},
  input:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:12,padding:12,marginBottom:10},
  btn:{backgroundColor:colors.primary,padding:14,borderRadius:12,alignItems:'center'},
  bt:{color:'#fff',fontWeight:'800'},
  title:{fontSize:20,fontWeight:'800',marginBottom:10,color:colors.text},
  item:{fontWeight:'800',fontSize:17,color:colors.text},
  muted:{color:colors.muted,lineHeight:20}
});
