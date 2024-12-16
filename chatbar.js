import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const ChatBar = ({ replyingTo, onSend, onAttachment }) => {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      {/* Reply UI */}
      {replyingTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyText}>Reply to @{replyingTo}</Text>
        </View>
      )}

      {/* Chat Input and Buttons */}
      <View style={styles.inputContainer}>
        {/* Attachment Buttons */}
        <TouchableOpacity onPress={onAttachment} style={styles.iconButton}>
          <Image
            source={require("./assets/icons/camera.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAttachment} style={styles.iconButton}>
          <Image
            source={require("./assets/icons/video.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAttachment} style={styles.iconButton}>
          <Image
            source={require("./assets/icons/document.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder="Reply to @Rohit Yadav"
          placeholderTextColor="#C5C5C5"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />

        {/* Send Button */}
        <TouchableOpacity
          onPress={() => {
            if (message.trim()) {
              onSend(message);
              setMessage(""); // Clear input
            }
          }}
          style={styles.sendButton}
        >
          <Image
            source={require("./assets/icons/send.png")}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EDEDED",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  replyContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  replyText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#4CAF50", // Green tint for icons
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    height: 40,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4CAF50", // Green background for send button
    padding: 8,
    borderRadius: 20,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF", // White send icon
  },
});

export default ChatBar;
