import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireStore'; // ดึง auth จาก firebase config

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('สำเร็จ', 'ลงทะเบียนสำเร็จ');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('ข้อผิดพลาด', mapAuthError(error.code));
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'อีเมลนี้ถูกใช้งานแล้ว';
      case 'auth/invalid-email':
        return 'อีเมลไม่ถูกต้อง';
      case 'auth/weak-password':
        return 'รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร';
      default:
        return 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ลงทะเบียน</Text>
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่าน"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>ลงทะเบียน</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>มีบัญชีแล้ว? ล็อกอินที่นี่</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#007BFF',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default RegisterScreen;
