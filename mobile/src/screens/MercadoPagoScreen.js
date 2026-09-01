
import React, { useState } from 'react';
import { ScrollView, Text, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import Card from '../components/Card';
import { colors, money } from '../theme';
import { createMercadoPagoOrder } from '../services/api';

export default function MercadoPagoScreen() {
  const [leaseId,setLeaseId]=useState('1');
  const [amount,setAmount]=useState('412000');
  const [period,setPeriod]=useState('2026-09');
  const [result,setResult]=useState(null);

  async function createPayment() {
    try {
      const data = await createMercadoPagoOrder({
        lease_id:Number(leaseId),
        amount:Number(amount),
        period
      });
      setResult(data);
      Alert.alert('Orden creada','El backend generó una referencia única. Cuando conectemos credenciales productivas, devolverá la URL real de Checkout.');
    } catch(e) {
      Alert.alert('No se pudo crear',e.message);
    }
  }

  return <ScrollView contentContainerStyle={styles.page}>
    <Card title="Mercado Pago">
      <Text style={styles.label}>Contrato / Lease ID</Text>
      <TextInput value={leaseId} onChangeText={setLeaseId} keyboardType="numeric" style={styles.input}/>
      <Text style={styles.label}>Importe</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input}/>
      <Text style={styles.label}>Período</Text>
      <TextInput value={period} onChangeText={setPeriod} style={styles.input}/>
      <Pressable onPress={createPayment} style={styles.button}><Text style={styles.buttonText}>Generar orden desde backend</Text></Pressable>

      {result ? <>
        <Text style={styles.ok}>✓ Orden creada</Text>
        <Text style={styles.p}>Referencia: {result.external_reference}</Text>
        <Text style={styles.p}>Estado: {result.provider_status}</Text>
        <Text style={styles.p}>Monto: {money(Number(amount))}</Text>
      </> : null}
    </Card>
    <Card title="Seguridad">
      <Text style={styles.p}>La app no almacena credenciales privadas de Mercado Pago. La orden nace en el servidor y la acreditación definitiva se hará por webhook validado.</Text>
    </Card>
  </ScrollView>
}
const styles=StyleSheet.create({
  page:{padding:18,backgroundColor:colors.background,flexGrow:1},
  label:{fontWeight:'700',color:colors.text,marginBottom:5},
  input:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:12,padding:12,marginBottom:10},
  button:{backgroundColor:colors.primary,borderRadius:12,padding:14,alignItems:'center',marginTop:6},
  buttonText:{color:'#fff',fontWeight:'800'},
  p:{color:colors.text,marginTop:9,lineHeight:20},
  ok:{color:colors.success,fontWeight:'800',marginTop:14}
});
