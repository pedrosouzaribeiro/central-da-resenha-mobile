import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function Header() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('usuario');
  const [position, setPosition] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/', {
          headers: {
            Authorization: 'Bearer seu_token_aqui', // Substitua pelo seu token
          },
        });
        setUserName(response.data.name || 'usuario');
        setPosition(response.data.POSICAO || '');
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title} onPress={() => navigation.navigate('Home' as never)}>Central da Resenha</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={styles.profileNameContainer}>
          <Text style={styles.profileName}>{userName}</Text>
          {position ? <Text style={styles.profileRole}>{position}</Text> : <Text style={styles.profileRole}>N/A</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)}>
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
    //position: 'absolute',
    top: 0,
    zIndex: 1,
    marginTop: 20,
    padding: 90
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
    flexDirection: 'row', // Muda para linha para alinhar o nome e o ícone horizontalmente
    alignItems: 'center',
    justifyContent: 'flex-end', // Alinha o conteúdo à direita
  },
  profileNameContainer: {
    flexDirection: 'column', // Muda para coluna para alinhar o nome e a posição verticalmente
    alignItems: 'flex-start', // Alinha o texto à esquerda
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
    marginLeft: 8, // Adiciona espaço entre o nome e o ícone
  },
});