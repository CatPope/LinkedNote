import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_mock_summary(url: str, mode: str) -> str:
    if mode == "quick":
        return f"This is a quick summary of {url}."
    elif mode == "detailed":
        return f"This is a detailed summary of {url}, providing more in-depth information."
    else:
        return f"Summary for {url} with mode {mode} is not supported."

def get_summary_from_openai(text: str, mode: str) -> str:
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