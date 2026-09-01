
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { colors, money } from '../theme';

export default function MoraScreen() {
  const [amount,setAmount]=useState('350000');
  const [days,setDays]=useState('8');
  const [rate,setRate]=useState('0.2');
  const lateFee=useMemo(()=>Number(amount||0)*(Number(rate||0)/100)*Number(days||0),[amount,days,rate]);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Card title="Cálculo de mora">
        <Text style={styles.label}>Capital vencido</Text>
        <TextInput keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input}/>
        <Text style={styles.label}>Días computables de atraso</Text>
        <TextInput keyboardType="numeric" value={days} onChangeText={setDays} style={styles.input}/>
        <Text style={styles.label}>Tasa diaria (%)</Text>
        <TextInput keyboardType="decimal-pad" value={rate} onChangeText={setRate} style={styles.input}/>
        <View style={styles.row}><Text>Mora</Text><Text style={styles.bold}>{money(lateFee)}</Text></View>
        <View style={styles.row}><Text style={styles.total}>Total</Text><Text style={styles.total}>{money(Number(amount||0)+lateFee)}</Text></View>
        <Text style={styles.note}>La tasa debe surgir del contrato y de la normativa aplicable; GDI no impone una tasa legal automática.</Text>
      </Card>
    </ScrollView>
  )
}
const styles=StyleSheet.create({
  page:{padding:18,backgroundColor:colors.background,flexGrow:1},
  label:{fontWeight:'700',color:colors.text,marginBottom:5},
  input:{backgroundColor:'white',borderWidth:1,borderColor:colors.border,borderRadius:12,padding:12,marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:9},
  bold:{fontWeight:'800'}, total:{fontWeight:'900',fontSize:18,color:colors.text},
  note:{color:colors.muted,lineHeight:20,marginTop:12}
});
