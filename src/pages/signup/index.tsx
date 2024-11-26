import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const formatDate = (text: string) => {
  const numbers = text.replace(/[^\d]/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const validateDate = (date: string) => {
  const [day, month, year] = date.split('/').map(num => parseInt(num));
  const currentYear = new Date().getFullYear();
  
  if (!day || !month || !year) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > currentYear) return false;
  
  return true;
};

const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType = 'default' }) => (
  <Animatable.View animation="fadeInUp" duration={1000} style={styles.inputContainer}>
    <MaterialIcons name={icon} size={24} color="#4ECB71" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </Animatable.View>
);

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (!validateDate(dataNasc)) {
      Alert.alert('Erro', 'Data de nascimento inválida!');
      return;
    }

    const [day, month, year] = dataNasc.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    const userData = {
      email,
      password,
      nivelUsuario: 1,
      nickname,
      nomeReal: fullName,
      dataNasc: formattedDate,
    };

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const textResponse = await response.text();

      if (response.ok) {
        const responseData = JSON.parse(textResponse);
        const token = responseData.token;
        await AsyncStorage.setItem('userToken', token);
        navigation.navigate('Menu');
      } else {
        Alert.alert('Erro', 'Falha ao registrar usuário: ' + textResponse);
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro', 'Falha ao registrar usuário: ' + error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#000', '#111']}
          style={styles.gradient}
        >
          <Animatable.Image
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            source={require('../../assets/BALL.png')}
            style={styles.logo}
          />
          <Animatable.Text animation="fadeInDown" style={styles.title}>Crie sua conta</Animatable.Text>
          
          <InputField
            icon="person"
            placeholder="Nome Completo"
            value={fullName}
            onChangeText={setFullName}
          />
          <InputField
            icon="person-outline"
            placeholder="Nickname"
            value={nickname}
            onChangeText={setNickname}
          />
          <InputField
            icon="email"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputField
            icon="lock"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <InputField
            icon="lock-outline"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          <InputField
            icon="calendar-today"
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            value={dataNasc}
            onChangeText={(text) => setDataNasc(formatDate(text))}
            keyboardType="numeric"
          />
          
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#4ECB71" />
            <Text style={styles.showPasswordText}>{showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <LinearGradient
              colors={['#4ECB71', '#3BA55D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Registrar</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECB71',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    color: '#fff',
    padding: 15,
    fontSize: 16,
    flex: 1,
  },
  showPasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  showPasswordText: {
    color: '#4ECB71',
    marginLeft: 10,
  },
  button: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#4ECB71',
    fontSize: 16,
  },
});