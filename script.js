

function getCourse(cells) {
    const course = {};
    course.number = cells[0].textContent;
    course.name = cells[1].textContent;
    course.credits = parseInt(cells[2].textContent);
    course.coreCodes = cells[3].textContent.split(/, | or /);
    return course;
}

async function addCourses(url, map, parser) {
    const response = await fetch(url);
    const htmlString = response.text();
    const coursesDoc = parser.parseFromString(htmlString);
    const tableRows = coursesDoc.querySelectorAll("table.sas-responsive-tbl > tr");
    for(const row of tableRows) {
        const cells = row.children;
        const isCourse = (cells.length === 4) && (cells[0].textContent !== "Course #");
        if(isCourse) {
            const course = getCourse(cells);
            map.set(course.number, course);
        }
    }
}

function getCourses() {
    const baseUrl = "https://sasundergrad.rutgers.edu/degree-requirements/core/";
    const paths = [
        "cognitive-skills-and-processes-quantitative-and-formal-reasoning", 
        "contemporary-challenges", 
        "cognitive-skills-and-processes-writing-and-communication", 
        "areas-of-inquiry-arts-and-humanities", 
        "areas-of-inquiry-social-and-historical-analysis"
    ];
    const courses = new Map();
    const parser = new DOMParser();
    for(const path of paths) {
        const url = baseUrl + path;
        addCourses(url, courses, parser);
    }
    return courses;
}