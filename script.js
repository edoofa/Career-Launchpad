let csvData = [];

// Fetch and Parse CSV Data
fetch('data.csv')
  .then(response => response.text())
  .then(data => {
    csvData = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
    }).data;
  });

// Search Student
function searchStudent() {
  const searchField = document.getElementById("search").value;
  const dropdown = document.getElementById("autocomplete-dropdown");
  dropdown.innerHTML = '';
  
  const filteredStudents = csvData.filter(student => {
    const match = student.group.match(/\d{4}(?=\D*$)/);
    const lastFourDigits = match ? match[0] : "";
    return lastFourDigits === searchField || student.group.endsWith(searchField);
  });
  
  filteredStudents.forEach(student => {
    const item = document.createElement("div");
    item.innerText = student.group;
    item.onclick = () => {
      document.getElementById("search").value = student.group;
      document.getElementById("name").innerText = student.name;
      document.getElementById("group").innerText = student.group;
      document.getElementById("college").innerText = student.college;
      document.getElementById("mentor").innerText = student.mentor;
      dropdown.innerHTML = '';
    };
    dropdown.appendChild(item);
  });
}

function validateAndSubmit() {
  const search = document.getElementById('search').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  let isValid = true;
  let errorMessage = "";

  if (!search) {
    isValid = false;
    errorMessage += "Search box cannot be empty.\n";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    isValid = false;
    errorMessage += "Invalid email format.\n";
  }

  if (!phone) {
    isValid = false;
    errorMessage += "Phone number cannot be empty.";
  }

  if (!isValid) {
    alert(errorMessage);
    return;
  }

  submitForm();
}


// Submit Form
function submitForm() {
  const name = document.getElementById("name").innerText;
  const group = document.getElementById("group").innerText;
  const college = document.getElementById("college").innerText;
  const mentor = document.getElementById("mentor").innerText;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  // Get current date and time
  const now = new Date();
  const dateTimeString = now.toISOString();

  const data = {name, group, college, mentor, phone, email, dateTime: dateTimeString};
  
  // Send POST request to Google Apps Script Web App
  fetch('https://script.google.com/macros/s/AKfycbwEnt7WOH1zL1iiaThCLzOcRVmKbwmnPt54YVQPCTDVwDTSw2HA3JG4UJXZBBjSNOeJ5g/exec', {
    method: 'POST',
    mode: 'no-cors', // Google Apps Script doesn't handle CORS well
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(() => {
    alert('Form submitted successfully!');
    window.location.reload();  // Refresh the page

  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
