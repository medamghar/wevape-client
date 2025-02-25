import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import ServiceList from '../components/collectionsService'
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_QUERY } from '../gql/queries';
import Header from '../components/productHeader';

const Collections = () => {
    const { loading, error, data } = useQuery(GET_COLLECTIONS_QUERY);7
    const services = data?.getCollection || [];

  return (
    <SafeAreaView className='flex-1 bg-white'>
        <Header isCollection='Collections'/>
        <View className='m-4 '>
            <ServiceList name='collection' services={services} isPage={true}/>
        </View>
    </SafeAreaView>
  )
}

export default Collections