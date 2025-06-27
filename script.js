document.addEventListener('DOMContentLoaded', () => {
    // Initial load of residents from localStorage or dummy data
    loadResidents();
    renderResidentList();
});

let residents = [];
let currentResidentId = null; // Stores the ID of the currently viewed resident

// --- Data Management ---

function loadResidents() {
    const storedResidents = localStorage.getItem('residents');
    if (storedResidents) {
        residents = JSON.parse(storedResidents);
    } else {
        // Dummy data for initial setup
        residents = [
            {
                id: 'res-1',
                name: 'Max Mustermann',
                room: '101',
                age: 78,
                gender: 'männlich',
                diagnosis: 'Demenz (Alzheimer-Typ), Diabetes Mellitus Typ 2',
                allergies: 'Penicillin',
                preferences: 'Liebt Spaziergänge, hört gerne klassische Musik.',
                woundHistory: [
                    { date: '2025-06-01', location: 'Sakrum', type: 'Dekubitus Grad II', size: '3x2x0.5', baseExudate: 'Fibrin/Wenig', care: 'NaCl Spülung, Hydrokolloid', remarks: 'Leichte Rötung um die Wunde.' },
                    { date: '2025-06-15', location: 'Sakrum', type: 'Dekubitus Grad II', size: '2.5x1.8x0.4', baseExudate: 'Granulation/Wenig', care: 'NaCl Spülung, Hydrokolloid', remarks: 'Wundränder schließen sich.' }
                ],
                physioHistory: [
                    { date: '2025-06-10', actions: 'Gangtraining mit Rollator', progress: 'Verbesserte Stabilität, noch unsicher bei Richtungswechseln.' },
                    { date: '2025-06-20', actions: 'Gleichgewichtsübungen', progress: 'Kann 10 Sekunden freistehen.' }
                ],
                ergoHistory: [
                    { date: '2025-06-05', actions: 'Feinmotorikübungen mit Steckspielen', progress: 'Kann große Bausteine greifen.' },
                    { date: '2025-06-18', actions: 'ADL-Training (Anziehen)', progress: 'Benötigt noch Unterstützung beim Knöpfe schließen.' }
                ],
                speechHistory: [
                    { date: '2025-06-08', actions: 'Schluckübungen (Eiswürfel)', progress: 'Weniger Husten beim Trinken angedickter Flüssigkeiten.' },
                    { date: '2025-06-22', actions: 'Sprechübungen (Lautbildung)', progress: 'Artikulation leicht verbessert, wird besser verstanden.' }
                ]
            },
            {
                id: 'res-2',
                name: 'Anna Schmidt',
                room: '205',
                age: 85,
                gender: 'weiblich',
                diagnosis: 'Schlaganfall (Z.n.), Dysphagie',
                allergies: 'Keine bekannten',
                preferences: 'Mag ruhige Umgebung, Tee, gestrichenes Brot.',
                woundHistory: [],
                physioHistory: [
                    { date: '2025-06-03', actions: 'Passive Mobilisation Arm/Bein links', progress: 'Geringe passive Bewegung möglich.' }
                ],
                ergoHistory: [
                    { date: '2025-06-07', actions: 'Positionierung im Rollstuhl', progress: 'Sitzhaltung stabiler.' }
                ],
                speechHistory: [
                    { date: '2025-06-01', actions: 'Schlucktraining mit Joghurt', progress: 'Schluckakt sicher, aber langsam.' },
                    { date: '2025-06-14', actions: 'Stimulation Mundraum', progress: 'Reaktion auf Reize verbessert.' }
                ]
            }
        ];
        saveResidents(); // Save dummy data to localStorage
    }
}

function saveResidents() {
    localStorage.setItem('residents', JSON.stringify(residents));
}

function getResidentById(id) {
    return residents.find(res => res.id === id);
}

// --- View Management ---

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

function showDashboard() {
    showView('dashboardView');
    renderResidentList(); // Re-render to ensure latest data is shown
    document.getElementById('residentSearch').value = ''; // Clear search
}

function showResidentForm() {
    showView('addResidentForm');
    // Clear the form fields
    document.getElementById('newResidentName').value = '';
    document.getElementById('newResidentRoom').value = '';
    document.getElementById('newResidentAge').value = '';
    document.getElementById('newResidentGender').value = 'männlich'; // Default
}

function showResidentDetails(residentId) {
    currentResidentId = residentId;
    const resident = getResidentById(residentId);
    if (!resident) {
        alert('Bewohner nicht gefunden!');
        showDashboard();
        return;
    }

    // Populate basic data tab
    document.getElementById('residentDetailName').textContent = resident.name;
    document.getElementById('detailName').value = resident.name;
    document.getElementById('detailRoom').value = resident.room;
    document.getElementById('detailAge').value = resident.age;
    document.getElementById('detailGender').value = resident.gender;
    document.getElementById('detailDiagnosis').value = resident.diagnosis;
    document.getElementById('detailAllergies').value = resident.allergies;
    document.getElementById('detailPreferences').value = resident.preferences;

    // Clear and populate history tables
    renderWoundHistory(resident.woundHistory || []);
    renderPhysioHistory(resident.physioHistory || []);
    renderErgoHistory(resident.ergoHistory || []);
    renderSpeechHistory(resident.speechHistory || []);

    // Set default values for input fields if they are empty
    document.getElementById('woundLocation').value = '';
    document.getElementById('woundType').value = '';
    document.getElementById('woundLength').value = '';
    document.getElementById('woundWidth').value = '';
    document.getElementById('woundDepth').value = '';
    document.getElementById('woundBase').value = '';
    document.getElementById('woundExudate').value = '';
    document.getElementById('woundEdges').value = '';
    document.getElementById('woundCarePlan').value = '';

    document.getElementById('physioProblem').value = resident.physioProblem || '';
    document.getElementById('physioGoals').value = resident.physioGoals || '';
    document.getElementById('physioFrequency').value = resident.physioFrequency || '';
    document.getElementById('physioDuration').value = resident.physioDuration || '';
    document.getElementById('physioExercises').value = resident.physioExercises || '';

    document.getElementById('ergoProblem').value = resident.ergoProblem || '';
    document.getElementById('ergoGoals').value = resident.ergoGoals || '';
    document.getElementById('ergoFrequency').value = resident.ergoFrequency || '';
    document.getElementById('ergoDuration').value = resident.ergoDuration || '';
    document.getElementById('ergoExercises').value = resident.ergoExercises || '';

    document.getElementById('speechProblem').value = resident.speechProblem || '';
    document.getElementById('speechGoals').value = resident.speechGoals || '';
    document.getElementById('speechFrequency').value = resident.speechFrequency || '';
    document.getElementById('speechDuration').value = resident.speechDuration || '';
    document.getElementById('speechExercises').value = resident.speechExercises || '';
    document.getElementById('speechDietPlan').value = resident.speechDietPlan || '';

    showView('residentDetailView');
    openTab(null, 'basicData'); // Open basic data tab by default
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    } else {
        // If called without an event (e.g., on page load)
        document.querySelector(`.tab-button[onclick*='${tabName}']`).className += " active";
    }
}

// --- Resident List Rendering ---

function renderResidentList(filterText = '') {
    const residentListDiv = document.getElementById('residentList');
    residentListDiv.innerHTML = ''; // Clear existing list

    const filteredResidents = residents.filter(resident =>
        resident.name.toLowerCase().includes(filterText.toLowerCase()) ||
        resident.room.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredResidents.length === 0 && filterText === '') {
        residentListDiv.innerHTML = '<p>Es sind noch keine Bewohner angelegt. Bitte fügen Sie einen neuen Bewohner hinzu.</p>';
        return;
    } else if (filteredResidents.length === 0 && filterText !== '') {
        residentListDiv.innerHTML = '<p>Keine Bewohner gefunden, die dem Suchkriterium entsprechen.</p>';
        return;
    }

    filteredResidents.forEach(resident => {
        const card = document.createElement('div');
        card.classList.add('resident-card');
        card.onclick = () => showResidentDetails(resident.id);

        // Simple status indication (can be expanded)
        let status = 'Stabil';
        let statusClass = 'status-indicator';
        if (resident.woundHistory && resident.woundHistory.length > 0 && resident.woundHistory[resident.woundHistory.length - 1].type.includes('Dekubitus')) {
            status = 'Wundversorgung nötig';
            statusClass += ' warning';
        }
        // Add more complex logic for therapy appointments here

        card.innerHTML = `
            <h4>${resident.name} <span style="float:right;">Zimmer: ${resident.room}</span></h4>
            <p>Alter: ${resident.age}</p>
            <p>Diagnose: ${resident.diagnosis.split(',')[0] || 'N/A'}</p>
            <p><span class="${statusClass}">Status: ${status}</span></p>
        `;
        residentListDiv.appendChild(card);
    });
}

document.getElementById('residentSearch').addEventListener('input', (event) => {
    renderResidentList(event.target.value);
});


// --- Add/Edit Resident Logic ---

function addResident() {
    const name = document.getElementById('newResidentName').value.trim();
    const room = document.getElementById('newResidentRoom').value.trim();
    const age = parseInt(document.getElementById('newResidentAge').value);
    const gender = document.getElementById('newResidentGender').value;

    if (!name || !room) {
        alert('Name und Zimmernummer sind Pflichtfelder.');
        return;
    }

    const newResident = {
        id: 'res-' + Date.now(), // Simple unique ID
        name,
        room,
        age: isNaN(age) ? null : age,
        gender,
        diagnosis: '',
        allergies: '',
        preferences: '',
        woundHistory: [],
        physioHistory: [],
        ergoHistory: [],
        speechHistory: []
        // Add other initial properties as needed
    };

    residents.push(newResident);
    saveResidents();
    alert('Neuer Bewohner angelegt!');
    showDashboard();
}

function saveResidentDetails() {
    const resident = getResidentById(currentResidentId);
    if (!resident) return;

    // Update basic data
    resident.name = document.getElementById('detailName').value.trim();
    resident.room = document.getElementById('detailRoom').value.trim();
    resident.age = parseInt(document.getElementById('detailAge').value);
    resident.gender = document.getElementById('detailGender').value;
    resident.diagnosis = document.getElementById('detailDiagnosis').value.trim();
    resident.allergies = document.getElementById('detailAllergies').value.trim();
    resident.preferences = document.getElementById('detailPreferences').value.trim();

    // Update therapy plan general info (if applicable to current tab)
    // This is simplified; in a real app, you might only save the current tab's main fields
    // or have separate save buttons per tab.
    resident.physioProblem = document.getElementById('physioProblem').value.trim();
    resident.physioGoals = document.getElementById('physioGoals').value.trim();
    resident.physioFrequency = document.getElementById('physioFrequency').value.trim();
    resident.physioDuration = document.getElementById('physioDuration').value.trim();
    resident.physioExercises = document.getElementById('physioExercises').value.trim();

    resident.ergoProblem = document.getElementById('ergoProblem').value.trim();
    resident.ergoGoals = document.getElementById('ergoGoals').value.trim();
    resident.ergoFrequency = document.getElementById('ergoFrequency').value.trim();
    resident.ergoDuration = document.getElementById('ergoDuration').value.trim();
    resident.ergoExercises = document.getElementById('ergoExercises').value.trim();

    resident.speechProblem = document.getElementById('speechProblem').value.trim();
    resident.speechGoals = document.getElementById('speechGoals').value.trim();
    resident.speechFrequency = document.getElementById('speechFrequency').value.trim();
    resident.speechDuration = document.getElementById('speechDuration').value.trim();
    resident.speechExercises = document.getElementById('speechExercises').value.trim();
    resident.speechDietPlan = document.getElementById('speechDietPlan').value.trim();

    saveResidents();
    alert('Änderungen gespeichert!');
    showResidentDetails(currentResidentId); // Re-render details to show updates
}

function deleteResident() {
    if (confirm(`Sind Sie sicher, dass Sie ${getResidentById(currentResidentId).name} löschen möchten? Alle zugehörigen Daten gehen verloren.`)) {
        residents = residents.filter(res => res.id !== currentResidentId);
        saveResidents();
        alert('Bewohner gelöscht.');
        showDashboard();
    }
}

// --- Wound Management ---

function addWoundEntry() {
    const resident = getResidentById(currentResidentId);
    if (!resident) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const location = document.getElementById('woundLocation').value.trim();
    const type = document.getElementById('woundType').value.trim();
    const length = parseFloat(document.getElementById('woundLength').value);
    const width = parseFloat(document.getElementById('woundWidth').value);
    const depth = parseFloat(document.getElementById('woundDepth').value);
    const base = document.getElementById('woundBase').value;
    const exudate = document.getElementById('woundExudate').value;
    const edges = document.getElementById('woundEdges').value.trim();
    const care = document.getElementById('woundCarePlan').value.trim();

    if (!location || !type) {
        alert('Lokalisation und Wundart sind Pflichtfelder für die Dokumentation.');
        return;
    }

    const newEntry = {
        date: today,
        location,
        type,
        size: `${length || 'N/A'}x${width || 'N/A'}x${depth || 'N/A'}`,
        baseExudate: `${base || 'N/A'}/${exudate || 'N/A'}`,
        care: care || 'N/A',
        remarks: edges || 'N/A'
    };

    resident.woundHistory.push(newEntry);
    saveResidents();
    renderWoundHistory(resident.woundHistory);
    // Clear input fields after adding
    document.getElementById('woundLocation').value = '';
    document.getElementById('woundType').value = '';
    document.getElementById('woundLength').value = '';
    document.getElementById('woundWidth').value = '';
    document.getElementById('woundDepth').value = '';
    document.getElementById('woundBase').value = '';
    document.getElementById('woundExudate').value = '';
    document.getElementById('woundEdges').value = '';
    document.getElementById('woundCarePlan').value = '';
}

function renderWoundHistory(history) {
    const tableBody = document.getElementById('woundHistoryTable').querySelector('tbody');
    tableBody.innerHTML = '';
    history.slice().reverse().forEach((entry, index) => { // Reverse to show latest first
        const row = tableBody.insertRow();
        row.insertCell().textContent = entry.date;
        row.insertCell().textContent = `${entry.location} / ${entry.type}`;
        row.insertCell().textContent = entry.size;
        row.insertCell().textContent = entry.baseExudate;
        row.insertCell().textContent = `${entry.care} (${entry.remarks})`;
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.classList.add('action-btn');
        deleteBtn.onclick = () => deleteHistoryEntry('woundHistory', history.length - 1 - index); // Adjust index due to reverse
        actionCell.appendChild(deleteBtn);
    });
}

// --- Physiotherapy Management ---

function addPhysioEntry() {
    const resident = getResidentById(currentResidentId);
    if (!resident) return;

    const today = new Date().toISOString().split('T')[0];
    const actions = document.getElementById('physioExercises').value.trim();
    const progress = document.getElementById('physioGoals').value.trim(); // Using goals as general remarks for history

    if (!actions) {
        alert('Bitte geben Sie Maßnahmen/Übungen für den Physio-Eintrag an.');
        return;
    }

    const newEntry = {
        date: today,
        actions,
        progress: progress || 'Keine spezifische Bemerkung.'
    };
    resident.physioHistory.push(newEntry);
    saveResidents();
    renderPhysioHistory(resident.physioHistory);
    // You might want to clear only the specific history input, not the general plan fields
    // document.getElementById('physioExercises').value = '';
    // document.getElementById('physioGoals').value = '';
}

function renderPhysioHistory(history) {
    const tableBody = document.getElementById('physioHistoryTable').querySelector('tbody');
    tableBody.innerHTML = '';
    history.slice().reverse().forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = entry.date;
        row.insertCell().textContent = entry.actions;
        row.insertCell().textContent = entry.progress;
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.classList.add('action-btn');
        deleteBtn.onclick = () => deleteHistoryEntry('physioHistory', history.length - 1 - index);
        actionCell.appendChild(deleteBtn);
    });
}

// --- Ergotherapy Management ---

function addErgoEntry() {
    const resident = getResidentById(currentResidentId);
    if (!resident) return;

    const today = new Date().toISOString().split('T')[0];
    const actions = document.getElementById('ergoExercises').value.trim();
    const progress = document.getElementById('ergoGoals').value.trim();

    if (!actions) {
        alert('Bitte geben Sie Maßnahmen/Übungen für den Ergo-Eintrag an.');
        return;
    }

    const newEntry = {
        date: today,
        actions,
        progress: progress || 'Keine spezifische Bemerkung.'
    };
    resident.ergoHistory.push(newEntry);
    saveResidents();
    renderErgoHistory(resident.ergoHistory);
}

function renderErgoHistory(history) {
    const tableBody = document.getElementById('ergoHistoryTable').querySelector('tbody');
    tableBody.innerHTML = '';
    history.slice().reverse().forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = entry.date;
        row.insertCell().textContent = entry.actions;
        row.insertCell().textContent = entry.progress;
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.classList.add('action-btn');
        deleteBtn.onclick = () => deleteHistoryEntry('ergoHistory', history.length - 1 - index);
        actionCell.appendChild(deleteBtn);
    });
}

// --- Speech Therapy Management (Logopädie) ---

function addSpeechEntry() {
    const resident = getResidentById(currentResidentId);
    if (!resident) return;

    const today = new Date().toISOString().split('T')[0];
    const actions = document.getElementById('speechExercises').value.trim();
    const progress = document.getElementById('speechGoals').value.trim();

    if (!actions) {
        alert('Bitte geben Sie Maßnahmen/Übungen für den Logo-Eintrag an.');
        return;
    }

    const newEntry = {
        date: today,
        actions,
        progress: progress || 'Keine spezifische Bemerkung.'
    };
    resident.speechHistory.push(newEntry);
    saveResidents();
    renderSpeechHistory(resident.speechHistory);
}

function renderSpeechHistory(history) {
    const tableBody = document.getElementById('speechHistoryTable').querySelector('tbody');
    tableBody.innerHTML = '';
    history.slice().reverse().forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = entry.date;
        row.insertCell().textContent = entry.actions;
        row.insertCell().textContent = entry.progress;
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.classList.add('action-btn');
        deleteBtn.onclick = () => deleteHistoryEntry('speechHistory', history.length - 1 - index);
        actionCell.appendChild(deleteBtn);
    });
}

// --- Generic History Deletion ---
function deleteHistoryEntry(historyType, index) {
    const resident = getResidentById(currentResidentId);
    if (!resident || !resident[historyType]) return;

    if (confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
        resident[historyType].splice(index, 1);
        saveResidents();
        // Re-render the specific history table
        if (historyType === 'woundHistory') renderWoundHistory(resident.woundHistory);
        else if (historyType === 'physioHistory') renderPhysioHistory(resident.physioHistory);
        else if (historyType === 'ergoHistory') renderErgoHistory(resident.ergoHistory);
        else if (historyType === 'speechHistory') renderSpeechHistory(resident.speechHistory);
    }
}


// --- Import/Export Functions ---

function exportData() {
    const dataStr = JSON.stringify(residents, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bewohnerdaten_haus_sonnenschein_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Alle Bewohnerdaten wurden exportiert. Bitte speichern Sie die Datei.');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    if (file.type !== 'application/json') {
        alert('Bitte wählen Sie eine JSON-Datei aus.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedResidents = JSON.parse(e.target.result);
            if (!Array.isArray(importedResidents) || !importedResidents.every(r => r.id && r.name)) {
                throw new Error('Ungültiges Dateiformat. Die JSON-Datei sollte ein Array von Bewohnerobjekten enthalten.');
            }
            if (confirm('Möchten Sie die aktuellen Bewohnerdaten mit den importierten Daten überschreiben?')) {
                residents = importedResidents;
                saveResidents();
                alert('Daten erfolgreich importiert und gespeichert!');
                showDashboard();
            } else {
                alert('Import abgebrochen.');
            }
        } catch (error) {
            alert('Fehler beim Importieren der Daten: ' + error.message);
            console.error('Import Error:', error);
        }
    };
    reader.readAsText(file);
}

