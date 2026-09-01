
import React from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet, Alert } from 'react-native';
import Card from '../components/Card';
import { colors, money } from '../theme';

export default function AccountScreen({ navigation }) {
  const rows = [['Alquiler',350000],['Expensas',40000],['Servicios',15000],['Mora',7000]];
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Card title="Departamento Centro — 4B">
        <Text style={styles.overdue}>Vencido · Septiembre 2026</Text>
        {rows.map(([k,v]) => <View key={k} style={styles.row}><Text>{k}</Text><Text style={styles.bold}>{money(v)}</Text></View>)}
        <View style={[styles.row,styles.total]}><Text style={styles.totalText}>Total actualizado</Text><Text style={styles.totalText}>{money(412000)}</Text></View>
        <Pressable onPress={() => navigation.navigate('MercadoPago')} style={styles.button}><Text style={styles.buttonText}>Cobrar con Mercado Pago</Text></Pressable>
        <Pressable onPress={() => Alert.alert('Pago manual','Se registrará con fecha, importe, medio de pago y auditoría.')} style={styles.secondary}><Text>Registrar pago manual</Text></Pressable>
      </Card>
    </ScrollView>
  )
}
const styles=StyleSheet.create({
  page:{padding:18,backgroundColor:colors.background,flexGrow:1},
  overdue:{color:colors.danger,fontWeight:'800',marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8},
  bold:{fontWeight:'700'}, total:{borderTopWidth:1,borderColor:colors.border,marginTop:6,paddingTop:14},
  totalText:{fontWeight:'900',fontSize:18,color:colors.text},
  button:{backgroundColor:colors.primary,borderRadius:12,padding:14,alignItems:'center',marginTop:16},
  buttonText:{color:'white',fontWeight:'800'},
  secondary:{borderWidth:1,borderColor:colors.border,borderRadius:12,padding:14,alignItems:'center',marginTop:10}
});
