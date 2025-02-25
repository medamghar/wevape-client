import { FlatList } from 'react-native';
import { View } from 'react-native';

interface ServiceItem {
    id: string;
    name: string;
    photo:String;
  // Add other properties of your service item
}

interface ServiceListProps {
  services: ServiceItem[];
  renderItem: ({ item }: { item: ServiceItem }) => React.ReactElement;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, renderItem }) => {
  return (
    <View className="px-4 flex gap-8">
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default ServiceList;