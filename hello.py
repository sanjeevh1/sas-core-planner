from flask import Flask
import aiohttp
import asyncio

app = Flask(__name__)

BASE_URL = "https://sasundergrad.rutgers.edu/degree-requirements/core/"
PATHS = [
    "cognitive-skills-and-processes-quantitative-and-formal-reasoning", 
    "contemporary-challenges", 
    "cognitive-skills-and-processes-writing-and-communication", 
    "areas-of-inquiry-arts-and-humanities", 
    "areas-of-inquiry-social-and-historical-analysis"
]

@app.route("/")
async def hello_world():
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(BASE_URL + path) for path in PATHS]
        responses = await asyncio.gather(*tasks)
    return str(responses)