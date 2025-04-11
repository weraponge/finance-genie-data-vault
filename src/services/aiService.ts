
import { toast } from "sonner";

// This is a placeholder for real AI integration
// Would be connected to OpenAI, Perplexity, or other AI services through Supabase edge functions
export async function analyzeStocks(prompt: string, stocks: any[]): Promise<string> {
  try {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI responses based on prompt content
    if (prompt.toLowerCase().includes("compare")) {
      return generateComparisonAnalysis(stocks);
    } else if (prompt.toLowerCase().includes("recommend") || prompt.toLowerCase().includes("best")) {
      return generateRecommendationAnalysis(stocks);
    } else if (prompt.toLowerCase().includes("risk")) {
      return generateRiskAnalysis(stocks);
    } else if (prompt.toLowerCase().includes("dividend")) {
      return generateDividendAnalysis(stocks);
    } else {
      return generateGeneralAnalysis(stocks);
    }
  } catch (error) {
    console.error("Error analyzing stocks:", error);
    toast.error("Failed to analyze stocks. Please try again later.");
    return "I'm sorry, I couldn't complete the analysis at this time.";
  }
}

function generateComparisonAnalysis(stocks: any[]): string {
  if (stocks.length < 2) {
    return "I need at least two stocks to make a comparison.";
  }
  
  let response = "## Comparison Analysis\n\n";
  
  // Sort stocks by market cap (if available)
  const sortedStocks = [...stocks].sort((a, b) => {
    const aMarketCap = a.attributes.find((attr: any) => attr.label === "Market Cap")?.value || 0;
    const bMarketCap = b.attributes.find((attr: any) => attr.label === "Market Cap")?.value || 0;
    return Number(bMarketCap) - Number(aMarketCap);
  });
  
  response += "### Market Cap Comparison\n";
  sortedStocks.forEach(stock => {
    const marketCap = stock.attributes.find((attr: any) => attr.label === "Market Cap")?.value;
    if (marketCap) {
      const formattedMarketCap = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(Number(marketCap));
      response += `- ${stock.symbol} (${stock.name}): ${formattedMarketCap}\n`;
    }
  });
  
  response += "\n### Performance Comparison\n";
  sortedStocks.forEach(stock => {
    response += `- ${stock.symbol}: ${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}% (${stock.change >= 0 ? "+" : ""}$${stock.change.toFixed(2)})\n`;
  });
  
  response += "\n### Valuation Metrics\n";
  sortedStocks.forEach(stock => {
    const pe = stock.attributes.find((attr: any) => attr.label === "P/E Ratio")?.value;
    response += `- ${stock.symbol} P/E Ratio: ${pe ? pe.toFixed(2) : "N/A"}\n`;
  });
  
  return response;
}

function generateRecommendationAnalysis(stocks: any[]): string {
  if (stocks.length === 0) {
    return "I need stock data to make recommendations.";
  }
  
  let response = "## Investment Recommendations\n\n";
  
  // Simplistic scoring based on P/E ratio and recent performance
  const scoredStocks = stocks.map(stock => {
    const pe = stock.attributes.find((attr: any) => attr.label === "P/E Ratio")?.value || 30;
    // Lower P/E is generally better, recent positive performance is good
    const peScore = Math.max(0, 40 - pe) / 30;
    const performanceScore = (stock.changePercent + 5) / 10;
    const totalScore = (peScore * 0.6) + (performanceScore * 0.4);
    
    return {
      ...stock,
      score: totalScore
    };
  });
  
  // Sort by score
  scoredStocks.sort((a, b) => b.score - a.score);
  
  response += "Based on current metrics and recent performance, here are my recommendations:\n\n";
  
  if (scoredStocks.length > 0) {
    const topStock = scoredStocks[0];
    response += `### Top Pick: ${topStock.symbol} (${topStock.name})\n`;
    response += `Current Price: $${topStock.price.toFixed(2)}\n`;
    response += `Recent Performance: ${topStock.changePercent >= 0 ? "+" : ""}${topStock.changePercent.toFixed(2)}%\n`;
    
    const pe = topStock.attributes.find((attr: any) => attr.label === "P/E Ratio")?.value;
    if (pe) {
      response += `P/E Ratio: ${pe.toFixed(2)}\n`;
    }
    
    response += "\n";
  }
  
  if (scoredStocks.length > 1) {
    response += "### Other Recommendations\n";
    
    for (let i = 1; i < Math.min(3, scoredStocks.length); i++) {
      const stock = scoredStocks[i];
      response += `- ${stock.symbol} (${stock.name}): $${stock.price.toFixed(2)}, ${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%\n`;
    }
  }
  
  response += "\n### Disclaimer\n";
  response += "These recommendations are based on simplified metrics and recent performance. Always conduct thorough research and consider consulting a financial advisor before making investment decisions.";
  
  return response;
}

function generateRiskAnalysis(stocks: any[]): string {
  if (stocks.length === 0) {
    return "I need stock data to analyze risk.";
  }
  
  let response = "## Risk Analysis\n\n";
  
  // Group stocks by risk level based on beta (if available)
  const highRisk: any[] = [];
  const mediumRisk: any[] = [];
  const lowRisk: any[] = [];
  
  stocks.forEach(stock => {
    const beta = stock.attributes.find((attr: any) => attr.label === "Beta")?.value;
    
    if (beta === undefined) {
      // If beta not available, use price volatility as a proxy
      if (Math.abs(stock.changePercent) > 2) {
        highRisk.push(stock);
      } else if (Math.abs(stock.changePercent) > 1) {
        mediumRisk.push(stock);
      } else {
        lowRisk.push(stock);
      }
    } else {
      // Categorize based on beta
      if (beta > 1.3) {
        highRisk.push(stock);
      } else if (beta > 0.8) {
        mediumRisk.push(stock);
      } else {
        lowRisk.push(stock);
      }
    }
  });
  
  response += "### High Risk Stocks\n";
  if (highRisk.length > 0) {
    highRisk.forEach(stock => {
      const beta = stock.attributes.find((attr: any) => attr.label === "Beta")?.value;
      response += `- ${stock.symbol} (${stock.name}): ${beta ? `Beta ${beta.toFixed(2)}` : `Volatility ${Math.abs(stock.changePercent).toFixed(2)}%`}\n`;
    });
  } else {
    response += "No high risk stocks identified.\n";
  }
  
  response += "\n### Medium Risk Stocks\n";
  if (mediumRisk.length > 0) {
    mediumRisk.forEach(stock => {
      const beta = stock.attributes.find((attr: any) => attr.label === "Beta")?.value;
      response += `- ${stock.symbol} (${stock.name}): ${beta ? `Beta ${beta.toFixed(2)}` : `Volatility ${Math.abs(stock.changePercent).toFixed(2)}%`}\n`;
    });
  } else {
    response += "No medium risk stocks identified.\n";
  }
  
  response += "\n### Low Risk Stocks\n";
  if (lowRisk.length > 0) {
    lowRisk.forEach(stock => {
      const beta = stock.attributes.find((attr: any) => attr.label === "Beta")?.value;
      response += `- ${stock.symbol} (${stock.name}): ${beta ? `Beta ${beta.toFixed(2)}` : `Volatility ${Math.abs(stock.changePercent).toFixed(2)}%`}\n`;
    });
  } else {
    response += "No low risk stocks identified.\n";
  }
  
  return response;
}

function generateDividendAnalysis(stocks: any[]): string {
  if (stocks.length === 0) {
    return "I need stock data to analyze dividends.";
  }
  
  let response = "## Dividend Analysis\n\n";
  
  // Sort stocks by dividend yield (if available)
  const stocksWithDividends = stocks.filter(stock => {
    const dividendYield = stock.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value;
    return dividendYield !== undefined && dividendYield > 0;
  });
  
  const stocksWithoutDividends = stocks.filter(stock => {
    const dividendYield = stock.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value;
    return dividendYield === undefined || dividendYield === 0;
  });
  
  stocksWithDividends.sort((a, b) => {
    const aYield = a.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value || 0;
    const bYield = b.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value || 0;
    return Number(bYield) - Number(aYield);
  });
  
  if (stocksWithDividends.length > 0) {
    response += "### Dividend-Paying Stocks\n";
    stocksWithDividends.forEach(stock => {
      const dividendYield = stock.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value;
      response += `- ${stock.symbol} (${stock.name}): Yield ${dividendYield.toFixed(2)}%\n`;
    });
  } else {
    response += "No dividend-paying stocks found in the analyzed set.\n";
  }
  
  if (stocksWithoutDividends.length > 0) {
    response += "\n### Non-Dividend Stocks\n";
    stocksWithoutDividends.forEach(stock => {
      response += `- ${stock.symbol} (${stock.name}): No dividend\n`;
    });
  }
  
  return response;
}

function generateGeneralAnalysis(stocks: any[]): string {
  if (stocks.length === 0) {
    return "I need stock data to provide analysis.";
  }
  
  let response = "## General Stock Analysis\n\n";
  
  if (stocks.length === 1) {
    // Single stock analysis
    const stock = stocks[0];
    response += `### ${stock.symbol} (${stock.name}) Analysis\n\n`;
    
    response += `Current Price: $${stock.price.toFixed(2)} (${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%)\n\n`;
    
    // Key metrics
    const pe = stock.attributes.find((attr: any) => attr.label === "P/E Ratio")?.value;
    const marketCap = stock.attributes.find((attr: any) => attr.label === "Market Cap")?.value;
    const dividendYield = stock.attributes.find((attr: any) => attr.label === "Dividend Yield")?.value;
    
    response += "#### Key Metrics\n";
    if (marketCap) {
      const formattedMarketCap = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(Number(marketCap));
      response += `- Market Cap: ${formattedMarketCap}\n`;
    }
    
    if (pe) {
      response += `- P/E Ratio: ${pe.toFixed(2)}\n`;
    }
    
    if (dividendYield !== undefined) {
      response += `- Dividend Yield: ${dividendYield.toFixed(2)}%\n`;
    }
    
    response += "\n#### Performance Summary\n";
    if (stock.changePercent >= 2) {
      response += "The stock is showing strong positive momentum in recent trading.\n";
    } else if (stock.changePercent >= 0.5) {
      response += "The stock is showing moderate positive performance recently.\n";
    } else if (stock.changePercent >= -0.5) {
      response += "The stock has been relatively stable in recent trading.\n";
    } else if (stock.changePercent >= -2) {
      response += "The stock has shown some weakness in recent trading.\n";
    } else {
      response += "The stock has shown significant weakness in recent trading.\n";
    }
    
  } else {
    // Multiple stocks analysis
    response += `Analyzed ${stocks.length} stocks:\n\n`;
    
    // Find best and worst performers
    const sortedByPerformance = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    const bestPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];
    
    response += "### Performance Overview\n";
    response += `- Best Performer: ${bestPerformer.symbol} (${bestPerformer.changePercent >= 0 ? "+" : ""}${bestPerformer.changePercent.toFixed(2)}%)\n`;
    response += `- Worst Performer: ${worstPerformer.symbol} (${worstPerformer.changePercent >= 0 ? "+" : ""}${worstPerformer.changePercent.toFixed(2)}%)\n\n`;
    
    // Average performance
    const avgPerformance = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;
    response += `Average Performance: ${avgPerformance >= 0 ? "+" : ""}${avgPerformance.toFixed(2)}%\n\n`;
    
    // Brief summary of each stock
    response += "### Individual Summaries\n";
    stocks.forEach(stock => {
      response += `- ${stock.symbol} (${stock.name}): $${stock.price.toFixed(2)}, ${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%\n`;
    });
  }
  
  return response;
}
