"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowRight, Check, CheckCheck, Smile, X } from "lucide-react";

// --- Types ---
interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
  fileUrl?: string;
}

interface ChatSession {
  userId: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

// --- Mock Data ---
const currentUser = { id: 99, name: "الاستقبال", role: "Reception" };

const contacts: User[] = [
  { id: 1, name: "د. نبيل", role: "جراحة عامة", avatar: "N", status: "online" },
  { id: 2, name: "د. سارة", role: "أطفال", avatar: "S", status: "busy", lastSeen: "منذ 5د" },
  { id: 3, name: "المعمل", role: "Lab", avatar: "L", status: "offline", lastSeen: "منذ 1س" },
  { id: 4, name: "د. أحمد", role: "قلب", avatar: "A", status: "online" },
];

const initialChats: Record<number, ChatSession> = {
  1: {
    userId: 1,
    unreadCount: 2,
    lastMessage: "تمام، هعدي عليكي كمان شوية",
    lastMessageTime: "10:30 ص",
    messages: [
      { id: 1, senderId: 99, text: "دكتور، الحالة رقم 45 موجودة في الانتظار", time: "10:15 ص", status: "read", type: "text" },
      { id: 2, senderId: 1, text: "أنا بخلص كشف حالياً، 5 دقايق بالظبط", time: "10:20 ص", status: "read", type: "text" },
      { id: 3, senderId: 99, text: "تمام يا دكتور، هبلغهم", time: "10:21 ص", status: "read", type: "text" },
      { id: 4, senderId: 1, text: "المريض دفع الكشف ولا لسه؟", time: "10:25 ص", status: "read", type: "text" },
      { id: 5, senderId: 1, text: "تمام، هعدي عليكي كمان شوية", time: "10:30 ص", status: "delivered", type: "text" },
    ]
  },
  2: {
    userId: 2,
    unreadCount: 0,
    lastMessage: "شكراً يا أستاذة",
    lastMessageTime: "أمس",
    messages: [
      { id: 1, senderId: 99, text: "د. سارة، نتيجة التحاليل وصلت", time: "أمس", status: "read", type: "text" },
      { id: 2, senderId: 2, text: "شكراً يا أستاذة", time: "أمس", status: "read", type: "text" },
    ]
  }
};

// Message status icons component
const MessageStatus = ({ status }: { status: Message['status'] }) => {
  if (status === 'read') return <CheckCheck className="w-4 h-4 text-blue-500" />;
  if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
  return <Check className="w-4 h-4 text-gray-400" />;
};

// Contact Avatar Component
const ContactAvatar = ({ contact, size = "md" }: { contact: User; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-14 h-14 text-lg"
  };
  
  const statusColors = {
    online: "bg-green-500",
    busy: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md`}>
        {contact.avatar}
      </div>
      {contact.status === 'online' && (
        <div className={`absolute bottom-0 right-0 ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${statusColors[contact.status]} border-2 border-white rounded-full`} />
      )}
    </div>
  );
};

// Contact List Item Component
const ContactListItem = React.memo(({ 
  contact, 
  chat, 
  isSelected, 
  onClick 
}: { 
  contact: User; 
  chat?: ChatSession; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const lastMsg = chat?.lastMessage || "ابدأ محادثة جديدة";
  const time = chat?.lastMessageTime || "";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-r-4 ${
        isSelected 
          ? 'bg-gradient-to-l from-blue-50 to-transparent border-blue-500' 
          : 'hover:bg-gray-50 border-transparent'
      }`}
    >
      <ContactAvatar contact={contact} />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
            {contact.name}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0 mr-2">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMsg}</p>
      </div>

      {(chat?.unreadCount ?? 0) > 0 && (
        <div className="flex-shrink-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {chat?.unreadCount}
        </div>
      )}
    </div>
  );
});

ContactListItem.displayName = 'ContactListItem';

// Message Bubble Component
const MessageBubble = React.memo(({ message, isMe }: { message: Message; isMe: boolean }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isMe
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
              : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
          <div className={`flex items-center gap-1 justify-end mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
            <span className="text-xs">{message.time}</span>
            {isMe && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [chats, setChats] = useState<Record<number, ChatSession>>(initialChats);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedUserId, chats, scrollToBottom]);

  // Focus input when chat selected
  useEffect(() => {
    if (selectedUserId && !isMobileListVisible) {
      inputRef.current?.focus();
    }
  }, [selectedUserId, isMobileListVisible]);

  // Filtered contacts based on search
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectUser = useCallback((id: number) => {
    setSelectedUserId(id);
    setIsMobileListVisible(false);
    
    // Mark as read
    setChats(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], unreadCount: 0 }
      };
    });
  }, []);

  const handleSendMessage = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedUserId) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      type: "text"
    };

    setChats(prev => {
      const userChat = prev[selectedUserId] || {
        userId: selectedUserId,
        messages: [],
        unreadCount: 0,
        lastMessage: "",
        lastMessageTime: ""
      };
      
      return {
        ...prev,
        [selectedUserId]: {
          ...userChat,
          messages: [...userChat.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.time
        }
      };
    });

    setMessageInput("");
    
    // Simulate message delivery after 1 second
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [selectedUserId]: {
          ...prev[selectedUserId],
          messages: prev[selectedUserId].messages.map(m =>
            m.id === newMessage.id ? { ...m, status: "delivered" } : m
          )
        }
      }));
    }, 1000);
  }, [messageInput, selectedUserId]);

  const activeChat = useMemo(() => {
    if (!selectedUserId) return null;
    return chats[selectedUserId] || { userId: selectedUserId, messages: [], unreadCount: 0, lastMessage: "", lastMessageTime: "" };
  }, [selectedUserId, chats]);

  const selectedContact = useMemo(() => 
    contacts.find(u => u.id === selectedUserId),
    [selectedUserId]
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 bg-white border-l border-gray-200 flex-shrink-0`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">المحادثات</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن محادثة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              dir="rtl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                chat={chats[contact.id]}
                isSelected={selectedUserId === contact.id}
                onClick={() => handleSelectUser(contact.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <Search className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${isMobileListVisible ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {selectedUserId && selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm relative z-10">
              <button
                onClick={() => setIsMobileListVisible(true)}
                className="md:hidden p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
              
              <ContactAvatar contact={selectedContact} />
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                <p className="text-xs text-gray-500">
                  {selectedContact.status === 'online' ? 'متصل الآن' : selectedContact.lastSeen}
                </p>
              </div>

              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* Date Divider */}
              <div className="flex justify-center my-4">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-gray-600 shadow-sm">
                  اليوم
                </span>
              </div>

              {activeChat?.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMe={msg.senderId === currentUser.id}
                />
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 relative z-10">
              <div className="flex items-end gap-2">
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>

                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="اكتب رسالة..."
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    dir="rtl"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-3 rounded-full transition-all flex-shrink-0 ${
                    messageInput.trim()
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Send className={`w-5 h-5 ${messageInput.trim() ? 'text-white' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Clinica Chat</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                أرسل واستقبل الرسائل من الأطباء والموظفين فوراً
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span>رسائلك محمية ومشفرة داخل النظام</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





















// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Search,
//   Send,
//   Paperclip,
//   MoreVertical,
//   Phone,
//   Video,
//   ArrowRight,
//   Check,
//   CheckCheck,
//   Smile,
//   Image as ImageIcon,
//   FileText,
//   Mic
// } from "lucide-react";

// // --- Types ---
// interface User {
//   id: number;
//   name: string;
//   role: string;
//   avatar: string;
//   status: "online" | "offline" | "busy";
//   lastSeen?: string;
// }

// interface Message {
//   id: number;
//   senderId: number;
//   text: string;
//   time: string;
//   status: "sent" | "delivered" | "read";
//   type: "text" | "image" | "file";
//   fileUrl?: string;
// }

// interface ChatSession {
//   userId: number;
//   unreadCount: number;
//   lastMessage: string;
//   lastMessageTime: string;
//   messages: Message[];
// }

// // --- Mock Data ---
// const currentUser = { id: 99, name: "الاستقبال", role: "Reception" };

// const contacts: User[] = [
//   { id: 1, name: "د. نبيل", role: "جراحة عامة", avatar: "N", status: "online" },
//   { id: 2, name: "د. سارة", role: "أطفال", avatar: "S", status: "busy", lastSeen: "منذ 5د" },
//   { id: 3, name: "المعمل", role: "Lab", avatar: "L", status: "offline", lastSeen: "منذ 1س" },
//   { id: 4, name: "د. أحمد", role: "قلب", avatar: "A", status: "online" },
// ];

// const initialChats: Record<number, ChatSession> = {
//   1: {
//     userId: 1,
//     unreadCount: 2,
//     lastMessage: "تمام، هعدي عليكي كمان شوية",
//     lastMessageTime: "10:30 ص",
//     messages: [
//       { id: 1, senderId: 99, text: "دكتور، الحالة رقم 45 موجودة في الانتظار", time: "10:15 ص", status: "read", type: "text" },
//       { id: 2, senderId: 1, text: "أنا بخلص كشف حالياً، 5 دقايق بالظبط", time: "10:20 ص", status: "read", type: "text" },
//       { id: 3, senderId: 99, text: "تمام يا دكتور، هبلغهم", time: "10:21 ص", status: "read", type: "text" },
//       { id: 4, senderId: 1, text: "المريض دفع الكشف ولا لسه؟", time: "10:25 ص", status: "read", type: "text" },
//       { id: 5, senderId: 1, text: "تمام، هعدي عليكي كمان شوية", time: "10:30 ص", status: "delivered", type: "text" },
//     ]
//   },
//   2: {
//     userId: 2,
//     unreadCount: 0,
//     lastMessage: "شكراً يا أستاذة",
//     lastMessageTime: "أمس",
//     messages: [
//       { id: 1, senderId: 99, text: "د. سارة، نتيجة التحاليل وصلت", time: "أمس", status: "read", type: "text" },
//       { id: 2, senderId: 2, text: "شكراً يا أستاذة", time: "أمس", status: "read", type: "text" },
//     ]
//   }
// };

// export default function ChatPage() {
//   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
//   const [chats, setChats] = useState(initialChats);
//   const [messageInput, setMessageInput] = useState("");
//   const [isMobileListVisible, setIsMobileListVisible] = useState(true);

//   // Scroll to bottom logic
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [selectedUserId, chats]);

//   // --- Handlers ---
//   const handleSelectUser = (id: number) => {
//     setSelectedUserId(id);
//     setIsMobileListVisible(false); // Hide list on mobile
    
//     // Mark as read
//     if (chats[id]) {
//         setChats(prev => ({
//             ...prev,
//             [id]: { ...prev[id], unreadCount: 0 }
//         }));
//     }
//   };

//   const handleSendMessage = (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (!messageInput.trim() || !selectedUserId) return;

//     const newMessage: Message = {
//         id: Date.now(),
//         senderId: currentUser.id,
//         text: messageInput,
//         time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
//         status: "sent",
//         type: "text"
//     };

//     setChats(prev => {
//         const userChat = prev[selectedUserId] || { 
//             userId: selectedUserId, 
//             messages: [], 
//             unreadCount: 0, 
//             lastMessage: "", 
//             lastMessageTime: "" 
//         };
        
//         return {
//             ...prev,
//             [selectedUserId]: {
//                 ...userChat,
//                 messages: [...userChat.messages, newMessage],
//                 lastMessage: newMessage.text,
//                 lastMessageTime: newMessage.time
//             }
//         };
//     });

//     setMessageInput("");
//   };

//   const getActiveChat = () => {
//     if (!selectedUserId) return null;
//     return chats[selectedUserId] || { userId: selectedUserId, messages: [], unreadCount: 0 };
//   };

//   const getContactInfo = (id: number) => contacts.find(u => u.id === id);

//   return (
//     <div dir="rtl" className="h-[calc(100vh-4rem)] bg-gray-100 flex overflow-hidden">
      
//       {/* 1. Sidebar (Contact List) */}
//       <aside className={`w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
//         !isMobileListVisible ? 'hidden md:flex' : 'flex'
//       }`}>
        
//         {/* Header */}
//         <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-800">المحادثات</h2>
//             <div className="flex gap-2">
//                 <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><MoreVertical className="w-5 h-5" /></button>
//             </div>
//         </div>

//         {/* Search */}
//         <div className="p-3">
//             <div className="relative">
//                 <input 
//                     type="text" 
//                     placeholder="بحث عن طبيب..." 
//                     className="w-full bg-gray-100 border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//                 <Search className="absolute top-2.5 right-3 w-4 h-4 text-gray-400" />
//             </div>
//         </div>

//         {/* Contacts List */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//             {contacts.map(contact => {
//                 const chat = chats[contact.id];
//                 const lastMsg = chat?.lastMessage || "ابدأ محادثة جديدة";
//                 const time = chat?.lastMessageTime || "";
                
//                 return (
//                     <div 
//                         key={contact.id}
//                         onClick={() => handleSelectUser(contact.id)}
//                         className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
//                             selectedUserId === contact.id ? 'bg-blue-50 hover:bg-blue-50' : ''
//                         }`}
//                     >
//                         {/* Avatar */}
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200">
//                                 {contact.avatar}
//                             </div>
//                             {contact.status === 'online' && (
//                                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
//                             )}
//                         </div>

//                         {/* Info */}
//                         <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-baseline mb-1">
//                                 <h3 className="font-bold text-gray-900 truncate">{contact.name}</h3>
//                                 <span className="text-xs text-gray-500">{time}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <p className="text-sm text-gray-500 truncate w-4/5">{lastMsg}</p>
//                                 {chat?.unreadCount > 0 && (
//                                     <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//                                         {chat.unreadCount}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//       </aside>

//       {/* 2. Chat Area */}
//       <main className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${
//         isMobileListVisible ? 'hidden md:flex' : 'flex'
//       }`}>
//         {/* Background Pattern Overlay (Optional for WhatsApp feel) */}
//         <div className="absolute inset-0 opacity-10 pointer-events-none" 
//              style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}>
//         </div>

//         {selectedUserId ? (
//             <>
//                 {/* Chat Header */}
//                 <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
//                     <div className="flex items-center gap-3">
//                         <button 
//                             onClick={() => setIsMobileListVisible(true)}
//                             className="md:hidden p-2 -mr-2 hover:bg-gray-100 rounded-full"
//                         >
//                             <ArrowRight className="w-5 h-5 text-gray-600" />
//                         </button>
                        
//                         <div className="relative">
//                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
//                                 {getContactInfo(selectedUserId)?.avatar}
//                             </div>
//                              {getContactInfo(selectedUserId)?.status === 'online' && (
//                                 <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
//                             )}
//                         </div>
                        
//                         <div>
//                             <h3 className="font-bold text-gray-900">{getContactInfo(selectedUserId)?.name}</h3>
//                             <p className="text-xs text-green-600">
//                                 {getContactInfo(selectedUserId)?.status === 'online' ? 'متصل الآن' : getContactInfo(selectedUserId)?.lastSeen}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3 text-gray-600">
//                         <button className="p-2 hover:bg-gray-100 rounded-full" title="اتصال صوتي"><Phone className="w-5 h-5" /></button>
//                         <button className="p-2 hover:bg-gray-100 rounded-full" title="مكالمة فيديو"><Video className="w-5 h-5" /></button>
//                         <button className="p-2 hover:bg-gray-100 rounded-full"><Search className="w-5 h-5" /></button>
//                     </div>
//                 </header>

//                 {/* Messages Area */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-0">
//                     {/* Date Divider Example */}
//                     <div className="flex justify-center my-4">
//                         <span className="bg-white/80 text-gray-600 text-xs px-3 py-1 rounded-lg shadow-sm">اليوم</span>
//                     </div>

//                     {getActiveChat()?.messages.map((msg) => {
//                         const isMe = msg.senderId === currentUser.id;
//                         return (
//                             <div 
//                                 key={msg.id} 
//                                 className={`flex ${isMe ? 'justify-start' : 'justify-end'}`} // In RTL: start is right, end is left. WAIT. 
//                                 // Let's simplify: Standard flex direction row in RTL starts from right.
//                                 // So justify-start puts items on Right. justify-end puts items on Left.
//                                 // In WhatsApp Arabic: Me is Left (End), Them is Right (Start).
//                             >
//                                 <div 
//                                     className={`relative max-w-[70%] sm:max-w-[60%] px-4 py-2 shadow-sm rounded-lg text-sm ${
//                                         isMe 
//                                         ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' // WhatsApp Green for Me
//                                         : 'bg-white text-gray-900 rounded-tl-none' // White for Them
//                                     }`}
//                                 >
//                                     <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    
//                                     <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'justify-end text-gray-500' : 'justify-end text-gray-400'}`}>
//                                         <span>{msg.time}</span>
//                                         {isMe && (
//                                             <span>
//                                                 {msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : 
//                                                  msg.status === 'delivered' ? <CheckCheck className="w-3 h-3 text-gray-400" /> : 
//                                                  <Check className="w-3 h-3 text-gray-400" />}
//                                             </span>
//                                         )}
//                                     </div>
                                    
//                                     {/* Tail SVG (Optional aesthetic touch) */}
//                                     <span className={`absolute top-0 w-3 h-3 ${isMe ? '-right-2' : '-left-2'}`}>
//                                        {/* SVG for tail can be added here */}
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                     <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input Area */}
//                 <footer className="bg-gray-100 px-4 py-3 z-10">
//                     <form onSubmit={handleSendMessage} className="flex items-end gap-2">
//                         <div className="flex items-center gap-2 pb-2 text-gray-500">
//                              <button type="button" className="hover:text-gray-700"><Smile className="w-6 h-6" /></button>
//                              <button type="button" className="hover:text-gray-700"><Paperclip className="w-6 h-6" /></button>
//                         </div>

//                         <div className="flex-1 bg-white rounded-xl flex items-center border border-gray-200 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden px-4 py-2">
//                             <input 
//                                 type="text" 
//                                 value={messageInput}
//                                 onChange={(e) => setMessageInput(e.target.value)}
//                                 placeholder="اكتب رسالة..."
//                                 className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
//                                 dir="rtl"
//                             />
//                         </div>

//                         <button 
//                             type="submit" 
//                             disabled={!messageInput.trim()}
//                             className={`p-3 rounded-full shadow-sm transition-all flex items-center justify-center ${
//                                 messageInput.trim() 
//                                 ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105' 
//                                 : 'bg-gray-200 text-gray-400 cursor-default'
//                             }`}
//                         >
//                             {messageInput.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
//                         </button>
//                     </form>
//                 </footer>
//             </>
//         ) : (
//             // Empty State
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#f0f2f5] border-b-[6px] border-green-500 h-full">
//                 <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
//                     <img src="/logo/logo.svg" alt="Clinica" className="w-32 h-32 opacity-50 grayscale" />
//                 </div>
//                 <h2 className="text-2xl font-light text-gray-700 mb-2">Clinica Web</h2>
//                 <p className="text-sm">أرسل واستقبل الرسائل من الأطباء والموظفين فوراً.</p>
//                 <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
//                      <LockIcon />
//                      رسائلك محمية ومشفرة داخل النظام
//                 </div>
//             </div>
//         )}
//       </main>
//     </div>
//   );
// }

// // Simple Lock Icon for empty state
// const LockIcon = () => (
//     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm6 10v8H6v-8h12zm-9-5V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z"/></svg>
// );