const body = document.querySelector("body")
const coreSelect = document.getElementById("core-select");
const courseList = document.getElementById("course-list");
let courses;
const coursesTaken = [];
async function fetchCourses() {
    const response = await fetch("https://sas-core-planner.onrender.com");
    console.log("fetched courses");
    courses = await response.json();
    console.log("converted to json");
    console.log(courses);
    courses.forEach(course => {
        courseList.innerHTML += `
            <div id="${course.number}-div">
                <p>${course.number}</p>
                <p>${course.name}</p>
                <p>${course.credits}</p>
                <p>${course.core_codes}</p>
                <button id="${course.number}-btn">Add</button>
            </div>
        `; 
    });
    courses.forEach(course => {
        const addButton = document.getElementById(`${course.number}-btn`);
        addButton.addEventListener("click", () => {
            coursesTaken.push(course);
            console.log(coursesTaken);
            addButton.disabled = true;
        });
    });
}
async function initialize() {
    await fetchCourses();
    coreSelect.addEventListener("change", () => {
        const selectedCore = coreSelect.value;
        courses.forEach(course => {
            const courseDiv = document.getElementById(`${course.number}-div`);
            courseDiv.style.display = course.core_codes.includes(selectedCore) ? "block" : "none";
        })
    });
}

initialize();

 
