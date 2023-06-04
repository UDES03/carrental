"""
This script runs the application using a development server.
"""

from os import environ
from app import webApp

if __name__ == '__main__':
    # host = environ.get('SERVER_HOST', 'localhost')
    # try:
    #     port = int(environ.get('SERVER_PORT', '5555'))
    # except ValueError:
    #     port = 5555
    # webApp.run(host, port)
    webApp.run()
