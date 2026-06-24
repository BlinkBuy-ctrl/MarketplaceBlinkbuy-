export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  itemId: string;
  itemTitle: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Get all conversations for a user
export function getConversations(userId: string): Conversation[] {
  try {
    const stored = localStorage.getItem("marketplace_conversations");
    const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
    return conversations.filter(c => c.buyerId === userId || c.sellerId === userId);
  } catch {
    return [];
  }
}

// Save conversations to localStorage
function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem("marketplace_conversations", JSON.stringify(conversations));
  } catch (e) {
    console.error("Failed to save conversations:", e);
  }
}

// Get messages for a conversation
export function getMessages(conversationId: string): Message[] {
  try {
    const stored = localStorage.getItem("marketplace_messages");
    const messages: Message[] = stored ? JSON.parse(stored) : [];
    return messages.filter(m => m.conversationId === conversationId).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

// Save messages to localStorage
function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem("marketplace_messages", JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages:", e);
  }
}

// Send a message
export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  recipientId: string,
  recipientName: string,
  itemId: string,
  itemTitle: string,
  text: string
): Message {
  const message: Message = {
    id: Date.now().toString(),
    conversationId,
    senderId,
    senderName,
    recipientId,
    recipientName,
    itemId,
    itemTitle,
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const messages = getMessages(conversationId);
  messages.push(message);
  saveMessages(messages);

  // Update conversation
  const conversations = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  const convIndex = conversations.findIndex((c: Conversation) => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = text;
    conversations[convIndex].lastMessageTime = message.timestamp;
    if (recipientId !== senderId) {
      conversations[convIndex].unreadCount = (conversations[convIndex].unreadCount || 0) + 1;
    }
  }
  saveConversations(conversations);

  return message;
}

// Start or get a conversation
export function startConversation(
  buyerId: string,
  buyerName: string,
  sellerId: string,
  sellerName: string,
  itemId: string,
  itemTitle: string
): string {
  const conversations: Conversation[] = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  
  // Check if conversation already exists
  const existing = conversations.find(
    c => c.buyerId === buyerId && c.sellerId === sellerId && c.itemId === itemId
  );
  
  if (existing) {
    return existing.id;
  }

  // Create new conversation
  const newConversation: Conversation = {
    id: Date.now().toString(),
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    itemId,
    itemTitle,
    lastMessage: "",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  };

  conversations.push(newConversation);
  saveConversations(conversations);

  return newConversation.id;
}

// Mark messages as read
export function markAsRead(conversationId: string, userId: string): void {
  const messages = JSON.parse(localStorage.getItem("marketplace_messages") || "[]");
  messages.forEach((m: Message) => {
    if (m.conversationId === conversationId && m.recipientId === userId) {
      m.read = true;
    }
  });
  saveMessages(messages);

  // Update conversation unread count
  const conversations: Conversation[] = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
  }
  saveConversations(conversations);
}
