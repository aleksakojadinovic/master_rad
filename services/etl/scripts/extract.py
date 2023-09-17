import os
import pymongo
from pymongo import MongoClient
# from datetime import datetime, timedelta

DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'


def calculate_resolution_time(ticket):
    created_at = ticket.get('createdAt')

    history = ticket.get('history')
    resolution_time_items = list(
        filter(lambda item: item.get('type') == 'STATUS_CHANGED' and item.get('payload').get('status') == 'RESOLVED', history))

    resolved_time = resolution_time_items[-1].get(
        'timestamp') if resolution_time_items else None

    resolution_time = (
        resolved_time - created_at).total_seconds() / 60 if resolved_time else None

    return resolution_time


def calculate_pickup_time(ticket):
    created_at = ticket.get('createdAt')

    history = ticket.get('history')
    assignees_changed_items = list(
        filter(lambda item: item.get('type') == 'ASSIGNEES_CHANGED', history))

    assignees_changed_time = assignees_changed_items[0].get(
        'timestamp') if assignees_changed_items else None

    pickup_time = (
        assignees_changed_time - created_at).total_seconds() / 60 if assignees_changed_time else None

    return pickup_time


def calculate_first_response_time(ticket):
    created_at = ticket.get('createdAt')

    history = ticket.get('history')
    comment_items = list(
        filter(lambda item: item.get('type') == 'COMMENT_ADDED', history))

    first_comment_time = comment_items[0].get(
        'timestamp') if comment_items else None

    first_response_time = (
        first_comment_time - created_at).total_seconds() / 60 if first_comment_time else None

    return first_response_time


def transform_data(ticket):
    created_at = ticket.get('createdAt')
    resolution_time = calculate_resolution_time(ticket)
    pickup_time = calculate_pickup_time(ticket)
    first_response_time = calculate_first_response_time(ticket)

    return {"_id": ticket.get('_id'), "timestamp": created_at, "resolution_time": resolution_time, "pickup_time": pickup_time, "first_response_time": first_response_time}


def main():
    MONGODB_USERNAME = os.getenv("MAIN_DB_USERNAME")
    MONGODB_PASSWORD = os.getenv("MAIN_DB_PWD")

    client = MongoClient(
        host='mongodb://maindb',
        port=27017,
        username=MONGODB_USERNAME,
        password=MONGODB_PASSWORD
    )

    src_db = client["sts_db"]
    src_tickets_collection = src_db["tickets"]

    dest_db = client["sts_analytics_db"]
    dest_tickets_collection = dest_db["tickets"]

    latest_processed_ticket = dest_tickets_collection.find_one(
        sort=[("timestamp", pymongo.DESCENDING)]
    )

    latest_timestamp = latest_processed_ticket["timestamp"] if latest_processed_ticket else None

    query = {}
    if latest_timestamp:
        query["timestamp"] = {"$gte": latest_timestamp}

    unprocessed_tickets_cursor = src_tickets_collection.find(query)

    new_tickets = []

    for ticket in unprocessed_tickets_cursor:
        transformed_ticket = transform_data(ticket)
        new_tickets.append(transformed_ticket)

    if new_tickets:
        dest_tickets_collection.insert_many(new_tickets)


if __name__ == "__main__":
    main()
