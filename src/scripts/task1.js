const form = document.querySelector('form');
const selectFrom = document.querySelector('#from');
const selectTo = document.querySelector('#to');
const numberInput = document.querySelector('#number-input');
const result = document.querySelector('.result')

const numRomanos = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
}

const allowedKeys = ['I', 'V', 'X', 'L', 'C', 'D', 'M', 'BACKSPACE', 'DELETE'];

numberInput.addEventListener('keydown', (e) => {
    let key = e.key;
    if (selectFrom.value === 'roman') {
        if(!allowedKeys.includes(key.toUpperCase())){
            e.preventDefault();
        }
    }
    else {
        if (isNaN(Number(key)) && !['Backspace', 'Delete'].includes(key)) {
            e.preventDefault();
        }
    }
})

selectFrom.addEventListener('change', () => {
    numberInput.value = '';
    if(selectFrom.value === 'roman'){
            selectTo.value = 'arabic'
    }
    else {
        selectTo.value = 'roman'
    }
});

selectTo.addEventListener('change', () => {
    numberInput.value = '';
    if(selectTo.value === 'roman'){
            selectFrom.value = 'arabic'
    }
    else {
        selectFrom.value = 'roman'
    }
});

form.addEventListener('submit', () => {
    let value = numberInput.value;
    
    if(selectFrom.value === 'roman'){
        romanToArabic(value.toUpperCase())
    }
    else {
        arabicToRoman(Number(value));
    }
});

function numberIsValid(value){
    if(value.match(/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/)){
        return true;
    }  
    return false;
}

function romanToArabic(value){
    arabic = 0;
    if(numberIsValid(value)){
        for(let i=0; i<value.length; i++){
            if(i === value.length - 1){
                arabic += numRomanos[value[i]];
                break;
            }
    
            if(numRomanos[value[i]] >= numRomanos[value[i+1]]){
                arabic += numRomanos[value[i]]
            }
            else{
                arabic -= numRomanos[value[i]]
            }
        }

        result.innerText = arabic;
    }
    else {
        result.innerText = 'Número Inválido';
    }
    
}

function arabicToRoman(value){
    const valueOptions = [
        { 'M': 1000 },
        { 'CM': 900 },
        { 'D': 500 },
        { 'CD': 400 },
        { 'C': 100 },
        { 'XC': 90 },
        { 'L': 50 },
        { 'XL': 40 },
        { 'X': 10 },
        { 'IX': 9 },
        { 'V': 5 },
        { 'IV': 4 },
        { 'I': 1 }
    ];
    
    let romanNum = '';

    if(value < 1 || value > 3999){
        result.innerText = 'Número inválido';
    }
    else {
        for(let i = 0; i < valueOptions.length; i++){
            let currentRoman = Object.keys(valueOptions[i])[0];
            let currentRomanValue = Object.values(valueOptions[i])[0];
    
            while(value >= currentRomanValue){
                romanNum += currentRoman;
                value -= currentRomanValue;
            }
        }
        
        result.innerText = romanNum;
    }
}