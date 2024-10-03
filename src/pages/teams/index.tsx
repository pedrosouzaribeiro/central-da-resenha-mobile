import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const positions = [
  { id: 'gk', label: 'GL', x: '50%', y: '85%' },
  { id: 'zg1', label: 'ZG', x: '30%', y: '65%' },
  { id: 'zg2', label: 'ZG', x: '70%', y: '65%' },
  { id: 'ala1', label: 'ALA', x: '15%', y: '40%' },
  { id: 'ala2', label: 'ALA', x: '85%', y: '40%' },
  { id: 'pvo', label: 'PIVO', x: '50%', y: '40%' },
  { id: 'fxo', label: 'FIXO', x: '50%', y: '15%' },
];

export default function LineupScreen() {
  const [homeTeam, setHomeTeam] = useState('ARC');
  const [awayTeam, setAwayTeam] = useState('CTL');
  const [timer, setTimer] = useState('00:00');
  const [players, setPlayers] = useState({});
  const [editingPlayer, setEditingPlayer] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, []);

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

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/c04prFF.png' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Central da Resenha</Text>
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
            <Text style={styles.score}>0</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{timer}</Text>
          </View>
          <View style={styles.teamContainer}>
            <Text style={styles.score}>0</Text>
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
              <Pressable onPress={() => setEditingPlayer(position.id)}>
                {editingPlayer === position.id ? (
                  <TextInput
                    style={styles.nameInput}
                    value={players[position.id] || ''}
                    onChangeText={(text) => handlePlayerNameChange(position.id, text)}
                    onBlur={() => setEditingPlayer(null)}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.playerName}>
                    {players[position.id] || 'Jogador'}
                  </Text>
                )}
              </Pressable>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Começar jogo</Text>
        </TouchableOpacity>
      </View>
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
  nameInput: {
    color: '#fff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
    padding: 0,
    minWidth: 80,
    textAlign: 'center',
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
});