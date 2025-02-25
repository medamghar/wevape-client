import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ImageGalleryProps {
  images: ProductImage[];
  selectedImage: ProductImage;
  onImageSelect: (image: ProductImage) => void;
  onImagePress: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedImage, onImageSelect, onImagePress }) =>{
    
    return(
  <View style={{ width: '100%', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 8 }}>
    <TouchableOpacity onPress={onImagePress} style={{ width: '100%', aspectRatio: 1 }}>
      <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: selectedImage.url }} resizeMode="contain" />
    </TouchableOpacity>
    <FlatList
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onImageSelect(item)} style={{ padding: 8, marginRight: 8, borderWidth: selectedImage.id === item.id ? 2 : 0, borderColor: '#3B82F6', borderRadius: 8 }}>
          <Image style={{ width: 64, height: 64, borderRadius: 8 }} source={{ uri: item.url }} resizeMode="contain" />
        </TouchableOpacity>
      )}
      style={{ marginTop: 16 }}
    />
  </View>
);
}
export default ImageGallery;
