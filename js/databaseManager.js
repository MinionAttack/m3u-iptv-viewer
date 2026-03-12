'use strict';

const DB_NAME = 'channelsDatabase';
const DB_VERSION = 1; // Increase this number when the structure (store) is changed.
const STORE_NAME = 'channelsData';

const INDEX_SEARCH_RESULTS_LIMIT = 50;

let db = null;

function checkDatabaseExists() {
    return indexedDB.databases()
        .then(databases => {
            return databases.some(database => DB_NAME === database.name);
        });
}

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
                store.createIndex('idx_tvgName_low', 'tvgName_low', {unique: false});
                store.createIndex('idx_group_low', 'group_low', {unique: false});
                store.createIndex('idx_subgroup_low', 'subgroup_low', {unique: false});
                store.createIndex('idx_category_low', 'category_low', {unique: false});
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => {
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
        const normalizedChannelData = {
            ...channelData,
            tvgName_low: channelData.tvgName?.toLowerCase() || "",
            group_low: channelData.group?.toLowerCase() || "",
            subgroup_low: channelData.group?.toLowerCase() || "",
            category_low: channelData.category?.toLowerCase() || "",
        };
        const request = store.add(normalizedChannelData);
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

function checkAvailableContentForSearch() {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject(new Error('There is no open connection to the database.'));
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("idx_category_low");
        const findings = {live: false, series: false, movie: false};
        const categories = Object.keys(findings);
        for (const category of categories) {
            index.getKey(category).onsuccess = (event) => {
                if (event.target.result !== undefined) {
                    findings[category] = true;
                }
            };
        }
        transaction.oncomplete = () => {
            resolve(findings);
        };
        transaction.onerror = (event) => {
            reject(new Error(`Error in the transaction to check the available content for search: ${event.target.error}`));
        };
    });
}

function searchChannels(searchTerm) {
    return new Promise((resolve, reject) => {
        const range = IDBKeyRange.bound(searchTerm, searchTerm + '\uffff');
        const searchByIndexes = [searchInIndex("idx_category_low", range),
            searchInIndex("idx_tvgName_low", range), searchInIndex("idx_group_low", range),
            searchInIndex("idx_subgroup_low", range)];
        Promise.all(searchByIndexes)
            .then(results => {
                const combinedResults = results.flat();
                const uniqueMap = new Map();
                combinedResults.forEach(item => {
                    uniqueMap.set(item.tvgName, item);
                });
                resolve(Array.from(uniqueMap.values()));
            }).catch(error => {
            reject(error);
        });
    });
}

function searchInIndex(indexName, range, limit = INDEX_SEARCH_RESULTS_LIMIT) {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject(new Error('There is no open connection to the database.'));
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index(indexName);
        const request = index.openCursor(range);

        const results = [];
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && results?.length < limit) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        request.onerror = () => reject(new Error(`Error in the request for the index search: ${indexName}`));
        transaction.onerror = () => reject(new Error(`Error in the transaction for the index search: ${indexName}`));
    });
}
