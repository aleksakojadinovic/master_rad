import streamlit as st
from datetime import datetime

from api import calculate_average_first_response_time, calculate_average_pickup_time, calculate_average_resolution_time


st.set_page_config(layout="wide")
st.title('STS analytics dashboard')

average_resolution_time = calculate_average_resolution_time()
average_pickup_time = calculate_average_pickup_time()
average_first_response_time = calculate_average_first_response_time()

d_from = st.date_input("From")
d_to = st.date_input("To")


st.metric(label="Average resolution time",
          value=f"{average_resolution_time} h")

st.metric(label="Average pickup time",
          value=f"{average_pickup_time} h")

st.metric(label="Average first response time",
          value=f"{average_first_response_time} h")
