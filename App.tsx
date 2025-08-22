import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider, useThemeStore } from "./src/state/themeStore";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

function AppContent() {
  const { theme } = useThemeStore();
  
  return (
    <NavigationContainer
      theme={theme === "dark" ? {
        ...NavDarkTheme,
        colors: {
          ...NavDarkTheme.colors,
          background: "#0B1220",
          card: "#0F172A",
          text: "#FFFFFF",
          border: "#1F2937",
          primary: "#60A5FA"
        }
      } : {
        ...NavLightTheme,
        colors: {
          ...NavLightTheme.colors,
          background: "#F9FAFB",
          card: "#FFFFFF",
          text: "#111827",
          border: "#E5E7EB",
          primary: "#2563EB"
        }
      }}
    >
      <RootNavigator />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
