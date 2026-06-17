import { createNotice } from './core.js';

var DB_NAME = 'pdfStudioNotes';
var STORE_NAME = 'notes';

function openDb() {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to open notes database.'));
        };
    });
}

function getAllNotes(db) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readonly');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.getAll();
        request.onsuccess = function () {
            resolve(request.result || []);
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to read notes.'));
        };
    });
}

function saveNote(db, note) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.put(note);
        request.onsuccess = function () {
            resolve(note);
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to save note.'));
        };
    });
}

function deleteNote(db, id) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.delete(id);
        request.onsuccess = function () {
            resolve();
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to delete note.'));
        };
    });
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="noteTitle">Title</label>
            <input id="noteTitle" class="tool-input" type="text" placeholder="Note title">
        </div>
        <div class="tool-field">
            <label for="noteBody">Content</label>
            <textarea id="noteBody" class="tool-textarea" placeholder="Write your note"></textarea>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="save">Save note</button>
            <button class="btn btn-ghost" type="button" data-action="new">New note</button>
            <button class="btn btn-ghost" type="button" data-action="delete">Delete note</button>
        </div>
        <div class="tool-field" data-status></div>
        <div class="tool-field">
            <label>Saved notes</label>
            <div id="noteList" class="tool-textarea" style="min-height:120px;"></div>
        </div>
    `;

    var titleInput = panel.querySelector('#noteTitle');
    var bodyInput = panel.querySelector('#noteBody');
    var listEl = panel.querySelector('#noteList');
    var status = panel.querySelector('[data-status]');
    var activeId = null;
    var dbInstance = null;

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function renderList(notes) {
        var sorted = notes.slice().sort(function (a, b) {
            return b.updatedAt - a.updatedAt;
        });
        if (!sorted.length) {
            listEl.innerHTML = 'No notes saved yet.';
            return;
        }
        listEl.innerHTML = sorted.map(function (note) {
            return '<div data-note-id="' + note.id + '" style="padding:6px 0; cursor:pointer;">' +
                '<strong>' + note.title + '</strong><br><small>' + new Date(note.updatedAt).toLocaleString() + '</small>' +
                '</div>';
        }).join('');
    }

    function refreshList() {
        if (!dbInstance) {
            return;
        }
        getAllNotes(dbInstance)
            .then(renderList)
            .catch(function () {
                listEl.innerHTML = 'Unable to load notes.';
            });
    }

    function clearForm() {
        activeId = null;
        titleInput.value = '';
        bodyInput.value = '';
    }

    listEl.addEventListener('click', function (event) {
        var target = event.target.closest('[data-note-id]');
        if (!target || !dbInstance) {
            return;
        }
        var id = Number(target.dataset.noteId);
        getAllNotes(dbInstance).then(function (notes) {
            var note = notes.find(function (item) { return item.id === id; });
            if (!note) {
                return;
            }
            activeId = note.id;
            titleInput.value = note.title;
            bodyInput.value = note.body;
        });
    });

    panel.querySelector('[data-action="new"]').addEventListener('click', function () {
        clearForm();
        updateStatus('New note ready.', 'success');
    });

    panel.querySelector('[data-action="save"]').addEventListener('click', function () {
        if (!dbInstance) {
            updateStatus('Database not ready.', 'error');
            return;
        }
        if (!titleInput.value.trim()) {
            updateStatus('Add a title for the note.', 'error');
            return;
        }
        var now = Date.now();
        var note = {
            id: activeId || now,
            title: titleInput.value.trim(),
            body: bodyInput.value.trim(),
            updatedAt: now
        };
        saveNote(dbInstance, note)
            .then(function () {
                activeId = note.id;
                updateStatus('Note saved locally.', 'success');
                refreshList();
            })
            .catch(function () {
                updateStatus('Unable to save note.', 'error');
            });
    });

    panel.querySelector('[data-action="delete"]').addEventListener('click', function () {
        if (!dbInstance) {
            updateStatus('Database not ready.', 'error');
            return;
        }
        if (!activeId) {
            updateStatus('Select a note to delete.', 'error');
            return;
        }
        deleteNote(dbInstance, activeId)
            .then(function () {
                clearForm();
                updateStatus('Note deleted.', 'success');
                refreshList();
            })
            .catch(function () {
                updateStatus('Unable to delete note.', 'error');
            });
    });

    openDb()
        .then(function (db) {
            dbInstance = db;
            refreshList();
        })
        .catch(function () {
            updateStatus('IndexedDB not available in this browser.', 'error');
        });
}
