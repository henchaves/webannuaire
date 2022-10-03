
let personId = undefined;
let buttonState = "add";

const form = document.getElementById('idForm');
const addButton = form.querySelector('#addButton');
const clearButton = form.querySelector('#clearButton');

const inputRadios = document.querySelectorAll('input[type="radio"]');

function changeButtonState(state) {
    buttonState = state;
    state === "add" ? addButton.innerHTML = "Ajouter" : addButton.innerHTML = "Modifier";
}

function fillForm(event) {
    const tr = event.target.parentElement.parentElement;
    form.querySelector("#name").value = tr.querySelector("[data-id='name']").textContent;
    form.querySelector("#surname").value = tr.querySelector("[data-id='surname']").textContent;
    form.querySelector("#phone").value = tr.querySelector("[data-id='phone']").textContent;
    form.querySelector("#city").value = tr.querySelector("[data-id='city']").textContent;
    changeButtonState("update");
}

function clearForm() {
    form.querySelector("#name").value = "";
    form.querySelector("#surname").value = "";
    form.querySelector("#phone").value = "";
    form.querySelector("#city").value = "";
}

clearButton.addEventListener('click', function (event) {
    clearForm();
    changeButtonState("add");

});

inputRadios.forEach((input) => {
    input.addEventListener("change", fillForm)
});

class ContactsTable {
    constructor() {
        this.table = document.createElement('table');
        this.table.id = "contactsTable";
        this.table.classList.add('w3-table-all');

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        const ths = ["", "Prénom", "NOM", "Téléphone", "Ville"];
        ths.forEach((th) => {
            const thElement = document.createElement('th');
            thElement.textContent = th;
            tr.appendChild(thElement);
        });

        thead.appendChild(tr);
        this.table.appendChild(thead);
        document.querySelector('#contactsTableContainer').appendChild(this.table);
    }

    insert(person) {
        const tr = document.createElement('tr');
        tr.dataset.personid = person.id;

        const td = document.createElement('td');
        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "person";
        radio.addEventListener("change", fillForm);
        td.appendChild(radio);
        tr.appendChild(td);

        const tds = ["name", "surname", "phone", "city"];
        tds.forEach((td) => {
            const tdElement = document.createElement('td');
            tdElement.dataset.id = td;
            tdElement.textContent = person[td];
            tr.appendChild(tdElement);
        });

        this.table.appendChild(tr);
    }
}

const contactsTable = new ContactsTable();

// REST API
const REPLIED = 4;
const HTTP_OK = 200;
const API_URL = "/person";

function getAllPersons() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_OK:
                    const persons = JSON.parse(xhr.responseText);
                    persons.forEach((person) => {
                        console.log(person);
                        contactsTable.insert(person);
                    });
                    break;
            }
        }
    }

    try {
        xhr.open("GET", API_URL, true);
        xhr.send();
    } catch (err) {
        alert(err.name + " " + protURL);
    }
}

getAllPersons();