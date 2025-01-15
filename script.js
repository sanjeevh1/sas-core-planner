const body = document.querySelector("body")
async function fetchCourses() {
    const response = await fetch("https://sas-core-planner.onrender.com");
    const courses = await response.json();
    console.log(courses);
    courses.forEach(course => {
        body.innerHTML += `
            <div>
                <p>${course.number}</p>
                <p>${course.name}</p>
                <p>${course.credits}</p>
                <p>${course.core_codes}</p>
            </div>
        `; 
    });
}
fetchCourses();
 
