import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Component() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState(''); // Novo estado para nickname
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNasc, setDataNasc] = useState(''); // Novo estado para data de nascimento
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('As senhas não coincidem!');
      return;
    }

    const userData = {
      email: email, // Certifique-se de que o email está correto
      password: password, // A senha deve ser a que o usuário digitou
      nivelUsuario: 1, // Padrão
      nickname: nickname, // O nickname que o usuário digitou
      nomeReal: fullName, // O nome completo que o usuário digitou
      dataNasc: dataNasc, // A data de nascimento que o usuário digitou
    };

    try {
      const response = await fetch('http://192.168.2.12:3000/api/autenticacao/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Converte o objeto em JSON
      });

      const textResponse = await response.text(); // Captura a resposta como texto
      console.log('Resposta da API:', textResponse); // Log da resposta

      if (response.ok) {
        const responseData = JSON.parse(textResponse); // Supondo que a resposta seja um JSON
        const token = responseData.token; // Extraia o token da resposta

        // Armazene o token no AsyncStorage
        await AsyncStorage.setItem('userToken', token);

        // Navegue para a tela "Menu"
        navigation.navigate('Menu'); // Certifique-se de que "Menu" é o nome correto da sua tela
      } else {
        Alert.alert('Erro ao registrar usuário: ' + textResponse); // Mostra a resposta de erro
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Erro ao registrar usuário: ' + error.message);
    }
  };

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
        <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nickname"
          placeholderTextColor="#666"
          value={nickname} // Novo campo para nickname
          onChangeText={setNickname}
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

      <View style={styles.inputContainer}>
        <MaterialIcons name="calendar-today" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { paddingLeft: 16 }]}
          placeholder="Data de Nascimento (YYYY-MM-DD)"
          placeholderTextColor="#666"
          value={dataNasc} // Novo campo para data de nascimento
          onChangeText={setDataNasc}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
    fontWeight: '800', // Colocar extrabold 
  },
});
