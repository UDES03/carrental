"""
The flask application package.
"""

from flask import Flask
from flask_mysql_connector import MySQL
import os
import urllib.parse

webApp = Flask(__name__)

mysqlUrl = urllib.parse.urlparse(os.environ['MYSQL_URL'])

webApp.config['MYSQL_DATABASE_HOST'] = mysqlUrl.hostname
webApp.config['MYSQL_DATABASE_PORT'] = mysqlUrl.port
webApp.config['MYSQL_DATABASE_USER'] = mysqlUrl.username
webApp.config['MYSQL_DATABASE_PASSWORD'] = mysqlUrl.password
webApp.config['MYSQL_DATABASE_DB'] = mysqlUrl.path.lstrip('/')

mysql = MySQL(webApp)

import app.views
