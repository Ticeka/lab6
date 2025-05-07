import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');

  // ลองดึงข้อมูลผู้ใช้จาก AsyncStorage (หรือที่เก็บข้อมูลอื่นๆ)
  const loadUserProfile = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      } else {
        setUserEmail('ไม่มีข้อมูล');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      Alert.alert('สำเร็จ', 'คุณได้ออกจากระบบแล้ว');
      navigation.navigate('Login'); // นำทางไปที่หน้า Login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.info}>อีเมล: {userEmail}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>ออกจากระบบ</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
