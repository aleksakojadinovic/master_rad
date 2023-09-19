import streamlit as st
from datetime import datetime

from api import calculate_average_first_response_time, calculate_average_pickup_time, calculate_average_resolution_time, get_resolved_count, get_picked_up_count, DEFAULT_END, DEFAULT_START


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

    ticket_metric_col1, ticket_metric_col2, ticket_metric_col3 = st.columns(3)

    with ticket_metric_col1:
        st.metric(label="Average resolution time",
                  value=format_metric(average_resolution_time))

    with ticket_metric_col2:
        st.metric(label="Average pickup time",
                  value=format_metric(average_pickup_time))
    with ticket_metric_col3:
        st.metric(label="Average first response time",
                  value=format_metric(average_first_response_time))

    st.markdown("""---""")

    ticket_count_col1, ticket_count_col2, ticket_count_col3 = st.columns(3)

    with ticket_count_col1:
        total_resolved_tickets = get_resolved_count(start=d_from, end=d_to)
        st.metric(label="Total resolved",
                  value=total_resolved_tickets)

    with ticket_count_col2:
        total_picked_up = get_picked_up_count(start=d_from, end=d_to)
        st.metric(label="Total picked up",
                  value=total_picked_up)
    # with ticket_count_col2:
    #     st.metric(label="Average pickup time",
    #             value=format_metric(average_pickup_time))

    # with ticket_count_col3:
    #     st.metric(label="Average first response time",
    #             value=format_metric(average_first_response_time))
