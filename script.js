document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const meterId = document.getElementById("meterId");
    const prevReading = document.getElementById("prevReading");
    const currReading = document.getElementById("currReading");
    const costPerKwh = document.getElementById("costPerKwh");
    const sayonaraBtn = document.getElementById("sayonaraBtn");
    const consumptionElement = document.getElementById("consumptionDisplay");
    const computationElement = document.getElementById("computationText");

    function validateMeterId(value) {
        return /^[a-zA-Z]{4}\d{4}$/.test(value);
    }
    function validateReading(value) {
        return /^\d{5}$/.test(value) && parseInt(value) >= 0;
    }
    function validateCost(value) {
        return parseFloat(value) > 0;
    }

    function showError(input, message) {
        input.style.border = "2px solid red";
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            input.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        errorSpan.style.color = "red";
    }

    function clearError(input) {
        input.style.border = "";
        let errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains("error-message")) {
            errorSpan.remove();
        }
    }

    if (form) {
        form.addEventListener("input", function (event) {
            const input = event.target;
            if (input === meterId && validateMeterId(input.value)) clearError(input);
            if ((input === prevReading || input === currReading) && validateReading(input.value)) clearError(input);
            if (input === costPerKwh && validateCost(input.value)) clearError(input);
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            let isValid = true;

            if (!validateMeterId(meterId.value)) {
                showError(meterId, "Meter ID must be 4 letters followed by 4 digits (e.g., abcd1234)");
                isValid = false;
            } else {
                clearError(meterId);
            }

            if (!validateReading(prevReading.value)) {
                showError(prevReading, "Previous Reading must be a 5-digit non-negative number");
                isValid = false;
            } else {
                clearError(prevReading);
            }

            if (!validateReading(currReading.value) || parseInt(currReading.value) < parseInt(prevReading.value)) {
                showError(currReading, "Current Reading must be a 5-digit number and >= Previous Reading");
                isValid = false;
            } else {
                clearError(currReading);
            }

            if (!validateCost(costPerKwh.value)) {
                showError(costPerKwh, "Cost per kWh must be a valid positive number");
                isValid = false;
            } else {
                clearError(costPerKwh);
            }

            if (isValid) {
                const prevReadingValue = parseInt(prevReading.value);
                const currReadingValue = parseInt(currReading.value);
                const costPerKwhValue = parseFloat(costPerKwh.value);
                const consumption = currReadingValue - prevReadingValue;
                const totalCost = consumption * costPerKwhValue;

                // ✅ Store all values in localStorage
                localStorage.setItem("prevReading", prevReadingValue);
                localStorage.setItem("currReading", currReadingValue);
                localStorage.setItem("costPerKwh", costPerKwhValue);
                localStorage.setItem("consumption", consumption);
                localStorage.setItem("totalCost", totalCost);

                setTimeout(() => {
                    window.location.href = "Calculating.html";
                }, 500);
                setTimeout(() => {
                    window.location.href = "Consumption.html";
                }, 3500);
            }
        });
    }

    if (window.location.pathname.includes("Consumption.html")) {
        const prevReadingValue = parseInt(localStorage.getItem("prevReading")) || 0;
        const currReadingValue = parseInt(localStorage.getItem("currReading")) || 0;
        const costPerKwhValue = parseFloat(localStorage.getItem("costPerKwh")) || 0.00;
        const consumption = parseInt(localStorage.getItem("consumption")) || 0;
        const totalCost = parseFloat(localStorage.getItem("totalCost")) || 0.00;

        const formattedPrevReading = prevReadingValue.toLocaleString();
        const formattedCurrReading = currReadingValue.toLocaleString();
        const formattedConsumption = consumption.toLocaleString();
        const formattedTotalCost = totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (consumptionElement) {
            consumptionElement.innerHTML = `${formattedConsumption} kWh <br> Total Cost: $${formattedTotalCost}`;
        }

        if (computationElement) {
            computationElement.innerHTML = `(${formattedCurrReading} - ${formattedPrevReading}) kWh × $${costPerKwhValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per kWh = $${formattedTotalCost}`;
        }
    }

    if (sayonaraBtn) {
        sayonaraBtn.addEventListener("click", function () {
            window.location.href = "thankyou.html";
        });
    }
});
