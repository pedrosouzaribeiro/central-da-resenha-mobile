import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shirt } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const positions = [
  { id: 'gk', label: 'GK', x: '50%', y: '85%' },
  { id: 'zg1', label: 'ZG', x: '30%', y: '65%' },
  { id: 'zg2', label: 'ZG', x: '70%', y: '65%' },
  { id: 'ala1', label: 'ALA', x: '15%', y: '40%' },
  { id: 'ala2', label: 'ALA', x: '85%', y: '40%' },
  { id: 'pvo', label: 'PVO', x: '50%', y: '40%' },
  { id: 'fxo', label: 'FXO', x: '50%', y: '15%' },
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
          <TextInput
            style={styles.teamName}
            value={homeTeam}
            onChangeText={setHomeTeam}
          />
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>0</Text>
            <Text style={styles.timer}>{timer}</Text>
            <Text style={styles.score}>0</Text>
          </View>
          <TextInput
            style={styles.teamName}
            value={awayTeam}
            onChangeText={setAwayTeam}
          />
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
              <Shirt size={40} color="#4CAF50" />
              <TouchableOpacity onPress={() => setEditingPlayer(position.id)}>
                <Text style={styles.playerName}>
                  {editingPlayer === position.id ? (
                    <TextInput
                      style={styles.nameInput}
                      value={players[position.id] || ''}
                      onChangeText={(text) => handlePlayerNameChange(position.id, text)}
                      onBlur={() => setEditingPlayer(null)}
                      autoFocus
                    />
                  ) : (
                    players[position.id] || 'Jogador'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Adicionar jogador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Começar jogo</Text>
          </TouchableOpacity>
        </View>
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
  },
  teamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  timer: {
    color: '#4CAF50',
    fontSize: 18,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});