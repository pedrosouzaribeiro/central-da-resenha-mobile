import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../../components/header';
import Footer from '../../components/footer';

const API_URL = 'http://168.138.151.78:3000/api/accountmanagement';
const DEFAULT_PROFILE_IMAGE = 'http://168.138.151.78:3000/uploads/avatars/default/default.jpg';

const InputField = ({ label, value, onChangeText, keyboardType = 'default', style }) => (
  <View style={[styles.inputContainer, style]}>
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
    <MaterialIcons name="edit" size={20} color="#999" />
  </View>
);

const ProfileImage = ({ imageUri, onPress, onError }) => (
  <View style={styles.profileSection}>
    <TouchableOpacity onPress={onPress}>
      <Image 
        source={{ uri: imageUri || DEFAULT_PROFILE_IMAGE }} 
        style={styles.profileImage}
        onError={onError}
      />
      <View style={styles.imagePickerOverlay}>
        <MaterialIcons name="camera-alt" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  </View>
);

export default function ProfileEditor() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    playStyle: '',
    city: '',
    points: '',
    victories: '',
    games: '',
    reflexes: '',
    defense: '',
    strength: '',
    physical: '',
    stars: '',
    overall: '',
    neighborhood: '',
    imageUri: null,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      const userResponse = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const profileResponse = await axios.get(`${API_URL}/profile/${userResponse.data.idcliente}`);
      const profileData = profileResponse.data.profile || {};

      const imageUrl = profileData.fotoavatar 
        ? `http://168.138.151.78:3000/${profileData.fotoavatar}`
        : DEFAULT_PROFILE_IMAGE;

      setFormData(prevData => ({
        ...prevData,
        name: profileData.nickname || '',
        position: profileData.posicao || '',
        number: profileData.numeropreferido?.toString() || '0',
        playStyle: profileData.estilo || '',
        city: profileData.cidadeestado || '',
        points: profileData.pontos?.toString() || '0',
        victories: profileData.vitorias?.toString() || '0',
        games: profileData.jogos?.toString() || '0',
        reflexes: profileData.reflexos?.toString() || '0',
        defense: profileData.defesa?.toString() || '0',
        strength: profileData.forca?.toString() || '0',
        physical: profileData.fisico?.toString() || '0',
        stars: profileData.estrelas?.toString() || '0',
        overall: profileData.geral?.toString() || '0',
        neighborhood: profileData.bairro || '',
        imageUri: imageUrl,
      }));
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        updateField('imageUri', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleConfirm = async () => {
    try {
      // Validação dos campos obrigatórios
      const requiredFields = {
        position: 'Posição',
        playStyle: 'Estilo de jogo',
        city: 'Cidade',
        neighborhood: 'Bairro'
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key]?.trim())
        .map(([_, label]) => label);

      if (emptyFields.length > 0) {
        Alert.alert(
          'Campos obrigatórios',
          `Por favor, preencha os seguintes campos:\n\n${emptyFields.join('\n')}`,
          [{ text: 'OK' }]
        );
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      const formDataToSend = new FormData();
      
      // Campos obrigatórios (texto)
      formDataToSend.append('nickname', formData.name || '');
      formDataToSend.append('posicao', formData.position);
      formDataToSend.append('numeroPreferido', formData.number || '');
      formDataToSend.append('estilo', formData.playStyle);
      formDataToSend.append('cidadeEstado', formData.city);
      formDataToSend.append('bairro', formData.neighborhood);

      // Campos numéricos (mantendo os valores existentes se não foram alterados)
      formDataToSend.append('pontos', formData.points || '0');
      formDataToSend.append('vitorias', formData.victories || '0');
      formDataToSend.append('jogos', formData.games || '0');
      formDataToSend.append('reflexos', formData.reflexes || '0');
      formDataToSend.append('defesa', formData.defense || '0');
      formDataToSend.append('forca', formData.strength || '0');
      formDataToSend.append('fisico', formData.physical || '0');
      formDataToSend.append('estrelas', formData.stars || '0');
      formDataToSend.append('geral', formData.overall || '0');

      // Só adiciona a imagem se uma nova foi selecionada
      if (formData.imageUri && !formData.imageUri.includes('http')) {
        formDataToSend.append('fotoAvatar', {
          uri: formData.imageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      const response = await axios.put(`${API_URL}/update`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        navigation.navigate('Profile');
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    }
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    scrollViewRef.current?.scrollTo({ x: pageIndex * width, animated: true });
  };

  const handleImageError = () => {
    setFormData(prev => ({
      ...prev,
      imageUri: DEFAULT_PROFILE_IMAGE
    }));
  };

  const renderInputField = (label, field, keyboardType = 'default', customStyle = {}) => (
    <InputField
      label={label}
      value={formData[field]}
      onChangeText={(value) => updateField(field, value)}
      keyboardType={keyboardType}
      style={customStyle}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileImage 
            imageUri={formData.imageUri} 
            onPress={handleImagePicker}
            onError={handleImageError}
          />
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentPage(pageIndex);
            }}
          >
            <View style={[styles.page, { width }]}>
              <View style={styles.row}>
                {renderInputField("Nome", "name", "default", { flex: 1 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Posição", "position", "default", { flex: 1, marginRight: 8 })}
                {renderInputField("Número", "number", "numeric", { flex: 1, marginLeft: 8 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Estilo de jogo", "playStyle", "default", { flex: 1 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Cidade", "city", "default", { flex: 1, marginRight: 8 })}
                {renderInputField("Bairro", "neighborhood", "default", { flex: 1, marginLeft: 8 })}
              </View>
            </View>
            <View style={[styles.page, { width }]}>
              <View style={styles.row}>
                {renderInputField("Pontos", "points", "numeric", { flex: 1, marginRight: 8 })}
                {renderInputField("Vitórias", "victories", "numeric", { flex: 1, marginLeft: 8 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Reflexos", "reflexes", "numeric", { flex: 1, marginRight: 8 })}
                {renderInputField("Defesa", "defense", "numeric", { flex: 1, marginLeft: 8 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Força", "strength", "numeric", { flex: 1, marginRight: 8 })}
                {renderInputField("Físico", "physical", "numeric", { flex: 1, marginLeft: 8 })}
              </View>
              <View style={styles.row}>
                {renderInputField("Estrelas", "stars", "numeric", { flex: 1, marginRight: 8 })}
                {renderInputField("Geral", "overall", "numeric", { flex: 1, marginLeft: 8 })}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.pageIndicator}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 0 && styles.activePageButton]}
              onPress={() => handlePageChange(0)}
            />
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && styles.activePageButton]}
              onPress={() => handlePageChange(1)}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar edições</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 100,
  },
  page: {
    paddingHorizontal: '5%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4%',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: '5%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4ECB71',
  },
  imagePickerOverlay: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#4ECB71',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212121',
    borderRadius: 12,
    paddingRight: 12,
    marginBottom: '2%',
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  pageButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666',
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: '#4ECB71',
  },
  buttonWrapper: {
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    backgroundColor: '#000',
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: '2%',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});