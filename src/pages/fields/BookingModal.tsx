import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  fieldData: any[];
}

export default function BookingModal({ isVisible, onClose, fieldData }: BookingModalProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  //const [bookingName, setBookingName] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([]);

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setSelectedHorarios([]); // Limpa horários selecionados ao trocar de campo
  };

  const handleBack = () => {
    setSelectedField(null);
    setSelectedHorarios([]);
  };

  const toggleHorarioSelection = (time: string) => {
    setSelectedHorarios(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  // Função para pegar a data da semana atual
  const getCurrentWeek = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedField || selectedHorarios.length === 0 || !peopleCount) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos necessários');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');

      // Verificando se o token foi recuperado corretamente
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      // Adicionando logs para depuração
      console.log('ID do Campo:', selectedField.id);
      console.log('ID da Empresa:', selectedField.idEmpresa || 1);
      console.log('Horários Selecionados:', selectedHorarios);
      console.log('Quantidade de Pessoas:', peopleCount);
      console.log('Data da Semana:', getCurrentWeek());

      const bookingData = {
        idCampo: selectedField.id,
        idEmpresa: selectedField.idEmpresa || 1,
        horario: {
          [selectedDay.toLowerCase()]: selectedHorarios
        },
        quantidadePessoas: parseInt(peopleCount),
        semana: getCurrentWeek()
      };

      console.log('Dados do Agendamento:', bookingData); // Log do objeto de agendamento

      const response = await fetch('http://192.168.2.16:3000/api/schedule/agendar', {
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

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível realizar o agendamento');
    }
  };

  // Função para renderizar os horários com seleção múltipla
  const renderHorarios = () => {
    if (!selectedField || !selectedField.horarios || !selectedField.horarios[selectedDay.toLowerCase()]) {
      return null;
    }

    return selectedField.horarios[selectedDay.toLowerCase()].map((time: string, index: number) => (
      <TouchableOpacity 
        key={index} 
        style={[
          styles.horarioButton,
          selectedHorarios.includes(time) && styles.selectedHorarioButton
        ]}
        onPress={() => toggleHorarioSelection(time)}
      >
        <Text style={[
          styles.fieldItemTime,
          selectedHorarios.includes(time) && styles.selectedHorarioText
        ]}>
          {time}
        </Text>
      </TouchableOpacity>
    ));
  };

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
          <Text style={styles.fieldCardName}>{field.nomecampo}</Text>
          <Text style={styles.fieldCardPrice}>R$ {field.preco?.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderBookingForm = () => (
    <View style={styles.bookingFormContainer}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.fieldHeader}>
        <Text style={styles.fieldName}>{selectedField?.nomecampo || ''}</Text>
        {selectedField?.bannercampo && typeof selectedField.bannercampo === 'string' && selectedField.bannercampo.startsWith('http') && (
          <Image 
            source={{ uri: selectedField.bannercampo }} 
            style={styles.fieldImage}
            accessibilityLabel="Imagem do campo"
          />
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.weekDaysContainer}
      >
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.horariosContainer}>
        {renderHorarios()}
      </ScrollView>

      <View style={styles.inputsContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder="Nome do agendamento"
          placeholderTextColor="#999"
          value={bookingName}
          onChangeText={setBookingName}
        /> */}
        
        <TextInput
          style={styles.input}
          placeholder="Quantidade de pessoas"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={peopleCount}
          onChangeText={setPeopleCount}
        />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
        <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {selectedField ? 'Agendar Horário' : 'Escolha um Campo'}
          </Text>
          
          {selectedField ? renderBookingForm() : renderFieldsList()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  fieldName: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#4ECB71',
    borderWidth: 1,
    
  },
  selectedDayButton: {
    backgroundColor: '#7acf92',
    
  },
  dayButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedDayButtonText: {
    color: '#1D4A2A',
  },
  fieldsContainer: {
    marginBottom: 20,
  },
  fieldItem: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: 100,
  },
  fieldItemName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 10,
  },
  fieldItemTime: {
    color: '#AAAAAA',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#4ECB71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scheduleButton: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  scheduleButtonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#4ECB71', //Testando caso olhar o field dnv pedro
    borderRadius: 10,
  },
  fieldHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  horariosContainer: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 15,
  },
  horarioButton: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  inputsContainer: {
    width: '100%',
    marginBottom: 15,
  },
  fieldsListContainer: {
    width: '100%',
    maxHeight: '80%',
  },
  fieldCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
  },
  fieldCardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 10,
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
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#4ECB71',
    fontSize: 16,
  },
  bookingFormContainer: {
    width: '100%',
  },
  selectedHorarioButton: {
    backgroundColor: '#4ECB71',
  },
  selectedHorarioText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
  },
});
