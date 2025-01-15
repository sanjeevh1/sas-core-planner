from flask import Flask
from bs4 import BeautifulSoup
import aiohttp
import asyncio
from course import Course
import re
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_URL = "https://sasundergrad.rutgers.edu/degree-requirements/core/"
PATHS = [
    "cognitive-skills-and-processes-quantitative-and-formal-reasoning", 
    "contemporary-challenges", 
    "cognitive-skills-and-processes-writing-and-communication", 
    "areas-of-inquiry-arts-and-humanities", 
    "areas-of-inquiry-social-and-historical-analysis"
]

def get_course(row) -> Course:
    """
    Converts cells into a Course object
    Returns None if a Course object cannot be formed
    """
    cells = list(row.find_all("td"))
    if len(cells) != 4:
        return None
    number_match = re.match(r"\d\d:\d\d\d:\d\d\d",cells[0].get_text())
    if number_match is None:
        return None
    number = number_match.group()
    name = cells[1].get_text()
    credits_match = re.match(r"\d(\.\d)?", cells[2].get_text())
    if credits_match is None:
        return None
    credits = float(credits_match.group())                         
    core_codes = re.findall(r"CCD|CCO|NS|SCL|HST|AHo|AHp|AHq|AHr|WCr|WCd|WC|QQ|QR", cells[3].get_text(), re.IGNORECASE)
    if core_codes is None:
        return None
    core_codes = [code.upper() for code in core_codes]
    return Course(number, name, credits, core_codes)

def add_courses(courses: set[Course], response_text):
    """Adds the courses from the given HTTP response to the given courses set"""
    soup = BeautifulSoup(response_text, "html.parser")
    tables = soup.find_all("table", class_="sas-responsive-tbl")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows:
            course = get_course(row)
            if course is not None:
                courses.add(course)                    

@app.route("/")
def fetch_courses():
    courses = set()
    for path in PATHS:
        response = requests.get(BASE_URL + path)
        add_courses(courses, response.text)
    course_list = [course.__dict__ for course in courses]
    return course_list