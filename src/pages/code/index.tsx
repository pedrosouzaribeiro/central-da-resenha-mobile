import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params; // Recebe os dados do usuário da tela de login
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };

  const handleVerifyCode = async () => {
    const verificationCode = parseInt(code.join(''), 10); // Junta os dígitos do código e converte para inteiro
    const dataToSend = {
      email: userData.email,
      password: userData.password,
      codigoVerificacao: verificationCode, // Envia o código de verificação como número
    };

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Aqui você pode armazenar o token ou redirecionar para a página Home
        Alert.alert('Código verificado com sucesso!');
        // Navega para a página Home e passa o token
        navigation.navigate('Menu', { token: responseData.token });
        await AsyncStorage.setItem('userToken', responseData.token);
      } else {
        Alert.alert('Erro ao verificar código: ' + responseData.message);
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      Alert.alert('Erro ao verificar código. Verifique sua conexão.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/BALL.png')} style={styles.image} />
      <Text style={styles.text}>Digite o código enviado no e-mail.</Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <React.Fragment key={index}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChangeText(text, index)}
              value={digit}
            />
          </React.Fragment>
        ))}
      </View>
      <TouchableOpacity onPress={handleVerifyCode} style={styles.button}>
        <Text style={styles.buttonText}>Verificar Código</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    color: '#4ECB71',
    fontSize: 18,
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4ECB71',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#1D4A2A',
    fontWeight: 'bold',
  },
});

export default CodeScreen;
