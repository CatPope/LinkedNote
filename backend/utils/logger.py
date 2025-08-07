import logging
import os

def setup_logger(name: str, log_file: str, level=logging.INFO):
    """
    Function to setup a logger with a file handler and a console handler.
    """
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    handler = logging.FileHandler(log_file)
    handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)
    logger.addHandler(console_handler)

    return logger

# Example usage (can be removed or modified as needed)
# if __name__ == "__main__":
#     log_dir = "logs"
#     os.makedirs(log_dir, exist_ok=True)
#     app_logger = setup_logger('app_logger', os.path.join(log_dir, 'app.log'))
#     app_logger.info('This is an info message.')
#     app_logger.error('This is an error message.')
