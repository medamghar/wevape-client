import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { ModalStatus, setModalCity } from "../slices/modal";
import { Citiesmap } from "@/constants/Cities";
import { useState } from "react";

const Omodal = ()=>{
    const modalOpen = useSelector((state: RootState) => state.modal.open);
    const [cities , setFiltercity] = useState(Citiesmap.cities)
    const [selectedCity, setSelectedCity] = useState('');

    const dispatch = useDispatch();
    const handleCitySelect = (city:any) => {
        dispatch(setModalCity(city))
        dispatch(ModalStatus({open:false}))      };

        const OnchangeInput =(text:string)=>{
            const searchTerm = text.toLowerCase();

  
  const newCities = Citiesmap.cities.filter(city => 
    city.toLowerCase().includes(searchTerm)
  );
  setFiltercity(newCities);
        }
return(

    <Modal
transparent
animationType="slide"
visible={modalOpen}
onRequestClose={() => dispatch(ModalStatus({open:false}))}
className=""
>
<View className="flex-1
  items-center justify-center" style={
    {

    }
  }>

  <View className="w-[20rem] h-[30rem] bg-white rounded-lg border border-gray-100 px-4 py-4">
    <View className="flex gap-4">
        <TextInput className=" border border-gray-200 rounded-lg px-4 py-2" placeholder="Search" onChangeText={OnchangeInput}  />
        <FlatList 
        className="h-[300px] border rounded-lg border-gray-200 "
        data={cities}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCitySelect(item)}>
            <Text style={{ padding: 10, fontSize: 16 }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}

        />


    </View>
    <TouchableOpacity className="w-full flex items-center bg-red-400 rounded-lg my-4" onPress={() => dispatch(ModalStatus({open:false}))}><Text className="py-2 text-white">Close</Text></TouchableOpacity>

  </View>
</View>

</Modal>

)





}
export default Omodal