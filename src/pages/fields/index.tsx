import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
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

export default function FieldsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldsState, setFieldsState] = useState([]); // Estado para armazenar os campos
  const [selectedFields, setSelectedFields] = useState(null); // Renomeado para selectedFields

  useEffect(() => {
    const fetchFields = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Obtendo o token do AsyncStorage
      const response = await fetch('http://192.168.2.12:3000/api/home/empresas', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
        },
      });
      const data = await response.json();
      
      // Mapeando os dados para o formato desejado
      const mappedFields = data.map(item => ({
        id: item.id,
        name: item.nome,
        image: item.imagembanner || 'default_image_url', // Usando imagembanner ou uma imagem padrão
        endereco: item.endereco,
      }));

      setFieldsState(mappedFields); // Atualizando o estado com os dados mapeados
    };

    fetchFields();
  }, []); // Executa apenas uma vez ao montar o componente

  const handleOpenModal = async (fieldId) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Obtendo o token do AsyncStorage
      const response = await fetch(`http://192.168.2.12:3000/api/home/campos/${fieldId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
        },
      });
      const fieldData = await response.json();
      
      // Garantindo que fieldData seja um array
      const fieldsArray = Array.isArray(fieldData) ? fieldData : [fieldData];
      setSelectedFields(fieldsArray); // Armazenando o array de campos
      setModalVisible(true); // Abrindo o modal
    } catch (error) {
      console.error('Erro ao buscar dados do campo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Campos disponíveis</Text>
        
        <View style={styles.featuredField}>
          <View style={styles.featuredHeader}>
            <Image 
              source={require('../../assets/mercado.png')} 
              style={styles.featuredLogo}
              accessibilityLabel="Logo do campo" // Adicionando label de acessibilidade
            />
            <View>
              <Text style={styles.featuredName}>{featuredField.name}</Text>
              <Text style={styles.featuredDescription}>{featuredField.description}</Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          {featuredField.categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={featuredField.categoryStyle}
              accessibilityLabel={`Categoria ${category}`} // Adicionando label de acessibilidade
            >
              <Text style={featuredField.categoryTextStyle}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>
            Filtre por região: <Text>_______________________________________________</Text>
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScrollView}
          contentContainerStyle={styles.scrollViewContent} // Adicionando contentContainerStyle
        >
          {fieldsState.map((item) => (
            <View key={item.id} style={styles.fieldItem}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.fieldImage}
                accessibilityLabel={`Imagem do campo ${item.name}`} // Adicionando label de acessibilidade
              />
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldName}>{item.name}</Text>
                <Text style={styles.fieldAddress}>{item.endereco}</Text>
                <TouchableOpacity 
                  style={styles.scheduleButton} 
                  onPress={() => handleOpenModal(item.id)}
                  accessibilityLabel={`Ver horários de ${item.name}`} // Adicionando label de acessibilidade
                >
                  <Text style={styles.scheduleButtonText}>Ver horários</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <Footer />
      <BookingModal 
        isVisible={modalVisible} 
        onClose={() => {
          setModalVisible(false);
          setSelectedFields(null); // Limpa os campos selecionados ao fechar
        }} 
        fieldData={selectedFields || []} // Garantindo que sempre seja um array
      />
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
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingRight: 20, // Adicionando padding no final do scroll
  },
});
