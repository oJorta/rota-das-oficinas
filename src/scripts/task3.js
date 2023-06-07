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
    <p>${newUser.name}</p>
    <div class="tax-payment">
        <input type="checkbox" name="tax" id="tax-${newUser.id}" data-userid="${newUser.id}">
        <label for="tax-${newUser.id}">10% Tax</label>
    </div>`                       
    
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
            <input type="checkbox" name="" data-item=${newItem.id} data-userid=${user.id}>`
        } else {
            payer.innerHTML = `<label for="">${user.name}</label>
            <input type="number" name="" data-item=${newItem.id} data-userid=${user.id} value="0">`
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
        let sharedArray = [];
        let individualArray = [];
        
        if (currentItem.shared) {
            let payersInputs = document.querySelectorAll(`.payer input[type="checkbox"]`);
            payersInputs.forEach( (payerCheckbox) => {
                if (Number(payerCheckbox.dataset.item) === currentItem.id && payerCheckbox.checked) {
                    sharedArray.push(Number(payerCheckbox.dataset.userid));
                }
            });
            
            let valuePerPayer = currentItem.price / sharedArray.length;
            
            let usersUpdated = users.map( user => {
                if (sharedArray.includes(user.id)) {
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
            const payersInputs = document.querySelectorAll(`.payer input[type="number"]`);

            payersInputs.forEach( (payerAmountConsumed) => {
                if (Number(payerAmountConsumed.dataset.item) === currentItem.id && payerAmountConsumed.value) {
                    individualArray.push(
                        {
                            id: Number(payerAmountConsumed.dataset.userid),
                            amount: Number(payerAmountConsumed.value)
                        }
                    );
                }
            });

            let usersUpdated = users.map( (user) => {
                let currentPayer = individualArray.find( payer => payer.id === user.id ? 1:0);
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

    taxInclusion();
    printResult();
}

function resetBill(){
    users.forEach( user => {
        user.bill = 0;
    })
}

function taxInclusion(){
    let usersTaxInputs = document.querySelectorAll(`.user input[type="checkbox"]`);

    usersTaxInputs.forEach( (taxInput) => {
        if (taxInput.checked) {
            let usersUpdated = users.map( (user) => {
                if (user.id === Number(taxInput.dataset.userid)) {
                    let billUpdated = user.bill + (user.bill/10);
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
}

function printResult(){
    result.style.display = "flex";
    result.innerHTML = '';

    users.forEach( (user) => {
        result.innerHTML += `<h2>${user.name}: $${(user.bill).toFixed(2)}</h2>`
        if (user.id !== users.length) {
            result.innerHTML += `<p>|</p>`
        }
    });
}