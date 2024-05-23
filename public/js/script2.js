document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#questionForm');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;
    const questionsPerPage = 20;
    let documentName = "";
    let questionData = [];

    if (!form || !pagination) {
        console.error('Form or pagination element not found!');
        return;
    }

    fetchQuestions();
    addSubmitEvent(form);
        function addSubmitEvent(form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Menghentikan form dari submit secara default
                const formData = getFormDataFromStorage(); // Mengambil data dari localStorage
                sendFormData(formData); // Mengirim data ke server
            });
        }
    
        function sendFormData(formData) {
            fetch('/save-question-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formData })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Data submitted successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit data');
            });
        }
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.classList.add('btn', 'btn-primary'); // Bootstrap class for styling
    form.appendChild(submitButton);

    
    
    function fetchQuestions() {
        fetch(`/apiquestions/${surveyId}`)
            .then(response => response.json())
            .then(question => {
                const tampungData = question[1];
                let start = 1;
                formCheck(tampungData, start + 1);
                initializeStorageWithEmptyData(tampungData);
                loadForm();
                
            });

    }

    function formCheck(formData, startNumber) {
        formData.forEach((questionData, index) => {
            const formSection = document.createElement('div');
            formSection.classList.add('form-section');
    
            const label = document.createElement('label');
            label.textContent = `${questionData.pertanyaan}`;
            formSection.appendChild(label);
    
            questionData.option.forEach(option => {
                const divFormCheck = document.createElement('div');
                divFormCheck.classList.add('form-check');
                let input, labelElement = document.createElement('label');
                labelElement.classList.add('form-check-label');
    
                if (option.radiobutton) {
                    input = document.createElement('input');
                    input.type = 'radio';
                    input.name = questionData.pertanyaan;
                    input.value = option.radiobutton;
                    labelElement.textContent = option.radiobutton;
                    divFormCheck.appendChild(labelElement);
                    labelElement.prepend(input);
                } else if (option.checkbox) {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = `${questionData.pertanyaan}`;
                    input.value = option.checkbox;
                    labelElement.textContent = option.checkbox;
                    divFormCheck.appendChild(labelElement);
                    labelElement.prepend(input);
                } else if (option.textarea !== undefined) {
                    input = document.createElement('textarea');
                    input.classList.add('form-control');
                    input.name = questionData.pertanyaan;
                    divFormCheck.appendChild(input);
                } else if (option.select) {
                    input = document.createElement('select');
                    input.classList.add('form-select');
                    input.name = questionData.pertanyaan;
                    
                    // Membuat dan menambahkan opsi default
                    const defaultOption = document.createElement('option');
                    defaultOption.textContent = 'Pilih';
                    defaultOption.value = '';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    input.appendChild(defaultOption);
    
                    option.select.forEach(selectOption => {
                        const optionElem = document.createElement('option');
                        optionElem.textContent = selectOption;
                        optionElem.value = selectOption;
                        input.appendChild(optionElem);
                    });
                    divFormCheck.appendChild(input);
                } else if (option.file !== undefined) {
                    input = document.createElement('input');
                    input.type = 'file';
                    input.name = 'file';
                    divFormCheck.appendChild(input);
                }
    
                formSection.appendChild(divFormCheck);
            });
    
            form.appendChild(formSection);
        });
    }
    
    function initializeStorageWithEmptyData(questions) {
        const formDataObject = getFormDataFromStorage();
        let updated = false;

        questions.forEach(question => {
            question.option.forEach(option => {
                if (!formDataObject.hasOwnProperty(question.pertanyaan)) {
                    formDataObject[question.pertanyaan] = (option.textarea !== undefined || option.file !== undefined) ? "" : false;
                    updated = true;
                }
            });
        });

        if (updated) {
            console.log("Initialized storage with empty form data:", formDataObject);
            setFormDataToStorage(formDataObject);
        }
    }

    function setFormDataToStorage(formDataObject) {
        localStorage.setItem('formData', JSON.stringify(formDataObject));
        console.log('Storage set:', JSON.stringify(formDataObject));
    }

    function getFormDataFromStorage() {
        const formDataJSON = localStorage.getItem('formData');
        return formDataJSON ? JSON.parse(formDataJSON) : {};
    }

    function updateStorageData() {
        const formDataObject = getFormDataFromStorage();
        const formElements = form.querySelectorAll('input, textarea, select');
    
        // Reset all checkbox values in formDataObject to prepare for new inputs
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            formDataObject[checkbox.name] = '';
        });
    
        formElements.forEach(element => {
            const name = element.name;
            const type = element.type;
            if (type === 'checkbox') {
                if (element.checked) {
                    if (formDataObject[name]) {
                        formDataObject[name] += "," + element.value; // Append value if already exists
                    } else {
                        formDataObject[name] = element.value; // Set value if not exists
                    }
                }
            } else if (type === 'radio') {
                if (element.checked) {
                    formDataObject[name] = element.value;
                }
            } else {
                formDataObject[name] = element.value;
            }
        });

        
    
        // Cleanup checkbox entries to remove trailing commas
        Object.keys(formDataObject).forEach(key => {
            if (formDataObject[key] && formDataObject[key].endsWith(',')) {
                formDataObject[key] = formDataObject[key].slice(0, -1);
            }
        });
    
        setFormDataToStorage(formDataObject);
    }
    function loadForm() {
        const formDataObject = getFormDataFromStorage();
        const formElements = form.querySelectorAll('input, textarea, select');
    
        formElements.forEach(element => {
            const name = element.name;
            const type = element.type;
            const savedValue = formDataObject[name];
    
            if (type === 'checkbox') {
                // Split saved values by comma for checkboxes
                const values = savedValue ? savedValue.split(',') : [];
                element.checked = values.includes(element.value);
                console.log(`Checkbox [${name}]: set checked=${element.checked}`);
            } else if (type === 'radio') {
                element.checked = (element.value === savedValue);
                console.log(`Radio [${name}]: set checked=${element.checked}`);
            } else if (type !== 'file') { // Tambahkan pengecualian untuk tipe 'file'
                element.value = savedValue || ''; // Set value for textarea and select
                console.log(`Other [${name}]: set value=${element.value}`);
            }
        });
    }
    
    

    form.addEventListener('change', updateStorageData);

   
    console.log('Current storage data:', localStorage.getItem('formData'));
});
