(function () {
    const conversions = {
        length: {
            units: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches', 'Centimeters', 'Millimeters', 'Yards'],
            base: 'Meters',
            toBase: {
                Meters: v => v, Kilometers: v => v * 1000, Miles: v => v * 1609.344,
                Feet: v => v * 0.3048, Inches: v => v * 0.0254, Centimeters: v => v / 100,
                Millimeters: v => v / 1000, Yards: v => v * 0.9144
            },
            fromBase: {
                Meters: v => v, Kilometers: v => v / 1000, Miles: v => v / 1609.344,
                Feet: v => v / 0.3048, Inches: v => v / 0.0254, Centimeters: v => v * 100,
                Millimeters: v => v * 1000, Yards: v => v / 0.9144
            }
        },
        mass: {
            units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons (metric)', 'Stones'],
            base: 'Kilograms',
            toBase: {
                Kilograms: v => v, Grams: v => v / 1000, Milligrams: v => v / 1e6,
                Pounds: v => v * 0.45359237, Ounces: v => v * 0.028349523,
                'Tons (metric)': v => v * 1000, Stones: v => v * 6.35029318
            },
            fromBase: {
                Kilograms: v => v, Grams: v => v * 1000, Milligrams: v => v * 1e6,
                Pounds: v => v / 0.45359237, Ounces: v => v / 0.028349523,
                'Tons (metric)': v => v / 1000, Stones: v => v / 6.35029318
            }
        },
        temperature: {
            units: ['Celsius', 'Fahrenheit', 'Kelvin'],
            base: 'Celsius',
            toBase: {
                Celsius: v => v,
                Fahrenheit: v => (v - 32) * 5/9,
                Kelvin: v => v - 273.15
            },
            fromBase: {
                Celsius: v => v,
                Fahrenheit: v => v * 9/5 + 32,
                Kelvin: v => v + 273.15
            }
        },
        volume: {
            units: ['Liters', 'Milliliters', 'Gallons (US)', 'Quarts (US)', 'Pints (US)', 'Cups (US)', 'Fluid Ounces (US)', 'Cubic Meters'],
            base: 'Liters',
            toBase: {
                Liters: v => v, Milliliters: v => v / 1000,
                'Gallons (US)': v => v * 3.78541178, 'Quarts (US)': v => v * 0.946352946,
                'Pints (US)': v => v * 0.473176473, 'Cups (US)': v => v * 0.236588236,
                'Fluid Ounces (US)': v => v * 0.0295735296, 'Cubic Meters': v => v * 1000
            },
            fromBase: {
                Liters: v => v, Milliliters: v => v * 1000,
                'Gallons (US)': v => v / 3.78541178, 'Quarts (US)': v => v / 0.946352946,
                'Pints (US)': v => v / 0.473176473, 'Cups (US)': v => v / 0.236588236,
                'Fluid Ounces (US)': v => v / 0.0295735296, 'Cubic Meters': v => v / 1000
            }
        }
    };

    const themeToggle = document.getElementById('theme-toggle');
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const swapBtn = document.getElementById('swap-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    let currentCategory = 'length';

    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('tools-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    function populateUnits(category) {
        const data = conversions[category];
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        data.units.forEach(u => {
            fromUnit.appendChild(new Option(u, u));
            toUnit.appendChild(new Option(u, u));
        });
        if (data.units.length > 1) {
            toUnit.value = data.units[1] || data.units[0];
        }
    }

    function convert() {
        const data = conversions[currentCategory];
        const val = parseFloat(fromValue.value);
        if (isNaN(val)) { toValue.value = ''; return; }
        const from = fromUnit.value;
        const to = toUnit.value;
        const baseVal = data.toBase[from](val);
        const result = data.fromBase[to](baseVal);
        toValue.value = result.toPrecision(10).replace(/\.?0+$/, '');
    }

    function switchCategory(category) {
        currentCategory = category;
        tabBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
        populateUnits(category);
        convert();
    }

    tabBtns.forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));

    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);

    swapBtn.addEventListener('click', () => {
        if (fromUnit.value === toUnit.value) return;
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        fromValue.value = toValue.value || fromValue.value;
        convert();
    });

    document.querySelectorAll('.converter-row input').forEach(inp => {
        inp.addEventListener('focus', e => e.target.select());
    });

    switchCategory('length');
})();
