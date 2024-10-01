import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {MaterialIcons, Octicons} from '@expo/vector-icons';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <View style={styles.iconPlaceholder}>
        <ImageBackground
          source={require('../../assets/BALL.png')}
          style={{
            width: '100%',
            height: '100%',
            marginTop: -50
          }}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="key" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity  onPress={() => navigation.navigate('Code' as never)} >
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Code' as never)} style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
        <Text style={styles.createAccount}>Criar uma conta</Text>
      </TouchableOpacity>

  
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconPlaceholder: {
    width: 100,
    height: 100
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 5,
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    color: '#fff',
    padding: 15,
    fontSize: 16,
    flex: 1,
  },
  eyeIcon: {
    marginRight: 10,
  },
  eyeIconText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  forgotPassword: {
    color: '#f5f5f5',
    marginTop: -8,
    marginBottom: 20,
    fontWeight: '100',
    marginRight: 210,
    fontFamily: 'montserrat'
  },
  button: {
    backgroundColor: '#4ECB71',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#1D4A2A',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 115
  },
  createAccount: {
    color: '#FFFFFF',
    fontWeight: '100',
    fontFamily: 'montserrat'
  },
});