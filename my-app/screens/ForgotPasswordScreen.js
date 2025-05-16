import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../FireStore'; // import auth จาก firebase config

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('สำเร็จ', `ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปที่ ${email}`);
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('ข้อผิดพลาด', mapAuthError(error.code));
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'ไม่พบผู้ใช้งานนี้';
      case 'auth/invalid-email':
        return 'อีเมลไม่ถูกต้อง';
      default:
        return 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ลืมรหัสผ่าน</Text>
      <TextInput
        style={styles.input}
        placeholder="กรอกอีเมลของคุณ"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>ส่งลิงก์การรีเซ็ตรหัสผ่าน</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>กลับไปที่หน้าล็อกอิน</Text>
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
    backgroundColor: '#007BFF',
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

export default ForgotPasswordScreen;
