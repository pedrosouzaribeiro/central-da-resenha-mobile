import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal,} from 'react-native';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];



const fields = [
  { id: '1', name: 'Campo 1', image: 'https://example.com/campo1.jpg', time: '19:00 - 20:00' },
  { id: '2', name: 'Campo 2', image: 'https://example.com/campo2.jpg', time: '20:00 - 21:00' },
  { id: '3', name: 'Campo 1', image: 'https://example.com/campo3.jpg', time: '21:00 - 22:00' },
];

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BookingModal({ isVisible, onClose }: BookingModalProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [bookingName, setBookingName] = useState('');
  const [peopleCount, setPeopleCount] = useState('');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Horários</Text>
          <Text style={styles.fieldName}>Resenha da Bola</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekDaysContainer}>
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fieldsContainer}>
            {fields.map((field) => (
              <View key={field.id} style={styles.fieldItem}>
                <Image source={{ uri: field.image }} style={styles.fieldImage} />
                <Text style={styles.fieldItemName}>{field.name}</Text>
                <Text style={styles.fieldItemTime}>{field.time}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.scheduleButton}>
                  <Text style={styles.scheduleButtonText}>R$ 130/h</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Nome do agendamento"
            placeholderTextColor="#999"
            value={bookingName}
            onChangeText={setBookingName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade de pessoas"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={peopleCount}
            onChangeText={setPeopleCount}
          />
          <TextInput
            style={styles.input}
            placeholder="R$ 0,00/pessoa"
            placeholderTextColor="#4F4F4F"
            keyboardType="numeric"
            value={peopleCount}
            onChangeText={setPeopleCount}
          />

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
          </TouchableOpacity>
          
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
});