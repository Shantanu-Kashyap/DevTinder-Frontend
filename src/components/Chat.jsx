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
  const socketRef = useRef(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages
        .map((msg) => {
          if (!msg.senderId || typeof msg.senderId !== "object") {
            console.warn("Message received without valid sender data:", msg);
            return null;
          }

          const { senderId, text, createdAt } = msg;

          return {
            _id: msg._id,
            senderId: senderId._id,
            firstName: senderId.firstName,
            lastName: senderId.lastName,
            text,
            timestamp: createdAt,
            isSentByUser: senderId._id === userId,
          };
        })
        .filter(Boolean);

      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    socketRef.current.emit("sendMessage", {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      targetUserId,
      text: newMessage,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
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
    if (!userId) return;

    const socket = createSocketConnection({ withCredentials: true });
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on(
      "messageReceived",
      ({ senderId, firstName, lastName, text, createdAt }) => {
        if (senderId === userId) return;
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderId,
            firstName,
            lastName,
            text,
            timestamp: createdAt,
            isSentByUser: false,
          },
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user.firstName]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight;
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
            key={msg._id || index}
            className={
              msg.isSentByUser ? "chat-message-sent" : "chat-message-received"
            }
          >
            <div className="message-header">
              {`${msg.firstName} ${msg.lastName}`}
              {msg.timestamp && (
                <time className="message-time">{formatTime(msg.timestamp)}</time>
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
