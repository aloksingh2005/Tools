import { debounce } from './core.js';

var UNITS = {
    length: {
        label: 'Length',
        units: {
            m: 1,
            km: 1000,
            ft: 0.3048,
            mi: 1609.34
        }
    },
    weight: {
        label: 'Weight',
        units: {
            g: 1,
            kg: 1000,
            lb: 453.592,
            oz: 28.3495
        }
    },
    temperature: {
        label: 'Temperature',
        units: {
            c: 'c',
            f: 'f',
            k: 'k'
        }
    }
};

function convertTemperature(value, from, to) {
    var celsius = value;
    if (from === 'f') {
        celsius = (value - 32) * (5 / 9);
    } else if (from === 'k') {
        celsius = value - 273.15;
    }
    if (to === 'f') {
        return (celsius * 9) / 5 + 32;
    }
    if (to === 'k') {
        return celsius + 273.15;
    }
    return celsius;
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="unitCategory">Category</label>
            <select id="unitCategory" class="tool-select"></select>
        </div>
        <div class="tool-field">
            <label for="unitValue">Value</label>
            <input id="unitValue" class="tool-input" type="number" value="1" step="0.01">
        </div>
        <div class="tool-field">
            <label for="unitFrom">From</label>
            <select id="unitFrom" class="tool-select"></select>
        </div>
        <div class="tool-field">
            <label for="unitTo">To</label>
            <select id="unitTo" class="tool-select"></select>
        </div>
        <div class="tool-field">
            <label>Result</label>
            <div id="unitResult" class="tool-textarea" style="min-height:60px; text-align:center; font-size:1.4rem;"></div>
        </div>
    `;

    var categorySelect = panel.querySelector('#unitCategory');
    var valueInput = panel.querySelector('#unitValue');
    var fromSelect = panel.querySelector('#unitFrom');
    var toSelect = panel.querySelector('#unitTo');
    var result = panel.querySelector('#unitResult');

    function populateCategories() {
        categorySelect.innerHTML = Object.keys(UNITS).map(function (key) {
            return '<option value="' + key + '">' + UNITS[key].label + '</option>';
        }).join('');
    }

    function populateUnits() {
        var category = UNITS[categorySelect.value];
        var keys = Object.keys(category.units);
        fromSelect.innerHTML = keys.map(function (unit) {
            return '<option value="' + unit + '">' + unit.toUpperCase() + '</option>';
        }).join('');
        toSelect.innerHTML = keys.map(function (unit) {
            return '<option value="' + unit + '">' + unit.toUpperCase() + '</option>';
        }).join('');
        toSelect.selectedIndex = Math.min(1, keys.length - 1);
    }

    function calculate() {
        var value = parseFloat(valueInput.value || '0');
        var categoryKey = categorySelect.value;
        if (categoryKey === 'temperature') {
            var tempValue = convertTemperature(value, fromSelect.value, toSelect.value);
            result.textContent = tempValue.toFixed(2);
            return;
        }
        var unitMap = UNITS[categoryKey].units;
        var base = value * unitMap[fromSelect.value];
        var converted = base / unitMap[toSelect.value];
        result.textContent = converted.toFixed(2);
    }

    populateCategories();
    populateUnits();
    calculate();

    var update = debounce(calculate, 100);
    [categorySelect, valueInput, fromSelect, toSelect].forEach(function (el) {
        el.addEventListener('input', function () {
            if (el === categorySelect) {
                populateUnits();
            }
            update();
        });
    });
}
