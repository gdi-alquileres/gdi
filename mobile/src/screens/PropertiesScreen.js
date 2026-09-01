
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import Card from '../components/Card';
import { colors } from '../theme';
import { listProperties, createProperty } from '../services/api';

export default function PropertiesScreen() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try { setItems(await listProperties()); }
    catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim() || !address.trim()) {
      Alert.alert('Faltan datos', 'Ingresá nombre y dirección.');
      return;
    }
    try {
      await createProperty({
        name: name.trim(),
        property_type: 'departamento',
        address: address.trim(),
        city: city.trim()
      });
      setName(''); setAddress(''); setCity('');
      await load();
    } catch (e) {
      Alert.alert('No se pudo guardar', e.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load}/>}>
      <Card title="Nueva propiedad">
        <TextInput value={name} onChangeText={setName} placeholder="Nombre / identificación" style={styles.input}/>
        <TextInput value={address} onChangeText={setAddress} placeholder="Dirección" style={styles.input}/>
        <TextInput value={city} onChangeText={setCity} placeholder="Ciudad" style={styles.input}/>
        <Pressable onPress={add} style={styles.button}><Text style={styles.buttonText}>Guardar propiedad</Text></Pressable>
      </Card>

      <Text style={styles.title}>Mis propiedades</Text>
      {loading && !items.length ? <ActivityIndicator/> : null}
      {!loading && items.length === 0 ? <Text style={styles.muted}>Todavía no agregaste propiedades.</Text> : null}
      {items.map((p) => (
        <Card key={p.id}>
          <Text style={styles.itemTitle}>{p.name}</Text>
          <Text style={styles.muted}>{p.address}{p.city ? ` · ${p.city}` : ''}</Text>
          <Text style={styles.status}>● {p.status === 'active' ? 'Activa' : p.status}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}
const styles=StyleSheet.create({
  page:{padding:18,backgroundColor:colors.background,flexGrow:1},
  input:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:12,padding:12,marginBottom:10},
  button:{backgroundColor:colors.primary,borderRadius:12,padding:14,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'800'},
  title:{fontSize:20,fontWeight:'800',marginBottom:12,color:colors.text},
  itemTitle:{fontSize:17,fontWeight:'800',color:colors.text},
  muted:{color:colors.muted,marginTop:4},
  status:{color:colors.success,fontWeight:'700',marginTop:8}
});
