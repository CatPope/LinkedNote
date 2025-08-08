def get_mock_summary(url: str, mode: str) -> str:
    if mode == "quick":
        return f"This is a quick summary of {url}."
    elif mode == "detailed":
        return f"This is a detailed summary of {url}, providing more in-depth information."
    else:
        return f"Summary for {url} with mode {mode} is not supported."
