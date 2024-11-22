import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const positions = [
  { id: 'gk', label: 'GK', x: '45%', y: '75%' },
  { id: 'fxo', label: 'FIXO', x: '25%', y: '55%' },
  { id: 'fxo2', label: 'FIXO', x: '65%', y: '55%' },
  { id: 'ala1', label: 'ALA', x: '10%', y: '30%' },
  { id: 'ala2', label: 'ALA', x: '80%', y: '30%' },
  { id: 'mei', label: 'MEI', x: '45%', y: '30%' },
  { id: 'pvo', label: 'PIVO', x: '45%', y: '5%' },
];

export default function LineupScreen() {
  const navigation = useNavigation();
  const [homeTeam, setHomeTeam] = useState('ARC');
  const [awayTeam, setAwayTeam] = useState('CTL');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [players, setPlayers] = useState({});
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isGameStarted && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isGameStarted) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isPaused]);

  const loadPlayers = async () => {
    try {
      const savedPlayers = await AsyncStorage.getItem('players');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      }
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const savePlayers = async (newPlayers) => {
    try {
      await AsyncStorage.setItem('players', JSON.stringify(newPlayers));
    } catch (error) {
      console.error('Error saving players:', error);
    }
  };

  const handlePlayerNameChange = (id, name) => {
    const newPlayers = { ...players, [id]: name };
    setPlayers(newPlayers);
    savePlayers(newPlayers);
    setEditingPlayer(null);
  };

  const handlePlayerPress = (positionId) => {
    setSelectedPosition(positionId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPosition(null);
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsPaused(false);
  };

  const handlePauseGame = () => {
    setIsPaused(!isPaused);
  };

  const handleStopGame = () => {
    setIsGameStarted(false);
    setTimer(0);
  };

  const handleIncreaseHomeScore = () => {
    setHomeScore(homeScore + 1);
  };

  const handleIncreaseAwayScore = () => {
    setAwayScore(awayScore + 1);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/c04prFF.png' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.headerTitle}>Central da Resenha</Text>
          </TouchableOpacity>
          <MaterialCommunityIcons name="soccer" size={24} color="#4CAF50" />
          <View style={styles.profileIcon}>
            <MaterialCommunityIcons name="account" size={24} color="#fff" />
          </View>
        </View>
        <View style={styles.scoreBoard}>
          <View style={styles.teamContainer}>
            <View style={styles.teamNameContainer}>
              <TextInput
                style={styles.teamName}
                value={homeTeam}
                onChangeText={setHomeTeam}
              />
            </View>
            <Text style={styles.score}>{homeScore}</Text>
            <TouchableOpacity onPress={handleIncreaseHomeScore}>
              <Text style={styles.scoreButton}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</Text>
          </View>
          <View style={styles.teamContainer}>
            <TouchableOpacity onPress={handleIncreaseAwayScore}>
              <Text style={styles.scoreButton}>+</Text>
            </TouchableOpacity> 
            <Text style={styles.score}>{awayScore}</Text>
            <View style={styles.teamNameContainer}>
              <TextInput
                style={styles.teamName}
                value={awayTeam}
                onChangeText={setAwayTeam}
              />
            </View>
          </View>
        </View>
        <View style={styles.field}>
          {positions.map((position) => (
            <View
              key={position.id}
              style={[
                styles.playerPosition,
                { left: position.x, top: position.y },
              ]}
            >
              <Text style={styles.positionLabel}>{position.label}</Text>
              <View style={styles.playerIconBackground}>
                <MaterialCommunityIcons name="tshirt-crew" size={24} color="#4CAF50" />
              </View>
              <Pressable onPress={() => handlePlayerPress(position.id)}>
                <Text style={styles.playerName}>
                  {players[position.id] || 'Jogador'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
        {!isGameStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Começar jogo</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlButtonsContainer}>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={handleStopGame}>
                <Text style={styles.controlButtonText}>Parar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlButton, styles.pauseButton]} onPress={handlePauseGame}>
                <Text style={styles.controlButtonText}>{isPaused ? 'Retomar' : 'Pausar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleModalClose}
        onBackButtonPress={handleModalClose}
        style={styles.modal}
        avoidKeyboard={true}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.modalInput}
            value={selectedPosition ? players[selectedPosition] || '' : ''}
            onChangeText={(text) => handlePlayerNameChange(selectedPosition, text)}
            placeholder="Nome do jogador"
            placeholderTextColor="#666"
            autoFocus
          />
          <TouchableOpacity 
            style={styles.modalButton} 
            onPress={handleModalClose}
          >
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamNameContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  scoreButton: {
    color: '#4CAF50',
    fontSize: 24,
    marginRight: 10,
  },
  timerContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  timer: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  field: {
    flex: 1,
    position: 'relative',
  },
  playerPosition: {
    position: 'absolute',
    alignItems: 'center',
  },
  positionLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  playerIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlButtonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  controlButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#FF8C00',
  },
  stopButton: {
    backgroundColor: 'red',
  },
  pauseButton: {
    backgroundColor: 'yellow',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#4ECB71',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#1D4A2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});