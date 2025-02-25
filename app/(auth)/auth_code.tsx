import { gql, useMutation } from "@apollo/client";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native"
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import * as Notifications from 'expo-notifications';
import { useAuth } from "../auth";

const VERIFY_OTP = gql`
  mutation verifyOtp($phone: String!, $code: String!) {
    verifyOtp(phone: $phone, code: $code) {
      message
      ok
      token
      completed
    }
  }
`;

const AuthCode = () => {
const  {login}= useAuth()
  const phone= useSelector((state : RootState) => state.otp.phone); // Access the phone state

  const [verifyOtp, { loading, error, data }] = useMutation(VERIFY_OTP);
  const [code, setCode] = useState('');
  const handleGenerateOtp = () => {
    verifyOtp({
      variables: {
        phone,
        code
      },
      onCompleted: (data) => {
        if(data.verifyOtp.ok && data.verifyOtp.token){
          login(data.verifyOtp.token, phone);
          if(data?.verifyOtp?.completed){
            router.replace("/(auth)/home");
            return
          }
          router.replace("/(auth)/on-bording");
        }
        return
      },
      onError: (error) => {
        console.error('OTP Verification failed:', error); // Corrected the error message
      }
    });
  };


    return(
        <SafeAreaView className="flex-1  items-center  bg-white">
        <View className="w-full flex items-start px-4">
            <TouchableOpacity onPress={()=> {router.replace("/(auth)/welcome")}}>
            <Text className="font-JakartaBold text-black text-md" >Previous</Text>
            </TouchableOpacity>
        </View>
        <View className="w-full p-6 flex flex-col m-10 items-center justify-center">
          <Text className="text-red-700">{data?.verifyOtp?.message}</Text>
             <View className='w-full' >
                        <Text className=' text-center text-[36px] text-[#222] font-bold '>Verification code</Text>
                    </View>
                    <View>
                        <Text className='text-md text-[#858585] font-Jakarta mt-3 text-center'>We have sent the verification code to your phone number via SMS</Text>
                    </View>
                    <View className="mt-12">
                    <OtpInput
  numberOfDigits={6}
  focusColor="green"
  autoFocus={false}
  hideStick={true}
  placeholder="******"
  blurOnFilled={true}
  disabled={false}
  type="numeric"
  secureTextEntry={false}
  focusStickBlinkingDuration={500}
  onFocus={() => {}}
  onBlur={() => {}}
  onTextChange={(text) => {}}
  onFilled={(text) => {setCode(text) }}
  textInputProps={{
    accessibilityLabel: "One-Time Password",
  }}
  
/>
                    </View>
                    <View className='mt-12 w-full '>
<TouchableOpacity  className={`w-full h-12 flex items-center justify-center rounded-lg bg-[#293777] `}   onPress={()=>handleGenerateOtp()}><Text className="text-white text-lg font-JakartaBold">Verifé</Text></TouchableOpacity>

</View>
        </View>
        </SafeAreaView>
    )
}

export default AuthCode