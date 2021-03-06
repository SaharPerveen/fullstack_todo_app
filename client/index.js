
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

const addBtn = document.querySelector('#add-task-btn');

addBtn.onclick = function () {
    const taskInput = document.querySelector('#task-input');
    const task = taskInput.value;
    taskInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ task: task })
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));

}

function insertRowIntoTable(data) {

}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    data.forEach(function ({ id, description, date_added }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${description}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id= ${id}> Delete </td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id= ${id}> Edit </td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}