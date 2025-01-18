const body = document.querySelector("body")
const coreSelect = document.getElementById("core-select");
const courseList = document.getElementById("course-list");
let courses;
const coursesTaken = [];
const coursesRequied = {
    "CCD": 1,
    "CCO": 1,
    "NS": 2,
    "SCL": 1,
    "HST": 1,
    "AH": 2,
    "WC": 1,
    "WCR": 1,
    "WCD": 1,
    "QQ": 1,
    "QR": 1,
};
const MAX_CORES = 2;

function isValid(checkedCores) {
    if (checkedCores.length === 0) {
        alert("Please select a core code");
        return false;
    }
    if (checkedCores.length > MAX_CORES) {
        alert(`You can only select ${MAX_CORES} core codes`);
        return false;
    }
    if (checkedCores.includes("CCD") && checkedCores.includes("CCO")) {
        alert("You cannot take CCD and CCO together");
        return false;
    }
    if (checkedCores.includes("WCR") && checkedCores.includes("WCD")) {
        alert("You cannot take WCR and WCD together");
        return false;
    }
    if (checkedCores.includes("QQ") && checkedCores.includes("QR")) {
        alert("You cannot take QQ and QR together");
        return false;
    }
    if (checkedCores.includes("HST") && checkedCores.includes("SCL")) {
        alert("You cannot take HST and SCL together");
        return false;
    }
    return true;
}

function getCheckedCores(course) {
    const codesDiv = document.getElementById(`${course.number}-codes`);
    const checkboxes = codesDiv.querySelectorAll("input");
    const checkedCores = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCores.push(checkbox.value);
        }
    });
    return checkedCores;
}



async function fetchCourses() {
    const response = await fetch("http://127.0.0.1:5000");
    console.log("fetched courses");
    courses = await response.json();
    console.log("converted to json");
    courses.forEach(course => {
        courseList.innerHTML += `
            <div id="${course.number}-div" class="course-div">
                <p>${course.number}</p>
                <p>${course.name}</p>
                <p>${course.credits}</p>
                <div id="${course.number}-codes"></div>
                <button id="${course.number}-btn">Add</button>
            </div>
        `;
        const codesDiv = document.getElementById(`${course.number}-codes`);
        course.core_codes.forEach(core => {
            codesDiv.innerHTML += `
                <input type="checkbox" value="${core}"/>
                <label>${core}</label>
            `;
        }); 
    });
    courses.forEach(course => {
        const addButton = document.getElementById(`${course.number}-btn`);
        addButton.addEventListener("click", () => {
            const checkedCores = getCheckedCores(course);
            if(isValid(checkedCores)) {
                coursesTaken.push(course);
                console.log(coursesTaken);
            } 
        });
    });
}
async function initialize() {
    await fetchCourses();
    coreSelect.addEventListener("change", () => {
        const selectedCore = coreSelect.value;
        courses.forEach(course => {
            const courseDiv = document.getElementById(`${course.number}-div`);
            courseDiv.style.display = course.core_codes.includes(selectedCore) ? "grid" : "none";
        })
    });
}

initialize();

 
