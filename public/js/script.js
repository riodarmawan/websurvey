document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#questionForm');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;
    const questionsPerPage = 20;
    let documentName = "";
    let questionsData = [];

    if (!form || !pagination) {
        console.error('Form or pagination element not found');
        return;
    }

    fetchQuestions();
    function fetchQuestions() {
        console.log("Fetching questions for survey ID:", surveyId);
        fetch(`/apiquestions/${surveyId}`)
            .then(response => response.json())
            .then(questions => {
                console.log("Questions fetched:", questions);
                documentName = questions[0];
                questionsData = questions[1];
                initializeCookieWithEmptyData(questionsData);
                const totalPages = Math.ceil(questionsData.length / questionsPerPage);
                createPagination(totalPages);
                displayQuestions(questionsData, currentPage);
            })
            .catch(error => console.error('Error fetching questions:', error));
    }

    function initializeCookieWithEmptyData(questions) {
        const formDataObject = getFormDataFromCookie();
        let updated = false;

        questions.forEach(question => {
            question.option.forEach(option => {
                if (option.radiobutton && !formDataObject.hasOwnProperty(question.pertanyaan)) {
                    formDataObject[question.pertanyaan] = "";
                    updated = true;
                } else if (option.checkbox && !formDataObject.hasOwnProperty(`${question.pertanyaan}-${option.checkbox}`)) {
                    formDataObject[`${question.pertanyaan}-${option.checkbox}`] = "false";
                    updated = true;
                } else if (option.textarea !== undefined && !formDataObject.hasOwnProperty(question.pertanyaan)) {
                    formDataObject[question.pertanyaan] = "";
                    updated = true;
                } else if (option.select && !formDataObject.hasOwnProperty(question.pertanyaan)) {
                    formDataObject[question.pertanyaan] = "";
                    updated = true;
                } else if (option.file !== undefined && !formDataObject.hasOwnProperty(question.pertanyaan)) {
                    formDataObject[question.pertanyaan] = "";
                    updated = true;
                }
            });
        });

        if (updated) {
            console.log("Initialized cookie with empty form data:", formDataObject);
            setFormDataToCookie(formDataObject);
        }
    }

    function getFormDataFromCookie() {
        const cookies = document.cookie.split('; ');
        const formDataCookie = cookies.find(row => row.startsWith('formData='));
        if (formDataCookie) {
            const formDataJSON = formDataCookie.split('=')[1];
            return JSON.parse(decodeURIComponent(formDataJSON));
        }
        return {};
    }

    function setFormDataToCookie(formDataObject) {
        document.cookie = `formData=${encodeURIComponent(JSON.stringify(formDataObject))};path=/;max-age=86400`;
    }

    function createPagination(totalPages) {
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = i;
            if (i === currentPage) {
                a.classList.add('active');
            }
            a.addEventListener('click', function(e) {
                e.preventDefault();
                updateFormData();
                currentPage = i;
                updatePagination(a);
                displayQuestions(questionsData, currentPage);
            });
            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    function updatePagination(activeLink) {
        const activeElement = document.querySelector('.pagination a.active');
        if (activeElement) {
            activeElement.classList.remove('active');
        }
        activeLink.classList.add('active');
    }

    function displayQuestions(questions, page) {
        console.log("Displaying questions for page:", page);
        form.innerHTML = '';
        const start = (page - 1) * questionsPerPage;
        const end = start + questionsPerPage;
        const paginatedQuestions = questions.slice(start, end);
        formCheck(paginatedQuestions, start + 1);
        restoreFormData();

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'documentName';
        hiddenInput.value = documentName;
        form.appendChild(hiddenInput);

        if (page === Math.ceil(questions.length / questionsPerPage)) {
            const submitButtonDiv = document.createElement('div');
            submitButtonDiv.classList.add('col-12');

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            submitButton.classList.add('btn', 'btn-primary', 'mt-3');
            submitButtonDiv.appendChild(submitButton);

            form.appendChild(submitButtonDiv);
        }
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
                    input.name = `${questionData.pertanyaan}-${option.checkbox}`;
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
                    input.name = 'fileName';
                    divFormCheck.appendChild(input);
                }

                formSection.appendChild(divFormCheck);
            });

            form.appendChild(formSection);
        });
    }

    function restoreFormData() {
        const formDataString = localStorage.getItem('formData');
        const formDataObject = formDataString ? JSON.parse(formDataString) : {};
    
        for (const key in formDataObject) {
            const inputElements = form.querySelectorAll(`[name="${key}"]`);
            inputElements.forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (input.value === formDataObject[key]) {
                        input.checked = true;
                    }
                } else if (input.type === 'file') {
                    // Logika untuk file tidak diimplementasikan karena keamanan
                    console.log('File inputs cannot be restored.');
                } else {
                    input.value = formDataObject[key];
                }
            });
        }
    }
    

    function updateFormData() {
        let formDataObject = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')) : {};
    
        // Loop through each form element
        for (const element of form.elements) {
            const name = element.name;
            if (name) {  // Make sure the element has a name attribute
                if (element.type === 'checkbox') {
                    formDataObject[name] = element.checked ? element.value : 'false';
                } else if (element.type === 'radio') {
                    if (element.checked) {
                        formDataObject[name] = element.value;
                    } else {
                        // Ensure even unchecked radio buttons have a representation, but don't overwrite if already set
                        formDataObject[name] = formDataObject[name] || null;
                    }
                } else if (element.type !== 'file' && element.value.trim() === '') {
                    // Assign null or empty string for empty inputs
                    formDataObject[name] = null;
                } else {
                    formDataObject[name] = element.value;
                }
            }
        }
    
        localStorage.setItem('formData', JSON.stringify(formDataObject));
    }
    
    

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateFormData(); // Update the latest form data before submission
    
        // Retrieve all form data from localStorage
        const formDataObject = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')) : {};
    
        // Prepare data to be sent
        const dataToSend = {
            formData: formDataObject,
            documentName: documentName,
            username: username, // make sure the 'username' variable is defined and correctly assigned
        };
    
        // Send data using fetch
        fetch('/save-question-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            } else {
                return response.text(); // Fallback to text response
            }
        })
        .then(data => {
            console.log('Success:', data);
            // Handle success - perhaps redirect or show a success message
            // Consider clearing localStorage if needed
            localStorage.removeItem('formData'); // Optionally clear form data on successful submission
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error - show an error message or retry
        });
    });
    

    form.addEventListener('change', updateFormData);
    restoreFormData();

    document.getElementById('clearData').addEventListener('click', function() {
        localStorage.clear();
        form.reset();
        console.log("Data cleared and form reset.");
    });
});
