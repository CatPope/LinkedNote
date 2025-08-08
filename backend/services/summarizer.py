import os
from openai import OpenAI, APIError, RateLimitError
from dotenv import load_dotenv
from .scraper import scrape_url

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text_with_openai(text: str, mode: str) -> str:
    if mode == "quick":
        prompt = f"Summarize the following text concisely: {text}"
    elif mode == "detailed":
        prompt = f"Provide a detailed summary of the following text: {text}"
    elif mode == "tags":
        prompt = f"Extract relevant keywords or tags from the following text, separated by commas: {text}"
    elif mode == "full":
        prompt = f"Return the full text provided: {text}"
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
    except APIError as e:
        print(f"OpenAI API Error: {e.status_code} - {e.response}")
        return f"Error from OpenAI API: {e.message}"
    except RateLimitError as e:
        print(f"OpenAI Rate Limit Error: {e.status_code} - {e.response}")
        return "OpenAI API rate limit exceeded. Please try again later."
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return f"An unexpected error occurred: {e}"
