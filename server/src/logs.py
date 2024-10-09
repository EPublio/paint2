import logging

class Logger:
    def __init__(self, mod_name):
        self.logger = logging.getLogger(mod_name)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s [%(name)s] %(levelname)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.DEBUG)

    def info(self, string):
        self.logger.info(string)
