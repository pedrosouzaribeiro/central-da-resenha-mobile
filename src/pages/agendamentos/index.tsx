import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons } from '@expo/vector-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'

const API_URL = 'http://168.138.151.78:3000/api/accountmanagement/agendamentos'

interface Horario {
  [key: string]: string[]
}

interface Agendamento {
  id: number
  nomecampo: string
  preco: number
  nomeempresa: string
  semana: string
  horario: Horario
  pago: boolean
}

export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgendamentos()
  }, [])

  const fetchAgendamentos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setAgendamentos(data.agendamentos)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching agendamentos:', error)
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos. Tente novamente.')
      setLoading(false)
    }
  }

  const formatHorario = (horario: Horario) => {
    const dia = Object.keys(horario)[0]
    const horas = horario[dia].join(', ')
    return {
      dia: dia.charAt(0).toUpperCase() + dia.slice(1),
      horas: horas
    }
  }

  const renderAgendamentoItem = ({ item }: { item: Agendamento }) => {
    const { dia, horas } = formatHorario(item.horario)
    const formattedDate = new Date(item.semana).toLocaleDateString('pt-BR')

    return (
      <View style={styles.agendamentoCard}>
        <Text style={styles.nomeEmpresa}>{item.nomeempresa}</Text>
        <Text style={styles.nomeCampo}>{item.nomecampo}</Text>
        <View style={styles.horarioContainer}>
          <Text style={styles.dia}>{dia}</Text>
          <Text style={styles.horas}>{horas}</Text>
        </View>
        <Text style={styles.data}>{formattedDate}</Text>
        <View style={styles.footerContainer}>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
          <View style={[
            styles.statusContainer, 
            !item.pago && styles.statusContainerPendente
          ]}>
            <MaterialIcons 
              name={item.pago ? "payment" : "pending"} 
              size={18} 
              color={item.pago ? "#4ECB71" : "#FFA500"} 
            />
            <Text style={[
              styles.statusText,
              !item.pago && styles.statusTextPendente
            ]}>
              {item.pago ? "Pago" : "Pendente"}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECB71" />
        </View>
        <Footer />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Meus Agendamentos</Text>
      <FlatList
        data={agendamentos}
        renderItem={renderAgendamentoItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
        }
      />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  agendamentoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  nomeEmpresa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  nomeCampo: {
    fontSize: 16,
    color: '#B8B8B8',
    marginBottom: 10,
  },
  horarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 10,
  },
  dia: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECB71',
  },
  horas: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  data: {
    fontSize: 14,
    color: '#B8B8B8',
    marginBottom: 10,
    marginTop: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECB71',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusContainerPendente: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
  },
  statusText: {
    fontSize: 14,
    color: '#4ECB71',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  statusTextPendente: {
    color: '#FFA500',
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
})