"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getAiStrategyAdvice(marketCondition: string, currentStrategy?: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        As an algorithmic trading expert, provide advice for a trading strategy based on the following market conditions:
        ${marketCondition}
        
        ${currentStrategy ? `The current strategy is: ${currentStrategy}` : ""}
        
        Provide specific recommendations for indicators, entry/exit conditions, and risk management parameters.
        Format your response in a clear, concise manner that can be easily understood by traders.
      `,
      system:
        "You are an expert algorithmic trading assistant for AlgoSensei, a no-code trading strategy builder platform. Provide professional, accurate, and actionable trading strategy advice.",
    })

    return text
  } catch (error) {
    console.error("Error getting AI strategy advice:", error)
    return "Unable to generate strategy advice at this time. Please try again later."
  }
}

export async function analyzeBacktestResults(results: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following backtest results and provide insights and optimization suggestions:
        ${results}
        
        Include analysis of:
        1. Overall performance metrics
        2. Risk-adjusted returns
        3. Potential weaknesses in the strategy
        4. Specific optimization suggestions
      `,
      system:
        "You are an expert algorithmic trading assistant for AlgoSensei. Provide professional, data-driven analysis of backtest results with actionable optimization suggestions.",
    })

    return text
  } catch (error) {
    console.error("Error analyzing backtest results:", error)
    return "Unable to analyze backtest results at this time. Please try again later."
  }
}
