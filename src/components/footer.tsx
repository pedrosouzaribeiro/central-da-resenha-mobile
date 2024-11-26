import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      <LinearGradient
        colors={['rgba(19, 19, 19, 0)', 'rgba(19, 19, 19, 0.8)', '#131313']}
        style={styles.gradient}
      >
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={() => navigation.navigate('Fields')}
          >
            <MaterialCommunityIcons name="soccer-field" size={28} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconContainer, styles.activeIcon]} 
            onPress={() => navigation.navigate('Teams')}
          >
            <Image source={{ uri: 'https://i.imgur.com/EMWvwxY.png' }} style={styles.centerImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={() => navigation.navigate('Agendamentos')}
          >
            <AntDesign name="calendar" size={26} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    paddingTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activeIcon: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 5,
    marginTop: -40,
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  centerImage: {
    width: 50,
    height: 50,
  },
});