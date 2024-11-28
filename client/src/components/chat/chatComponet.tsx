import React, { useEffect, useState } from 'react';
import axiosWrapper from '../axiosWrapper';
import "../../boards/css/chat.css";

// Message Interface
interface Message {
    chatIndex: number;
    username: string;
    chatText: string;
    author: string;
    writtenAt: string;
    profilePic: string;

}

// ChatComponent
const ChatComponent: React.FC = () => {
    const [chatText, setChatText] = useState<string>('');
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [chatIndex, setChatIndex] = useState<number>(0);

    const fetchMessages = async () => {
        try {
            const response = await axiosWrapper.post('/api/GetGlobalChats', chatIndex);
            const data = response.data;
            console.log('Fetched messages:', data.chats);
            setMessages(data.chats);
            setChatIndex(data.chatIndex);
            fetchActiveUsers();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
   
        const intervalId = setInterval(fetchMessages, 5000);

        return () => {
            clearInterval(intervalId);
        };

    }, []);

    const byteArrayToBase64 = (byteArray: string) => {
        return `data:image/jpeg;base64,${byteArray}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const fetchActiveUsers = async () => {
        try {
            const response = await axiosWrapper.get('/api/Session/GetConnectedUsernames');
            const data: string[] = response.data;
            console.log('Fetched active users:', data);
            if (data) {
                setActiveUsers(data);
            }
        } catch (error) {
            console.error('Error fetching active users:', error);
        }
    };
    
    useEffect(() => {
        fetchActiveUsers();
    }, [])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (chatText.trim() === '') {
            return;
        }

        try {
            const response = await axiosWrapper.post('/api/SendGlobalChat', { chatText });
            console.log('Message sent:', response.data);
            
            setChatText('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <button role='button' className='chatButton' onClick={() => setIsPopupVisible(!isPopupVisible)}>
                <i className="fas fa-comments"></i>
            </button>
            {isPopupVisible && (
                <div className="chat-popup">
                    <div className="chat">
                        <div className="activeUsers">
                            <div className="users_header">
                                <h1>Active Users</h1>
                            </div>
                            <div className="users_list">
                                <div>
                                    <ul className='active_list'>
                                        {activeUsers.map((user, index) => (
                                            <li key={index} className='listActive'>
                                                <span className='activeUser'>{user}</span>
                                                <div className='circle'><i className='fas fa-circle'></i></div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="chatBox">
                            <div className="chat_header">
                                <h1>Chat</h1>
                            </div>
                            <div className="chat_messages" id="chatMessages">
                                <ul className='message_list'>
                                    {messages && messages.slice().reverse().map((message, index) => (
                                        <li key={index} className="message">
                                            <div className="message_header">
                                                <div className="message_header_left">
                                                    <img className='chat_image' src={byteArrayToBase64(message.profilePic)} />
                                                    <span className='message_user'>{message.username}</span>
                                                </div>
                                                <span className="message_date">{formatDate(message.writtenAt)}</span>
                                            </div>
                                            <div className="message_body">
                                                <p>{message.chatText}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="chat_input">
                                <form onSubmit={handleSubmit} className='chat_input_obj'>
                                    <input
                                        type="text"
                                        value={chatText}
                                        onChange={(e) => setChatText(e.target.value)}
                                        placeholder="Type your message here..."
                                    />
                                    <button role='button' className="sendButton" type="submit">Send</button>
                                </form>                    
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default ChatComponent;