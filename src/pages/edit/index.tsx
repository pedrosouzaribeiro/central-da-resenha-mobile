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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../../components/header';
import Footer from '../../components/footer';

const { width } = Dimensions.get('window');
const API_URL = 'http://168.138.151.78:3000/api/accountmanagement';

const InputField = ({ label, value, onChangeText, keyboardType = 'default', width = '100%' }) => (
  <View style={[styles.inputContainer, { width }]}>
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

const ProfileImage = ({ imageUri, onPress }) => (
  <View style={styles.profileSection}>
    <TouchableOpacity onPress={onPress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.profileImage} />
      ) : (
        <View style={styles.defaultProfileImage} />
      )}
      <View style={styles.imagePickerOverlay}>
        <MaterialIcons name="camera-alt" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  </View>
);

const DeleteAccountModal = ({ visible, onClose, onDelete }) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Apagar conta?</Text>
        <Text style={styles.modalText}>
          Esta ação não pode ser desfeita.
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmDeleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default function ProfileEditor() {
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data;
      setFormData(prevData => ({
        ...prevData,
        name: profileData.nickname || '',
        position: profileData.posicao || '',
        number: profileData.numeroPreferido || '',
        playStyle: profileData.estilo || '',
        city: profileData.cidadeEstado || '',
        points: profileData.pontos?.toString() || '',
        victories: profileData.vitorias?.toString() || '',
        games: profileData.jogos?.toString() || '',
        reflexes: profileData.reflexos?.toString() || '',
        defense: profileData.defesa?.toString() || '',
        strength: profileData.forca?.toString() || '',
        physical: profileData.fisico?.toString() || '',
        stars: profileData.estrelas?.toString() || '',
        overall: profileData.geral?.toString() || '',
        neighborhood: profileData.bairro || '',
        imageUri: profileData.avatarUrl || null,
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
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('fotoAvatar', {
        uri: formData.imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      formDataToSend.append('nickname', formData.name);
      formDataToSend.append('posicao', formData.position);
      formDataToSend.append('numeroPreferido', formData.number);
      formDataToSend.append('estilo', formData.playStyle);
      formDataToSend.append('cidadeEstado', formData.city);
      formDataToSend.append('pontos', parseInt(formData.points) || 0);
      formDataToSend.append('vitorias', parseInt(formData.victories) || 0);
      formDataToSend.append('jogos', parseInt(formData.games) || 0);
      formDataToSend.append('reflexos', parseInt(formData.reflexes) || 0);
      formDataToSend.append('defesa', parseInt(formData.defense) || 0);
      formDataToSend.append('forca', parseInt(formData.strength) || 0);
      formDataToSend.append('fisico', parseInt(formData.physical) || 0);
      formDataToSend.append('estrelas', parseInt(formData.stars) || 0);
      formDataToSend.append('geral', parseInt(formData.overall) || 0);
      formDataToSend.append('bairro', formData.neighborhood);

      const response = await axios.put(`${API_URL}/update`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.delete(`${API_URL}/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { requestDelete: 1 },
      });

      if (response.status === 200) {
        Alert.alert('Conta deletada', 'Sua conta foi deletada com sucesso');
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        throw new Error('Erro ao deletar conta');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      Alert.alert('Erro', 'Não foi possível deletar a conta. Tente novamente.');
    }
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    scrollViewRef.current?.scrollTo({ x: pageIndex * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.content}>
          <ProfileImage imageUri={formData.imageUri} onPress={handleImagePicker} />
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
            <View style={styles.page}>
              <View style={styles.row}>
                <InputField
                  label="Nome"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  width="100%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Posição"
                  value={formData.position}
                  onChangeText={(value) => updateField('position', value)}
                  width="48%"
                />
                <InputField
                  label="Número"
                  value={formData.number}
                  onChangeText={(value) => updateField('number', value)}
                  keyboardType="numeric"
                  width="48%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Estilo de jogo"
                  value={formData.playStyle}
                  onChangeText={(value) => updateField('playStyle', value)}
                  width="100%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Cidade"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  width="48%"
                />
                <InputField
                  label="Bairro"
                  value={formData.neighborhood}
                  onChangeText={(value) => updateField('neighborhood', value)}
                  width="48%"
                />
              </View>
            </View>
            <View style={styles.page}>
              <View style={styles.row}>
                <InputField
                  label="Pontos"
                  value={formData.points}
                  onChangeText={(value) => updateField('points', value)}
                  keyboardType="numeric"
                  width="48%"
                />
                <InputField
                  label="Vitórias"
                  value={formData.victories}
                  onChangeText={(value) => updateField('victories', value)}
                  keyboardType="numeric"
                  width="48%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Reflexos"
                  value={formData.reflexes}
                  onChangeText={(value) => updateField('reflexes', value)}
                  keyboardType="numeric"
                  width="48%"
                />
                <InputField
                  label="Defesa"
                  value={formData.defense}
                  onChangeText={(value) => updateField('defense', value)}
                  keyboardType="numeric"
                  width="48%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Força"
                  value={formData.strength}
                  onChangeText={(value) => updateField('strength', value)}
                  keyboardType="numeric"
                  width="48%"
                />
                <InputField
                  label="Físico"
                  value={formData.physical}
                  onChangeText={(value) => updateField('physical', value)}
                  keyboardType="numeric"
                  width="48%"
                />
              </View>
              <View style={styles.row}>
                <InputField
                  label="Estrelas"
                  value={formData.stars}
                  onChangeText={(value) => updateField('stars', value)}
                  keyboardType="numeric"
                  width="48%"
                />
                <InputField
                  label="Geral"
                  value={formData.overall}
                  onChangeText={(value) => updateField('overall', value)}
                  keyboardType="numeric"
                  width="48%"
                />
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
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmar edições</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.deleteButtonText}>Apagar conta</Text>
        </TouchableOpacity>
      </View>

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
    paddingTop: 80,
  },
  page: {
    width: width,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4ECB71',
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
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
    marginTop: 10,
    marginBottom: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 155,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 5,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#CB4E4E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 5,
  },
  deleteButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#212121',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmDeleteButton: {
    backgroundColor: '#CB4E4E',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});