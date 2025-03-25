const API_URL = "http://localhost:5000/api/tasks";

document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});

function fetchTasks() {
  console.log("📡 Fetching tasks...");

  fetch(API_URL)
      .then(res => {
          console.log("Response status:", res.status);
          return res.json();
      })
      .then(tasks => {
          console.log("✅ Tasks received:", tasks);

          let tableBody = document.querySelector("#taskTable tbody");
          tableBody.innerHTML = ""; // Clear previous content

          tasks.forEach(task => {
              let row = document.createElement("tr");
              row.id = `task-${task.id}`;

              row.innerHTML = `
                  <td>${task.task_name}</td>  
                  <td>${task.task_owner}</td>
                  <td>
                   <button class="btn btn-primary btn-sm" onclick="window.location.href='index3.html?id=${task.id}'">📝 Update</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                          ❌ Delete
                      </button>
                  </td>
              `;
              tableBody.appendChild(row);
          });
      })
      .catch(err => console.error("🚨 Error fetching tasks:", err));
}

function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`${API_URL}/${taskId}`, { method: "DELETE" })
      .then(res => {
          if (!res.ok) throw new Error("Failed to delete task");
          return res.json();
      })
      .then(() => {
          console.log(`Task ${taskId} deleted`);
          document.querySelector(`#task-${taskId}`).remove();  // ✅ Removes from UI
      })
      .catch(err => console.error("Error deleting task:", err));
}



document.getElementById("taskForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    const formData = new FormData(event.target); // Get form data

    const taskData = {
        task_owner: formData.get("task_owner"),
        task_name: formData.get("task_name"),
        description: formData.get("description"),
        start_date: formData.get("start_date"),
        due_date: formData.get("due_date"),
        reminder: formData.get("reminder"),
        priority: formData.get("priority"),
        status: formData.get("status"),
    };

    console.log("📤 Sending task data:", taskData); // Debugging

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            alert("✅ Task added successfully!");
            event.target.reset(); // Clear form after submission
            window.location.href = "index1.html";
         //   fetchTasks(); // Reload tasks
        } else {
            const errorData = await response.json();
            console.error("❌ Failed to add task:", errorData);
            alert("❌ Error: " + errorData.error);
        }
    } catch (error) {
        console.error("🚨 Fetch Error:", error);
        alert("Something went wrong!");
    }
});



document.getElementById("taskForm").addEventListener("input", function (event) {
    validateForm(); // Validate the form on input change
});

document.getElementById("taskForm").addEventListener("submit", function (event) {
    // Prevent default form submission to apply our own validation
    event.preventDefault(); 

    // Validate the form
    let valid = validateForm();

    // If form is valid, you can allow submission (or proceed with other logic)
    if (valid) {
        alert("✅ Task added successfully!");
        // Uncomment this line if you want to submit the form programmatically
        // document.getElementById("taskForm").submit(); 
    } else {
        alert("❌ Please correct the errors before submitting!");
    }
});

function validateForm() {
    let valid = true;
    clearErrors(); // Clear previous errors

    // Get form fields
    const task_owner = document.querySelector("[name='task_owner']").value.trim();
    const task_name = document.querySelector("[name='task_name']").value.trim();
    const description = document.querySelector("[name='description']").value.trim();
    const start_date = document.querySelector("[name='start_date']").value.trim();
    const due_date = document.querySelector("[name='due_date']").value.trim();
    const reminder = document.querySelector("[name='reminder']").value.trim();
    const priority = document.querySelector("[name='priority']").value.trim();
    const status = document.querySelector("[name='status']").value.trim();

    // Task Owner Validation (Only letters allowed)
    if (task_owner === "") {
        showError("task_owner", "Task owner is required.");
        valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(task_owner)) {
        showError("task_owner", "Task owner must only contain letters.");
        valid = false;
    }

    // Task Name Validation (Only letters allowed)
    if (task_name === "") {
        showError("task_name", "Task name is required.");
        valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(task_name)) {
        showError("task_name", "Task name must only contain letters.");
        valid = false;
    }

    // Description Validation (Optional, no restrictions in this case)
    if (description === "") {
        showError("description", "Description is optional, but it’s good to have one!");
    }

    // Start Date Validation
    if (start_date === "") {
        showError("start_date", "Start date is required.");
        valid = false;
    }

    // Due Date Validation
    if (due_date === "") {
        showError("due_date", "Due date is required.");
        valid = false;
    }

    // Reminder Validation
    if (reminder === "") {
        showError("reminder", "Reminder date is required.");
        valid = false;
    }

    // Priority Validation (Only Low, Moderate, or High)
    if (priority === "") {
        showError("priority", "Priority is required.");
        valid = false;
    }

    // Status Validation (Open, In Progress, or Completed)
    if (status === "") {
        showError("status", "Status is required.");
        valid = false;
    }

    // Disable or Enable submit button based on validity
    toggleSubmitButton(valid);

    return valid; // Return whether the form is valid or not
}

// Function to show error message next to the field
function showError(fieldName, message) {
    const field = document.querySelector(`[name='${fieldName}']`);
    field.classList.add("is-invalid"); // Bootstrap class to show error state
    
    // Create and display the error message
    const errorElement = document.createElement("div");
    errorElement.classList.add("invalid-feedback");
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}

// Function to clear previous error messages
function clearErrors() {
    const fields = document.querySelectorAll(".form-control");
    fields.forEach(field => {
        field.classList.remove("is-invalid"); // Remove error class
        const error = field.parentElement.querySelector(".invalid-feedback");
        if (error) error.remove(); // Remove error messages
    });
}

// Function to toggle the submit button
function toggleSubmitButton(isValid) {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = !isValid; // Disable button if invalid, enable if valid
}
