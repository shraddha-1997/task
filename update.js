const API_URL = "http://localhost:5000/api/tasks";

// Get the task ID from the URL (index3.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("id");

if (!taskId) {
    alert("No task ID found in the URL!");
    window.location.href = "index1.html";  // Redirect if no ID found
}

// Function to generate initials from a name
function getInitials(name) {
    if (!name) return "?"; // Fallback if name is empty
    const nameParts = name.trim().split(" "); // Split name by spaces
    const initials = nameParts.map(part => part[0].toUpperCase()).join(""); // Get first letter of each part
    return initials.length > 2 ? initials.substring(0, 2) : initials; // Limit to 2 letters
}

// Function to format dates to YYYY-MM-DD (for date input fields)
function formatDateForInput(dateString) {
    if (!dateString) return ""; // Handle empty or undefined date
    return dateString.split("T")[0]; // Extracts YYYY-MM-DD from timestamp
}


var priority = document.querySelector("select[name='priority']").value.trim();

// Function to format datetime to "YYYY-MM-DDTHH:MM" (for datetime-local input)
function formatDateTimeForInput(dateTimeString) {
    if (!dateTimeString) return ""; // Handle empty or undefined value
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Fetch the task data and populate the page
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(`${API_URL}/${taskId}`);
        if (!response.ok) throw new Error(`Failed to fetch task data: ${response.status}`);

        const task = await response.json();
        console.log("Fetched Task Data:", task);

        // Update task details in form fields
        document.getElementById("task_owner").value = task.task_owner;
        document.getElementById("task_name").value = task.task_name;
        document.getElementById("description").value = task.description;
        document.getElementById("start_date").value = formatDateForInput(task.start_date);
        document.getElementById("due_date").value = formatDateForInput(task.due_date);
        document.getElementById("reminder").value = formatDateTimeForInput(task.reminder);
        document.getElementById("priority").value = task.priority;
        document.getElementById("status").value = task.status;

        // Update static display fields
        document.getElementById("taskDueDate").textContent = formatDateForInput(task.due_date);
        document.getElementById("taskStatus").textContent = task.status;
        document.getElementById("taskOwnerName").textContent = task.task_owner;
        document.getElementById("initiatedBy").textContent = task.task_owner; // Initiated By also shows task owner

        // Generate initials and insert into profile pictures
        const initials = getInitials(task.task_owner);
        document.getElementById("taskOwnerPic").textContent = initials;
        document.getElementById("commentOwnerPic").textContent = initials;

    } catch (error) {
        console.error("Error fetching task data:", error);
        alert("Failed to load task data!");
    }
});

// Handle the form submission to update the task
document.getElementById("updateForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page






    



    const updatedTaskData = {
        task_owner: document.getElementById("task_owner").value,
        task_name: document.getElementById("task_name").value,
        description: document.getElementById("description").value,
        start_date: formatDateForInput(document.getElementById("start_date").value),
        due_date: formatDateForInput(document.getElementById("due_date").value),
        reminder: formatDateTimeForInput(document.getElementById("reminder").value),
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
    };

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTaskData),
        });

        if (response.ok) {
            alert("✅ Task updated successfully!");
            window.location.href = "index1.html";  // Redirect to task list after update
        } else {
            const errorData = await response.json();
            console.error("❌ Failed to update task:", errorData);
            alert("❌ Error: " + errorData.error);
        }
    } catch (error) {
        console.error("🚨 Fetch Error:", error);
        alert("Something went wrong while updating the task.");
    }
});




