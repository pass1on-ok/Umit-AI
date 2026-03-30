import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, UserCircle, Search, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { createSocket } from '@/services/socket';
import { getMessages, sendMessage, type MessageRecord } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const socketRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('connecting');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const patientId = user?.role === 'patient' ? user.id : 'default-patient';
  const token = typeof window !== 'undefined' ? localStorage.getItem('umetaiToken') : null;

  interface Conversation {
    id: string;
    title: string;
    subtitle: string;
    patientId: string;
    online: boolean;
  }

  const conversations = useMemo<Conversation[]>(
    () => [
      {
        id: 'dr-emily',
        title: t('chat.drEmily'),
        subtitle: t('chat.makeSure'),
        patientId,
        online: true,
      },
      {
        id: 'support-nurse',
        title: t('chat.supportNurse'),
        subtitle: t('chat.nextAppointment'),
        patientId,
        online: false,
      },
    ],
    [t, patientId]
  );

  const [activeConversationId, setActiveConversationId] = useState<string>(conversations[0]?.id ?? '');

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];
  const currentPatientId = activeConversation?.patientId ?? patientId;

  const filteredMessages = useMemo(
    () => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return messages;
      }
      return messages.filter((msg) => msg.text.toLowerCase().includes(query));
    },
    [messages, searchQuery]
  );

  const handleConversationClick = (id: string) => {
    setActiveConversationId(id);
    setSearchQuery('');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const history = await getMessages(currentPatientId);
        setMessages(history);
      } catch (err) {
        setError((err as Error).message || 'Unable to load conversation.');
      } finally {
        setIsLoading(false);
      }
    };

    const socket = createSocket(token || undefined);
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      socket.emit('join-room', { patientId: currentPatientId });
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setStatus('disconnected');
    });

    socket.on('message', (incoming: MessageRecord) => {
      setMessages((prev) => [...prev, incoming]);
      socket.emit('read', { patientId: currentPatientId });
    });

    socket.on('typing', ({ typing }: { typing: boolean }) => {
      setIsOtherTyping(typing);
    });

    socket.connect();
    fetchHistory();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('message');
      socket.off('typing');
      socket.disconnect();
    };
  }, [currentPatientId, token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    const outgoing: MessageRecord = {
      id: `local-${Date.now()}`,
      sender: 'patient',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages((prev) => [...prev, outgoing]);
    setMessage('');

    try {
      await sendMessage(currentPatientId, trimmed);
      socketRef.current?.emit('message', { patientId: currentPatientId, text: trimmed });
    } catch (err) {
      setError((err as Error).message || 'Unable to send message.');
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    socketRef.current?.emit('typing', { patientId: currentPatientId, typing: Boolean(value) });
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[80vh] flex flex-col gap-4 px-4">
      {error ? <ErrorMessage message={error} onDismiss={() => setError(null)} /> : null}
      {isLoading ? (
        <LoadingSpinner text="Loading chat history..." variant="page" />
      ) : (
        <Card className="flex-1 flex md:flex-row overflow-hidden shadow-custom border-border bg-card border">
          <div className="w-80 border-r border-border bg-muted/30 flex flex-col hidden md:flex">
            <div className="p-4 border-b border-border bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('chat.searchMessages')}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`p-4 border-b border-border cursor-pointer flex gap-3 items-center transition ${isActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                  >
                    <UserCircle className={`w-10 h-10 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{conversation.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{conversation.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-background relative">
            <div className="p-4 border-b border-border bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <UserCircle className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-foreground">{t('chat.drEmily')}</p>
                  <p className={`text-xs ${status === 'connected' ? 'text-green-500' : 'text-destructive'}`}>
                    {status === 'connected' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{status}</span>
                {isOtherTyping ? <span className="text-xs text-muted-foreground">Typing...</span> : null}
                <Button variant="ghost" size="sm" className="hidden lg:flex"><Info className="w-4 h-4 mr-2" /> {t('chat.viewProfile')}</Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/10">
              <div className="text-center text-xs text-muted-foreground my-2 border-b border-border/50 pb-2">{t('chat.today')}</div>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className={`max-w-[70%] ${msg.sender === 'patient' ? 'self-end bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-xl rounded-bl-2xl' : 'self-start bg-card border border-border text-card-foreground rounded-tl-xl rounded-tr-2xl rounded-br-2xl shadow-sm'} p-3 px-4 flex flex-col`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1 text-right ${msg.sender === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">{t('chat.noMessagesFound') ?? 'No messages found.'}</div>
              )}
            </div>

            <div className="p-4 bg-card border-t border-border">
              <form className="flex gap-2" onSubmit={handleSend}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder={t('chat.typeMessage')}
                  className="flex-1 px-4 py-2 border border-input rounded-full bg-background outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <Button type="submit" className="rounded-full px-6 gap-2">
                  {t('chat.send')} <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Chat;
