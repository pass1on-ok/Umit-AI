import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Send, UserCircle, Search, Info, Loader2, ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const conversationList = [
  { patientId: 'p-4402', name: 'Sarah Jenkins', lastMessage: 'I am feeling better with the new breathing routine.', time: '11:00 AM' },
  { patientId: 'p-5511', name: 'Michael Lee', lastMessage: 'Will I need a follow-up test next week?', time: '9:45 AM' },
  { patientId: 'p-3328', name: 'Ayesha Patel', lastMessage: 'My fatigue is still high after therapy.', time: 'Yesterday' },
];

const getConversationMessages = (name: string) => [
  { id: 1, text: `Hi ${name}, I reviewed your latest report and your recent activity looks promising.`, sender: 'doctor', time: '10:15 AM' },
  { id: 2, text: 'Thanks doctor, I have been managing my anxiety with the breathing exercises.', sender: 'patient', time: '10:20 AM' },
  { id: 3, text: 'That is good progress. Keep tracking your sleep and fatigue levels.', sender: 'doctor', time: '10:30 AM' },
];

const Chat = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversationList;
    return conversationList.filter((conversation) =>
      conversation.name.toLowerCase().includes(term) ||
      conversation.patientId.toLowerCase().includes(term) ||
      conversation.lastMessage.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const selectedConversation = useMemo(
    () => conversationList.find((conversation) => conversation.patientId === patientId) || null,
    [patientId]
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      if (patientId && !selectedConversation) {
        setError('Conversation not found for this patient.');
      }
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [patientId, selectedConversation]);

  const messages = selectedConversation ? getConversationMessages(selectedConversation.name) : [];

  if (!patientId) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
     
        <Card className="shadow-custom border-border bg-card">
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <div className="mt-3">Loading conversations...</div>
            </div>
          ) : error ? (
            <div className="p-6">
              <Alert>
                <AlertTitle>Unable to load chat</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No conversations match your search.
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <Link
                    key={conversation.patientId}
                    to={`/chat/${conversation.patientId}`}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <UserCircle className="w-10 h-10 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{conversation.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto h-[80vh] flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link to="/chat">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat with {selectedConversation?.name ?? 'Patient'}</h1>
            <p className="text-sm text-muted-foreground">Discuss symptoms, treatment plans, and more.</p>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex md:flex-row overflow-hidden shadow-custom border-border bg-card border">
        <div className="w-80 border-r border-border bg-muted/30 hidden md:flex flex-col">
          <div className="p-4 border-b border-border bg-card">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.patientId}
                to={`/chat/${conversation.patientId}`}
                className={`block w-full p-4 border-b border-border hover:bg-muted transition-colors ${conversation.patientId === patientId ? 'bg-background' : ''}`}
              >
                <div className="flex gap-3 items-center">
                  <UserCircle className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{conversation.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-background relative">
          {isLoading ? (
            <div className="flex-1 flex flex-col justify-center items-center gap-3 p-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              Loading conversation...
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col justify-center items-center gap-3 p-12">
              <Alert>
                <AlertTitle>Unable to open chat</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Link to="/chat">
                <Button variant="outline">Back to conversations</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-border bg-card flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-bold text-foreground">{selectedConversation?.name ?? 'Patient Chat'}</p>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hidden lg:flex">
                  <Info className="w-4 h-4 mr-2" /> View Profile
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/10">
                <div className="text-center text-xs text-muted-foreground my-2 border-b border-border/50 pb-2">Today</div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] ${
                      msg.sender === 'patient'
                        ? 'self-end bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-xl rounded-bl-2xl'
                        : 'self-start bg-card border border-border text-card-foreground rounded-tl-xl rounded-tr-2xl rounded-br-2xl shadow-sm'
                    } p-3 px-4 flex flex-col`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1 text-right ${msg.sender === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-card border-t border-border">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setMessage('');
                  }}
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Compose a new message (demo mode)"
                    className="flex-1 px-4 py-2 border border-input rounded-full bg-background outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <Button type="submit" className="rounded-full px-6 gap-2" disabled={!message.trim()}>
                    Send <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Chat;
