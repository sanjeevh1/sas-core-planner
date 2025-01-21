const body = document.querySelector("body")
const coreSelect = document.getElementById("core-select");
const courseList = document.getElementById("course-list");
const courseTable = document.getElementById("course-table");
let courses;
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

function removeCourse(course) {
    console.log("Removing course");
    const row = document.getElementById(`${course.number}-row`);
    courseTable.deleteRow(row.rowIndex);
    for(const code of Object.keys(codesTaken)) {
        if(course.core_codes.includes(code)) {
            codesTaken[code]--;
            const codeSpan = document.getElementById(code);
            codeSpan.textContent = codesTaken[code];
            if(code.includes("AH") && codesTaken[code] === 0) {
                ahCodesTaken--;
                ahCodes.textContent = ahCodesTaken;
            }
        }
    }
    for(const category of Object.keys(categoriesTaken)) {
        const codes = category.split("/");
        if (codes.some(code => course.core_codes.includes(code))) {
            categoriesTaken[category]--;
            const categorySpan = document.getElementById(category);
            categorySpan.textContent = categoriesTaken[category];
        }
    }
    const courseDiv = document.getElementById(`${course.number}-div`);
    const removeBtn = courseDiv.querySelector("button")
    removeBtn.remove();
    const addBtn = document.createElement("button");
    addBtn.classList.add("add-btn");
    addBtn.textContent = "+";
    addBtn.addEventListener("click", () => void addCourse(course));
    courseDiv.appendChild(addBtn);
}

function addCourse(course) {
    console.log("adding course");
    const courseTable = document.getElementById("course-table");
    const row = courseTable.insertRow(-1);
    row.id = `${course.number}-row`;
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
    const removeCell = row.insertCell(-1);
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "-";
    removeCell.appendChild(removeButton);
    removeButton.addEventListener("click", () => void removeCourse(course));
    const courseDiv = document.getElementById(`${course.number}-div`);
    const addBtn = courseDiv.querySelector("button")
    addBtn.remove();
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "-";
    removeBtn.addEventListener("click", () => void removeCourse(course));
    courseDiv.appendChild(removeBtn);
}

async function fetchCourses() {
    const response = await fetch("http://127.0.0.1:5000");
    console.log("fetched courses");
    courses = await response.json();
    console.log("converted to json");
    courses.forEach(course => {
        courseList.innerHTML += `
            <div class="course-div" id="${course.number}-div">
                <p>${course.number}</p>
                <p>${course.name}</p>
                <p>${course.credits}</p>
                <p>${course.core_codes.join(", ")}</p>
                <button class="add-btn">+</button>
            </div>
        `;
    });
    courses.forEach(course => {
        const courseDiv = document.getElementById(`${course.number}-div`);
        const addButton = courseDiv.querySelector("button");
        addButton.addEventListener("click", () => void addCourse(course));
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

 
