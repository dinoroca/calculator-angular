import { Injectable, signal } from '@angular/core';

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '*', '/'];
const specialOperators = ['C', '+/-', '=', '.', '%', 'Backspace'];

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  public resulText = signal('0');
  public subResulText = signal('0');
  public lastOperator = signal('+');

  public constructNumber(value: string): void {

    //validar inputs
    if (![...numbers, ...operators, ...specialOperators].includes(value)) {
      console.log('Invalid input', value);
      return;
    }

    // =
    if (value === '=') {
      this.calculate();
      return;
    }

    //Limpiar resultados
    if (value === 'C') {
      this.resulText.set('0');
      this.subResulText.set('0');
      this.lastOperator.set('+');
      return;
    }

    //Limpiar ultimo caracter
    //TODO: Revisar cuandos e tenga numeros negativos
    if (value === 'Backspace') {

      if (this.resulText() === '0') return;
      if (this.resulText().includes('-') && this.resulText().length === 2) {
        this.resulText.set('0');
        return;
      }

      if (this.resulText().length === 1) {
        this.resulText.set('0');
        return;
      }

      this.resulText.update((v) => v.slice(0, -1));
      return;
    }

    //aplicar operador
    if (operators.includes(value)) {
      //Calcular resultado con los operadores tambien
      this.calculate();

      this.lastOperator.set(value);
      this.subResulText.set(this.resulText());
      this.resulText.set('0');
      return;
    }

    //limitar numero de caracteres
    if (this.resulText().length >= 10) {
      console.log('Max length reached');
      return;
    }

    //Validar punto decimal
    if (value === '.' && !this.resulText().includes('.')) {
      if (this.resulText() === '0' || this.resulText() === '') {
        this.resulText.set('0.');
        return;
      }
      this.resulText.update((text) => text + '.');
      return;
    }

    //manejo de 0 inicial
    if (value === '0' && (this.resulText() === '0' || this.resulText() === '-0')) {
      return;
    }

    //cambiar signo
    if (value === '+/-') {
      if (this.resulText().includes('-')) {
        this.resulText.update((text) => text.slice(1));
        return;
      }
      this.resulText.update((text) => '-' + text);
      return;
    }


    //Numeros
    if (numbers.includes(value)) {
      if (this.resulText() === '0' || this.resulText() === '-0') {
        if (this.resulText().includes('-')) {
          this.resulText.set('-' + value);
          return;
        }

        this.resulText.set(value);
        return;
      }

      this.resulText.update((text) => text + value);
      return;
    }
  }

  public calculate(): void {
    const number1 = parseFloat(this.subResulText());
    const number2 = parseFloat(this.resulText());

    let result = 0;

    switch (this.lastOperator()) {
      case '+':
        result = number1 + number2;
        break;
      case '-':
        result = number1 - number2;
        break;
      case '*':
        result = number1 * number2;
        break;
      case '/':
        result = number1 / number2;
        break;
    }

    this.resulText.set(result.toString());
    this.subResulText.set('0');
  }

}
