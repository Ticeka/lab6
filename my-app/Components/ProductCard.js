// ProductCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ id, name, price, description, imageUri }) => {
  const formattedPrice = !isNaN(parseFloat(price))
    ? `฿${parseFloat(price).toLocaleString('en-US')}`
    : 'N/A';

  const imageUrl = imageUri && typeof imageUri === 'string' ? imageUri : null;

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image
          style={styles.logo}
          source={{ uri: imageUrl }}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.textProduct} numberOfLines={2} ellipsizeMode="tail">
          {name || 'Unnamed Product'}
        </Text>
        <Text style={styles.textDescription} numberOfLines={2} ellipsizeMode="tail">
          {description || ''}
        </Text>
        <Text style={styles.textPrice}>{formattedPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    minHeight: 120,
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 15,
    alignSelf: 'center',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  textDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  textPrice: {
    fontSize: 15,
    color: '#B12704',
    fontWeight: 'bold',
  },
});

export default ProductCard;
