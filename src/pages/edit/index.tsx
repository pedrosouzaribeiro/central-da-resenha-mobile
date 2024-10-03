import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/header';
import Footer from '../../components/footer';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://localhost:4444/api';
const TOKEN = 'your_auth_token_here'; // Replace with actual token

export default function ProfileEditor() {
  const [name, setName] = useState('Kevin Girelli');
  const [position, setPosition] = useState('');
  const [number, setNumber] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [city, setCity] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // Adicione esta linha

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('position', position);
      formData.append('number', number);
      formData.append('playStyle', playStyle);
      formData.append('city', city);

      // Adiciona a imagem ao FormData se uma imagem foi selecionada
      if (imageUri) {
        formData.append('image', {
          uri: imageUri,
          name: 'profile.jpg', // Nome do arquivo
          type: 'image/jpeg', // Tipo do arquivo
        });
      }

      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ requestDelete: 1 })
      });

      if (response.ok) {
        Alert.alert('Account Deleted', 'Your account has been successfully deleted');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleImagePicker = async () => {
    // Solicitar permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria para escolher uma imagem.');
      return;
    }

    // Abrir o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Armazena a URI da imagem selecionada
    }
  };

  return (
    <View style={styles.container}>
      <View><Header /></View>
      
      <Text style={styles.title}>Editar perfil</Text>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://avatars.githubusercontent.com/u/131497909?v=4' }}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.viewbug}>

        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={styles.imagePickerText}>Escolher imagem</Text>
          <MaterialIcons name="file-download" size={24} color="#B5B5B5" style={{ marginLeft: 110 }}/>
      </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome"
            placeholderTextColor="#999"
          />
          <MaterialIcons name="edit" size={24} color="#999"  />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfWidth]}
            value={position}
            onChangeText={setPosition}
            placeholder="Posição"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.halfWidth]}
            value={number}
            onChangeText={setNumber}
            placeholder="Número"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={playStyle}
            onChangeText={setPlayStyle}
            placeholder="Estilo de jogo"
            placeholderTextColor="#999"
          />
          <MaterialIcons name="edit" size={22} color="#999" />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Cidade"
            placeholderTextColor="#999"
          />
          <MaterialIcons name="edit" size={22} color="#999" style={styles.icon} />
        </View>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmar edições</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
          <Text style={styles.buttondelete}>Apagar conta</Text>
        </TouchableOpacity>
        
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>VOCÊ QUER APAGAR A SUA CONTA?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
              >
                <Text style={styles.buttonText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 13,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#B8B8B8',

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212121',
    borderRadius: 13,
    marginBottom: 10,
    paddingRight: 10, // Adiciona espaço para o ícone dentro do input
  },
  input: {
    flex: 1, // Permite que o TextInput ocupe o espaço restante
    backgroundColor: '#212121',
    color: '#B8B8B8',
    padding: 13,
    borderRadius: 13,
    fontSize: 14,
  },
  icon: {
    marginLeft: -30, // Ajusta a posição do ícone dentro do input
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  halfWidth: {
    width: '48%',
  },
  logoutButton: {
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 135,
    marginBottom: -20,
    marginTop: -16,
    marginLeft: -65,
    fontWeight: 'thin',
    fontFamily: 'montserrat',
    width: 100,
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -16,
  },
  deleteButton: {
    backgroundColor: '#CB4E4E',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttondelete:{
    color: '#4A201D',
    fontSize: 16,
    fontWeight: 'bold',

  },
  buttonText: {
    color: '#1D4A2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#1D4A2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
  },
  modalButtonCancel: {
    backgroundColor: '#808080',
  },
  modalButtonConfirm: {
    backgroundColor: '#4ECB71',
  },
  viewbug: {
    paddingHorizontal: 40
  }
});