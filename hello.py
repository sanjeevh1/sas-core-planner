from flask import Flask
from bs4 import BeautifulSoup
import aiohttp
import asyncio
from course import Course
import re
import requests

app = Flask(__name__)

BASE_URL = "https://sasundergrad.rutgers.edu/degree-requirements/core/"
PATHS = [
    "cognitive-skills-and-processes-quantitative-and-formal-reasoning", 
    "contemporary-challenges", 
    "cognitive-skills-and-processes-writing-and-communication", 
    "areas-of-inquiry-arts-and-humanities", 
    "areas-of-inquiry-social-and-historical-analysis"
]

def get_course(cells) -> Course:
    """Converts cells into a Course object"""
    number = re.match(r"\d\d:\d\d\d:\d\d\d",cells[0].get_text()).group()
    name = cells[1].get_text()
    credits = float(re.match(r"\d(\.\d)?", cells[2].get_text()).group())
    core_codes = re.split(r", | or ", cells[3].get_text())
    return Course(number, name, credits, core_codes)

def add_courses(courses: set[Course], response_text):
    """Adds the courses from the given HTTP response to the given courses set"""
    soup = BeautifulSoup(response_text, "html.parser")
    tables = soup.find_all("table", class_="sas-responsive-tbl")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows:
            cells = list(row.find_all("td"))
            is_course = len(cells) == 4 and re.match(r"\d\d:\d\d\d:\d\d\d",cells[0].get_text()) and re.match(r"\d(.\d)?", cells[2].get_text())
            if is_course:
                course = get_course(cells)
                courses.add(course)                       

@app.route("/")
def fetch_courses():
    courses = set()
    for path in PATHS:
        response = requests.get(BASE_URL + path)
        add_courses(courses, response.text)
    course_list = [course.__dict__ for course in courses]
    return course_list