class BaseAgent:
    def __init__(self, config, logger):
        self.config = config
        self.logger = logger
        self.agent_name = self.__class__.__name__

    def log_action(self, action, details, hypothesis_id=None):
        self.logger.log(self.agent_name, action, details, hypothesis_id)

    def info(self, message, hypothesis_id=None):
        self.logger.info(self.agent_name, message, hypothesis_id)

    def run(self, input_data: dict, context: dict) -> dict:
        raise NotImplementedError("Cada agente debe implementar su método run.")
