import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import Header from '../components/productHeader';
import ServiceList from '../components/collectionsService';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_QUERY, GET_MARKS } from '../gql/queries';

const Brands = () => {
    const { loading, error, data } = useQuery(GET_MARKS);
    const services = data?.getMarks || [];
  return (
    


    <SafeAreaView className='flex-1 bg-white'>
        <Header isCollection='Brands'/>
        <View className='m-4'>
            <ServiceList name='mark' services={services} isPage={true}/>
        </View>
    </SafeAreaView>
  )

  
}

export default Brands