document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener
    ('click', function (event) {
        if (event.target.className === "delete-row-btn") {
            deleteRowById(event.target.dataset.id);
        }
        if (event.target.className === "edit-row-btn") {
            handleEditRow(event.target.dataset.id);
        }
    });

const updateBtn = document.querySelector('#update-row-btn');

function deleteRowById(id) {
    console.log(id);
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-task-input').dataset.id = id;
}

updateBtn.onclick = function () {
    const updateTaskInput = document.querySelector('#update-task-input');

    console.log(updateTaskInput);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: updateTaskInput.dataset.id,
            task: updateTaskInput.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })

}

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
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id= ${data.id}> Delete </td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id= ${data.id}> Edit </td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    data.forEach(function ({ id, task, date_added }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${task}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id= ${id}> Delete </td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id= ${id}> Edit </td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}