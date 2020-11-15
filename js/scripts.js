window.onload = function runApp() {
    let calcButton = document.getElementById("calculate-button");
    let serverResultList = document.getElementById('server-list');
    let fibonacciResult = document.getElementById('fibonacci-output');
    let userInput = document.getElementById("user-input");
    let checkbox = document.getElementById('checkbox');
    let spinner = document.querySelector('.spin');
    let errorServer = document.getElementById("error-server");
    let errorLargerThan = document.getElementById("error-larger-than");
    let spinnerResults = document.getElementById("results-spinner");

    function getResultsList() {
        fetch('http://localhost:5050/getFibonacciResults').then(function (response) {
            return response.json()
                .then(function (serverData) {
                    let arrayResults = serverData.results;
                    for (let i = 0; i < 9; i++) {
                        createLiElement(arrayResults[i])
                    }
                })
        });
    }

    function createLiElement(arrayElement) {
        const { number, createdDate, result } = arrayElement;

        let li = document.createElement("li");
        serverResultList.appendChild(li)
            .innerHTML = `The Fibonacci of <strong>${number}</strong> is <strong>${result}</strong>. Calculated at: ${new Date(createdDate)}`;
        li.classList.add("list-group-item", "p-0", "py-3")
    }
    getResultsList();

    function validateCheckbox() {
        if (!checkbox.checked) {
            if (userInput.value > 50) notValidNumber();
            else if (userInput.value == 42) {
                reset();
                showSpinner();
                showServerError();
                errorServer.innerText = 'Server Error : 42 is the meaning of life';
            } else {
                getLocalOutput();
            }
        }
        else {
            if (userInput.value > 50) {
                notValidNumber();
            } else {
                getServerOutput();
            }
        }
    }
    calcButton.addEventListener('click', validateCheckbox);

    function showSpinner() {
        spinner.classList.add('show');
    }

    function hideSpinner() {
        spinner.classList.remove('show');
    }

    function showServerError() {
        hideSpinner();
        errorServer.classList.add('show');
    };

    function notValidNumber() {
        reset();
        userInput.classList.add("error-box");
        errorLargerThan.classList.add('show');
        errorLargerThan.innerText = "Can't be larger than 50";
    }

    function reset() {
        fibonacciResult.classList.remove('show');
        userInput.classList.remove("error-box");
        errorLargerThan.classList.remove('show');
        errorServer.classList.remove('show');
    }

    function getLocalOutput() {
        reset();
        showSpinner();
        let inputValue = userInput.value;

        let firstNumber = 0, secondNumber = 1, fibonacciY = 1;
        for (let i = 2; i <= inputValue; i++) {
            fibonacciY = firstNumber + secondNumber;
            firstNumber = secondNumber;
            secondNumber = fibonacciY;
        }

        setTimeout(showResult, 400);
        fibonacciResult.innerText = fibonacciY;
    };

    function showResult() {
        hideSpinner();
        fibonacciResult.classList.add('show');
    };

    function getServerOutput() {
        showSpinner();
        reset();
        spinnerResults.classList.add('show');

        fetch(`http://localhost:5050/fibonacci/${userInput.value}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json()
                        .then((responseData) => handleNumber(responseData));
                } else {
                    return response.text()
                        .then((response) => handleText(response)); 
                }
            });
    };

    function handleNumber(responseData) {
        spinnerResults.classList.remove('show');
        showResult();
        fibonacciResult.innerText = responseData.result;

        let serverResultList = document.getElementById('server-list');
        let resultDate = new Date();
        let addToList = () => {
            let li = document.createElement("li")
            serverResultList.appendChild(li)
                .innerHTML = `The Fibonacci of <strong>${userInput.value}</strong> is <strong>${responseData.result}</strong>. Calculated at: ${resultDate}`;
            li.classList.add("list-group-item", "p-0", "py-3")
        }
        addToList();
    }

    function handleText(response) {
        spinnerResults.classList.remove('show');
        showServerError();
        errorServer.innerText = `Server Error : ${response}`;
    }
}