const body = document.querySelector("body")
const coreSelect = document.getElementById("core-select");
const courseList = document.getElementById("course-list");
const courseTable = document.getElementById("course-table");
let courses;
const coursesAdded = [];
const courseCounts = document.getElementsByClassName("course-count");

const codesTaken = {
    "CCD": 0,
    "CCO": 0,
    "NS": 0,
    "SCL": 0,
    "HST": 0,
    "AHO": 0,
    "AHP": 0,
    "AHQ": 0,
    "AHR": 0,
    "WCR": 0,
    "WCD": 0,
    "WC": 0,
    "QQ": 0,
    "QR": 0
};
const categoriesTaken = {
    "CCD/CCO": 0,
    "SCL/HST": 0,
    "AHO/AHP/AHQ/AHR": 0,
    "WCR/WCD": 0,
    "QQ/QR": 0
};
let ahCodesTaken = 0;
const ahCodes = document.getElementById("AH-codes");
const MAX_CORES = 2;

function isValid(course) {
    const checkedCores = getCheckedCores(course);
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
    if (checkedCores.length == 2 && checkedCores[0].includes("AH") && checkedCores[1].includes("AH")) {
        alert("You cannot take two AH codes together");
        return false;
    }
    return true;
}

function addCourse(course) {
    const courseTable = document.getElementById("course-table");
    const row = courseTable.insertRow(-1);
    const numberCell = row.insertCell(0);
    numberCell.textContent = course.number;
    for(const code of Object.keys(codesTaken)) {
        const cell = row.insertCell(-1);
        if(course.core_codes.includes(code)) {
            if(code.includes("AH") && codesTaken[code] === 0) {
                ahCodesTaken++;
                ahCodes.textContent = ahCodesTaken;
            }
            codesTaken[code]++;
            const codeSpan = document.getElementById(code);
            codeSpan.textContent = codesTaken[code];
            cell.style.backgroundColor = "green";
        }
    }
    for(const category of Object.keys(categoriesTaken)) {
        const codes = category.split("/");
        if (codes.some(code => course.core_codes.includes(code))) {
            categoriesTaken[category]++;
            const categorySpan = document.getElementById(category);
            categorySpan.textContent = categoriesTaken[category];
        }
    }
    row.insertCell(-1);
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
            if(isValid(course)) {
                addCourse(course);
                addButton.disabled = true;
                console.log("added course");
            } else {
                console.log("invalid course");
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
            courseDiv.style.display = course.core_codes.some(prefix => selectedCore.includes(prefix)) ? "grid" : "none";
        });
    });
}

initialize();

 
