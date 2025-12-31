'use strict';

const DB_NAME = 'channelsDatabase';
const DB_VERSION = 1; // Increase this number when the structure (store) is changed.
const STORE_NAME = 'channelsData';

let db = null;

function connectToDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                const storeOptions = {keyPath: 'id', autoIncrement: true};
                const store = dbInstance.createObjectStore(STORE_NAME, storeOptions);
                store.createIndex('idx_tvgName', 'tvgName', {unique: false});
                store.createIndex('idx_group', 'group', {unique: false});
                store.createIndex('idx_subgroup', 'subgroup', {unique: false});
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => {
            console.error(`Error connecting to the database: ${event.target.error}`);
            reject(event.target.error);
        };
    });
}

function closeDBConnection() {
    return new Promise((resolve) => {
        if (!db) {
            return resolve('There is no open connection to the database.');
        }
        db.close();
        db = null;
        resolve('Database connection closed successfully');
    });
}

function deleteDatabase() {
    return new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        deleteRequest.onsuccess = () => {
            resolve('Database deleted successfully.');
        };
        deleteRequest.onerror = (event) => {
            reject(new Error(`Error deleting database: ${event.target.error}`));
        }
    });
}

function insertChannelData(channelData) {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject(new Error('There is no open connection to the database.'));
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(channelData);
        let channelId = null;
        request.onsuccess = (event) => {
            channelId = event.target.result;
        };
        request.onerror = (event) => {
            reject(new Error(`Error inserting channel data: ${event.target.error}`));
        };
        transaction.oncomplete = () => {
            resolve(channelId);
        };
        transaction.onerror = (event) => {
            reject(new Error(`Error during transaction to insert channel data: ${event.target.error}`));
        };
    });
}

/*
Example of use:

restoreSavedChannels((channelsBatch) => {
    // Use requestAnimationFrame to wait for the browser to be ready to paint and avoid blocking the user interface.
    window.requestAnimationFrame(() => {
        // Create a DocumentFragment in memory and do a single appendChild at the end of the batch. This avoids
        // ‘Reflow’ (layout recalculation) for each element.
        const fragment = document.createDocumentFragment();
        channelsBatch.forEach(channel => {
            // TODO: create card and fetch logo
            const div = document.createElement('div');
            div.textContent = channel.name;
            fragment.appendChild(div);
        });
        // Print all batch in a single DOM operation
        document.getElementById('container').appendChild(fragment);
    });
}).then(() => {
    console.info('All channels have been restored');
}).catch(err => {
    console.error(err);
});
*/
function restoreSavedChannels(callback) {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject(new Error('There is no open connection to the database.'));
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openCursor();
        const BATCH_SIZE = 200;
        let channelsBatch = [];
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                channelsBatch.push(cursor.value);
                if (BATCH_SIZE === channelsBatch.length) {
                    callback(channelsBatch);
                    channelsBatch = [];
                }
                cursor.continue();
            } else if (channelsBatch.length > 0) {
                callback(channelsBatch);
            }
        };
        request.onerror = (event) => {
            reject(new Error(`Error reading from cursor: ${event.target.error}`));
        };
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = (event) => {
            reject(new Error(`Error in the transaction to restore the channels: ${event.target.error}`));
        };
    });
}
