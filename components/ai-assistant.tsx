"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getAiStrategyAdvice, getMockStrategyAdvice } from "@/lib/openai"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<"api_key" | "quota" | "general" | "">("")
  const [usingMockResponse, setUsingMockResponse] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError("")
    setErrorType("")
    setUsingMockResponse(false)

    try {
      const advice = await getAiStrategyAdvice(prompt)

      // Check for specific error types
      if (advice.startsWith("QUOTA_EXCEEDED:")) {
        setError(advice.replace("QUOTA_EXCEEDED: ", ""))
        setErrorType("quota")
        setUsingMockResponse(true)
        // Use mock advice as fallback
        const mockAdvice = await getMockStrategyAdvice(prompt)
        setResponse(mockAdvice)
      } else if (advice.startsWith("API_KEY_ERROR:")) {
        setError(advice.replace("API_KEY_ERROR: ", ""))
        setErrorType("api_key")
        setUsingMockResponse(true)
        // Use mock advice as fallback
        const mockAdvice = await getMockStrategyAdvice(prompt)
        setResponse(mockAdvice)
      } else if (advice.startsWith("ERROR:")) {
        setError(advice.replace("ERROR: ", ""))
        setErrorType("general")
        setUsingMockResponse(true)
        // Use mock advice as fallback
        const mockAdvice = await getMockStrategyAdvice(prompt)
        setResponse(mockAdvice)
      } else {
        // Normal response
        setResponse(advice)
      }
    } catch (error) {
      console.error("Error getting AI advice:", error)
      setError("Error connecting to AI service. Using mock responses instead.")
      setErrorType("general")
      setUsingMockResponse(true)
      // Use mock advice as fallback
      const mockAdvice = await getMockStrategyAdvice(prompt)
      setResponse(mockAdvice)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-24 right-6 z-50 rounded-full w-12 h-12 p-0 bg-teal-500 hover:bg-teal-600 text-black shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot size={24} />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-black/90 border-teal-500/30 backdrop-blur-md shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center">
              <Bot className="mr-2 h-5 w-5 text-teal-500" />
              AI Strategy Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                className={`mb-4 ${
                  errorType === "quota"
                    ? "bg-yellow-900/20 border-yellow-800 text-yellow-400"
                    : errorType === "api_key"
                      ? "bg-red-900/20 border-red-800 text-red-400"
                      : "bg-gray-800 border-gray-700 text-gray-400"
                }`}
              >
                <AlertTitle>
                  {errorType === "quota" ? "API Quota Exceeded" : errorType === "api_key" ? "API Key Error" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  {error}
                  {errorType === "quota" && (
                    <div className="mt-2 text-xs">
                      Using mock strategy advice instead. The advice below is generated locally.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Describe market conditions or ask for strategy advice..."
                className="bg-gray-900/50 border-gray-700 text-white resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />

              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? "Thinking..." : "Get Advice"}
                {!isLoading && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {response && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded-md text-white text-sm max-h-60 overflow-y-auto">
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-teal-400">Strategy Recommendation:</h4>
                  {usingMockResponse && <span className="ml-2 text-xs text-yellow-500">(Mock Response)</span>}
                </div>
                <div className="whitespace-pre-line">{response}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
