import React, { useState, useEffect, useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Header from '../../components/header';
import Footer from '../../components/footer';
import BookingModal from './BookingModal';

const { width } = Dimensions.get('window');

const featuredField = {
  name: 'Resenha da Bola',
  description: 'Nosso campo principal oficial com churrasco, bebidas e TV',
  image: 'https://instagram.fpoa40-1.fna.fbcdn.net/v/t51.2885-19/245158485_327622122471270_2568264200865043438_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpoa40-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=k1ZHirHyMNEQ7kNvgEUcwSD&_nc_gid=955f552db9d74f35951a8d1887b4e71f&edm=AEYEu-QBAAAA&ccb=7-5&oh=00_AYDOWBBY5QYNy2-PZ14YagHqscyPhOnjJEBYpS5bxd9W-Q&oe=674AF801&_nc_sid=ead929',
};

const categories = ['Todos', 'Society', 'Futebol', 'Futsal'];

export default function FieldsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const fetchFields = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://168.138.151.78:3000/api/home/empresas', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const mappedFields = data.map(item => ({
        id: item.id,
        name: item.nome,
        image: item.imagembanner 
          ? `http://168.138.151.78:3000/uploads/empresas/${item.id}/${item.imagembanner.split('/').pop()}`
          : 'https://example.com/default-field-image.jpg',
        endereco: item.endereco,
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        price: item.menorpreco || 80,
      }));

      setFields(mappedFields);
    } catch (error) {
      console.error('Erro ao buscar campos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleOpenModal = async (fieldId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://168.138.151.78:3000/api/home/campos/${fieldId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fieldData = await response.json();
      
      const fieldsArray = Array.isArray(fieldData) ? fieldData : [fieldData];
      
      const mappedFields = fieldsArray.map(field => ({
        ...field,
        bannercampo: field.bannercampo 
          ? `http://168.138.151.78:3000/uploads/campos/${field.id}/${field.bannercampo.split('/').pop()}`
          : null
      }));
      
      setSelectedFields(mappedFields);
      setModalVisible(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do campo:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFields();
  };

  const renderFeaturedField = () => (
    <Animatable.View animation="fadeIn" duration={1000} style={styles.featuredCard}>
      <LinearGradient
        colors={['rgba(78, 203, 113, 0.8)', 'rgba(78, 203, 113, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredGradient}
      >
        <Image source={{ uri: featuredField.image }} style={styles.featuredImage} />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredName}>{featuredField.name}</Text>
          <Text style={styles.featuredDescription}>{featuredField.description}</Text>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderCategories = () => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={200} style={styles.categoriesContainer}>
      <Text style={styles.categoriesTitle}>Categorias</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
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
      </ScrollView>
    </Animatable.View>
  );

  const renderFieldItem = ({ item, index }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => handleOpenModal(item.id)}
    >
      <Animatable.View 
        animation="fadeInRight" 
        duration={1000} 
        delay={index * 100}
        style={styles.fieldItem}
      >
        <Image source={{ uri: item.image }} style={styles.fieldImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.fieldGradient}
        >
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldName}>{item.name}</Text>
            <Text style={styles.fieldAddress}>{item.endereco}</Text>
            <View style={styles.fieldDetails}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.priceText}>A partir de R$ {item.price}</Text>
            </View>
            <TouchableOpacity 
              style={styles.scheduleButton}
              onPress={(e) => {
                e.stopPropagation();
                handleOpenModal(item.id);
              }}
            >
              <Text style={styles.scheduleButtonText}>Ver horários</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={400} style={styles.statsContainer}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="soccer-field" size={24} color="#4ECB71" />
        <Text style={styles.statNumber}>{fields.length}</Text>
        <Text style={styles.statLabel}>Campos</Text>
      </View>
      <View style={styles.statItem}>
        <FontAwesome5 name="users" size={24} color="#4ECB71" />
        <Text style={styles.statNumber}>1000+</Text>
        <Text style={styles.statLabel}>Usuários</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="football-outline" size={24} color="#4ECB71" />
        <Text style={styles.statNumber}>500+</Text>
        <Text style={styles.statLabel}>Partidas</Text>
      </View>
    </Animatable.View>
  );

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
        {renderStats()}
        
        <Animatable.Text animation="fadeInLeft" duration={1000} delay={600} style={styles.sectionTitle}>
          Campos disponíveis
        </Animatable.Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#4ECB71" style={styles.loader} />
        ) : (
          <FlatList
            data={fields}
            renderItem={renderFieldItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fieldsScrollContent}
          />
        )}
      </ScrollView>

      <Footer />
      
      <BookingModal 
        isVisible={modalVisible} 
        onClose={() => {
          setModalVisible(false);
          setSelectedFields(null);
        }} 
        fieldData={selectedFields || []}
      />
    </View>
  );
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
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,

  },
  featuredGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  featuredImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  featuredContent: {
    flex: 1,
    marginLeft: 15,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  featuredButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 22,
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
    width: width * 0.75,
    height: 250,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: '100%',
  },
  fieldGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  fieldInfo: {
    justifyContent: 'flex-end',
  },
  fieldName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  fieldAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  fieldDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#4ECB71',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
});