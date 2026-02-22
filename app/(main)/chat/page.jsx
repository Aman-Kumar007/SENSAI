"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "@/actions/chat"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your **SensAi**. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollAnchorRef = useRef(null);

  // Robust scrolling logic
  const scrollToBottom = () => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage]);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "⚠️ **Connection Error**: I'm having trouble reaching the servers. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto p-4 overflow-hidden">
      <div className="flex-1 min-h-0 border rounded-2xl bg-linear-to-b from-card to-background flex flex-col shadow-xl">
        <div className="p-4 border-b bg-secondary/20 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Bot className="text-primary" size={20} />
            </div>
            <div>
                <h2 className="font-semibold text-sm">SensAi</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Professional Advisor
                </p>
            </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 md:p-6 space-y-6">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                    msg.role === "user" ? "bg-primary border-primary" : "bg-background border-border"
                  }`}>
                    {msg.role === "user" ? <User size={14} className="text-primary-foreground" /> : <Bot size={14} />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none border border-border/50"
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-words">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shadow-sm">
                    <Loader2 size={14} className="animate-spin text-primary" />
                </div>
                <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none border border-border/50">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
              </div>
            )}
            <div ref={scrollAnchorRef} className="h-1" />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 bg-background border-t flex gap-2 items-center shrink-0">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-full shadow-lg transition-transform hover:scale-105">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}