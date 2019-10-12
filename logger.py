#!/usr/bin/env python3

import logging
import logging.handlers

LOG_FILENAME = 'graph_output.log'
logger = logging.getLogger("graph-logger")
logger.setLevel(logging.DEBUG)

# Add the log message handler to the logger
handler = logging.handlers.RotatingFileHandler(
              LOG_FILENAME, maxBytes=10000, backupCount=5)

logger.addHandler(handler)
