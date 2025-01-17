export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export function setupFormDataStorage({ formSelector = 'input', storageKey = 'formData', debounceDelay = 500 } = {}) {
    const inputs = document.querySelectorAll(formSelector); 
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            inputs.forEach(input => {
                const inputKey = input.id || input.name || input.classList[0] || `input_${Array.prototype.indexOf.call(inputs, input)}`;
                if (parsedData[inputKey]) {
                    input.value = parsedData[inputKey];
                    console.log(`Loaded saved input for ${inputKey}:`, parsedData[inputKey]);
                }
            });
        } catch (error) {
            console.error('Error parsing saved data from localStorage:', error);
        }
    } else {
        console.log('No saved data found.');
    }
    const saveFormData = debounce(function () {
        const formData = Array.from(inputs).reduce((data, input, index) => {
            const inputKey = input.id || input.name || input.classList[0] || `input_${index}`;
            data[inputKey] = input.value;
            return data;
        }, {});

        try {
            localStorage.setItem(storageKey, JSON.stringify(formData));
            console.log('Form data saved:', formData);
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, debounceDelay);
    inputs.forEach(input => input.addEventListener('keyup', saveFormData));
}
