class ContactsTable {
    constructor(form) {
        this.form = form;



        this.table = document.createElement('table');
        this.table.id = "contactsTable";
        this.table.classList.add('w3-table-all');

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const thButton = document.createElement('th');

        this.deleteButton = document.createElement("button");
        this.deleteButton.id = "deleteButton";
        this.deleteButton.textContent = "Supprimer";
        this.deleteButton.addEventListener("click", this.deleteButtonHandler.bind(this));
        thButton.appendChild(this.deleteButton);
        tr.appendChild(thButton);
        const ths = ["Prénom", "NOM", "Téléphone", "Ville"];
        ths.forEach((th) => {
            const thElement = document.createElement('th');
            thElement.textContent = th;
            tr.appendChild(thElement);
        });

        thead.appendChild(tr);
        this.table.appendChild(thead);

        document.querySelector('#contactsTableContainer').appendChild(this.table);
    }

    clear() {
        while (this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
    }

    insert(person) {
        const tr = document.createElement('tr');
        tr.dataset.personid = person.id;

        const td = document.createElement('td');
        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "person";
        radio.addEventListener("change", this.changeForm.bind(this));
        td.appendChild(radio);
        tr.appendChild(td);

        this.form.fields.forEach((td) => {
            const tdElement = document.createElement('td');
            tdElement.dataset.id = td;
            tdElement.textContent = person[td];
            tr.appendChild(tdElement);
        });

        this.table.appendChild(tr);
    }

    changeForm(event) {
        const tr = event.target.parentElement.parentElement;

        getPerson(tr.dataset.personid, getPersonCallback);
    }

    deleteButtonHandler(event) {
        event.preventDefault();
        console.log("deleteButtonHandler");
        const tr = document.querySelector('#contactsTable input[type="radio"]:checked').parentElement.parentElement;

        deletePerson(tr.dataset.personid, deletePersonCallback);
    }
}

class ContactsForm {
    constructor() {
        this.form = document.createElement("form");
        this.form.id = "contactsForm";
        this.form.dataset.personid = undefined;

        this.form.innerHTML = `
            <label for='name'>Prénom</label>
            <input type="text" name="name" id="name" placeholder="John"/>
            <label for="surname">NOM:</label>
            <input type="text" name="surname" id="surname" placeholder="SNOW"/>
            <label for="phone">Téléphone:</label>
            <input type="text" name="phone" id="phone" placeholder="0600000001"/>
            <label for="city">Ville:</label>
            <input type="text" name="city" id="city" placeholder="Winterfell"/>
        `;

        this.actionButton = document.createElement("button");
        this.actionButton.id = "actionButton";
        this.actionButton.textContent = "Ajouter";
        this.actionButton.dataset.state = "add";
        this.actionButton.addEventListener("click", this.actionButtonHandler.bind(this));

        this.resetButton = document.createElement("button");
        this.resetButton.id = "resetButton";
        this.resetButton.textContent = "Nouveau";
        this.resetButton.addEventListener("click", this.resetButtonHandler.bind(this));

        this.form.appendChild(this.actionButton);
        this.form.appendChild(this.resetButton);
        document.querySelector('#contactsFormContainer').appendChild(this.form);

        this.fields = ["name", "surname", "phone", "city"];
    }

    changeActionButtonState(state) {
        this.actionButton.dataset.state = state;
        state === "add" ? this.actionButton.textContent = "Ajouter" : this.actionButton.textContent = "Modifier";
    }

    actionButtonHandler(event) {
        event.preventDefault();
        const person = this.getCurrentPerson();
        if (this.actionButton.dataset.state === "add") {
            person.id = undefined;
            createPerson(person, createPersonCallback);
        } else {
            updatePerson(person, updatePersonCallback);
        }
    }

    resetButtonHandler(event) {
        event.preventDefault();
        this.clearForm();
        this.changeActionButtonState("add");
    }

    update(person) {
        this.form.dataset.personid = person.id;

        for (let field of this.fields) {
            this.form.querySelector(`#${field}`).value = person[field];
        }

        this.changeActionButtonState("update");
    }

    clearForm() {
        this.form.dataset.personid = undefined;

        for (let field of this.fields) {
            this.form.querySelector(`#${field}`).value = "";
        }
    }

    getCurrentPerson() {
        const person = {};

        if (this.form.dataset.personid) person.id = this.form.dataset.personid;

        for (let field of this.fields) {
            const value = this.form.querySelector(`#${field}`).value;
            if (!value) return undefined;
            person[field] = value;
        }

        return person;
    }

}

const contactsForm = new ContactsForm();
const contactsTable = new ContactsTable(contactsForm);

// CRUD
const API_URL = "/person";
const REPLIED = 4;
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;


function getAllPersonsCallback(persons) {
    contactsTable.clear();
    persons.forEach((person) => contactsTable.insert(person));
}

function getAllPersons(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_OK:
                    const persons = JSON.parse(xhr.responseText);
                    callback(persons);
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

function createPersonCallback(person) {
    contactsTable.insert(person);
    contactsForm.clearForm();
}

function createPerson(person, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_CREATED:
                    const person = JSON.parse(xhr.responseText);
                    callback(person);
                    break;
            }
        }
    }

    try {
        xhr.open("POST", API_URL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(person));
    } catch (err) {
        alert(err.name + " " + protURL);
    }
}

function getPersonCallback(person) {
    contactsForm.update(person);
}

function getPerson(id, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_OK:
                    const person = JSON.parse(xhr.responseText);
                    callback(person);
                    break;
            }
        }
    }

    try {
        xhr.open("GET", `${API_URL}/${id}`, true);
        xhr.send();
    } catch (err) {
        alert(err.name + " " + protURL);
    }
}

function updatePersonCallback() {
    contactsForm.clearForm();
    contactsForm.changeActionButtonState("add");
    getAllPersons(getAllPersonsCallback);
}

function updatePerson(person, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_NO_CONTENT:
                    callback();
                    break;
            }
        }
    }

    try {
        xhr.open("PUT", API_URL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(person));
    } catch (err) {
        alert(err.name + " " + protURL);
    }
}

function deletePersonCallback() {
    contactsForm.clearForm();
    contactsForm.changeActionButtonState("add");
    getAllPersons(getAllPersonsCallback);
}

function deletePerson(id, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == REPLIED) {
            switch (xhr.status) {
                case HTTP_NO_CONTENT:
                    callback();
                    break;
            }
        }
    }

    try {
        xhr.open("DELETE", `${API_URL}/${id}`, true);
        xhr.send();
    } catch (err) {
        alert(err.name + " " + protURL);
    }
}

getAllPersons(getAllPersonsCallback);