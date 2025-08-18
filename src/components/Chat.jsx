import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import "./Chat.css";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const chatMessagesRef = useRef(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          _id: msg._id, // NEW: Use the unique message ID
          senderId: senderId._id, // NEW: Store the full senderId
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          timestamp: createdAt,
          isSentByUser: senderId?._id === userId,
        };
      });
      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      userId, // NEW: Send the sender's ID
      firstName: user.firstName,
      lastName: user.lastName,
      targetUserId,
      text: newMessage,
    });

    // Optimistically add the new message to the local state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        // We don't have a database ID yet, so use a temporary one
        _id: Date.now(), 
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
        timestamp: new Date().toISOString(),
        isSentByUser: true,
      },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ senderId, firstName, lastName, text, createdAt }) => {
      // FIX: Only add the message to state if the sender is NOT the current user
      if (senderId === userId) {
        return;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: senderId,
          firstName,
          lastName,
          text,
          timestamp: createdAt,
          isSentByUser: false,
        },
      ]);
    });
    
    socket.on("messageSeen", ({ userId: seenById }) => {
      if (seenById === targetUserId) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.isSentByUser ? { ...msg, isSeen: true } : msg
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user.firstName]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <div
            key={msg._id || index} // Use unique ID for key
            className={msg.isSentByUser ? "chat-message-sent" : "chat-message-received"}
          >
            <div className="message-header">
              {`${msg.firstName} ${msg.lastName}`}
              {msg.timestamp && (
                <time className="message-time">
                  {formatTime(msg.timestamp)}
                </time>
              )}
            </div>
            <div className="message-bubble">{msg.text}</div>
            <div className="message-footer">
              {msg.isSentByUser ? "Sent" : null}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="chat-input"
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;