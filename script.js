const body = document.querySelector("body")
const coreSelect = document.getElementById("core-select");
const courseList = document.getElementById("course-list");
let courses;
async function fetchCourses() {
    const response = await fetch("https://sas-core-planner.onrender.com");
    console.log("fetched courses");
    courses = await response.json();
    console.log("converted to json");
    console.log(courses);
    courses.forEach(course => {
        courseList.innerHTML += `
            <div>
                <p>${course.number}</p>
                <p>${course.name}</p>
                <p>${course.credits}</p>
                <p>${course.core_codes}</p>
            </div>
        `; 
    });
}
async function initialize() {
    await fetchCourses();
    coreSelect.addEventListener("change", () => {
        const selectedCore = coreSelect.value;
        courseList.innerHTML = "";
        const selectedCourses = courses.filter(course => course.core_codes.includes(selectedCore));
        selectedCourses.forEach(course => {
            courseList.innerHTML += `
                <div id="${course.number}">
                    <p>${course.number}</p>
                    <p>${course.name}</p>
                    <p>${course.credits}</p>
                    <p>${course.core_codes}</p>
                </div>
            `;
        });
    });
}

initialize();

 
