import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firestore imports
import { db } from '../FireStore'; // Import the Firestore instance
import ProductCard from '../Components/ProductCard';

const HomeScreen = ({ navigation }) => {
  const [allProductData, setAllProductData] = useState([]);
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [selectedProductNames, setSelectedProductNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchProductData = async () => {
    try {
      // Get reference to Firestore collection
      const productRef = collection(db, 'products');
      const productSnapshot = await getDocs(productRef); // Fetch all documents
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(), // Get product data from Firestore
      }));
      return productList;
    } catch (error) {
      setError(error);
      return [];
    }
  };

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

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      const allData = await fetchProductData();
      setAllProductData(allData);
      setFilteredProductData(allData);
      await loadSelectedProducts();
      setLoading(false);
    };

    loadAllData();
  }, []);

  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredProductData(allProductData);
    } else if (filterStatus === 'IN_STOCK') {
      const inStockProducts = allProductData.filter(item => parseInt(item.stock) > 0);
      setFilteredProductData(inStockProducts);
    }
  }, [filterStatus, allProductData]);

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const handleProductPress = async (item) => {
    Alert.alert('ชื่อสินค้า', item.name);

    try {
      const alreadyExists = selectedProductNames.includes(item.name);
      if (!alreadyExists) {
        const updatedList = [...selectedProductNames, item.name];
        setSelectedProductNames(updatedList);
        await AsyncStorage.setItem('selectedProductNames', JSON.stringify(updatedList));
      }
    } catch (error) {
      console.error('Error saving product list:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลสินค้า...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
        <Text style={styles.errorText}>ไม่สามารถโหลดข้อมูลได้: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
      <View style={styles.container}>
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === 'ALL' && styles.activeFilterButton]}
              onPress={() => handleFilter('ALL')}
            >
              <Text style={[styles.filterButtonText, filterStatus === 'ALL' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === 'IN_STOCK' && styles.activeFilterButton]}
              onPress={() => handleFilter('IN_STOCK')}
            >
              <Text style={[styles.filterButtonText, filterStatus === 'IN_STOCK' && styles.activeFilterText]}>IN STOCK</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product List Section */}
        <View style={styles.productListSection}>
          <ScrollView>
            {filteredProductData.length > 0 ? (
              filteredProductData.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleProductPress(item)}>
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    description={`ประเภท: ${item.cate || 'ไม่มี'} | คงเหลือ: ${item.stock || '0'}`}
                    price={item.price}
                    imageUri={item.pic}  // ใช้ `pic` เป็น URL รูปภาพจาก Firestore
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>ไม่พบสินค้าที่ตรงกับเงื่อนไข</Text>
            )}
          </ScrollView>
        </View>

        {/* Cart Button */}
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartButton}>ไปที่ตะกร้าสินค้า</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  container: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 25,
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  productListSection: {
    flex: 1,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
  },
  cartButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cartButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
