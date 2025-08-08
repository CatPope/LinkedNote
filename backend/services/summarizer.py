import os
from openai import OpenAI
from dotenv import load_dotenv
from .scraper import scrape_url

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text_with_openai(text: str, mode: str) -> str:
    if mode == "quick":
        prompt = f"Summarize the following text concisely: {text}"
    elif mode == "detailed":
        prompt = f"Provide a detailed summary of the following text: {text}"
    else:
        return "Unsupported summary mode."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating summary: {e}"
