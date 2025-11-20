// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect, useState } from "react";
// import CustomSplashScreen from "./components/CustomSplashScreen";
// import { AuthProvider } from "./contexts/AuthContext";
// import RootNavigator from "./Navigation/RootNavigator";
// import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
// import "./global.css";

// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   const [loaded, error] = useFonts({
//     quilka: require("./assets/fonts/Qilkabold-DO6BR.otf"),
//     abeezee: require("./assets/fonts/ABeeZee-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   if (!loaded || error) return <CustomSplashScreen />;

//   return (
//     <>
//       <StatusBar style="auto" />
//       <NavigationContainer>
//         <AuthProvider>
//           <RootNavigator />
//         </AuthProvider>
//       </NavigationContainer>
//     </>
//   );
// }
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ParentsHomeScreen from "./screens/parents/ParentsHomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ParentsHome" component={ParentsHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
