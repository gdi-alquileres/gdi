
import React from 'react';
import {ScrollView,Text,Pressable,StyleSheet,View,Alert} from 'react-native';
import Card from '../components/Card'; import {colors,money} from '../theme';
export default function ContractScreen(){
 return <ScrollView contentContainerStyle={s.page}>
  <Card title="Contrato activo">
   <Row a="Propiedad" b="Departamento Centro 4B"/><Row a="Alquiler inicial" b={money(350000)}/><Row a="Vencimiento mensual" b="Día 10"/><Row a="Ajuste" b="Según mecanismo pactado"/><Row a="Mora" b="Configurada en contrato"/>
   <Pressable style={s.btn} onPress={()=>Alert.alert('Contrato','En producción se generará el PDF desde una plantilla legal revisada.')}><Text style={s.bt}>Generar borrador de contrato</Text></Pressable>
  </Card>
  <Card title="Documentación"><Text>✓ Datos del inmueble</Text><Text>✓ Datos del inquilino</Text><Text>⚠ Garantía pendiente de revisión</Text></Card>
 </ScrollView>
}
function Row({a,b}){return <View style={s.row}><Text>{a}</Text><Text style={s.bold}>{b}</Text></View>}
const s=StyleSheet.create({page:{padding:18,backgroundColor:colors.background,flexGrow:1},row:{flexDirection:'row',justifyContent:'space-between',gap:10,paddingVertical:8},bold:{fontWeight:'700',textAlign:'right',flex:1},btn:{backgroundColor:colors.primary,padding:14,borderRadius:12,alignItems:'center',marginTop:14},bt:{color:'#fff',fontWeight:'800'}})
