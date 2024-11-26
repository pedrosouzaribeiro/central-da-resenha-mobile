import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Modal, 
  Alert,
  Dimensions,
  Animated
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChevronLeft, X } from 'lucide-react-native'

const { height } = Dimensions.get('window')
const weekDays = [
  { display: 'Segunda', value: 'segunda' },
  { display: 'Terça', value: 'terca' },
  { display: 'Quarta', value: 'quarta' },
  { display: 'Quinta', value: 'quinta' },
  { display: 'Sexta', value: 'sexta' }
];

interface BookingModalProps {
  isVisible: boolean
  onClose: () => void
  fieldData: any[]
}

export default function BookingModal({ isVisible, onClose, fieldData }: BookingModalProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0].value)
  const [peopleCount, setPeopleCount] = useState('')
  const [selectedField, setSelectedField] = useState(null)
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([])
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    }
  }, [isVisible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0]
  });

  const handleFieldSelect = (field) => {
    setSelectedField(field)
    setSelectedHorarios([])
  }

  const handleBack = () => {
    setSelectedField(null)
    setSelectedHorarios([])
  }

  const toggleHorarioSelection = (time: string) => {
    setSelectedHorarios(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    )
  }

  const getCurrentWeek = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const handleConfirmBooking = async () => {
    try {
      if (!selectedField || selectedHorarios.length === 0 || !peopleCount) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos necessários')
        return
      }

      const token = await AsyncStorage.getItem('userToken')
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.')
        return
      }

      const bookingData = {
        idCampo: selectedField.id,
        idEmpresa: selectedField.idEmpresa || 1,
        horario: { [selectedDay]: selectedHorarios },
        quantidadePessoas: parseInt(peopleCount),
        semana: getCurrentWeek()
      }

      const response = await fetch('http://168.138.151.78:3000/api/schedule/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer agendamento')
      }

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao agendar:', error)
      Alert.alert('Erro', error.message || 'Não foi possível realizar o agendamento')
    }
  }

  const renderHorarios = () => {
    if (!selectedField?.horarios?.[selectedDay]) return null

    return (
      <View style={styles.horariosGrid}>
        {selectedField.horarios[selectedDay].map((time: string, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.horarioButton, selectedHorarios.includes(time) && styles.selectedHorarioButton]}
            onPress={() => toggleHorarioSelection(time)}
          >
            <Text style={[styles.horarioText, selectedHorarios.includes(time) && styles.selectedHorarioText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const renderFieldsList = () => (
    <ScrollView style={styles.fieldsListContainer}>
      {fieldData?.map((field) => (
        <TouchableOpacity
          key={field.id}
          style={styles.fieldCard}
          onPress={() => handleFieldSelect(field)}
        >
          {field.bannercampo && typeof field.bannercampo === 'string' && field.bannercampo.startsWith('http') ? (
            <Image 
              source={{ uri: field.bannercampo }} 
              style={styles.fieldCardImage}
              accessibilityLabel="Imagem do campo"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
          <View style={styles.fieldCardInfo}>
            <Text style={styles.fieldCardName}>{field.nomecampo}</Text>
            <Text style={styles.fieldCardPrice}>R$ {field.preco?.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderBookingForm = () => (
    <ScrollView style={styles.bookingFormContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.bookingFormContent}>
        <View style={styles.fieldHeader}>
          {selectedField?.bannercampo && typeof selectedField.bannercampo === 'string' && selectedField.bannercampo.startsWith('http') && (
            <Image 
              source={{ uri: selectedField.bannercampo }} 
              style={styles.fieldImage}
              accessibilityLabel="Imagem do campo"
            />
          )}
          <Text style={styles.fieldName}>{selectedField?.nomecampo || ''}</Text>
        </View>

        <Text style={styles.sectionTitle}>Selecione o dia:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekDaysContainer}
        >
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[styles.dayButton, selectedDay === day.value && styles.selectedDayButton]}
              onPress={() => setSelectedDay(day.value)}
            >
              <Text style={[styles.dayButtonText, selectedDay === day.value && styles.selectedDayButtonText]}>
                {day.display}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Horários disponíveis:</Text>
        <View style={styles.horariosContainer}>
          {renderHorarios()}
        </View>

        <Text style={styles.sectionTitle}>Quantidade de pessoas:</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de pessoas"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={peopleCount}
          onChangeText={setPeopleCount}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
          <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }]
              }
            ]}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => e.stopPropagation()} 
              style={{ flex: 1 }}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={selectedField ? handleBack : onClose} style={styles.backButton}>
                  {selectedField ? <ChevronLeft color="#4ECB71" size={24} /> : <X color="#4ECB71" size={24} />}
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {selectedField ? 'Agendar Horário' : 'Escolha um Campo'}
                </Text>
              </View>
              
              <View style={styles.modalBody}>
                {selectedField ? renderBookingForm() : renderFieldsList()}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    height: height * 2/3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    flex: 1,
  },
  fieldsListContainer: {
    padding: 16,
  },
  fieldCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  fieldCardImage: {
    width: '100%',
    height: 150,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#333',
  },
  fieldCardInfo: {
    padding: 16,
  },
  fieldCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  fieldCardPrice: {
    fontSize: 16,
    color: '#4ECB71',
  },
  bookingFormContainer: {
    flex: 1,
  },
  bookingFormContent: {
    padding: 16,
    paddingBottom: 32, // Adiciona padding extra no final
  },
  fieldHeader: {
    marginBottom: 24,
  },
  fieldImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  fieldName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 24,
  },
  weekDaysContainer: {
    flexDirection: 'row',
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#1E1E1E',
  },
  selectedDayButton: {
    backgroundColor: '#4ECB71',
  },
  dayButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDayButtonText: {
    color: '#1D4A2A',
  },
  horariosContainer: {
    marginBottom: 16,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  horarioButton: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedHorarioButton: {
    backgroundColor: '#4ECB71',
  },
  horarioText: {
    color: '#FFFFFF',
  },
  selectedHorarioText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  confirmButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
    fontSize: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})