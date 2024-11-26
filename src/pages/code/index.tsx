import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

const CodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputs.current[index + 1]?.focus();
    } else if (text.length === 0 && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      Keyboard.dismiss();
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    const verificationCode = parseInt(code.join(''), 10);
    const dataToSend = {
      email: userData.email,
      password: userData.password,
      codigoVerificacao: verificationCode,
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
        await AsyncStorage.setItem('userToken', responseData.token);
        navigation.navigate('Menu', { token: responseData.token });
      } else {
        Alert.alert('Erro', 'Código de verificação inválido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      Alert.alert('Erro', 'Falha ao verificar o código. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#000', '#111']}
        style={styles.gradient}
      >
        <Animatable.View 
          animation="bounceIn"
          duration={1500}
          style={styles.iconContainer}
        >
          <MaterialIcons name="verified-user" size={80} color="#4ECB71" />
        </Animatable.View>

        <Animatable.Text 
          animation="fadeInUp"
          delay={500}
          style={styles.title}
        >
          Verificação
        </Animatable.Text>

        <Animatable.Text 
          animation="fadeInUp"
          delay={600}
          style={styles.text}
        >
          Digite o código enviado para o seu e-mail
        </Animatable.Text>

        <Animatable.View 
          animation="fadeInUp"
          delay={700}
          style={styles.codeContainer}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChangeText(text, index)}
              value={digit}
              ref={el => inputs.current[index] = el}
            />
          ))}
        </Animatable.View>

        <Animatable.View 
          animation="fadeInUp"
          delay={800}
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={handleVerifyCode} disabled={loading}>
            <LinearGradient
              colors={['#4ECB71', '#3BA55D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>Verificar Código</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECB71',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 300,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    width: 45,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ECB71',
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendText: {
    color: '#fff',
    marginTop: 20,
  },
  resendLink: {
    color: '#4ECB71',
    fontWeight: 'bold',
  },
});

export default CodeScreen;