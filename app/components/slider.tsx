import React, { useState, useRef, useEffect } from 'react';
import { View, Image, FlatList, Dimensions, Animated, ViewToken } from 'react-native';

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

type ViewableItemsChangedInfo = {
  viewableItems: ViewToken[];
  changed: ViewToken[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);
  const { width } = Dimensions.get('window');
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay) {
      interval = setInterval(() => {
        if (currentIndex === images.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        } else {
          flatListRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
          });
        }
      }, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval, images.length]);

  const onViewableItemsChanged = useRef((info: ViewableItemsChangedInfo) => {
    if (info.viewableItems.length > 0 && info.viewableItems[0].index !== null) {
      setCurrentIndex(info.viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View className="mb-2" style={{ width }}>
        <Image
          source={{ uri: item }}
          className="w-full h-48 "
          resizeMode="cover"
        />
      </View>
    );
  };

  // Render dots indicator
  const renderDots = () => {
    return (
      <View className="flex-row justify-center items-center mt-2">
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              className="h-2 rounded-full bg-gray-500 mx-1"
              style={{
                width: dotWidth,
                opacity,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {renderDots()}
    </View>
  );
};

export default ImageSlider