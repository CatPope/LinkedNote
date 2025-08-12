import os
from openai import OpenAI, APIError, RateLimitError
from dotenv import load_dotenv
from .scraper import scrape_url
from backend.models import Summary
from sqlalchemy.orm import Session

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text_with_openai(db: Session, url: str, text: str, mode: str) -> str:
    if mode == "quick":
        prompt = f"""<context>
{text}
</context>

request: Create a concise summary with:

<example>
[Title] - a short, clear headline.
[Sumary] - A brief, one or two-sentence summary of the main points.
</example>

chat:"""

    elif mode == "detailed":
        prompt = f"""<context>
{text}
</context>

request: Provide a detailed, well-structured summary highlighting key points, important facts, and relevant context. Avoid repetition and keep it factual.

<example>
[Title] - a short, clear headline.
[Detail] - A multi-paragraph summary covering all key information and context in a logical flow.
</example>

chat:"""

    elif mode == "tags":
        prompt = f"""<context>
{text}
</context>

request: Identify 3–6 highly relevant keywords or tags from the content above, separated by commas. Exclude generic or irrelevant terms.

<example>
[Title] - a short, clear headline.
[Tags] - keyword1, keyword2, keyword3, keyword4
</example>

chat:"""

    elif mode == "full":
        prompt = f"""<context>
{text}
</context>

request: Return the content above exactly as provided, without any modifications or commentary.

<example>
[Title] - a short, clear headline.
[Full Text] - The entire original content, formatted for easy readability without any modifications.
</example>

chat:"""

    else:
        return "Unsupported summary mode."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that processes and summarizes content with precision, clarity, and relevance to the user's request."},
                {"role": "user", "content": prompt}
            ]
        )
        summary_content = response.choices[0].message.content

        db_summary = Summary(url=url, mode=mode, content=summary_content)
        db.add(db_summary)
        db.commit()
        db.refresh(db_summary)

        return summary_content
    except APIError as e:
        print(f"OpenAI API Error: {e.status_code} - {e.response}")
        return f"Error from OpenAI API: {e.message}"
    except RateLimitError as e:
        print(f"OpenAI Rate Limit Error: {e.status_code} - {e.response}")
        return "OpenAI API rate limit exceeded. Please try again later."
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return f"An unexpected error occurred: {e}"