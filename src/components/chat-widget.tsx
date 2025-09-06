"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { 
  MessageSquare, 
  Send, 
  Hash, 
  Users, 
  X, 
  Minimize2,
  Maximize2,
  Bell,
  Filter
} from "lucide-react"
import { cn } from "~/lib/utils"

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  channel: string
  isVeteran?: boolean
  reputation?: number
}

interface ChatWidgetProps {
  isPaid?: boolean
  currentCity?: string
}

// Demo messages - will be replaced with real data from Discourse
const demoMessages: Message[] = [
  {
    id: "1",
    user: "BangkokVet",
    content: "Just checked Soi Cowboy, it's packed tonight. Crazy Cats has some new talent 👀",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    channel: "bangkok",
    isVeteran: true,
    reputation: 89
  },
  {
    id: "2", 
    user: "NewbieJohn",
    content: "First time in Pattaya, any recommendations for tonight?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    channel: "pattaya",
    isVeteran: false,
    reputation: 2
  },
  {
    id: "3",
    user: "Stinger",
    content: "@NewbieJohn Check the map for Soi 6, good value there. Avoid Walking Street gogos if you're on budget",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    channel: "pattaya",
    isVeteran: true,
    reputation: 156
  },
  {
    id: "4",
    user: "AngelesExpert",
    content: "Envy just raised barfine to 5k PHP. Getting ridiculous",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    channel: "angeles",
    isVeteran: true,
    reputation: 78
  },
  {
    id: "5",
    user: "PattayaPaul",
    content: "Windmill has 2-for-1 drinks until 9pm",
    timestamp: new Date(Date.now() - 1000 * 30),
    channel: "pattaya",
    isVeteran: false,
    reputation: 34
  }
]

const channels = [
  { id: "all", name: "All Cities", count: 847 },
  { id: "pattaya", name: "Pattaya", count: 423 },
  { id: "bangkok", name: "Bangkok", count: 234 },
  { id: "angeles", name: "Angeles City", count: 156 },
  { id: "manila", name: "Manila", count: 34 }
]

export function ChatWidget({ isPaid = false, currentCity = "all" }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(currentCity)
  const [messages, setMessages] = useState(demoMessages)
  const [inputValue, setInputValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(3)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filter messages by channel
  const filteredMessages = selectedChannel === "all" 
    ? messages 
    : messages.filter(m => m.channel === selectedChannel)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [filteredMessages])

  // Clear unread when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    if (!isPaid) {
      // Show paywall for free users
      alert("Join MongerMaps Premium to participate in live chat")
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      content: inputValue,
      timestamp: new Date(),
      channel: selectedChannel === "all" ? "pattaya" : selectedChannel,
      isVeteran: false,
      reputation: 10
    }

    setMessages([...messages, newMessage])
    setInputValue("")
  }

  const formatTime = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 1000 / 60)
    if (mins < 1) return "now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg relative"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>
    )
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-xl">
          <div className="p-3 flex items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-semibold">Live Chat</span>
              <Badge variant="secondary" className="text-xs">
                {filteredMessages.length} messages
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Full chat interface
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[600px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-3 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-semibold">MongerMaps Live Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Channel selector */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {channels.map(channel => (
              <Button
                key={channel.id}
                size="sm"
                variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                className="text-xs whitespace-nowrap h-7"
                onClick={() => setSelectedChannel(channel.id)}
              >
                <Hash className="h-3 w-3 mr-1" />
                {channel.name}
                <Badge variant="outline" className="ml-1 text-xs h-4 px-1">
                  {channel.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {filteredMessages.map(message => (
              <div key={message.id} className="group">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {message.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{message.user}</span>
                      {message.isVeteran && (
                        <Badge variant="secondary" className="text-xs h-4 px-1">
                          Vet
                        </Badge>
                      )}
                      {message.reputation && message.reputation > 50 && (
                        <span className="text-xs text-muted-foreground">
                          ⭐ {message.reputation}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.channel !== selectedChannel && selectedChannel === "all" && (
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          #{message.channel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t">
          {isPaid ? (
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Join to participate in live chat
              </p>
              <Button size="sm" className="w-full">
                Unlock Chat Access
              </Button>
            </div>
          )}
        </div>

        {/* Active users indicator */}
        <div className="px-3 pb-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{channels.find(c => c.id === selectedChannel)?.count || 0} online</span>
          </div>
          <span>Powered by MongerMaps</span>
        </div>
      </Card>
    </div>
  )
}