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
        if settings.AZURE_OPENAI_API_KEY and settings.AZURE_OPENAI_ENDPOINT:
            client = AsyncAzureOpenAI(
                api_key=settings.AZURE_OPENAI_API_KEY,
                api_version=settings.API_VERSION or "2024-05-01-preview",
                azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            )
            response = await client.chat.completions.create(
                model=settings.AZURE_DEPLOYMENT or "gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_text}
                ],
                temperature=0.7
            )
            text_resp = response.choices[0].message.content.strip()
        elif settings.LLMFARM_API_KEY and settings.LLMFARM_API_URL:
             # Fallback to LLMFarm
            client = AsyncAzureOpenAI(
                api_key=settings.LLMFARM_API_KEY,
                api_version=settings.LLMFARM_CHAT_VERSION or "2024-08-01-preview",
                azure_endpoint=settings.LLMFARM_API_URL,
            )
            response = await client.chat.completions.create(
                model=settings.LLMFARM_CHAT_DEPLOYMENT_OPENAI,
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
            model = genai.GenerativeModel('gemini-1.5-flash')
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

async def generate_slide_image(slide_title: str, slide_points: list) -> str:
    """
    Generates an image URL using DALL-E based on slide content.
    """
    log_file = "ai_service.log"
    try:
        if not settings.DALLE_OPENAI_API_KEY:
            with open(log_file, "a") as f:
                f.write("DALL-E API Key missing in settings\n")
            return ""

        # Try multiple endpoints and keys
        endpoints_to_try = [
            settings.DALLE_OPENAI_ENDPOINT,
            settings.DALLE_OPENAI_ENDPOINT.replace("cognitiveservices.azure.com", "openai.azure.com"),
            settings.AZURE_OPENAI_ENDPOINT
        ]
        endpoints_to_try = list(dict.fromkeys([e for e in endpoints_to_try if e]))
        
        keys_to_try = [settings.DALLE_OPENAI_API_KEY, settings.AZURE_OPENAI_API_KEY]
        keys_to_try = list(dict.fromkeys([k for k in keys_to_try if k]))

        for endpoint in endpoints_to_try:
            for api_key in keys_to_try:
                try:
                    with open(log_file, "a") as f:
                        f.write(f"Attempting image generation with endpoint: {endpoint} and key: {api_key[:5]}...\n")

                    client = AsyncAzureOpenAI(
                        api_key=api_key,
                        api_version=settings.DALLE_API_VERSION or "2024-02-01",
                        azure_endpoint=endpoint,
                    )

                    prompt = f"Professional presentation slide illustration for: {slide_title}. Key points: {', '.join(slide_points)}. Style: Modern, clean, corporate."
                    
                    response = await client.images.generate(
                        model=settings.DALLE_AZURE_DEPLOYMENT or "dall-e-3",
                        prompt=prompt,
                        n=1,
                        size="1024x1024"
                    )

                    image_url = response.data[0].url
                    with open(log_file, "a") as f:
                        f.write(f"Successfully generated image using {endpoint}!\n")
                    return image_url
                except Exception as e:
                    with open(log_file, "a") as f:
                        f.write(f"Failed with {endpoint} using key {api_key[:5]}... : {str(e)}\n")
                    continue

        return ""
    except Exception as e:
        with open(log_file, "a") as f:
            f.write(f"Critical error in generate_slide_image: {str(e)}\n")
        return ""
