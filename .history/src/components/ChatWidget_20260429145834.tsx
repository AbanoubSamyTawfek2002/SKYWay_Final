import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error(
          "OpenRouter API Key is missing in environment variables.",
        );
      }

      // الداتا الشاملة للموقع
      const websiteData = {
        flights: [
          {
            id: "F1",
            destination: "Sharm El Sheikh",
            airline: "Emirates",
            price: "4,811 EGP",
            flightType: "1 Transit",
            duration: "3H 30M",
          },
          {
            id: "F2",
            destination: "Cairo",
            airline: "Turkish Airlines",
            price: "1,205 EGP",
            flightType: "1 Transit",
            duration: "1H 10M",
          },
          {
            id: "F3",
            destination: "Paris",
            airline: "Various",
            price: "3,509 EGP",
            flightType: "Direct",
            duration: "3H 0M",
          },
          {
            id: "F4",
            destination: "Istanbul",
            airline: "Lufthansa",
            price: "5,873 EGP",
            flightType: "1 Transit",
            duration: "8H 0M",
          },
          {
            id: "F5",
            destination: "Aswan",
            airline: "Emirates",
            price: "4,056 EGP",
            flightType: "Direct",
            duration: "6H 20M",
          },
          {
            id: "F6",
            destination: "Dubai",
            airline: "Turkish Airlines",
            price: "7,424 EGP",
            flightType: "1 Transit",
            duration: "8H 30M",
          },
          {
            id: "F7",
            destination: "London",
            airline: "EgyptAir",
            price: "20,125 EGP",
            flightType: "Direct",
            duration: "7H 10M",
          },
          {
            id: "F8",
            destination: "Luxor",
            airline: "EgyptAir",
            price: "10,669 EGP",
            flightType: "1 Transit",
            duration: "2H 0M",
          },
          {
            id: "F9",
            destination: "Istanbul",
            airline: "Lufthansa",
            price: "1,840 EGP",
            flightType: "Direct",
            duration: "2H 10M",
          },
        ],
        cars: [
          {
            id: "C1",
            name: "Mercedes-Benz S-Class",
            type: "Luxury",
            provider: "Europcar",
            seats: 5,
            pricePerDay: "12,500 EGP",
          },
          {
            id: "C2",
            name: "BMW 7 Series",
            type: "Luxury",
            provider: "Sixt",
            seats: 5,
            pricePerDay: "11,500 EGP",
          },
          {
            id: "C3",
            name: "Audi Q8",
            type: "SUV",
            provider: "Budget",
            seats: 5,
            pricePerDay: "9,000 EGP",
          },
          {
            id: "C4",
            name: "Toyota Camry",
            type: "Sedan",
            provider: "Avis",
            seats: 5,
            pricePerDay: "3,000 EGP",
          },
          {
            id: "C5",
            name: "Honda Civic",
            type: "Economy",
            provider: "Enterprise",
            seats: 5,
            pricePerDay: "2,250 EGP",
          },
          {
            id: "C6",
            name: "Porsche 911",
            type: "Convertible",
            provider: "Europcar",
            seats: 2,
            pricePerDay: "22,500 EGP",
          },
          {
            id: "C7",
            name: "Tesla Model 3",
            type: "Sedan",
            provider: "Enterprise",
            seats: 5,
            pricePerDay: "5,500 EGP",
          },
          {
            id: "C8",
            name: "Range Rover Vogue",
            type: "SUV",
            provider: "Enterprise",
            seats: 5,
            pricePerDay: "14,000 EGP",
          },
          {
            id: "C9",
            name: "Volkswagen Golf",
            type: "Economy",
            provider: "Budget",
            seats: 5,
            pricePerDay: "2,500 EGP",
          },
          {
            id: "C10",
            name: "Mercedes-Benz G-Class",
            type: "SUV",
            provider: "Europcar",
            seats: 5,
            pricePerDay: "17,500 EGP",
          },
        ],
        hotels: [
          {
            id: "H1",
            name: "Burj Al Arab",
            location: "Dubai, UAE",
            rating: 4.3,
            pricePerNight: "17,250 EGP",
          },
          {
            id: "H2",
            name: "The Savoy Elite",
            location: "London, UK",
            rating: 4.4,
            pricePerNight: "31,338 EGP",
          },
          {
            id: "H3",
            name: "Le Meurice",
            location: "Paris, France",
            rating: 4.0,
            pricePerNight: "28,175 EGP",
          },
          {
            id: "H4",
            name: "Aman Tokyo",
            location: "Tokyo, Japan",
            rating: 4.4,
            pricePerNight: "28,175 EGP",
          },
          {
            id: "H5",
            name: "The Plaza",
            location: "New York, USA",
            rating: 4.0,
            pricePerNight: "32,775 EGP",
          },
          {
            id: "H6",
            name: "Marriott Mena House",
            location: "Cairo, Egypt",
            rating: 4.2,
            pricePerNight: "7,763 EGP",
          },
          {
            id: "H7",
            name: "Raffles Singapore",
            location: "Singapore, Singapore",
            rating: 4.0,
            pricePerNight: "28,463 EGP",
          },
          {
            id: "H8",
            name: "Hotel De Russie",
            location: "Rome, Italy",
            rating: 4.5,
            pricePerNight: "28,463 EGP",
          },
          {
            id: "H9",
            name: "Beverly Hills Hotel",
            location: "Los Angeles, USA",
            rating: 4.3,
            pricePerNight: "33,063 EGP",
          },
          {
            id: "H10",
            name: "The Ritz, Paris",
            location: "Paris, France",
            rating: 4.7,
            pricePerNight: "28,750 EGP",
          },
          {
            id: "H11",
            name: "Park Hyatt Sydney",
            location: "Sydney, Australia",
            rating: 4.3,
            pricePerNight: "28,750 EGP",
          },
          {
            id: "H12",
            name: "Four Seasons Kyoto",
            location: "Kyoto, Japan",
            rating: 4.8,
            pricePerNight: "31,050 EGP",
          },
          {
            id: "H13",
            name: "Waldorf Astoria",
            location: "Amsterdam, Netherlands",
            rating: 4.7,
            pricePerNight: "31,050 EGP",
          },
          {
            id: "H14",
            name: "The St. Regis",
            location: "New York, USA",
            rating: 4.8,
            pricePerNight: "35,650 EGP",
          },
        ],
      };

      // تحويل الداتا لنص مقروء جداً للذكاء الاصطناعي بدلاً من JSON
      const readableData = `
      Available Flights:
      ${websiteData.flights.map((f) => `- ${f.destination} via ${f.airline}: ${f.price}`).join("\n")}
      
      Available Cars for Rent:
      ${websiteData.cars.map((c) => `- ${c.name} (${c.type}): ${c.pricePerDay} per day`).join("\n")}
      
      Available Hotels:
      ${websiteData.hotels.map((h) => `- ${h.name} in ${h.location}: ${h.pricePerNight} per night`).join("\n")}
      `;

      const formattedMessages = [
        {
          role: "system",
          content: `You are the friendly and expert SkyWay Travel Concierge. 
          
          CRITICAL RULES:
          1. Be conversational, polite, and NEVER return JSON, arrays, or code blocks. Speak like a normal human agent.
          2. You MUST ONLY use the flights, hotels, and cars from the "Available Website Data" provided below. NEVER invent places or prices.
          3. If the user asks for cars, list the available cars and their prices naturally using bullet points.
          4. Keep your responses structured, highly readable, and use suitable emojis (✈️, 🏨, 🚗).
          5. Always reply in the EXACT SAME LANGUAGE the user uses to speak to you.
          
          Available Website Data:
          ${readableData}`,
        },
        ...messages
          .filter(
            (m) =>
              m.text !==
              "Hello! I'm your SkyWay concierge. How can I help you today?",
          )
          .map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        { role: "user", content: userMessage },
      ];

      // تغيير الموديل لـ Llama 3 (ممتاز جداً في المحادثات ومش بيخرف في الـ JSON)
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "SkyWay Assistant",
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: formattedMessages,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      let botReply = data.choices[0].message.content;

      // سطر حماية قوي: لو الموديل بعت JSON بالغلط، هنستخرج النص منه
      try {
        if (botReply.trim().startsWith("[") && botReply.trim().endsWith("]")) {
          const parsed = JSON.parse(botReply);
          if (Array.isArray(parsed) && parsed[0]?.text) {
            botReply = parsed.map((p: any) => p.text).join("\n");
          }
        }
      } catch (e) {
        // لو مش JSON نتجاهل الخطأ ونعرض النص زي ما هو
      }

      // تنظيف إضافي لأي أقواس متبقية
      botReply = botReply
        .replace(/\[\{"type":"text","text":"/g, "")
        .replace(/"\}\]/g, "")
        .replace(/\\n/g, "\n");

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      console.error("OpenRouter Error:", err);
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
