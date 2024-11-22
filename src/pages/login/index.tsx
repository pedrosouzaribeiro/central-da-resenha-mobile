import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate('Menu');
      }
    };

    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);

    const userData = {
      email,
      password,
      // codigoVerificacao: null,
    };

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.ok) {
        await AsyncStorage.setItem('userToken', responseData.token);
        navigation.navigate('Code', { userData });
      } else {
        if (responseData.message.includes("Código de verificação incorreto")) {
          navigation.navigate('Code', { userData });
        } else {
          Alert.alert('Erro ao fazer login: ' + responseData.message);
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro ao fazer login. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
            returnKeyType="next"
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
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#1D4A2A" />
          ) : (
            <Text style={styles.buttonText}>Continuar</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
          <Text style={styles.createAccount}>Criar uma conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontWeight: 'bold',
  },
  createAccount: {
    color: '#FFFFFF',
    fontWeight: '100',
  },
});
