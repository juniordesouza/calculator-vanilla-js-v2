// Selecionando elementos
const $screen = document.getElementById("screen");
const $input = document.getElementById("input-number");
const $buttons = document.querySelectorAll(".click-button");

//Definindo variáveis
const SIZE = 5;
const numeros = new Array(SIZE);
const operadores = new Array(SIZE);
let topoNumeros = 0;
let topoOperadores = 0;

//Lista de possíveis operações
const basicoperation = ["+", "-"];
const precedence = ["*", "/", "%"];

//Adiciona atributo a todos os botões
$buttons.forEach((item) => {
  item.setAttribute("onclick", "fetch(this.innerText)");
});

class Calculator {
  constructor() {
    this.cleanAll;
  }

  //Adiciona pilha de operadores
  add_pilha_num(number) {
    if (topoOperadores < SIZE) {
      numeros[topoNumeros] = number;
      topoNumeros++;
    } else {
      alert("Está cheio!");
      topoNumeros = SIZE;
    }
  }

  //Adiciona Pilha de números
  add_pilha_ops(operator) {
    if (topoOperadores < SIZE) {
      operadores[topoOperadores] = operator;
      topoOperadores++;
    } else {
      alert("Está cheio!");
      topoOperadores = SIZE;
    }
  }

  //Atualiza textarea
  updateScreen(val) {
    $screen.disabled = "false";
    $screen.value += `${$input.value}\n${val}\n`;
    $screen.disabled = "true";
  }

  //Limpa o input
  clean() {
    $input.value = "";
  }

  //Limpa tudo
  cleanAll() {
    $input.value = "";
    $screen.value = "";
    topoNumeros = 0;
    topoOperadores = 0;
  }

  //Recebe o dígito diretamente da função Fetch
  insertData(data) {
    //Seleciona o ultimo valor no visor
    let screen_value = $screen.value.trim();

    //Verifica se data é operador
    if (isNaN(data)) {
      //Verifica se o visor está vazio
      if (screen_value == "") {
        if (!$input.value) {
          console.log("Digite um número");

          //Input não está vazio, executa operação
        } else {
          this.moveToStark(data);
        }

        //Tem valor no visor
      } else {
        //Verifica se é operador
        if (isNaN(screen_value)) {
          //É operador e input está vazio
          if (!$input.value) {
            console.log("Digite um número");

            //É operador e input não está vazio, executa operação
          } else {
            this.moveToStark(data);
          }

          //Não é operador, executa operação
        } else {
          this.moveToStark(data);
        }
      }

      //data não é operador
    } else {
      //Verifica se visor está vazio
      if (screen_value != "" && !isNaN(screen_value)) {
        console.log("Esperando operador");
      } else {
        $input.value += data;
      }
    }
  }

  moveToStark(operator) {
    if (!$input.value) {
      console.log("Esperando numero");
    } else {
      this.add_pilha_num(parseInt($input.value));
    }
    if (operator == "=") {
      this.verifyOperation(operadores[topoOperadores - 1]);
      this.clean();
    } else {
      this.add_pilha_ops(operator);
      this.updateScreen(operator);
      this.clean();
      this.verifyOperation(operator);
    }
  }

  organize(result, sequence) {
    let lastOperator;

    numeros[topoNumeros - 2] = result;
    topoNumeros--;
    if (sequence === 1) {
      lastOperator = operadores[topoOperadores - 2];
    } else {
      lastOperator = operadores[topoOperadores - 1];
    }
    operadores[topoOperadores - 2] = lastOperator;
    topoOperadores--;
    this.verifyOperation(lastOperator);
  }

  verifyOperation(data) {
    if (topoNumeros >= 2) {
      let currentOperator = data;
      let lastOperator = operadores[topoOperadores - 2];
      let num = numeros[topoNumeros - 2];
      let num2 = numeros[topoNumeros - 1];

      if (!lastOperator) {
        let result = this.execute(currentOperator, num, num2);
        numeros[topoNumeros - 2] = result;
        topoNumeros--;
        topoOperadores--;
        $screen.value = result;
      } else {
        if (precedence.includes(lastOperator)) {
          let result = this.execute(lastOperator, num, num2);
          this.organize(result);
        } else {
          if (basicoperation.includes(currentOperator)) {
            let result = this.execute(lastOperator, num, num2);
            this.organize(result);
          } else {
            if (topoNumeros > topoOperadores) {
              let result = this.execute(currentOperator, num, num2);
              this.organize(result, 1);
            }
          }
        }
      }
    }
  }

  execute(operator, x, y) {
    switch (operator) {
      case "+":
        return x + y;
      case "-":
        return x - y;
      case "*":
        return x * y;
      case "/":
        return Math.trunc(x / y);
      case "%":
        return Math.trunc(x % y);
    }
  }
}

//Instancia objeto
const calculadora = new Calculator();

function fetch(data) {
  calculadora.insertData(data);
}

//Função de debugg
/* function mostrarPilhas(x) {
  console.log("Números: " + numeros + " Operadores: " + operadores);
  console.log(x);
  console.log("Topo num: " + topoNumeros + "\nTopo Op: " + topoOperadores);
} */
