
import React from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { colors, money } from '../theme';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.brand}>
        <Image source={require('../../assets/gdi_logo.jpg')} style={styles.logo} />
        <View>
          <Text style={styles.h1}>GDI Alquileres</Text>
          <Text style={styles.sub}>Todo tu alquiler. En un solo lugar.</Text>
        </View>
      </View>

      <Card title="Resumen mensual">
        <View style={styles.row}><Text>Ingresos esperados</Text><Text style={styles.bold}>{money(1185000)}</Text></View>
        <View style={styles.row}><Text>Cobrado</Text><Text style={styles.ok}>{money(773000)}</Text></View>
        <View style={styles.row}><Text>Pendiente</Text><Text style={styles.warn}>{money(412000)}</Text></View>
      </Card>

      <Text style={styles.section}>Accesos rápidos</Text>
      <View style={styles.grid}>
        <Quick title="Propiedades" onPress={() => navigation.navigate('Propiedades')} />
        <Quick title="Estado de cuenta" onPress={() => navigation.navigate('Cuenta')} />
        <Quick title="Mercado Pago" onPress={() => navigation.navigate('MercadoPago')} />
        <Quick title="Mora" onPress={() => navigation.navigate('Mora')} />
      </View>

      <Card title="Alertas">
        <Text style={styles.alert}>⚠️ Departamento Centro 4B — pago vencido</Text>
        <Text style={styles.alert}>📈 Local Centro — ajuste próximo</Text>
        <Text style={styles.alert}>📄 Contrato — vence en 45 días</Text>
      </Card>
    </ScrollView>
  );
}

function Quick({ title, onPress }) {
  return <Pressable onPress={onPress} style={styles.quick}><Text style={styles.quickText}>{title}</Text></Pressable>
}

const styles = StyleSheet.create({
  page: { padding: 18, backgroundColor: colors.background, flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  logo: { width: 72, height: 72, borderRadius: 16 },
  h1: { fontSize: 25, fontWeight: '800', color: colors.text },
  sub: { color: colors.muted, marginTop: 3 },
  section: { fontWeight: '800', color: colors.text, fontSize: 18, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  quick: { width: '48%', minHeight: 82, backgroundColor: colors.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 12 },
  quickText: { color: 'white', fontWeight: '800', textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  bold: { fontWeight: '800' }, ok: { color: colors.success, fontWeight: '800' }, warn: { color: colors.warning, fontWeight: '800' },
  alert: { paddingVertical: 7, color: colors.text }
});
