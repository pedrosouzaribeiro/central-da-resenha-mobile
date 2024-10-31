import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/header';
import Footer from '../../components/footer';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.56.1:3000/api/accountmanagement';
const TOKEN =  AsyncStorage.getItem('userToken'); // Replace with actual token

export default function ProfileEditor() {
  const navigation = useNavigation();
  const [name, setName] = useState('Kevin Girelli');
  const [position, setPosition] = useState('');
  const [number, setNumber] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [city, setCity] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // Adicione esta linha
  const [currentPage, setCurrentPage] = useState(0);

  // Novos estados para os campos adicionais
  const [pontos, setPontos] = useState('');
  const [vitorias, setVitorias] = useState('');
  const [jogos, setJogos] = useState('');
  const [reflexos, setReflexos] = useState('');
  const [defesa, setDefesa] = useState('');
  const [forca, setForca] = useState('');
  const [fisico, setFisico] = useState('');
  const [estrelas, setEstrelas] = useState('');
  const [geral, setGeral] = useState('');
  const [bairro, setBairro] = useState('');

  const handleConfirm = async () => {
    try {
      // Criando o objeto JSON diretamente
      const dadosParaEnviar = {
        pontos: parseInt(pontos) || 0,
        vitorias: parseInt(vitorias) || 0,
        jogos: parseInt(jogos) || 0,
        reflexos: parseInt(reflexos) || 0,
        defesa: parseInt(defesa) || 0,
        forca: parseInt(forca) || 0,
        fisico: parseInt(fisico) || 0,
        estrelas: parseInt(estrelas) || 0,
        estilo: playStyle || '',
        posicao: position || '',
        cidadeEstado: city || '',
        numeroPreferido: number || '',
        bairro: bairro || '',
        geral: parseInt(geral) || 0
      };

      // Log para debug
      console.log('Dados sendo enviados:', dadosParaEnviar);

      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Mudado para application/json
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosParaEnviar), // Enviando como JSON
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
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
        Alert.alert('Conta deletada', 'Sua conta foi deletada com sucesso');
      } else {
        throw new Error('Erro ao deletar conta');
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

  const handleLogout = async () => {
    try {
      // Remove o token do AsyncStorage
      await AsyncStorage.removeItem('userToken');
      
      // Força a navegação para a tela de Login e limpa a pilha de navegação
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      // Adiciona um alerta para confirmar o logout
      Alert.alert(
        'Logout',
        'Você saiu da sua conta com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Logout successful')
          }
        ]
      );

    } catch (error) {
      console.error('Erro no logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
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

      <View style={styles.contentContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const page = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
            setCurrentPage(page);
          }}
        >
          {/* Primeira página */}
          <View style={[styles.page, styles.viewbug]}>
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
              <MaterialIcons name="edit" size={24} color="#999" />
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
              <MaterialIcons name="edit" size={22} color="#999" />
            </View>

            <View style={styles.swipeIndicator}>
              <MaterialIcons name="swipe" size={24} color="#666" />
              <Text style={styles.swipeText}>Deslize para mais opções</Text>
            </View>
          </View>

          {/* Segunda página - campos adicionais */}
          <View style={[styles.page, styles.viewbug]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={pontos}
                onChangeText={setPontos}
                placeholder="Pontos"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <MaterialIcons name="edit" size={24} color="#999" />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={vitorias}
                onChangeText={setVitorias}
                placeholder="Vitórias"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={jogos}
                onChangeText={setJogos}
                placeholder="Jogos"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={reflexos}
                onChangeText={setReflexos}
                placeholder="Reflexos"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={defesa}
                onChangeText={setDefesa}
                placeholder="Defesa"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={forca}
                onChangeText={setForca}
                placeholder="Força"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={fisico}
                onChangeText={setFisico}
                placeholder="Físico"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={estrelas}
                onChangeText={setEstrelas}
                placeholder="Estrelas"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                value={geral}
                onChangeText={setGeral}
                placeholder="Geral"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro"
                placeholderTextColor="#999"
              />
              <MaterialIcons name="edit" size={24} color="#999" />
            </View>
          </View>
        </ScrollView>

        <View style={styles.paginationDots}>
          <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
          <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Confirmar edições</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => setShowDeleteModal(true)}
        >
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
    marginLeft: -15,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'thin',
    fontFamily: 'montserrat',
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
  },
  contentContainer: {
    flex: 1, // Isso vai fazer o conteúdo ocupar o espaço disponível
    maxHeight: 400, // Ajuste este valor conforme necessário
  },
  page: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 40,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4ECB71',
    width: 10,
    height: 10,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  swipeText: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
  },
});