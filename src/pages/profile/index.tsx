import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign'; //Icones em chines? Trocar icons depois
import axios from 'axios';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
    name: '-',
    position: '-',
    number: '-',
    points: '-',
    victories: '-',
    games: '-',
    reflexes: '91',
    defense: '-',
    kickingPower: '-',
    physical: '-',
    playingStyle: '-',
    styleRating: 0,
    location: '-',
    subLocation: '-'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Buscar token do AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        
        // Primeira requisição para obter dados básicos do usuário
        const userResponse = await axios.get('http://168.138.151.78:3000/api/accountmanagement/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Buscar dados detalhados do perfil usando o idcliente
        const profileResponse = await axios.get(`http://168.138.151.78:3000/api/accountmanagement/profile/${userResponse.data.idcliente}`);
        
        // Função para capitalizar a primeira letra
        const capitalize = (str) => {
          if (!str) return '-';
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };
        
        // Função específica para capitalizar nomes próprios
        const capitalizeName = (str) => {
          if (!str) return '-';
          return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };
        
        // Atualizar o estado com os dados do perfil
        setUserData(prevState => ({
          ...prevState,
          name: capitalizeName(profileResponse.data.profile.nomereal) || '-',
          position: capitalize(profileResponse.data.profile.posicao) || '-',
          number: profileResponse.data.profile.numeropreferido?.toString() || '-',
          points: profileResponse.data.profile.pontos?.toString() || '-',
          victories: profileResponse.data.profile.vitorias?.toString() || '-',
          games: profileResponse.data.profile.jogos?.toString() || '-',
          reflexes: profileResponse.data.profile.reflexos?.toString() || '-',
          defense: profileResponse.data.profile.defesa?.toString() || '-',
          kickingPower: profileResponse.data.profile.forca?.toString() || '-',
          physical: profileResponse.data.profile.fisico?.toString() || '-',
          playingStyle: capitalize(profileResponse.data.profile.estilo) || '-',
          styleRating: profileResponse.data.profile.estrelas || 0,
          location: capitalize(profileResponse.data.profile.cidadeestado) || '-',
          subLocation: capitalize(profileResponse.data.profile.bairro) || '-'
        }));

      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={20}
        color="#FFD700"
      />
    ));
  };

  const getColorForStat = (value) => {
    const numValue = Number(value);
    return numValue > 90 ? '#FFD700' : '#FFFFFF';
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEditor');
  };

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 0, marginHorizontal: -20}}><Header /></View>
      <Text style={styles.title}>Seu perfil</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <TouchableOpacity>
            <MaterialIcons name="share" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{userData.number}</Text>
          </View>
        </View>
        
        <Image
          source={{ uri: 'https://avatars.githubusercontent.com/u/131497909?v=4' }}
          style={styles.profileImage}
        />
        
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.position}>{userData.position}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.points}</Text>
            <Text style={styles.statLabel}>pontos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.victories}</Text>
            <Text style={styles.statLabel}>vitórias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.games}</Text>
            <Text style={styles.statLabel}>jogos</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statsColumn}>
          <Text style={styles.statsTitle}>Estatísticas</Text>
          <View style={styles.statRow}>
            <Text style={styles.statName}>Reflexos</Text>
            <Text style={[styles.statValue, { color: getColorForStat(userData.reflexes) }]}>{userData.reflexes}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statName}>Defesa</Text>
            <Text style={[styles.statValue, { color: getColorForStat(userData.defense) }]}>{userData.defense}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statName}>Força do chute</Text>
            <Text style={[styles.statValue, { color: getColorForStat(userData.kickingPower) }]}>{userData.kickingPower}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statName}>Físico</Text>
            <Text style={[styles.statValue, { color: getColorForStat(userData.physical) }]}>{userData.physical}</Text>
          </View>
        </View>
        
        <View style={styles.statsColumn}>
          <Text style={styles.statsTitle}>Estilo de jogo</Text>
          <Text style={styles.playingStyle}>{userData.playingStyle}</Text>
          <View style={styles.starsContainer}>
            {renderStars(userData.styleRating)}
          </View>
          <Text style={styles.location}>{userData.location}</Text>
          <Text style={styles.subLocation}>{userData.subLocation}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 17,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  profileCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    marginLeft: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statsColumn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statName: {
    fontSize: 14,
    color: '#888888',
  },
  playingStyle: {
    fontSize: 20,
    fontWeight: 'thin',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  location: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subLocation: {
    fontSize: 16,
    color: '#888888',
  },
  editButton: {
    backgroundColor: '#4ECB71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D4A2A',
  },
  star: {
    fontSize: 20,
  },
});
