"""
Routes and views for the flask application.
"""

import json
from datetime import datetime
from typing import Any

from pandas import date_range
from flask import render_template, send_from_directory, request
from app import webApp, mysql
from app.utilities import editCarJson

@webApp.route('/')
@webApp.route('/home')
def home():
    """Landing page. All cars are displayed here."""
    return render_template('index.html')

@webApp.route('/reserve')
def reservation():
    """Route to handle reservation of rentals."""
    return render_template('reservation.html')

@webApp.route('/checkout')
def checkout():
    """Route to handle check out flow."""
    return render_template('checkout.html')

@webApp.route('/cars')
def cars():
    """Returns the json with all cars listed. This will be consumed by js."""
    filepath = 'data/cars.json'
    return send_from_directory('static', filepath
                               )

@webApp.route('/dbrecords', methods=['POST'])
def searchDbRecords():
    """Search the database for a record matching the provided email."""
    data = request.get_json()
    value = data['email']

    print('ye')
    connection: Any = mysql.connection
    cursor = connection.cursor(buffered=True)
    print(connection)
    result = None
    isPresent = False
    # set a range for 90 days
    range = date_range(end=datetime.now(), periods=90)
    for date in range:
        formattedDate = date.date().strftime('%Y-%m-%d')
        cursor.execute("SELECT * FROM renting_history WHERE user_email = %s AND rent_date LIKE %s", (value, formattedDate + '%'))
        result = cursor.fetchone()

        if result is not None:
            # if we have one result we can just break the loop
            isPresent = True
            break

    cursor.close()
    connection.close()
    return json.dumps({
        'isPresent': isPresent
    })

@webApp.route('/addnew', methods=['POST'])
def addNewRecord():
    """Append a new record to the database."""
    isSuccessful = False

    data = request.get_json()
    email = data['email']
    bond = data['bond']
    car = data['car']
    date = datetime.now()
    date = date.strftime("%Y-%m-%d %H:%M:%S")

    connection: Any = mysql.connection
    cursor = connection.cursor(buffered=True)

    cursor.execute("INSERT INTO renting_history (user_email, rent_date, bond_amount) VALUES (%s, %s, %s)", (email, date, bond))
    connection.commit()
    rows = cursor.rowcount
    if rows == 1:
        isSuccessful = True
        editCarJson(brand=car[0], model=car[1])

    cursor.close()
    connection.close()
    return json.dumps({
            'isSuccessful': isSuccessful
        })