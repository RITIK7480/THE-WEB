import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Play, Pause, RefreshCw, Smartphone, Eye, VolumeX, Volume2, ShieldCheck } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "elena" | "you";
  text: string;
  time: string;
  videoUrl?: string;
  isVideoStreaming?: boolean;
}

export default function MediaChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "elena",
      text: "Hey! I recorded the UX comparison demo for our direct streaming protocol vs standard WhatsApp downloading. Let me know what you think.",
      time: "10:42 AM",
    },
    {
      id: "2",
      sender: "elena",
      text: "Here is the direct streaming node test. Absolutely zero manual downloads needed on your side!",
      time: "10:43 AM",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-smartphone-with-a-blue-screen-40156-large.mp4",
      isVideoStreaming: true
    },
    {
      id: "3",
      sender: "you",
      text: "Wow, it plays instantly upon clicking play! No waiting for a download spinning indicator. This completely changes things.",
      time: "10:44 AM"
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "you",
      text: inputMessage,
      time: "10:45 AM",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate auto Elena reply after 2.5 seconds
    setTimeout(() => {
      const elenaReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "elena",
        text: "Exactly. The video packets chunk straight over continuous socket buffers instead of caching full static assets first. True streaming!",
        time: "10:46 AM",
      };
      setMessages((prev) => [...prev, elenaReply]);
    }, 1800);
  };

  const togglePlay = (msgId: string) => {
    setIsPlaying((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Add a trigger demo clip callback for the user to experience live upload
  const triggerDemoUpload = () => {
    const streamMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "you",
      text: "Simulating custom video capture & stream send...",
      time: "10:46 AM",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-bright-office-42289-large.mp4",
      isVideoStreaming: true
    };
    setMessages((prev) => [...prev, streamMsg]);
  };

  return (
    <div className="w-full flex flex-col bg-[#E5DDD5] h-full border-l border-slate-200" style={{ backgroundImage: "radial-gradient(circle, #e5ddd5 10%, #dfd5ca 90%)" }}>
      {/* Header bar styled like polished messaging header */}
      <div className="bg-[#f0f2f5] p-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-white font-mono font-bold tracking-tight shadow-inner">
              EV
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-100" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 font-sans tracking-tight">Elena Vance</h4>
            <p className="text-[10px] text-green-600 font-medium">Active streaming session</p>
          </div>
        </div>
        
        {/* Simulating high density badge indicator */}
        <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 px-2 py-1 rounded-md text-[10px] text-teal-800 font-mono font-bold">
          <Smartphone className="w-3 h-3" />
          No-Download Tech
        </div>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col min-h-[350px] max-h-[580px]">
        {messages.map((msg) => {
          const isYou = msg.sender === "you";
          return (
            <div key={msg.id} className={`flex flex-col max-w-[85%] ${isYou ? "self-end items-end" : "self-start items-start"}`}>
              <div
                className={`p-3.5 rounded-2xl shadow-sm relative ${
                  isYou
                    ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-150"
                }`}
              >
                {/* Instant Video Node Rendering */}
                {msg.videoUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/20 relative aspect-video group">
                    {/* Embedded interactive video playback */}
                    <video
                      id={`vid-${msg.id}`}
                      className="w-full h-full object-cover"
                      src={msg.videoUrl}
                      muted={isMuted}
                      loop
                      playsInline
                    />

                    {/* Media HUD Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-2.5 transition opacity-90 group-hover:opacity-100">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono font-bold text-[9px]">
                          INSTANT STREAM
                        </span>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1 rounded-full bg-black/50 hover:bg-black/80 text-white transition pointer-events-auto"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Giant Central Play toggle */}
                      <button
                        onClick={() => {
                          const vEl = document.getElementById(`vid-${msg.id}`) as HTMLVideoElement;
                          if (vEl) {
                            if (isPlaying[msg.id]) {
                              vEl.pause();
                            } else {
                              vEl.play().catch(err => console.log('Video trigger latency check:', err));
                            }
                            togglePlay(msg.id);
                          }
                        }}
                        className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/20 self-center flex items-center justify-center hover:scale-105 active:scale-95 transition text-white"
                      >
                        {isPlaying[msg.id] ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>

                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-400" /> Auto-buffer active
                        </span>
                        <span>0:45</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs md:text-sm text-slate-800 leading-relaxed">{msg.text}</p>
                <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-mono">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Quick live simulator panel action */}
      <div className="bg-slate-50/90 px-3.5 py-2 border-t border-slate-200 flex items-center justify-between gap-1.5 text-xs text-slate-600 font-mono">
        <span className="flex items-center gap-1 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Prototype direct webRTC streams
        </span>
        <button
          onClick={triggerDemoUpload}
          className="text-[10px] font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-md px-2 py-1 flex items-center gap-1 pointer-events-auto cursor-pointer transition active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
          Simulate Stream upload
        </button>
      </div>

      {/* Input panel below messaging */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#f0f2f5] border-t border-slate-200/80 flex items-center gap-2">
        <button type="button" className="p-1 px-1.5 text-slate-500 hover:text-teal-600 transition">
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type feedback response..."
          className="flex-1 bg-white h-9 px-4 rounded-full text-xs md:text-sm outline-none border border-slate-200 focus:border-teal-500 focus:ring-0 transition shadow-inner text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 mr-1 rounded-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white transition-all shadow active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
