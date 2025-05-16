import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireStore'; // ดึง auth ที่ export ไว้จาก FireStore.js

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('สำเร็จ', 'ล็อกอินสำเร็จ');
      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      Alert.alert('ข้อผิดพลาด', mapAuthError(error.code));
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'ไม่พบผู้ใช้งานนี้';
      case 'auth/wrong-password':
        return 'รหัสผ่านไม่ถูกต้อง';
      case 'auth/invalid-email':
        return 'อีเมลไม่ถูกต้อง';
      default:
        return 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>เข้าสู่ระบบ</Text>
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>ลืมรหัสผ่าน?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});

export default LoginScreen;
