import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';

const CodeScreen = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
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
            {index === 2 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
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
  separator: {
    width: 10,
  },
});

export default CodeScreen;
