## General functions will be stored here

import json
from pathlib import Path

def editCarJson(brand: str, model: str) -> None:
    newCars = []
    path = Path(__file__).parent / "static/data/cars.json"
    with path.open() as file:
        cars = json.loads(file.read())['cars']
        for car in cars:
            if(car['brand'] == brand and car['model'] == model):
                car['availability'] = False
        newCars = cars

    with path.open('w') as output:
        json.dump({'cars': newCars}, output)