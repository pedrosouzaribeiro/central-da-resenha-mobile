import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function MenuScreen() {
  const menuItems = [
    { icon: 'soccer-field', title: 'Reservar um campo', description: 'Reserve um horário no seu campo favorito. Verifique aqui a disponibilidade de horários.' },
    { icon: 'cart-outline', title: 'Compras para o churras', description: 'Encontre os melhores preços de região e divida o valor com seus amigos. Sem dores de cabeça.' },
    { icon: 'account-group', title: 'Organizar um time', description: 'Organize e reúna os times para aquele fut? Não tenha mais problemas com times desbalanceados.' },
    { icon: 'plus-circle-outline', title: 'Adicionar um amigo', description: 'Adicione seus amigos que já utilizam a Central da Reserva. Ao adicionar um amigo, você pode formar grupos e convidá-los para jogos.' },
  ];

  return (
    <View style={styles.container}>
      <Header />


        <Text style={styles.title}>O que você quer fazer hoje?</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <MaterialCommunityIcons name={item.icon} size={24} color="#F5F5F5" style={styles.menuIcon} />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.contactSection}>
          <Text style={styles.contactText}>Fale com a equipe da Central</Text>
          <Text style={styles.contactHandle}>@centraldaresenha</Text>
        </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF00',
  },
  profileButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131313',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,

  },
  menuIcon: {
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  contactSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  contactHandle: {
    fontSize: 14,
    color: '#BCBCBC',
  },
});