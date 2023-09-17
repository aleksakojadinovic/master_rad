import datetime

current_datetime = datetime.datetime.now()

formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

file_path = "/app/test.txt"

with open(file_path, "w") as file:
    file.write(formatted_datetime)
