import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState('usuario');
  const [position, setPosition] = useState('');
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Token não encontrado. Faça login novamente.');
          return;
        }

        const response = await axios.get('http://168.138.151.78:3000/api/accountmanagement/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClientId(response.data.idcliente);

        if (response.data.idcliente) {
          const profileResponse = await axios.get(`http://168.138.151.78:3000/api/accountmanagement/profile/${response.data.idcliente}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setPosition(profileResponse.data.profile.posicao || '');
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {route.name !== 'Menu' && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#4ecb71" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Menu' as never)} style={styles.titleContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/EMWvwxY.png' }}
              style={styles.logo}
            />
            <View>
              <Text style={styles.titleTop}>Central da</Text>
              <Text style={styles.titleBottom}>Resenha</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile' as never)} 
          style={styles.profileContainer}
          activeOpacity={0.7}
        >
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileRole}>{position || 'N/A'}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <FontAwesome6 name="user" size={18} color="#4ecb71" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  titleTop: {
    fontFamily: 'montserrat',
    fontWeight: '700',
    fontSize: 14,
    color: '#4ecb71',
    lineHeight: 16,
  },
  titleBottom: {
    fontFamily: 'montserrat',
    fontWeight: '700',
    fontSize: 14,
    color: '#4ecb71',
    lineHeight: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  profileName: {
    fontFamily: 'montserrat',
    fontWeight: '700',
    fontSize: 14,
    color: '#fff',
  },
  profileRole: {
    fontFamily: 'montserrat',
    fontSize: 12,
    color: '#4ecb71',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(78, 203, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});