import os
from pymongo import MongoClient
from datetime import datetime, timedelta
import streamlit as st
import math

MONGODB_USERNAME = os.getenv("MAIN_DB_USERNAME")
MONGODB_PASSWORD = os.getenv("MAIN_DB_PWD")

client = MongoClient(
    host='mongodb://maindb',
    port=27017,
    username=MONGODB_USERNAME,
    password=MONGODB_PASSWORD
)
db = client["sts_analytics_db"]  # Replace with your database name
tickets = db["tickets"]  # Replace with your collection name

DEFAULT_END = datetime.now()
DEFAULT_START = (datetime.now() - timedelta(days=7))


def get_average_metric(start, end, metric):
    pipeline = [
        {
            "$match": {
                "timestamp": {"$gte": start, "$lte": end},
                f"{metric}": {"$ne": None}

            }
        },
        {
            "$group": {
                "_id": "$_id",
                "average_result": {"$avg": f"${metric}"}
            }
        }
    ]

    result = list(tickets.aggregate(pipeline))
    if not result:
        return None
    average_result = result[0]["average_result"]
    return round(average_result / 60, 2)


def calculate_average_resolution_time(start=DEFAULT_START, end=DEFAULT_END):
    return get_average_metric(start, end, 'resolution_time')


def calculate_average_pickup_time(start=DEFAULT_START, end=DEFAULT_END):
    return get_average_metric(start, end, 'pickup_time')


def calculate_average_first_response_time(start=DEFAULT_START, end=DEFAULT_END):
    return get_average_metric(start, end, 'first_response_time')
