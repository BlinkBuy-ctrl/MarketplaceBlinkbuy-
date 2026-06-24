import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MessageCircle, ArrowLeft, Send, Clock } from "lucide-react";
import { getConversations, getMessages, sendMessage, markAsRead } from "@/lib/messages";
import type { Conversation, Message } from "@/lib/messages";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentUserId] = useState("user_" + Math.random().toString(36).substr(2, 9));
  const [currentUserName] = useState("You");

  // Load conversations on mount
  useEffect(() => {
    const convs = getConversations(currentUserId);
    setConversations(convs);
    if (convs.length > 0 && !selectedConvId) {
      setSelectedConvId(convs[0].id);
    }
  }, [currentUserId, selectedConvId]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConvId) {
      const msgs = getMessages(selectedConvId);
      setMessages(msgs);
      markAsRead(selectedConvId, currentUserId);
    }
  }, [selectedConvId, currentUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId) return;

    const conv = conversations.find(c => c.id === selectedConvId);
    if (!conv) return;

    const recipientId = conv.buyerId === currentUserId ? conv.sellerId : conv.buyerId;
    const recipientName = conv.buyerId === currentUserId ? conv.sellerName : conv.buyerName;

    sendMessage(
      selectedConvId,
      currentUserId,
      currentUserName,
      recipientId,
      recipientName,
      conv.itemId,
      conv.itemTitle,
      messageText
    );

    setMessageText("");
    const updatedMessages = getMessages(selectedConvId);
    setMessages(updatedMessages);

    // Refresh conversations
    const updatedConvs = getConversations(currentUserId);
    setConversations(updatedConvs);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 page-enter h-[calc(100vh-120px)] flex gap-4">
      {/* Conversations List */}
      <div className="w-full md:w-80 bg-card border border-pink-500/20 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-pink-500/10">
          <h2 className="font-black text-lg flex items-center gap-2">
            <MessageCircle size={20} className="text-pink-500" />
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Message a seller to get started</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-4 border-b border-pink-500/10 text-left transition-all hover:bg-pink-500/5 ${
                  selectedConvId === conv.id ? "bg-pink-500/10 border-l-2 border-l-pink-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm truncate">
                    {conv.buyerId === currentUserId ? conv.sellerName : conv.buyerName}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">{conv.itemTitle}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <Clock size={10} />
                  {new Date(conv.lastMessageTime).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="hidden md:flex flex-1 bg-card border border-pink-500/20 rounded-2xl overflow-hidden flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-pink-500/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  {selectedConversation.buyerId === currentUserId
                    ? selectedConversation.sellerName
                    : selectedConversation.buyerName}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedConversation.itemTitle}</p>
              </div>
              <Link
                href={`/marketplace/${selectedConversation.itemId}`}
                className="text-xs text-pink-500 hover:text-pink-600 font-semibold"
              >
                View Item
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-xl ${
                        msg.senderId === currentUserId
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === currentUserId ? "text-pink-100" : "text-muted-foreground"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-pink-500/10 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-pink-500/20 text-sm outline-none focus:border-pink-500 transition-all"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-sm flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
