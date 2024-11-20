import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native'
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { AlignJustify } from 'lucide-react-native'

const { width } = Dimensions.get('window')

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [userData, setUserData] = useState({
    name: '-',
    position: '-',
    number: '-',
    points: '-',
    victories: '-',
    games: '-',
    reflexes: '-',
    defense: '-',
    kickingPower: '-',
    physical: '-',
    playingStyle: '-',
    styleRating: 0,
    location: '-',
    subLocation: '-'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const userResponse = await axios.get('http://168.138.151.78:3000/api/accountmanagement/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const profileResponse = await axios.get(`http://168.138.151.78:3000/api/accountmanagement/profile/${userResponse.data.idcliente}`)
      
      const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-'
      const capitalizeName = (str) => str ? str.split(' ').map(word => capitalize(word)).join(' ') : '-'
      
      setUserData({
        name: capitalizeName(profileResponse.data.profile.nomereal),
        position: capitalize(profileResponse.data.profile.posicao),
        number: profileResponse.data.profile.numeropreferido?.toString() || '-',
        points: profileResponse.data.profile.pontos?.toString() || '-',
        victories: profileResponse.data.profile.vitorias?.toString() || '-',
        games: profileResponse.data.profile.jogos?.toString() || '-',
        reflexes: profileResponse.data.profile.reflexos?.toString() || '-',
        defense: profileResponse.data.profile.defesa?.toString() || '-',
        kickingPower: profileResponse.data.profile.forca?.toString() || '-',
        physical: profileResponse.data.profile.fisico?.toString() || '-',
        playingStyle: capitalize(profileResponse.data.profile.estilo),
        styleRating: profileResponse.data.profile.estrelas || 0,
        location: capitalize(profileResponse.data.profile.cidadeestado),
        subLocation: capitalize(profileResponse.data.profile.bairro)
      })
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={20}
        color="#FFD700"
      />
    ))
  }

  const getColorForStat = (value) => {
    const numValue = Number(value)
    return numValue > 90 ? '#FFD700' : '#FFFFFF'
  }

  const StatItem = ({ label, value, icon }) => (
    <View style={styles.statItem}>
      {icon}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: getColorForStat(value) }]}>{value}</Text>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECB71" />
        </View>
        <Footer />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://avatars.githubusercontent.com/u/131497909?v=4' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.position}>{userData.position}</Text>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{userData.number}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsOverview}>
          <StatItem 
            label="Pontos" 
            value={userData.points} 
            icon={<MaterialIcons name="emoji-events" size={24} color="#4ECB71" />}
          />
          <StatItem 
            label="Vitórias" 
            value={userData.victories} 
            icon={<MaterialIcons name="military-tech" size={24} color="#4ECB71" />}
          />
          <StatItem 
            label="Jogos" 
            value={userData.games} 
            icon={<Ionicons name="football" size={24} color="#4ECB71" />}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsColumn}>
            <Text style={styles.statsTitle}>Estatísticas</Text>
            <StatItem label="Reflexos" value={userData.reflexes} icon={<MaterialIcons name="flash-on" size={20} color="#4ECB71" />} />
            <StatItem label="Defesa" value={userData.defense} icon={<MaterialIcons name="security" size={20} color="#4ECB71" />} />
            <StatItem label="Força do chute" value={userData.kickingPower} icon={<MaterialIcons name="fitness-center" size={20} color="#4ECB71" />} />
            <StatItem label="Físico" value={userData.physical} icon={<MaterialIcons name="directions-run" size={20} color="#4ECB71" />} />
          </View>
          
          <View style={styles.statsColumn}>
            <Text style={styles.statsTitle}>Estilo de jogo</Text>
            <Text style={styles.playingStyle}>{userData.playingStyle}</Text>
            <View style={styles.starsContainer}>
              {renderStars(userData.styleRating)}
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={20} color="#4ECB71" />
              <View>
                <Text style={styles.location}>{userData.location}</Text>
                <Text style={styles.subLocation}>{userData.subLocation}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('ProfileEditor')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4ECB71',
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    width: 290
  },
  position: {
    fontSize: 18,
    color: '#4ECB71',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  statsColumn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
    flex: 1,
    marginLeft: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playingStyle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  subLocation: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#4ECB71',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  editButtonText: {
    color: '#1D4A2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
})