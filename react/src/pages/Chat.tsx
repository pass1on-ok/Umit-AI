import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, UserCircle, Search, Info } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages] = useState([
    { id: 1, text: t('chat.message1'), sender: 'doctor', time: '10:30 AM' },
    { id: 2, text: t('chat.message2'), sender: 'patient', time: '10:45 AM' },
    { id: 3, text: t('chat.message3'), sender: 'doctor', time: '11:00 AM' },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto h-[80vh] flex flex-col gap-4">
      
      <Card className="flex-1 flex md:flex-row overflow-hidden shadow-custom border-border bg-card border">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-muted/30 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border bg-card">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={t('chat.searchMessages')} 
                className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-border bg-primary/10 cursor-pointer flex gap-3 items-center">
              <UserCircle className="w-10 h-10 text-primary" />
              <div>
                <p className="font-semibold text-sm text-foreground">{t('chat.drEmily')}</p>
                <p className="text-xs text-muted-foreground truncate">{t('chat.makeSure')}</p>
              </div>
            </div>
            <div className="p-4 border-b border-border hover:bg-muted cursor-pointer flex gap-3 items-center opacity-70">
              <UserCircle className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm text-foreground">{t('chat.supportNurse')}</p>
                <p className="text-xs text-muted-foreground truncate">{t('chat.nextAppointment')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background relative">
          <div className="p-4 border-b border-border bg-card flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <UserCircle className="w-8 h-8 text-primary" />
              <div>
                <p className="font-bold text-foreground">{t('chat.drEmily')}</p>
                <p className="text-xs text-green-500">{t('chat.online')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="hidden lg:flex"><Info className="w-4 h-4 mr-2"/> {t('chat.viewProfile')}</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/10">
            <div className="text-center text-xs text-muted-foreground my-2 border-b border-border/50 pb-2">{t('chat.today')}</div>
            {messages.map(msg => (
              <div key={msg.id} className={`max-w-[70%] ${msg.sender === 'patient' ? 'self-end bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-xl rounded-bl-2xl' : 'self-start bg-card border border-border text-card-foreground rounded-tl-xl rounded-tr-2xl rounded-br-2xl shadow-sm'} p-3 px-4 flex flex-col`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-1 text-right ${msg.sender === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-card border-t border-border">
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
    </div>
  );
};

export default Chat;