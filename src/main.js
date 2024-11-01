const fs = require('fs');
const path = require('path');

// Access HTML elements
const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');
const activityName = document.getElementById('activityName'); 
const activityDetails = document.getElementById('activityDetails');
const displayContents = document.getElementById('displayContents');

// Directory for storing activity files
const pathName = path.join(__dirname, 'Activities');
if (!fs.existsSync(pathName)) fs.mkdirSync(pathName);

// Helper function to validate file name
function isValidFileName(name) {
    const invalidChars = /[<>:"\/\\|?*]/g;
    return name && !invalidChars.test(name.trim());
}

// Helper function to show error message in displayContents
function showError(message) {
    displayContents.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
}

// Create activity
btnCreate.addEventListener('click', () => {
    const file = path.join(pathName, activityName.value.trim());
    const details = activityDetails.value;

    if (!isValidFileName(activityName.value)) {
        showError("Invalid activity name. Avoid special characters like <>:\"/\\|?*");
        return;
    }

    fs.writeFile(file, details, (err) => {
        if (err) {
            showError("Error creating activity. Please try again.");
            console.error("Error creating activity:", err);
            return;
        }
        displayContents.innerHTML = `<p>Activity '${activityName.value}' was created successfully.</p>`;
        console.log("The activity was created!");
    });
});

// Read activity
btnRead.addEventListener('click', () => {
    const file = path.join(pathName, activityName.value.trim());

    if (!isValidFileName(activityName.value)) {
        showError("Invalid activity name. Please check the name and try again.");
        return;
    }

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                showError("Activity does not exist.");
            } else {
                showError("Error reading activity. Please try again.");
            }
            console.error("Error reading activity:", err);
            return;
        }
        // Display the content in the dedicated display area and load it into the textarea for editing
        displayContents.innerHTML = `<h3>Checklist for ${activityName.value}:</h3><p>${data}</p>`;
        activityDetails.value = data;
        console.log("The activity was read!");
    });
});

// Update activity
btnUpdate.addEventListener('click', () => {
    const file = path.join(pathName, activityName.value.trim());
    const details = activityDetails.value;

    if (!isValidFileName(activityName.value)) {
        showError("Invalid activity name. Please check the name and try again.");
        return;
    }

    if (!fs.existsSync(file)) {
        showError("Activity does not exist. Cannot update.");
        return;
    }

    fs.writeFile(file, details, (err) => {
        if (err) {
            showError("Error updating activity. Please try again.");
            console.error("Error updating activity:", err);
            return;
        }
        displayContents.innerHTML = `<p>Activity '${activityName.value}' was successfully updated.</p>`;
        console.log("The activity was updated!");
    });
});

// Delete activity
btnDelete.addEventListener('click', () => {
    const file = path.join(pathName, activityName.value.trim());

    if (!isValidFileName(activityName.value)) {
        showError("Invalid activity name. Please check the name and try again.");
        return;
    }

    if (!fs.existsSync(file)) {
        showError("Activity does not exist. Cannot delete.");
        return;
    }

    fs.unlink(file, (err) => {
        if (err) {
            showError("Error deleting activity. Please try again.");
            console.error("Error deleting activity:", err);
            return;
        }
        // Clear input fields and display success message
        activityName.value = "";
        activityDetails.value = "";
        displayContents.innerHTML = `<p>Activity '${activityName.value}' was successfully deleted.</p>`;
        console.log("The activity was deleted!");
    });
});
