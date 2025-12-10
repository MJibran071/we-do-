# AI API Configuration Guide

## Overview

The **WeDo AI Business Manager** platform uses a flexible AI model configuration system that allows users to configure multiple AI providers and their API keys. These configurations power all AI and automation features throughout the application.

---

## 🎯 How It Works

### 1. **Models & API Section** (`/models`)

This is the central hub where users configure AI providers and their API keys. The system supports:

#### **Supported AI Providers:**
- **Google Gemini** (Default)
- **OpenAI** (GPT-4, GPT-4o, etc.)
- **Anthropic** (Claude models)
- **DeepSeek** (DeepSeek R1, DeepSeek Chat, DeepSeek Coder)
- **xAI** (Grok models)
- **Meta** (Llama models)
- **Mistral** (Mistral Large, Medium, Small)
- **OpenRouter** (Aggregator for multiple providers)
- **Custom** (Any custom HTTP endpoint)

#### **What Users Can Configure:**
1. **Friendly Name**: A human-readable name for the model (e.g., "My Production GPT-4")
2. **Provider**: The AI provider (Google Gemini, OpenAI, etc.)
3. **Model ID**: The specific model identifier (e.g., `gpt-4-turbo`, `gemini-2.5-flash`, `claude-3-5-sonnet`)
4. **API Key**: The authentication key for the provider (stored securely)
5. **Endpoint URL**: For custom providers, the API endpoint URL

---

### 2. **Task Assignment System**

Once models are configured, users assign specific models to different AI tasks:

| Task Type | Description | Example Use Case |
|-----------|-------------|------------------|
| **Drafting & Reasoning** | Generates full message drafts and complex responses | Customer support replies, email drafts |
| **Fast Analysis & Tagging** | Sentiment analysis, priority classification | Auto-tagging incoming messages |
| **Quick Replies** | Generates instant smart reply suggestions | Quick response chips in inbox |
| **Image Generation** | Creates visual content for marketing | Social media posts, campaign visuals |

**Why This Matters:**
- **Cost Optimization**: Use cheaper/faster models for simple tasks, premium models for complex reasoning
- **Performance**: Route tasks to models optimized for specific capabilities
- **Flexibility**: Switch providers without changing application code

---

### 3. **Where AI APIs Are Used**

The configured API keys power AI features across the entire application:

#### **📨 Inbox & Messaging**
- **Auto-draft replies** based on conversation context
- **Sentiment analysis** (Positive, Neutral, Negative, Angry)
- **Priority detection** (High, Medium, Low)
- **Smart reply suggestions**
- **Message translation** to multiple languages
- **Conversation summarization**

#### **🤖 Business Copilot**
- **AI-powered business insights** and recommendations
- **Predictive analytics** for revenue, bookings, and customer behavior
- **Natural language queries** (e.g., "Show me revenue trends")

#### **👥 Customer Management (CRM)**
- **Churn risk prediction** (AI analyzes customer behavior)
- **Customer persona generation** (e.g., "Weekend Warrior", "Business Traveler")
- **Preference extraction** from conversation history
- **Win-back campaign generation** for churned customers

#### **📊 Marketing & Campaigns**
- **Campaign content generation** (email subject lines, body copy)
- **Audience segmentation** recommendations
- **A/B test suggestions**
- **Social media post generation**
- **Image generation** for marketing materials

#### **📈 Analytics & Reporting**
- **Review sentiment analysis** and trend detection
- **Automated insights** from business metrics
- **Anomaly detection** in revenue/bookings

#### **🔧 Operations**
- **Maintenance ticket analysis** and priority assignment
- **Vendor recommendation generation**
- **Inventory forecasting**
- **Smart scheduling** for staff and cleaners

#### **🎙️ Voice Agent**
- **Call transcription** and summarization
- **Intent detection** from voice calls
- **Automated action extraction** (e.g., "Book appointment", "Send info")

#### **🔄 Workflow Automation**
- **Trigger condition evaluation**
- **Dynamic message generation** based on workflow rules
- **Smart routing** of customer inquiries

---

## 🔐 Security & Storage

### **Frontend (.env file)**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:3000
```

### **Backend (Database)**
- API keys are stored in the `ai_model_config` table
- **Entity**: `AiModelConfig` (`server/src/ai/ai-model-config.entity.ts`)
- **Fields**:
  - `id`: UUID
  - `name`: Friendly name
  - `provider`: AI provider name
  - `modelId`: Model identifier
  - `apiKey`: API key (should be encrypted in production)
  - `endpoint`: Custom endpoint URL (optional)
  - `capabilities`: Array of capabilities (text, image, voice, function_calling)
  - `costPer1kTokens`: Cost tracking
  - `isActive`: Enable/disable model

### **API Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/ai/models` | List all configured models | All authenticated users |
| `POST` | `/api/ai/models` | Create new model configuration | Admin, Owner only |
| `PATCH` | `/api/ai/models/:id` | Update model configuration | Admin, Owner only |
| `DELETE` | `/api/ai/models/:id` | Delete model configuration | Admin, Owner only |

---

## 🚀 How AI Automation Runs

### **Step-by-Step Flow:**

1. **User Action Triggers AI**
   - Example: New message arrives in inbox

2. **Task Routing**
   - System checks `taskAssignments` configuration
   - Determines which model to use (e.g., "analysis" task → Gemini 2.5 Flash Lite)

3. **API Key Retrieval**
   - Fetches the configured API key for the selected model
   - If no API key is configured, uses environment variable fallback

4. **AI Request**
   - Sends request to AI provider (Google Gemini, OpenAI, etc.)
   - Includes conversation context, knowledge base data, and task-specific prompts

5. **Response Processing**
   - AI returns analysis/draft/suggestion
   - System applies the result (e.g., auto-tags message, generates draft reply)

6. **User Review (Optional)**
   - If Auto-Pilot is enabled, AI can auto-send replies
   - Otherwise, user reviews and approves AI-generated content

---

## 📋 Configuration Best Practices

### **1. Multi-Model Strategy**
```
✅ Recommended Setup:
- Drafting: GPT-4o (high quality, complex reasoning)
- Analysis: Gemini 2.5 Flash Lite (fast, cost-effective)
- Quick Replies: Gemini 2.5 Flash (balanced speed/quality)
- Image Generation: Gemini 2.5 Flash Image (specialized)
```

### **2. Cost Optimization**
- Use **cheaper models** for high-volume tasks (analysis, tagging)
- Use **premium models** for customer-facing content (drafts, campaigns)
- Track usage with `costPer1kTokens` field

### **3. Fallback Strategy**
- Always keep at least one active model configured
- System falls back to most recently updated active model if specific capability not found

### **4. Testing**
- Use the **"Test Latency"** button in Models & API section
- Verify API keys are working before assigning to critical tasks

---

## 🛠️ Technical Architecture

### **Frontend Components**
- **`components/Models.tsx`**: UI for managing models and task assignments
- **`components/Settings.tsx`**: AI Configuration tab (Auto-Pilot, tone, delay)

### **Backend Services**
- **`server/src/ai/ai.service.ts`**: Model CRUD operations, dynamic routing
- **`server/src/gemini/gemini.service.ts`**: AI request handling (currently Gemini-focused)
- **`server/src/gemini/gemini.controller.ts`**: API endpoints for AI operations

### **Key Functions**
```typescript
// Get best model for a specific capability
async getBestModel(capability: string): Promise<AiModelConfig | null>

// Example capabilities:
- 'text' (default)
- 'image'
- 'voice'
- 'function_calling'
```

---

## 🔄 Migration Path

### **Current State (v1.2.2)**
- Gemini API key in `.env` file
- Hardcoded Gemini service
- Limited multi-provider support

### **Future Enhancements**
1. **Encryption**: Encrypt API keys at rest in database
2. **Provider Abstraction**: Unified interface for all AI providers
3. **Usage Tracking**: Monitor token consumption per model
4. **Rate Limiting**: Prevent API quota exhaustion
5. **Model Benchmarking**: Automatic quality/cost comparison

---

## 📚 Related Files

### **Frontend**
- `/types.ts` - Type definitions for `AIModel`, `AIProvider`, `TaskAssignment`
- `/data.ts` - Default models list (`defaultModels`, `defaultTaskAssignment`)
- `/components/Models.tsx` - Models & API management UI
- `/components/Settings.tsx` - AI configuration settings

### **Backend**
- `/server/src/ai/ai-model-config.entity.ts` - Database entity
- `/server/src/ai/ai.service.ts` - Business logic
- `/server/src/ai/ai.controller.ts` - REST API endpoints
- `/server/src/gemini/gemini.service.ts` - AI request handling

---

## 🎓 Summary

**The Models & API section is the brain of the entire AI automation system.** By configuring AI providers and their API keys here, users enable:

✅ **Intelligent message handling** (auto-drafts, sentiment analysis)  
✅ **Predictive analytics** (churn risk, revenue forecasting)  
✅ **Marketing automation** (campaign generation, content creation)  
✅ **Operational efficiency** (smart scheduling, maintenance prioritization)  
✅ **Voice intelligence** (call transcription, intent detection)  

**Without proper API configuration, the AI features will not function.** This is why the Models & API section is critical to the platform's value proposition.

---

## 🆘 Troubleshooting

### **AI features not working?**
1. Check if API keys are configured in Models & API section
2. Verify at least one model is marked as "Active"
3. Test model latency to confirm API connectivity
4. Check browser console for API errors
5. Ensure task assignments are configured

### **High costs?**
1. Review task assignments - use cheaper models for high-volume tasks
2. Check `costPer1kTokens` tracking in database
3. Consider switching to more cost-effective providers for non-critical tasks

### **Slow responses?**
1. Test model latency in Models & API section
2. Consider using faster models (e.g., Flash models) for real-time tasks
3. Check if custom endpoints have network issues

---

**Last Updated**: December 2025  
**Version**: 1.2.2
