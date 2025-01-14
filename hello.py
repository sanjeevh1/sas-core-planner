from flask import Flask
from bs4 import BeautifulSoup
import aiohttp
import asyncio
from course import Course
import re

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
    number = cells[0].get_text()
    name = cells[1].get_text()
    credits = int(cells[2].get_text()[0])
    core_codes = re.split(r"/, | or /", cells[3].get_text())
    return Course(number, name, credits, core_codes)

def add_courses(courses: set[Course], response: aiohttp._RequestContextManager):
    """Adds the courses from the given HTTP response to the given courses set"""
    soup = BeautifulSoup(response.text)
    tables = soup.find_all("table", class_="sas-responsive-tbl")
    for table in tables:
        for row in table.children:
            cells = row.children
            is_course = cells.length == 4 and cells[0].get_text() != "Course #"
            if is_course:
                course = get_course(cells)
                courses.insert(course)
                
    
    

@app.route("/")
async def hello_world():
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(BASE_URL + path) for path in PATHS]
        responses = await asyncio.gather(*tasks)
    courses = set()
    for response in responses:
        add_courses(courses, response)
    return str(responses)