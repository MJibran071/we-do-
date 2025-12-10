# AI API Quick Reference Card

## 🔑 API Configuration Locations

### Environment Variables (.env)
```bash
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:3000
```

### Database Table: `ai_model_config`
```sql
- id (UUID)
- name (string) - "My Production GPT-4"
- provider (string) - "OpenAI", "Google Gemini", etc.
- modelId (string) - "gpt-4-turbo", "gemini-2.5-flash"
- apiKey (string) - Encrypted API key
- endpoint (string) - Custom endpoint URL (optional)
- capabilities (array) - ['text', 'image', 'voice']
- costPer1kTokens (float) - Cost tracking
- isActive (boolean) - Enable/disable
```

---

## 🎯 Task Assignment Matrix

| Task Type | Recommended Model | Why? |
|-----------|------------------|------|
| **Drafting & Reasoning** | GPT-4o, Claude 3.5 Sonnet | Complex reasoning, high quality |
| **Fast Analysis** | Gemini 2.5 Flash Lite | Speed + cost-effective |
| **Quick Replies** | Gemini 2.5 Flash | Balanced performance |
| **Image Generation** | Gemini 2.5 Flash Image, DALL-E | Specialized capability |

---

## 🚀 AI Features Powered by APIs

### Inbox & Messaging
- ✅ Auto-draft replies
- ✅ Sentiment analysis
- ✅ Priority detection
- ✅ Smart reply suggestions
- ✅ Translation
- ✅ Summarization

### Business Copilot
- ✅ Business insights
- ✅ Predictive analytics
- ✅ Natural language queries

### Customer CRM
- ✅ Churn risk prediction
- ✅ Persona generation
- ✅ Preference extraction
- ✅ Win-back campaigns

### Marketing
- ✅ Campaign content generation
- ✅ Audience segmentation
- ✅ A/B test suggestions
- ✅ Social media posts
- ✅ Image generation

### Analytics
- ✅ Review sentiment analysis
- ✅ Trend detection
- ✅ Anomaly detection

### Operations
- ✅ Maintenance prioritization
- ✅ Vendor recommendations
- ✅ Inventory forecasting
- ✅ Smart scheduling

### Voice Agent
- ✅ Call transcription
- ✅ Intent detection
- ✅ Action extraction

### Workflows
- ✅ Trigger evaluation
- ✅ Dynamic message generation
- ✅ Smart routing

---

## 📡 API Endpoints

### Model Management
```http
GET    /api/ai/models          # List all models
POST   /api/ai/models          # Create model (Admin only)
PATCH  /api/ai/models/:id      # Update model (Admin only)
DELETE /api/ai/models/:id      # Delete model (Admin only)
```

### AI Operations (Examples)
```http
POST /api/ai/analyze           # Analyze message sentiment
POST /api/ai/quick-replies     # Generate quick replies
POST /api/ai/draft             # Generate message draft
POST /api/ai/translate         # Translate text
POST /api/ai/summarize         # Summarize conversation
```

---

## 🔐 Security Checklist

- [ ] API keys stored in database (not hardcoded)
- [ ] API keys encrypted at rest (production)
- [ ] HTTPS for all API communications
- [ ] Rate limiting enabled
- [ ] Role-based access control (Admin/Owner only for config)
- [ ] API key rotation policy
- [ ] Usage monitoring and alerts

---

## 💰 Cost Optimization Tips

1. **Use tiered models**: Cheap for analysis, premium for customer-facing
2. **Monitor usage**: Track `costPer1kTokens` field
3. **Cache responses**: Reduce duplicate API calls
4. **Batch requests**: Combine multiple operations
5. **Set quotas**: Prevent runaway costs
6. **Review assignments**: Regularly optimize task routing

---

## 🐛 Troubleshooting

### AI not working?
```bash
1. Check Models & API section → Verify API keys configured
2. Ensure at least one model is "Active"
3. Test latency to confirm connectivity
4. Check browser console for errors
5. Verify task assignments are set
```

### High costs?
```bash
1. Review task assignments
2. Check costPer1kTokens tracking
3. Switch to cheaper models for high-volume tasks
4. Enable caching for repeated queries
```

### Slow responses?
```bash
1. Test model latency
2. Use faster models (Flash variants)
3. Check network/endpoint issues
4. Consider regional endpoints
```

---

## 📊 Model Comparison

| Provider | Best For | Speed | Cost | Quality |
|----------|----------|-------|------|---------|
| **Gemini Flash** | High-volume tasks | ⚡⚡⚡ | 💰 | ⭐⭐⭐ |
| **GPT-4o** | Complex reasoning | ⚡⚡ | 💰💰💰 | ⭐⭐⭐⭐⭐ |
| **Claude 3.5** | Long context | ⚡⚡ | 💰💰💰 | ⭐⭐⭐⭐⭐ |
| **DeepSeek R1** | Code/logic | ⚡⚡⚡ | 💰💰 | ⭐⭐⭐⭐ |
| **Llama 3.1** | Open source | ⚡⚡ | 💰 | ⭐⭐⭐ |

---

## 🔗 Related Files

**Frontend:**
- `components/Models.tsx` - UI
- `types.ts` - Type definitions
- `data.ts` - Default models

**Backend:**
- `server/src/ai/ai-model-config.entity.ts` - Entity
- `server/src/ai/ai.service.ts` - Business logic
- `server/src/ai/ai.controller.ts` - API endpoints
- `server/src/gemini/gemini.service.ts` - AI requests

---

## 📞 Support

**Documentation**: See `AI_API_CONFIGURATION_GUIDE.md`  
**Architecture Diagram**: See `ai_api_architecture.png`  
**Version**: 1.2.2
