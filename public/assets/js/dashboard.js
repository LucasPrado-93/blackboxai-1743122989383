document.addEventListener('DOMContentLoaded', () => {
    // Get user info from token
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/auth/login';
        return;
    }

    // Decode token to get user info
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    document.getElementById('userName').textContent = decodedToken.fullName || 'User';

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/auth/login';
    });

    // New contract button
    document.getElementById('newContractBtn').addEventListener('click', () => {
        window.location.href = '/contracts/new';
    });

    // View contracts button
    document.getElementById('viewContractsBtn').addEventListener('click', () => {
        window.location.href = '/contracts';
    });

    // Load contracts
    loadContracts();
});

async function loadContracts() {
    try {
        const response = await fetch('/api/contracts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            const contracts = await response.json();
            renderContracts(contracts);
        } else {
            console.error('Failed to load contracts');
        }
    } catch (error) {
        console.error('Error loading contracts:', error);
    }
}

function renderContracts(contracts) {
    const container = document.getElementById('contractsList');
    
    if (contracts.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No contracts found</p>';
        return;
    }

    container.innerHTML = contracts.map(contract => `
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-medium text-gray-900">${contract.title}</h4>
                    <p class="text-sm text-gray-500">Created: ${new Date(contract.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="flex space-x-2">
                    <button class="text-indigo-600 hover:text-indigo-800" data-action="view" data-id="${contract._id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-green-600 hover:text-green-800" data-action="sign" data-id="${contract._id}">
                        <i class="fas fa-signature"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            const contractId = e.currentTarget.getAttribute('data-id');
            handleContractAction(action, contractId);
        });
    });
}

function handleContractAction(action, contractId) {
    switch(action) {
        case 'view':
            window.location.href = `/contracts/view/${contractId}`;
            break;
        case 'sign':
            window.location.href = `/contracts/sign/${contractId}`;
            break;
        default:
            console.warn('Unknown action:', action);
    }
}

// Export for testing if needed
export { loadContracts, renderContracts, handleContractAction };