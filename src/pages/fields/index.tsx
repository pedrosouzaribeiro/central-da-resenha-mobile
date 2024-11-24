import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'
import BookingModal from './BookingModal'

const { width } = Dimensions.get('window')

const featuredField = {
  name: 'Resenha da Bola',
  description: 'Nosso campo principal oficial com churrasco, bebidas e TV',
  image: 'https://static-00.iconduck.com/assets.00/spring-boot-icon-2048x2046-hlpnsm8r.png',
}

const categories = ['Society', 'Futebol', 'Futsal']

// Adicione esta função de formatação
const formatWeekday = (weekday) => {
  const weekdayMap = {
    'domingo': 'Domingo',
    'segunda': 'Segunda',
    'terca': 'Terça',
    'quarta': 'Quarta',
    'quinta': 'Quinta',
    'sexta': 'Sexta',
    'sabado': 'Sábado'
  };
  
  return weekdayMap[weekday.toLowerCase()] || weekday;
};

export default function FieldsScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const fetchFields = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch('http://168.138.151.78:3000/api/home/empresas', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      const mappedFields = data.map(item => ({
        id: item.id,
        name: item.nome,
        image: item.imagembanner 
          ? `http://168.138.151.78:3000/uploads/empresas/${item.id}/${item.imagembanner.split('/').pop()}`
          : 'https://example.com/default-field-image.jpg',
        endereco: item.endereco,
      }))

      setFields(mappedFields)
    } catch (error) {
      console.error('Erro ao buscar campos:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  const handleOpenModal = async (fieldId) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`http://168.138.151.78:3000/api/home/campos/${fieldId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const fieldData = await response.json()
      
      const fieldsArray = Array.isArray(fieldData) ? fieldData : [fieldData]
      
      const mappedFields = fieldsArray.map(field => ({
        ...field,
        bannercampo: field.bannercampo 
          ? `http://168.138.151.78:3000/uploads/campos/${field.id}/${field.bannercampo.split('/').pop()}`
          : null
      }))
      
      setSelectedFields(mappedFields)
      setModalVisible(true)
    } catch (error) {
      console.error('Erro ao buscar detalhes do campo:', error)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchFields()
  }

  const renderFeaturedField = () => (
    <View style={styles.featuredCard}>
      <Image source={{ uri: featuredField.image }} style={styles.featuredImage} />
      <View style={styles.featuredContent}>
        <Text style={styles.featuredName}>{featuredField.name}</Text>
        <Text style={styles.featuredDescription}>{featuredField.description}</Text>
      </View>
    </View>
  )

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.categoriesTitle}>Categorias</Text>
      <View style={styles.categoriesButtonContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderFieldItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.fieldItem}
      onPress={() => handleOpenModal(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.fieldImage} />
      <View style={styles.fieldInfo}>
        <Text style={styles.fieldName}>{item.name}</Text>
        <Text style={styles.fieldAddress}>{item.endereco}</Text>
        <View style={styles.scheduleButton}>
          <Ionicons name="calendar-outline" size={16} color="#1D4A2A" />
          <Text style={styles.scheduleButtonText}>Ver horários</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECB71" />
        }
      >
        {renderFeaturedField()}
        {renderCategories()}
        
        <Text style={styles.sectionTitle}>Campos disponíveis</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#4ECB71" style={styles.loader} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fieldsScrollContent}
          >
            {fields.map(renderFieldItem)}
          </ScrollView>
        )}
      </ScrollView>

      <Footer />
      
      <BookingModal 
        isVisible={modalVisible} 
        onClose={() => {
          setModalVisible(false)
          setSelectedFields(null)
        }} 
        fieldData={selectedFields || []}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuredCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    margin: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4ECB71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    height: 120,
  },
  featuredImage: {
    width: 120,
    height: 120,
  },
  featuredContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  categoriesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoriesButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#4ECB71',
  },
  selectedCategoryButton: {
    backgroundColor: '#4ECB71',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#1D4A2A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginLeft: 20,
  },
  fieldsScrollContent: {
    paddingLeft: 20,
    paddingRight: 5,
  },
  fieldItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginRight: 15,
    width: width * 0.7,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: 150,
  },
  fieldInfo: {
    padding: 15,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  fieldAddress: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECB71',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  scheduleButtonText: {
    color: '#1D4A2A',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loader: {
    marginTop: 50,
  },
})