const form = document.querySelector('form.form');
const formCheck = (formData) => {
    formData.forEach(questionData => {
        console.log("Processing question:", questionData.pertanyaan); // Log untuk setiap pertanyaan
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('form-group');

        const legend = document.createElement('legend');
        legend.textContent = questionData.pertanyaan;
        fieldset.appendChild(legend);

        let select = document.createElement('select'); // Moved outside of the forEach
        let selectCreated = false;

        questionData.option.forEach((option, index) => {
            const divFormCheck = document.createElement('div');
            divFormCheck.classList.add('form-check');
            
            const label = document.createElement('label');
            label.classList.add('form-check-label');
            if (option.radiobutton || option.checkbox || option.file == "") {
                const input = document.createElement('input');
                input.classList.add('form-check-input');
                input.id = `${questionData.pertanyaan}-${index}`;
                label.setAttribute('for', input.id);

                if (option.radiobutton) {
                    input.type = 'radio';
                    input.name = questionData.pertanyaan;
                    input.value = option.radiobutton;
                    label.textContent = option.radiobutton;
                } else if (option.checkbox) {
                    input.type = 'checkbox';
                    input.name = `${questionData.pertanyaan}-${index}`;
                    input.value = option.checkbox;
                    label.textContent = option.checkbox;
                }
                else if(option.file == ""){
                    label.classList.add('form-label');
                    input.type = 'file';
                    input.setAttribute('class','');
                    input.classList.add('form-control');
                    
                }

                divFormCheck.appendChild(input);
                divFormCheck.appendChild(label);
                fieldset.appendChild(divFormCheck);
            } else if (option.textarea === "") {
                const textarea = document.createElement('textarea');
                textarea.classList.add('form-control');
                textarea.id = `${questionData.pertanyaan}-${index}`;
                label.setAttribute('for', textarea.id);
                divFormCheck.appendChild(textarea);
                fieldset.appendChild(divFormCheck);
            } else if (option.select) {
                if (!selectCreated) {
                    select.classList.add('form-select');
                    select.id = questionData.pertanyaan;
                    select.name = questionData.pertanyaan;

                    const placeholderOption = document.createElement('option');
                    placeholderOption.textContent = "Select an option";
                    placeholderOption.disabled = true;
                    placeholderOption.selected = true;
                    select.appendChild(placeholderOption);

                    selectCreated = true;
                }
                const optionElement = document.createElement('option');
                optionElement.value = option.select;
                optionElement.textContent = option.select;
                select.appendChild(optionElement);
            }
            
        });

        if (selectCreated) {
            const divFormCheck = document.createElement('div');
            divFormCheck.classList.add('form-check');
            divFormCheck.appendChild(select);
            fieldset.appendChild(divFormCheck);
        }

        form.appendChild(fieldset);
    });
};


// Create the submit button
if (form) {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.classList.add('btn', 'btn-primary');
    form.appendChild(submitButton);
} else {
    console.error('Form not found');
}

 // Variables passed from the server
 const databaseName = "<%= databaseName %>";
 const collectionName = "<%= collectionName %>";
 
 console.log("Database Name:", databaseName);
 console.log("Collection Name:", collectionName);
 
 // Example fetch operation using these variables
 async function fetchData() {
     try {
         const response = await fetch('http://127.0.0.1:3000/showCollections', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ databaseName, collectionName })
         });
 
         const data = await response.json();
         if (!response.ok) {
             console.error('Failed to fetch data:', data);
             return;
         }
         console.log(data);
     } catch (error) {
         console.error('Error fetching collection data:', error);
     }
 }
 
 fetchData(); 