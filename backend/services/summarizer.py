import openai
from typing import Optional
from backend.utils.logger import setup_logger
import os

# Setup logger for this module
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
summarizer_logger = setup_logger('summarizer_logger', os.path.join(log_dir, 'summarizer.log'))

class SummarizerService:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)
        summarizer_logger.info("SummarizerService initialized.")

    def summarize_text(self, text: str, mode: str = "summary") -> Optional[str]:
        """
        Summarizes the given text using OpenAI's GPT model.
        """
        prompt = self._get_prompt_for_mode(text, mode)
        summarizer_logger.info(f"Attempting to summarize text with mode: {mode}")

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Or another suitable model
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150, # Adjust as needed
            )
            summary = response.choices[0].message.content.strip()
            summarizer_logger.info("Text summarized successfully.")
            return summary
        except openai.APIError as e:
            summarizer_logger.error(f"OpenAI API error during summarization: {e}")
            return None
        except Exception as e:
            summarizer_logger.error(f"An unexpected error occurred during summarization: {e}")
            return None

    def _get_prompt_for_mode(self, text: str, mode: str) -> str:
        if mode == "summary":
            return f"Please summarize the following text:\n\n{text}"
        elif mode == "tags":
            return f"Extract key tags/keywords from the following text, separated by commas:\n\n{text}"
        elif mode == "full":
            return f"Provide a detailed summary of the following text:\n\n{text}"
        else:
            summarizer_logger.warning(f"Unknown summarization mode: {mode}. Defaulting to summary.")
            return f"Please summarize the following text:\n\n{text}"