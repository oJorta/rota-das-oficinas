const addUserBtn = document.querySelector('#add-user');
const addItemBtn = document.querySelector('#add-item');
const usersGrid = document.querySelector('.users-grid');
const itemsGrid = document.querySelector('.items-grid');
const userModal = document.querySelector('.user-modal');
const itemModal = document.querySelector('.item-modal');
const userForm = document.querySelector('#add-user-form');
const itemForm = document.querySelector('#add-item-form');
const userFormSubmit = document.querySelector('#add-user-submit');
const calculate = document.querySelector('#calculate');
const result = document.querySelector('.result');

let users = [];
const items = [];

calculate.addEventListener('click', () => {
    calculateBill();
});

addUserBtn.onclick = function(){
    userModal.style.display = 'flex'
};
addItemBtn.onclick = function(){
    itemModal.style.display = 'flex'
};

window.addEventListener('click', (e) =>{
    if (e.target === userModal) {
        userModal.style.display = 'none'
    }
    if (e.target === itemModal) {
        itemModal.style.display = 'none'
    }
});

userForm.addEventListener('submit', (e) =>{

    e.preventDefault();
    let inputValues = getFormData(userForm);
    let name = inputValues[0];

    addUser(name);
    userModal.style.display = 'none';

});

itemForm.addEventListener('submit', (e) =>{

    e.preventDefault();
    let inputValues = getFormData(itemForm);

    addItem(inputValues);
    itemModal.style.display = 'none';
});


function addUser(name){
    let newUser = {
        id: users.length+1,
        name,
        bill: 0
    };

    let newUserDiv = document.createElement('div');
    
    newUserDiv.classList.add('user');
    newUserDiv.innerHTML = `<h2>👤</h2>
    <p>${newUser.name}</p>`                       
    
    users.push(newUser);
    usersGrid.appendChild(newUserDiv);
}

function addItem(values){
    let newItem = {
        id: items.length+1,
        name: values[0],
        price: values[1],
        shared: values[2]
    };
/*     if (newItem.shared) {
        let payers = {};
        users.forEach( (user) => {
            let userId = user.id;
            payers[`${userId}`] = false;
        });
        newItem.payers = payers;
        console.log(newItem)
    }
 */
    let newItemDiv = document.createElement('div');
    let payersDiv = document.createElement('div');
    let sharedDiv = document.createElement('div');
    
    newItemDiv.classList.add('item');
    newItemDiv.id = newItem.id;
    payersDiv.classList.add('payers');
    
    newItemDiv.innerHTML = `<h2>🍽️ ${newItem.name}</h2>
    <div>
    <h3>Price</h3>
    <p>$${newItem.price}</p>
    </div>
    `     
    if (newItem.shared) {
        sharedDiv.innerHTML = `<div>
        <h3>Shared food?</h3>
        <p>✅</p>
        </div>`
    } else {
        sharedDiv.innerHTML = `<div>
        <h3>Shared food?</h3>
        <p>❌</p>
        </div>`
    }

    newItemDiv.appendChild(sharedDiv);
    
    users.forEach( (user) => {
        let payer = document.createElement('div');
        payer.classList.add('payer');

        if (newItem.shared) {
            payer.innerHTML = `<label for="">${user.name}</label>
            <input type="checkbox" name="" data-item=${newItem.id} data-payerid=${user.id} value="0">`
        } else {
            payer.innerHTML = `<label for="">${user.name}</label>
            <input type="number" name="" data-payerid=${user.id} value="0">`
        }
        
        
        payersDiv.appendChild(payer);
    });
    
    newItemDiv.appendChild(payersDiv);
    itemsGrid.appendChild(newItemDiv);
    items.push(newItem);
}

function getFormData(form){
    let inputNodeList = form.querySelectorAll('input');
    let inputValues = [];

    inputNodeList.forEach( (input) => {
        if (input.type === 'checkbox') {
            inputValues.push(input.checked);
            input.checked = false;
        }
        else {
            inputValues.push(input.value);
            input.value = '';
        }
    });

    return inputValues;
}

function calculateBill(){
    resetBill();
    let itemsDOM = document.querySelectorAll('.item');

    itemsDOM.forEach( (item) => {
        let itemId = Number(item.id);
        let currentItem = items.find( item => item.id === itemId ? 1:0);
        let payersShared = [];
        let payersIndividual = [];

        if (currentItem.shared) {
            let payersInputs = document.querySelectorAll('.payer input');
            payersInputs.forEach( (payerCheckbox) => {
                if (payerCheckbox.type === 'checkbox' && Number(payerCheckbox.dataset.item) === currentItem.id && payerCheckbox.checked) {
                    payersShared.push(Number(payerCheckbox.dataset.payerid));
                }
            });

            let valuePerPayer = currentItem.price / payersShared.length;

            let usersUpdated = users.map( user => {
                if (payersShared.includes(user.id)) {
                    let billUpdated = user.bill + valuePerPayer;
                    return {
                        id: user.id,
                        name: user.name,
                        bill: billUpdated
                    }
                } else {
                    return user;
                }
            });

            users = usersUpdated;
        } else {
            const payersInputs = document.querySelectorAll('.payer input');

            payersInputs.forEach( (payerAmountConsumed) => {
                if (payerAmountConsumed.type === 'number' && payerAmountConsumed.value) {
                    payersIndividual.push(
                        {
                            id: Number(payerAmountConsumed.dataset.payerid),
                            amount: Number(payerAmountConsumed.value)
                        }
                    );
                }
            });

            let usersUpdated = users.map( (user) => {
                let currentPayer = payersIndividual.find( payer => payer.id === user.id ? 1:0);
                if (currentPayer) {
                    let billUpdated = user.bill + (currentItem.price * currentPayer.amount);
                    return {
                        id: user.id,
                        name: user.name,
                        bill: billUpdated
                    }
                } else {
                    return user;
                }
            });

            users = usersUpdated;
        }
    });
    printResult();
}

function resetBill(){
    users.forEach( user => {
        user.bill = 0;
    })
}

function printResult(){
    result.style.display = "flex";
    result.innerHTML = '';
    users.forEach( (user) => {
        result.innerHTML += `<h2>${user.name}: $${user.bill}</h2>`
        if (user.id !== users.length) {
            result.innerHTML += `<p>|</p>`
        }
    });
}