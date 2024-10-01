import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

export default function Component() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
      <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { paddingLeft:16 }]}
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
          style={[styles.input, { paddingLeft: 16 }]}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="key" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { paddingLeft: 16 }]}
          placeholder="Confirmar Senha"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      
      
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  codeInput: {
    backgroundColor: '#333',
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  separator: {
    width: 10,
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
    fontWeight: '800', //Colocar extrabold 
    paddingHorizontal: 115
  },
  createAccount: {
    color: '#FFFFFF',
    fontWeight: 'thin' 
  },
});