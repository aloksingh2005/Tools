import { createNotice } from './core.js';

var DB_NAME = 'pdfStudioTodos';
var STORE_NAME = 'todos';

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
            reject(request.error || new Error('Unable to open todos database.'));
        };
    });
}

function getAllTodos(db) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readonly');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.getAll();
        request.onsuccess = function () {
            resolve(request.result || []);
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to read todos.'));
        };
    });
}

function saveTodo(db, todo) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.put(todo);
        request.onsuccess = function () {
            resolve(todo);
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to save todo.'));
        };
    });
}

function deleteTodo(db, id) {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(STORE_NAME, 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.delete(id);
        request.onsuccess = function () {
            resolve();
        };
        request.onerror = function () {
            reject(request.error || new Error('Unable to delete todo.'));
        };
    });
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="todoInput">New task</label>
            <input id="todoInput" class="tool-input" type="text" placeholder="Add a task">
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="add">Add task</button>
        </div>
        <div class="tool-field" data-status></div>
        <div class="tool-field">
            <label>Task list</label>
            <div id="todoList" class="tool-textarea" style="min-height:120px;"></div>
        </div>
    `;

    var input = panel.querySelector('#todoInput');
    var listEl = panel.querySelector('#todoList');
    var status = panel.querySelector('[data-status]');
    var dbInstance = null;

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function renderList(todos) {
        if (!todos.length) {
            listEl.innerHTML = 'No tasks yet.';
            return;
        }
        listEl.innerHTML = todos.map(function (todo) {
            return '<div data-todo-id="' + todo.id + '" style="display:flex; align-items:center; gap:10px; padding:6px 0;">' +
                '<input type="checkbox" ' + (todo.done ? 'checked' : '') + ' data-toggle>' +
                '<span style="flex:1; text-decoration:' + (todo.done ? 'line-through' : 'none') + '">' + todo.text + '</span>' +
                '<button class="btn btn-ghost" type="button" data-delete>Remove</button>' +
                '</div>';
        }).join('');
    }

    function refreshList() {
        if (!dbInstance) {
            return;
        }
        getAllTodos(dbInstance)
            .then(function (todos) {
                var sorted = todos.slice().sort(function (a, b) {
                    return b.createdAt - a.createdAt;
                });
                renderList(sorted);
            })
            .catch(function () {
                listEl.innerHTML = 'Unable to load tasks.';
            });
    }

    listEl.addEventListener('click', function (event) {
        var row = event.target.closest('[data-todo-id]');
        if (!row || !dbInstance) {
            return;
        }
        var id = Number(row.dataset.todoId);
        if (event.target.hasAttribute('data-delete')) {
            deleteTodo(dbInstance, id).then(refreshList);
            return;
        }
        if (event.target.hasAttribute('data-toggle')) {
            getAllTodos(dbInstance).then(function (todos) {
                var item = todos.find(function (todo) { return todo.id === id; });
                if (!item) {
                    return;
                }
                item.done = !item.done;
                saveTodo(dbInstance, item).then(refreshList);
            });
        }
    });

    panel.querySelector('[data-action="add"]').addEventListener('click', function () {
        if (!dbInstance) {
            updateStatus('Database not ready.', 'error');
            return;
        }
        var value = input.value.trim();
        if (!value) {
            updateStatus('Add a task name.', 'error');
            return;
        }
        var todo = {
            id: Date.now(),
            text: value,
            done: false,
            createdAt: Date.now()
        };
        saveTodo(dbInstance, todo)
            .then(function () {
                input.value = '';
                updateStatus('Task saved locally.', 'success');
                refreshList();
            })
            .catch(function () {
                updateStatus('Unable to save task.', 'error');
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
