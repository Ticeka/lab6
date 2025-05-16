import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = () => {
  const [selectedProductNames, setSelectedProductNames] = useState([]);

  const loadSelectedProducts = async () => {
    try {
      const namesJSON = await AsyncStorage.getItem('selectedProductNames');
      if (namesJSON) {
        const namesArray = JSON.parse(namesJSON);
        setSelectedProductNames(namesArray);
      }
    } catch (e) {
      console.error('Failed to load selected product list:', e);
    }
  };

  const handleClearSelection = async () => {
    try {
      await AsyncStorage.removeItem('selectedProductNames');
      setSelectedProductNames([]);  // Clear the state after removing from AsyncStorage
      Alert.alert('สำเร็จ', 'ล้างรายการสินค้าที่เลือกแล้ว');
      loadSelectedProducts();  // Reload the list of selected products
    } catch (error) {
      console.error('Error clearing product list:', error);
    }
  };

  useEffect(() => {
    loadSelectedProducts();  // Load products when the screen is first loaded
  }, []);  // Empty dependency array ensures it runs once when component is mounted.

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
      <Text style={styles.header}>ตะกร้าสินค้าของคุณ:</Text>
      {selectedProductNames.length > 0 ? (
        selectedProductNames.map((name, index) => (
          <Text key={index} style={styles.productName}>• {name}</Text>
        ))
      ) : (
        <Text style={styles.noProducts}>ยังไม่มีสินค้าที่เลือก</Text>
      )}
      <TouchableOpacity style={styles.clearButton} onPress={handleClearSelection}>
        <Text style={styles.clearButtonText}>ล้างรายการ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  noProducts: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
