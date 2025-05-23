class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operator);
                this.updateDisplay();
            });
        });

        // Action buttons
        document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });

        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });

        document.querySelector('[data-action="delete"]').addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });

        document.querySelector('[data-action="decimal"]').addEventListener('click', () => {
            this.appendNumber('.');
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendNumber('.');
        } else if (e.key === '+') {
            this.chooseOperation('+');
        } else if (e.key === '-') {
            this.chooseOperation('-');
        } else if (e.key === '*') {
            this.chooseOperation('×');
        } else if (e.key === '/') {
            e.preventDefault();
            this.chooseOperation('÷');
        } else if (e.key === '%') {
            this.chooseOperation('%');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.compute();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.delete();
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetDisplay = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = this.roundResult(computation).toString();
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    roundResult(number) {
        return Math.round((number + Number.EPSILON) * 1000000000) / 1000000000;
    }

    showError(message) {
        this.currentOperand = 'Error';
        this.previousOperand = '';
        this.operation = null;
        
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
        }, 2000);
    }

    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }

        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentElement = document.getElementById('currentOperand');
        const previousElement = document.getElementById('previousOperand');

        currentElement.textContent = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            previousElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            previousElement.textContent = '';
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Add visual feedback for button presses
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});
