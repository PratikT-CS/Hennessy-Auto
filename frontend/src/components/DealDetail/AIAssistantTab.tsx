import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistantTab = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant for analyzing vehicle deals. I can help you understand what's missing, validate requirements, or answer questions about the extracted data. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "What's missing in this deal?",
    "Which documents are incomplete?",
    "Show me customer name and sale price",
    "Is the title properly signed?",
    "What's the validation score breakdown?"
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantResponse: ChatMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: getAIResponse(message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('missing')) {
      return "Based on my analysis of Deal #149331, here are the missing items:\n\n• **Title signature** - The title document lacks the required signature\n• **Insurance verification** - No insurance documentation has been uploaded\n• **MV-9W form** - Required for veteran exemption (if applicable)\n\nThese items need to be addressed to complete the deal validation.";
    }
    
    if (lowerQuestion.includes('incomplete') || lowerQuestion.includes('documents')) {
      return "The following documents have issues:\n\n• **mv1.pdf** - Missing signature (Tag & Title Pack)\n• **Insurance docs** - Not yet uploaded\n\nAll other documents in the Trade Pack and Compliance sections are properly completed.";
    }
    
    if (lowerQuestion.includes('customer') || lowerQuestion.includes('sale price')) {
      return "Here's the key deal information:\n\n• **Customer Name:** Jane Doe\n• **Sale Price:** $24,500\n• **VIN:** 1HGCM82633A123456\n• **Vehicle:** 2018 Honda Civic\n• **Odometer:** 34,100 miles\n\nThis data was extracted from the bill of sale and title documents.";
    }
    
    if (lowerQuestion.includes('title') && lowerQuestion.includes('sign')) {
      return "❌ **Title Signature Issue**\n\nThe title document (title.pdf) is missing the required signature. This is currently preventing the deal from being fully validated. The signature is needed to complete the ownership transfer process.";
    }
    
    if (lowerQuestion.includes('validation') || lowerQuestion.includes('score')) {
      return "**Validation Score Breakdown (75%)**\n\n✅ **Passing (6 items):**\n• MV-1 form present\n• POA for lien valid\n• Bill of Sale signed\n• Odometer disclosure complete\n• GA TAVT calculation correct\n\n❌ **Failing (1 item):**\n• Title signature missing (-15 points)\n\n⚠️ **Warnings (1 item):**\n• MV-9W not claimed (-10 points)";
    }

    return "I understand your question about the vehicle deal. Based on the current documentation for Deal #149331, I can help you with specific validation requirements, missing documents, or extracted data analysis. Could you be more specific about what aspect you'd like me to focus on?";
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          🤖 Powered by Claude AI
        </Badge>
      </div>

      {/* Quick Questions */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900">Quick Questions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(question)}
                className="text-blue-700 border-blue-300 hover:bg-blue-100 text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="border border-gray-200 h-96 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about this deal..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
