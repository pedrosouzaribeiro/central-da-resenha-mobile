import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, X, Calendar, Users, Clock, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const weekDays = [
  { display: 'Seg', value: 'segunda' },
  { display: 'Ter', value: 'terca' },
  { display: 'Qua', value: 'quarta' },
  { display: 'Qui', value: 'quinta' },
  { display: 'Sex', value: 'sexta' },
  { display: 'Sáb', value: 'sabado' },
  { display: 'Dom', value: 'domingo' },
];

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  fieldData: any[];
}

export default function BookingModal({ isVisible, onClose, fieldData }: BookingModalProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0].value);
  const [peopleCount, setPeopleCount] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([]);
  const [animation] = useState(new Animated.Value(0));
  const [pricePerPerson, setPricePerPerson] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
      // Reset the state when reopening the modal
      setSelectedField(null);
      setSelectedDay(weekDays[0].value);
      setPeopleCount('');
      setSelectedHorarios([]);
      setPricePerPerson('0');
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease
      }).start();
    }
  }, [isVisible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0]
  });

  const handleFieldSelect = (field) => {
    setIsLoading(true);
    setSelectedField(field);
    setSelectedHorarios([]);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setSelectedField(null);
    setSelectedHorarios([]);
  };

  const toggleHorarioSelection = (time: string) => {
    setSelectedHorarios(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const getCurrentWeek = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedField || selectedHorarios.length === 0 || !peopleCount) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos necessários');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      const bookingData = {
        idCampo: selectedField.id,
        idEmpresa: selectedField.idEmpresa || 1,
        horario: { [selectedDay]: selectedHorarios },
        quantidadePessoas: parseInt(peopleCount),
        semana: getCurrentWeek()
      };

      const response = await fetch('http://168.138.151.78:3000/api/schedule/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer agendamento');
      }

      onClose();
      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível realizar o agendamento');
    }
  };

  const calculatePricePerPerson = (count: string) => {
    if (selectedField && count) {
      const totalPrice = selectedField.preco || 0;
      const people = parseInt(count);
      if (people > 0) {
        setPricePerPerson((totalPrice / people).toFixed(2));
      } else {
        setPricePerPerson('0');
      }
    } else {
      setPricePerPerson('0');
    }
  };

  const handlePeopleCountChange = (count: string) => {
    setPeopleCount(count);
    calculatePricePerPerson(count);
  };

  const renderHorarios = () => {
    if (!selectedField?.horarios?.[selectedDay]) return null;

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
    );
  };

  const renderFieldsList = () => (
    <ScrollView 
      style={styles.fieldsListContainer}
      contentContainerStyle={styles.fieldsListContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {fieldData?.map((field) => (
        <TouchableOpacity
          key={field.id}
          style={styles.fieldCard}
          onPress={() => handleFieldSelect(field)}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.6 }}
            style={styles.fieldCardGradient}
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
              <Text style={styles.fieldCardPrice}>R$ {field.preco?.toFixed(2)}/hora</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderBookingForm = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.bookingFormContainer}
      contentContainerStyle={styles.bookingFormContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECB71" />
        </View>
      ) : (
        <View style={styles.bookingFormContent}>
          <View style={styles.fieldHeader}>
            {selectedField?.bannercampo && typeof selectedField.bannercampo === 'string' && selectedField.bannercampo.startsWith('http') && (
              <Image 
                source={{ uri: selectedField.bannercampo }} 
                style={styles.fieldImage}
                accessibilityLabel="Imagem do campo"
              />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.fieldImageOverlay}
            >
              <Text style={styles.fieldName}>{selectedField?.nomecampo || ''}</Text>
              <Text style={styles.fieldPrice}>R$ {selectedField?.preco?.toFixed(2)}/hora</Text>
            </LinearGradient>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Calendar color="#4ECB71" size={20} />
              <Text style={styles.sectionTitle}>Selecione o dia:</Text>
            </View>
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
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Clock color="#4ECB71" size={20} />
              <Text style={styles.sectionTitle}>Horários disponíveis:</Text>
            </View>
            <View style={styles.horariosContainer}>
              {renderHorarios()}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Users color="#4ECB71" size={20} />
              <Text style={styles.sectionTitle}>Quantidade de pessoas:</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.peopleCountInput]}
                placeholder="Número de pessoas"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={peopleCount}
                onChangeText={handlePeopleCountChange}
              />
              <View style={styles.pricePerPersonContainer}>
                <Text style={styles.pricePerPersonValue}>R$ {pricePerPerson}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: translateY }]
            }
          ]}
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.6, 
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    marginRight: 15,
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
    flex: 1,
  },
  fieldsListContentContainer: {
    padding: 20,
  },
  fieldCard: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    height: 180,
  },
  fieldCardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fieldCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
  },
  fieldCardInfo: {
    padding: 15,
  },
  fieldCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  fieldCardPrice: {
    fontSize: 16,
    color: '#4ECB71',
    fontWeight: 'bold',
  },
  bookingFormContainer: {
    flex: 1,
  },
  bookingFormContentContainer: {
    paddingBottom: 40,
  },
  bookingFormContent: {
    padding: 20,
  },
  fieldHeader: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  fieldImage: {
    width: '100%',
    height: '100%',
  },
  fieldImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  fieldName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  fieldPrice: {
    fontSize: 18,
    color: '#4ECB71',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  weekDaysContainer: {
    flexDirection: 'row',
  },
  dayButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
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
    marginBottom: 10,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horarioButton: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  peopleCountInput: {
    flex: 1,
    marginRight: 10,
  },
  pricePerPersonContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    minWidth: 80, 
    alignItems: 'center', 
  },
  pricePerPersonValue: {
    color: '#4ECB71',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});