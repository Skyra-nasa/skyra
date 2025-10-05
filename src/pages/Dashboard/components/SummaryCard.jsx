import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { MessageCircle, Send, Sparkles, Thermometer, CloudRain, Wind, Sun, Cloud } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { WheatherContext } from '@/shared/context/WhetherProvider'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function SummaryCard({
    riskLevel = 'low', // 'low', 'medium', 'high'
    weatherSummary = '',
    temperature = { high: 33, low: 19, avg: 78.9 },
    rainProb = 15,
    windSpeed = 12
}) {
    const [chatOpen, setChatOpen] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const { selectedData, weatherData } = useContext(WheatherContext);
    
    // Generate initial message component with weather overview
    const getInitialMessage = useCallback(() => {
        const activity = selectedData?.activity || 'outdoor activities';
        const location = selectedData?.location || 'your location';
        const date = selectedData?.date || 'today';
        
        const rainStatus = rainProb > 60 ? '⚠️ High' : rainProb > 30 ? '⚡ Moderate' : '✅ Low';
        const windStatus = windSpeed > 20 ? '⚠️ Strong' : windSpeed > 10 ? '⚡ Moderate' : '✅ Light';
        const riskIcon = riskLevel === 'high' ? '🔴' : riskLevel === 'medium' ? '🟡' : '🟢';
        
        return {
            activity,
            location,
            date,
            rainStatus,
            windStatus,
            riskIcon
        };
    }, [selectedData, rainProb, windSpeed, riskLevel]);

    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            isCard: true,
            data: getInitialMessage()
        }
    ]);
    const getRiskConfig = () => {
        switch (riskLevel) {
            case 'high':
                return {
                    bgGradient: 'from-red-500/10 via-orange-500/5 to-red-500/10',
                    borderGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
                    accentColor: 'text-red-400'
                }
            case 'medium':
                return {
                    bgGradient: 'from-yellow-500/10 via-orange-500/5 to-yellow-500/10',
                    borderGlow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
                    accentColor: 'text-yellow-400'
                }
            default:
                return {
                    bgGradient: 'from-cyan-500/10 via-blue-500/5 to-cyan-500/10',
                    borderGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
                    accentColor: 'text-cyan-400'
                }
        }
    }

    const config = getRiskConfig()

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input and refresh initial message when dialog opens
    useEffect(() => {
        if (chatOpen) {
            // Refresh the initial message with current data
            setMessages([
                { 
                    role: 'assistant', 
                    isCard: true,
                    data: getInitialMessage()
                }
            ]);
            
            if (inputRef.current) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    }, [chatOpen, getInitialMessage])


    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage;
        setInputMessage("");

        // Add user message
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);
        try {//https://nasa.almiraj.xyz
            let data = {
                user_message: userMessage,
                activity: selectedData?.activity || "",
                weather_values: { ...weatherData }

            }
            const response = await axios.post(`https://nasa.almiraj.xyz/chat`, data);
            const botReply = response.data.bot_reply || "Sorry, I couldn’t understand that.";
            console.log("data", data)
            // Add assistant reply
            setMessages(prev => [...prev, { role: "assistant", text: botReply }]);

        } catch (error) {
            console.error("Chatbot API Error:", error);
            setMessages(prev => [...prev, { role: "assistant", text: "Error: Could not connect to AI assistant." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border-2 border-border/50 transition-all duration-500 hover:border-border/70 ${config.borderGlow} p-8`}>

                {/* Background gradient - only visible on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Header Section */}
                <div className="mb-6 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Sun className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Today's Highlights
                        </h2>
                    </div>
                    <div className={`text-xl sm:text-2xl font-normal leading-relaxed text-foreground group-hover:${config.accentColor} transition-colors duration-500 summary-markdown`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {weatherSummary || `Weather Today will be warmer with a high of ${temperature.high}°C and a low of ${temperature.low}°C. Tomorrow, the expected temperature will be around ${temperature.tomorrow}°C.`}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Weather Stats Icons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20">
                            <Thermometer className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">High</p>
                            <p className="text-lg font-semibold text-foreground">{temperature.high}°C</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                            <Thermometer className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Low</p>
                            <p className="text-lg font-semibold text-foreground">{temperature.low}°C</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20">
                            <CloudRain className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Rain</p>
                            <p className="text-lg font-semibold text-foreground">{rainProb}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20">
                            <Wind className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Wind</p>
                            <p className="text-lg font-semibold text-foreground">{windSpeed} mph</p>
                        </div>
                    </div>
                </div>

                {/* Chatbot Button */}
                <div className="mt-6 relative z-10 flex justify-center">
                    <RainbowButton
                        onClick={() => setChatOpen(true)}
                        variant="outline"
                        size="lg"
                        className="flex h-14 w-auto px-16 md:px-60 text-[15px] font-bold tracking-wide rounded-xl text-foreground"
                    >
                        <Sparkles className="w-5 h-5" />
                        Ask About the Weather
                    </RainbowButton>
                </div>
            </div>

            {/* Enhanced Chatbot Dialog */}
            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-2xl">
                    <DialogHeader className="border-b border-border/30 pb-4">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/20">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                Weather Analysis Assistant
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2 ml-[52px] text-sm">
                            Ask me anything about your weather analysis and recommendations
                        </DialogDescription>
                    </DialogHeader>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[350px] max-h-[450px] thin-scrollbar pr-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeInUp_.3s_ease_forwards]`}
                            >
                                {msg.isCard ? (
                                    <div className="w-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6 space-y-6">
                                        {/* Welcome Header */}
                                        <div className="flex items-center gap-2 border-b border-border/30 pb-4">
                                            <span className="text-2xl">👋</span>
                                            <h3 className="text-xl font-bold text-foreground">Weather Analysis Overview</h3>
                                        </div>

                                        {/* Selection Info Card */}
                                   

                                        {/* Weather Conditions Grid */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg">🌤️</span>
                                                <h4 className="font-semibold text-foreground">Weather Conditions</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* Temperature */}
                                                <div className="flex items-center gap-3 p-3 bg-card/40 rounded-xl border border-border/20 hover:border-border/40 transition-all">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-blue-500/20">
                                                        <Thermometer className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-muted-foreground">Temperature</p>
                                                        <p className="text-sm font-bold text-foreground">{temperature.low}°C - {temperature.high}°C</p>
                                                        <p className="text-xs text-muted-foreground">Avg: {temperature.avg}°C</p>
                                                    </div>
                                                </div>

                                                {/* Rain Probability */}
                                                <div className="flex items-center gap-3 p-3 bg-card/40 rounded-xl border border-border/20 hover:border-border/40 transition-all">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20">
                                                        <CloudRain className="w-5 h-5 text-cyan-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-muted-foreground">Rain Probability</p>
                                                        <p className="text-sm font-bold text-foreground">{rainProb}%</p>
                                                        <p className="text-xs text-muted-foreground">{msg.data.rainStatus}</p>
                                                    </div>
                                                </div>

                                                {/* Wind Speed */}
                                                <div className="flex items-center gap-3 p-3 bg-card/40 rounded-xl border border-border/20 hover:border-border/40 transition-all">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20">
                                                        <Wind className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-muted-foreground">Wind Speed</p>
                                                        <p className="text-sm font-bold text-foreground">{windSpeed} mph</p>
                                                        <p className="text-xs text-muted-foreground">{msg.data.windStatus}</p>
                                                    </div>
                                                </div>

                                                {/* Risk Level */}
                                                <div className="flex items-center gap-3 p-3 bg-card/40 rounded-xl border border-border/20 hover:border-border/40 transition-all">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/20">
                                                        <span className="text-2xl">{msg.data.riskIcon}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-muted-foreground">Risk Level</p>
                                                        <p className="text-sm font-bold text-foreground uppercase">{riskLevel}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Help Footer */}
                                        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                            <span className="text-lg mt-0.5">💬</span>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">Need help?</span> Ask me anything about the weather conditions, recommendations for your activity, or safety precautions!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                            : 'bg-card/60 backdrop-blur-sm border border-border/50 rounded-bl-sm'
                                            }`}
                                    >
                                        <div className="chat-markdown">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading Shimmer */}
                        {isLoading && (
                            <div className="flex justify-start animate-[fadeInUp_.3s_ease_forwards]">
                                <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-sm bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Enhanced Input */}
                    <div className="flex gap-3 pt-4 border-t border-border/30">
                        <Input
                            ref={inputRef}
                            placeholder="Type your question..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            disabled={isLoading}
                            className="flex-1 bg-card/60 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 h-12 text-base transition-all duration-300"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            className="bg-primary hover:bg-primary/90 px-6 h-12 shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SummaryCard
