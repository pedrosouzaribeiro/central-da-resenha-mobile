import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../../components/footer';
import Header from '../../components/header';
import BookingModal from './BookingModal';

const featuredField = {
  name: 'Resenha da Bola',
  description: 'Nosso campo principal oficial. O Resenha da Bola tem tudo o que você precisa para realizar, com direito a churrasco, bebidas e TV',
  categories: ['Society', 'Futebol', 'Futsal'],
  categoryStyle: {
    backgroundColor: '#4ECB71',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  categoryTextStyle: {
    color: '#1D4A2A',
    fontSize: 12,
    fontWeight: 'bold',
  },
};

const fields = [
  { id: '1', name: 'Arena Society', image: 'https://example.com/arena-society.jpg' },
  { id: '2', name: 'Cpx Esportivo Raboni', image: 'https://example.com/cpx-esportivo-raboni.jpg' },
  { id: '3', name: 'Resenha da Bola', image: 'https://example.com/resenha-da-bola.jpg' },
];

export default function FieldsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Campos disponíveis</Text>
        
        <View style={styles.featuredField}>
          <View style={styles.featuredHeader}>
            <Image source={require('../../assets/mercado.png')} style={styles.featuredLogo} />
            <View>
              <Text style={styles.featuredName}>{featuredField.name}</Text>
              <Text style={styles.featuredDescription}>{featuredField.description}</Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          {featuredField.categories.map((category, index) => (
            <TouchableOpacity key={index} style={featuredField.categoryStyle}>
              <Text style={featuredField.categoryTextStyle}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Filtre por região: _______________________________________________</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScrollView}
        >
          {fields.map((item) => (
            <View key={item.id} style={styles.fieldItem}>
              <Image source={{ uri: item.image }} style={styles.fieldImage} />
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>{item.name}</Text>
                <TouchableOpacity style={styles.scheduleButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.scheduleButtonText}>Ver horários</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <Footer />
      <BookingModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center'
  },
  featuredField: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#00FF00',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    color: '#F5F5F5',
    marginLeft: 10,
    fontSize: 16,
    marginTop: 32,
    marginBottom: 20
  },
  fieldItem: {
    width: 200,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: 120,
  },
  fieldInfo: {
    padding: 15,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scheduleButton: {
    backgroundColor: '#4ECB71',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  scheduleButtonText: {
    color: '#1D4A2A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  horizontalScrollView: {
    marginBottom: 20,
    color: '#FFF',
  },
});