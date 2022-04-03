/**
 * Neste código nós temos uma "to do list" em nodeJS.
 * A proposta do nosso projeto é construir essa "to do"
 * como uma CLI. E o que seria uma CLI? Command-line interface,
 * ou em português, interface de linha de comando, é um programa
 * que funciona por linha de comando no terminal. Não existe
 * uma interface própria, toda a funcionalidade é por comandos
 * no próprio terminal por "node".
 *
 * Este programa vai ter um menu e dois arquivos de textos,
 * um recebendo a lista de tarefas pendentes e outro recebendo
 * as tarefas feitas.
 */

const fs = require("fs");

const args = process.argv;

//O "Index.js" tem um tamanho de 8 caracteres, então -8
//remove o último caractere
const currentWorkingDirectory = args[1].slice(0, -8);

if (fs.existsSync(currentWorkingDirectory + "todo.txt") === false) {
  let createStream = fs.createWriteStream("todo.txt");
  createStream.end();
}
if (fs.existsSync(currentWorkingDirectory + "done.txt") === false) {
  let createStream = fs.createWriteStream("done.txt");
  createStream.end();
}

/**
 * Ao executar o comando "node index.js", receberemos como
 * retorno as informações do "UsageText". Essa constante nos
 * mostra os comandos para adicionar tarefas, mostrar lista,
 * deletar, completar e etc.
 */
const infoFunction = () => {
  const UsageText = `
    Usage: -
    $ node index.js add "todo item" # add new todo 
    $ node index.js ls              # show remaining todos
    $ node index.js del NUMBER      # Delete a todo
    $ node index.js done NUMBER     # Complete a todo
    $ node index.js help            # Show usage
    $ node index.js report          # Statistics`;

  console.log(UsageText);
};

//função responsável por listar as tarefas (funciona como o "ls")
const toDoList = () => {
  //cria um array vazio
  let data = [];

  //leia as informações do arquivo "todo.txt" e converte para String.
  const fileData = fs
    .readFileSync(currentWorkingDirectory + "todo.txt")
    .toString();

  //faz um split na string e armazena numa array.
  data = fileData.split("\n");

  //filtra a string para qualquer linha vazia no arquivo
  let filterData = data.filter(function (value) {
    return value !== "";
  });

  //Se o tamanho do array for zero => não há tarefas pendentes.
  if (filterData.length === 0) {
    console.log("Não há tarefas pendentes");
  }

  for (let i = 0; i < filterData.length; i++) {
    console.log((filterData.length - i) + ". " + filterData[i]);
  }
};

const addToDo = () => {
  //novo argumento de string de tarefas é armazenado
  const newTask = args[3];

  //se o argumento é passado
  if (newTask) {
    //cria um array vazio
    let data = [];

    //Lê os dados do arquivo todo.txt e converte para string
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    //A nova tarefa é adicionada nos dados prévios
    fs.writeFile(
      currentWorkingDirectory + "todo.txt",
      newTask + "\n" + fileData,

      //função responsável por controlar os erros => middleware
      function (err) {

        //controlador
        if (err) throw err;

        //nava tarefa é adicionada
        console.log('tarefa adicionada"' + newTask + '"');
      }
    );
  } else {
    //senão tereremos um erro
    console.log("Error: Missing todo string. Nothind added!");
  }
};

//função responsável por deletar as tarefas
const deleteToDo = () => {
  //Armaze os índices que foram passados para serem deletados
  const deleteIndex = args[3];

  //se o índice é passado
  if (deleteIndex) {
    //cria um novo array vazio
    let data = [];

    //Lê os dados do arquivo e converte para uma string
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    //Faz um split das strings em array
    data = fileData.split("\n");

    //Filtra os dados para qualquer linha vazia do arquivo
    let filterData = data.filter(function (value) {
      return value !== "";
    });

    //Se o índice for maior do que o o comprimento do array e o
    //índice dor menor ou igual a zero, teremos um erro.
    if (deleteIndex > filterData.length || deleteIndex <= 0) {
      console.log(
        "Error: todo #" + deleteIndex + "does t exist. Nothing deleted"
      );
    } else {
      //se não, remove a tarefa
      filterData.splice(filterData.length - deleteIndex, 1);

      //Fala um join para formar uma string
      const newData = filterData.join("\n");

      //escreva um novo arquivo "todo.txt" sem o o índice deletado
      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,
        function (err) {
          if (err) throw err;

          //logs dos índice deletados.
          console.log("Deleted todo #" + deleteIndex);
        }
      );
    }
  } else {
    //se não, os índices não foram passados e deu algum erro
    console.log("Error: Missing NUMBER for deleting todo.");
  }
};


//função responsável por armazenar no arquivo "done.txt" as tarefas que já foram feitas
const doneFunction = () => {

  //Armazena os índices que foram passados como argumentos (as tarefas que foram feitas)
  const doneIndex = args[3];

  // se o índice foi passado.
  if (doneIndex) {

    //crie um novo array vazio
    let data = [];

    //crie um novo objeto de data => data em que tarefa foi finalizada
    let dateobj = new Date();

    //converte para uma string 
    let dateString = dateobj.toISOString().substring(0, 10);

    //ler os dados do arquivo todo.txt e converter para uma string
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    //ler os dados do arquivo done.txt e converter para uma string
    const doneData = fs
      .readFileSync(currentWorkingDirectory + "done.txt")
      .toString();

    //faz um split no arquivo todo.txt
    data = fileData.split("\n");

    //filtrar para qualquer linha vazia
    let filterData = data.filter(function (value) {
      return value !== "";
    });

    //se o índice da tarefa pendente for menor do que o cumprimento do array || menor ou igual a 0 => retorna erro
    if (doneIndex > filterData.length || doneIndex <= 0) {
      console.log("Error: todo #" + doneIndex + "Does not exist.");

    } else {
      const deleted = filterData.splice(filterData.length - doneIndex, 1);

      const newData = filterData.join("\n");

      //reescrevendo o arquivo todo sem a tarefa colocada no done
      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,

        function (err) {
          if (err) throw err;
        }
      );

      /**
       * reescrevendo o arquivo done.txt com as tarefas feitas. 
       * nesse arquivo teremos um "x", representando que a tarefa 
       * foi completada, a data que foi finalizada e qual tarefa
       */
      fs.writeFile(
        currentWorkingDirectory + "done.txt",
        "x " + dateString + " " + deleted + "\n" + doneData,
        function (err) {
          if (err) throw err;
          console.log("Marked todo #" + doneIndex + "as done."); //tendo sucesso => teremos essa mensagem como retorno
        }
      );
    }
  } else {
    console.log("Error: MIssing NUMBER for" + "markint todo as done");
  }
};

const reportFunction = () => {

  let todoData = [];

  let doneData = [];
  
  let dateobj = new Date();

  let dateString = dateobj.toISOString().substring(0, 10);

  const todo = fs.readFileSync(currentWorkingDirectory + "todo.txt").toString();

  const done = fs.readFileSync(currentWorkingDirectory + "done.txt").toString();

  todoData = todo.split("\n");

  doneData = done.split("\n");

  let filterTodoData = todoData.filter(function (value) {
    return value !== "";
  });
  let filterDoneData = doneData.filter(function (value) {
    return value !== "";
  });
  console.log(
    dateString +
      " " +
      "pending : " +
      filterTodoData.length +
      " Completed : " +
      filterDoneData.length
  );
};

switch (args[2]) {
  case "add": {
    addToDo();
    break;
  }
  case "ls": {
    toDoList();
    break;
  }
  case "del": {
    deleteToDo();
    break;
  }
  case "done": {
    doneFunction();
    break;
  }
  case "help": {
    infoFunction();
    break;
  }
  case "report": {
    reportFunction();
    break;
  }
  default: {
    infoFunction();
  }
}
