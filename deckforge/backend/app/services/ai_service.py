import json
from openai import AsyncAzureOpenAI
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_presentations_structure(prompt: str, context_text: str = "") -> list:
    """
    Calls Azure OpenAI or Gemini API to get a JSON array of slide objects.
    Enforces format: [{"title": "Slide Title", "points": ["p1", "p2"]}]
    """
    try:
        system_prompt = (
            "You are an expert presentation generator. Provide your output ONLY as a valid JSON array "
            "of slide objects. Do NOT use markdown code blocks like ```json ... ```, just output the raw JSON. "
            "Each object must have 'title' (string) and 'points' (array of 3-5 strings). "
            "Adhere strictly to the Tone and Target Slide Count requested by the user."
        )
        
        full_text = f"User Request: {prompt}\n"
        if context_text:
            full_text += f"\nContext Document: {context_text}"

        text_resp = ""
        
        # Check if azure openai keys are available
        if settings.azure_openai_api_key and settings.azure_openai_endpoint:
            client = AsyncAzureOpenAI(
                api_key=settings.azure_openai_api_key,
                api_version=settings.api_version or "2024-05-01-preview",
                azure_endpoint=settings.azure_openai_endpoint,
            )
            response = await client.chat.completions.create(
                model=settings.azure_deployment or "gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_text}
                ],
                temperature=0.7
            )
            text_resp = response.choices[0].message.content.strip()
        else:
            # Fallback to Gemini
            final_prompt = system_prompt + "\n\n" + full_text
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(final_prompt)
            text_resp = response.text.strip()
        
        # very basic json cleansing if markdown wrapper used
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:]
        if text_resp.endswith("```"):
            text_resp = text_resp[:-3]
            
        slides = json.loads(text_resp)
        return slides
    except Exception as e:
        print(f"Error calling AI: {e}")
        # fallback
        return [
            {"title": "Error generating slides", "points": ["Please check API configurations or prompt.", str(e)]}
        ]
