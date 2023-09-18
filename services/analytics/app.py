import streamlit as st
from datetime import datetime

from api import calculate_average_first_response_time, calculate_average_pickup_time, calculate_average_resolution_time, DEFAULT_END, DEFAULT_START


st.set_page_config(page_title='Metrics | STS')
st.title('STS metrics dashboard')

tickets_tab, agents_tab, customers_tab = st.tabs(
    ['Tickets', 'Agents', 'Customers'])


def format_metric(metric):
    if metric:
        return f'{metric} h'

    return 'N/A'


with tickets_tab:
    d_from_input = st.date_input("From", value=DEFAULT_START)
    d_to_input = st.date_input("To", DEFAULT_END)

    d_from = datetime.combine(d_from_input, datetime.min.time())
    d_to = datetime.combine(d_to_input, datetime.min.time())

    average_resolution_time = calculate_average_resolution_time(d_from, d_to)
    average_pickup_time = calculate_average_pickup_time(d_from, d_to)
    average_first_response_time = calculate_average_first_response_time(
        d_from, d_to)

    st.metric(label="Average resolution time",
              value=format_metric(average_resolution_time))

    st.metric(label="Average pickup time",
              value=format_metric(average_pickup_time))

    st.metric(label="Average first response time",
              value=format_metric(average_first_response_time))
