import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => navigation.navigate('AddItem')}
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => navigation.navigate('Fields')}
      >
        <MaterialCommunityIcons name="soccer-field" size={33} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.iconContainer, styles.activeIcon, styles.bola]} 
        onPress={() => navigation.navigate('Teams')}
      >
        <Image source={{ uri: 'https://i.imgur.com/EMWvwxY.png' }} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => navigation.navigate('Shopping')}
      >
        <AntDesign name="shoppingcart" size={31} color="gray" style={{ marginBottom: 5 }} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => navigation.navigate('Notifications')}
      >
        <Octicons name="bell" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#131313',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  activeIcon: {
    backgroundColor: '#000',
    borderRadius: 20,
  },
  bola: {
    marginTop: -50,
  }
});