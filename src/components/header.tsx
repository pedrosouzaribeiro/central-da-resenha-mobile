import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('usuario');
  const [position, setPosition] = useState('');
  const [clientId, setClientId] = useState(null); // Novo estado para armazenar o ID do cliente

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Recupera o token do AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Token não encontrado. Faça login novamente.');
          return;
        }

        // Primeira requisição para obter o perfil do usuário
        const response = await axios.get('http://168.138.151.78:3000/api/accountmanagement/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Usa o token recuperado
          },
        });

        // Atualiza o estado com os dados do usuário
        setClientId(response.data.idcliente); // Armazena o ID do cliente


        // Segunda requisição para obter o nickname usando o ID do cliente
        if (response.data.idcliente) {
          const profileResponse = await axios.get(`http://168.138.151.78:3000/api/accountmanagement/profile/${response.data.idcliente}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Usa o token
            },
          });

          setPosition(profileResponse.data.profile.posicao || '');
          // Atualiza o estado com o nickname
          setUserName(profileResponse.data.profile.nickname || 'usuario');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert('Erro ao buscar dados do usuário. Verifique sua conexão.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title} onPress={() => navigation.navigate('Menu' as never)}>Central da Resenha</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)} style={styles.profileNameContainer}>
          <Text style={styles.profileName}>{userName}</Text>
          {position ? <Text style={styles.profileRole}>{position}</Text> : <Text style={styles.profileRole}>N/A</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <FontAwesome6 name="circle-user" size={25} color="#666" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 35,
    width: '100%',
    top: 0,
    zIndex: 1,
    marginTop: 20,
  },
  backButton: {
    padding: 5,
    backgroundColor: "#202020",
    borderRadius: 5,
    marginLeft: -15,
  },
  title: {
    fontFamily: 'montserrat',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: -50,
    width: "40%",
    color: '#4ecb71',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileNameContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  profileName: {
    fontFamily: 'montserrat',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  profileRole: {
    fontFamily: 'montserrat',
    fontSize: 12,
    color: '#888',
  },
  icon: {
    color: '#f5f5f5',
    marginLeft: 8,
  },
});
