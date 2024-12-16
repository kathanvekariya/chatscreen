import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderSection = ({ navigation }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  

  const onPlusIconLayout = (event) => {
    const { x, y, height } = event.nativeEvent.layout;
    setDropdownPosition({ top: y + height, left: x });
  };

  

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");
    }
  };

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "https://qa.corider.in/assignment/chat?page=0"
        );
        const data = await response.json();

        // Map API response to message format
        const formattedMessages = data.chats.map((chat) => ({
          id: chat.id,
          text: chat.message,
          sender: chat.sender.self ? "user" : "other", // 'user' for self, 'other' for others
          profileImage: chat.sender.image, // Extract profile image
          isVerified: chat.sender.is_kyc_verified, // KYC verification
          time: chat.time, // Time of the message
        }));

        setMessages(formattedMessages);
      } catch (error) {
        Alert.alert("Error", "Failed to load chat messages.");
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchMessages();
  }, []);

  const plusIconRef = React.useRef(null);

  const toggleDropdown = () => {
    if (plusIconRef.current) {
      plusIconRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height + 8, left: pageX });
        setDropdownVisible(!isDropdownVisible);
      });
    }
  };


 const renderMessage = ({ item }) => {
   const isUser = item.sender === "user";

   return (
     <View
       style={[
         styles.messageWrapper,
         isUser ? styles.alignRight : styles.alignLeft, // Conditionally apply the styles
       ]}
     >
       {/* Render profile image and KYC badge for 'other' users */}
       {!isUser && (
         <View style={styles.senderContainer}>
           <Image
             source={{ uri: item.profileImage }}
             style={styles.profileImageSmall}
           />
           {item.isVerified && (
             <Text style={styles.kycBadge}>✔</Text> // KYC Verification Indicator
           )}
         </View>
       )}

       {/* Message Bubble */}
       <View
         style={[
           styles.messageContainer,
           isUser ? styles.userMessage : styles.otherMessage,
         ]}
       >
         <Text style={styles.messageText}>{item.text}</Text>
         <Text style={styles.messageTime}>{item.time}</Text>
       </View>
     </View>
   );
 };




  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("./assets/icons/back.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Trip 1</Text>
        </View>
        <TouchableOpacity onPress={() => alert("Edit")}>
          <Image
            source={require("./assets/icons/edit.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.detailsContainer}>
        <Image
          source={require("./assets/images/user2.jpeg")}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.label}>
            From <Text style={styles.boldText}>IGI Airport, T3</Text>
          </Text>
          <Text style={styles.label}>
            To <Text style={styles.boldText}>Sector 28</Text>
          </Text>
        </View>
        <TouchableOpacity ref={plusIconRef} onPress={toggleDropdown}>
          <Image
            source={require("./assets/icons/plus.png")}
            style={styles.optionsIcon}
          />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <View
          style={[
            styles.dropdownMenu,
            {
              top: dropdownPosition.top + 8, // Adjust dropdown slightly below icon
              left: dropdownPosition.left,
              zIndex: 1000, // Ensure the dropdown is on top of other content
            },
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setDropdownVisible(false); // Close dropdown on selection
              alert("View Members");
            }}
          >
            <Text style={styles.dropdownText}>View Members</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setDropdownVisible(false); // Close dropdown on selection
              alert("Share Number");
            }}
          >
            <Text style={styles.dropdownText}>Share Number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setDropdownVisible(false); // Close dropdown on selection
              alert("Report");
            }}
          >
            <Text style={styles.dropdownText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Green Action Menu (Fixed) */}
      {isMenuVisible && (
        <View style={styles.greenActionMenu}>
          <TouchableOpacity
            style={styles.greenMenuItem}
            onPress={() => alert("View Details")}
          >
            <Text style={styles.greenMenuText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.greenMenuItem}
            onPress={() => alert("Mark as Completed")}
          >
            <Text style={styles.greenMenuText}>Mark as Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.greenMenuItem}
            onPress={() => alert("Contact Support")}
          >
            <Text style={styles.greenMenuText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Section */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        keyboardShouldPersistTaps="handled"
        scrollEnabled
      />

      {/* Chat Input Bar wrapped in KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.chatInputBar}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("./assets/icons/plus.png")}
            style={styles.attachIcon}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Reply to @User"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Image
            source={require("./assets/icons/bubble-chat.png")}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F8F8",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  optionsIcon: {
    width: 24,
    height: 24,
  },
  dropdownWrapper: {
    position: "relative", // Ensures dropdown is positioned relative to the parent
  },
  dropdownMenu: {
    position: "absolute", // Make sure it’s positioned relative to the parent
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 8,
    zIndex: 1000, // Ensure dropdown is above other content
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    width: 150, // Adjust width as necessary for your design
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#007AFF",
  },
  greenActionMenu: {
    position: "absolute",
    bottom: 80,
    left: 20,
    backgroundColor: "#28a745",
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
  greenMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  greenMenuText: {
    fontSize: 16,
    color: "#fff",
  },
  messageList: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: "row", // Ensure row layout for the message
    marginBottom: 10,
  },
  alignLeft: {
    justifyContent: "flex-start", // Align to the left for the other user's messages
  },
  alignRight: {
    justifyContent: "flex-end", // Align to the right for the user's messages
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    maxWidth: "70%", // Set a max width to avoid stretching the message too far
  },
  userMessage: {
    backgroundColor: "#D1F7C4", // User's message color
    borderBottomLeftRadius: 0, // Align the message bubble to the right
  },
  otherMessage: {
    backgroundColor: "#F1F1F1", // Other user's message color
    borderBottomRightRadius: 0, // Align the message bubble to the left
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  profileImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#ccc", // Fallback color for image
  },
  kycBadge: {
    fontSize: 14,
    color: "#4CAF50", // Green color for verified KYC
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  senderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDEDED",
    backgroundColor: "#F8F8F8",
  },
  attachIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    fontSize: 16,
    color: "#333",
  },
  sendIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
});

export default HeaderSection;
