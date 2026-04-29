import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your SkyWay concierge. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gemini Initialization
  const ai = React.useMemo(() => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) return null;

      return new GoogleGenerativeAI(apiKey);
    } catch (e) {
      console.error("Failed to initialize Gemini AI:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !ai) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setIsTyping(true);

    try {
      const formattedHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const firstUserIndex = formattedHistory.findIndex(
        (h) => h.role === "user",
      );
      const validHistory =
        firstUserIndex >= 0 ? formattedHistory.slice(firstUserIndex) : [];
      validHistory.push({ role: "user", parts: [{ text: userMessage }] });

      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble thinking right now. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 h-96 flex flex-col shadow-2xl border-primary/20">
              <div className="p-4 border-bottom bg-primary text-primary-foreground flex justify-between items-center rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-semibold">SkyWay Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <X size={18} />
                </Button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-2 text-sm animate-pulse">
                      ...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder={t("chat_placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="icon" onClick={handleSend}>
                  <Send size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>
    </div>
  );
};
