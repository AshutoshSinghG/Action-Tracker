# AI Notes

## LLM Provider

**Provider:** Google Gemini  
**Model:** `gemini-2.0-flash`  
**SDK:** `@google/generative-ai` (Node.js)

### Why Gemini?

1. **Free tier** — generous rate limits for development and small-scale usage
2. **Strong structured output** — reliably produces valid JSON when given clear system prompts
3. **Fast inference** — Flash model optimized for low-latency responses
4. **No credit card required** — API key available instantly via Google AI Studio

### Token / Cost Considerations

- Gemini 2.0 Flash is free for up to 15 RPM / 1M TPD on the free tier
- Average transcript processing uses ~500-2000 input tokens and ~200-500 output tokens
- Well within free tier limits for internal tool usage
- For higher throughput, the paid tier is cost-effective (~$0.075 / 1M input tokens)

## What AI Assisted With

- Structured system prompt design for reliable JSON extraction
- Edge case identification for input validation boundaries
- Architecture pattern decisions (service layer separation)

## What Was Manually Reviewed

- All error handling paths and fallback behavior
- Database schema design and index strategy
- CORS and security configuration
- Frontend state management flow
- Docker multi-stage build configuration
- API validation rules and HTTP status code usage
