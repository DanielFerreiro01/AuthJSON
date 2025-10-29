const API_BASE = '/api';
let collectionsData = [];

// Auth tab switching
function selectAuthOption(option) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.auth-tab').classList.add('active');

    document.querySelectorAll('.auth-option-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelector(`[data-option="${option}"]`)?.classList.add('active');
}

// Main tab switching
function switchTab(tab) {
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.main-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'auth') {
        document.getElementById('authContent').classList.add('active');
    } else {
        document.getElementById('collectionsContent').classList.add('active');
        if (collectionsData.length === 0) {
            loadCollections();
        }
    }
}

async function loadCollections() {
    const loadingContainer = document.getElementById('loadingContainer');
    
    try {
        const response = await fetch(`${API_BASE}/collections`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        collectionsData = await response.json();
        console.log(collectionsData);
        
        if (collectionsData.length === 0) {
            loadingContainer.innerHTML = '<div class="error">⚠️ No collections found in db.json</div>';
            return;
        }
        
        loadingContainer.style.display = 'none';
        renderTabs();
        renderCollections();
        updateStats();
        
        if (collectionsData.length > 0) {
            selectCollection(collectionsData[0].name);
        }
    } catch (error) {
        console.error('Error loading collections:', error);
        loadingContainer.innerHTML = `<div class="error">⚠️ Error loading collections: ${error.message}</div>`;
    }
}

function renderTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    
    tabsContainer.innerHTML = `
        <div class="tabs-list">
            ${collectionsData.map(collection => `
                <button class="collection-tab" data-collection="${collection.name}" onclick="selectCollection('${collection.name}')">
                    <span>${collection.name}</span>
                    <span class="tab-badge">${collection.count || 0}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function formatPermissions(roles) {
    if (!roles || roles.length === 0) return '<span class="permission-tag public">Public</span>';
    return roles.map(role => `<span class="permission-tag">${role}</span>`).join('');
}

function renderCollections() {
    const contentContainer = document.getElementById('collectionsData');
    
    contentContainer.innerHTML = collectionsData.map(collection => {
        const permissions = collection.permissions || {};
        
        const endpoints = [
            { 
                method: 'GET', 
                path: `/api/${collection.name}`, 
                class: 'method-get',
                roles: permissions.GET || []
            },
            { 
                method: 'GET', 
                path: `/api/${collection.name}/:id`, 
                class: 'method-get',
                roles: permissions.GET || []
            },
            { 
                method: 'POST', 
                path: `/api/${collection.name}`, 
                class: 'method-post',
                roles: permissions.POST || []
            },
            { 
                method: 'PUT', 
                path: `/api/${collection.name}/:id`, 
                class: 'method-put',
                roles: permissions.PUT || []
            },
            { 
                method: 'DELETE', 
                path: `/api/${collection.name}/:id`, 
                class: 'method-delete',
                roles: permissions.DELETE || []
            }
        ];

        return `
            <div class="collection-content" data-collection="${collection.name}">
                <div class="collection-header">
                    <h3 class="collection-name">${collection.name}</h3>
                    <span class="collection-count">${collection.count || 0} items</span>
                </div>
                
                <div class="endpoints-list">
                    ${endpoints.map(endpoint => `
                        <div class="endpoint-item">
                            <div class="endpoint-main">
                                <span class="method-tag ${endpoint.class}">${endpoint.method}</span>
                                <span class="endpoint-path">${endpoint.path}</span>
                            </div>
                            <div class="endpoint-permissions">
                                ${formatPermissions(endpoint.roles)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function selectCollection(collectionName) {
    document.querySelectorAll('.collection-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-collection="${collectionName}"].collection-tab`)?.classList.add('active');
    
    document.querySelectorAll('.collection-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelector(`[data-collection="${collectionName}"].collection-content`)?.classList.add('active');
}

function updateStats() {
    document.getElementById('totalCollections').textContent = collectionsData.length;
    document.getElementById('totalEndpoints').textContent = (collectionsData.length * 5) + 2;
}