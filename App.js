import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "./ChatScreen";

export default function App() {
  return (
    <NavigationContainer>
      <ChatScreen />
    </NavigationContainer>
  );
}
