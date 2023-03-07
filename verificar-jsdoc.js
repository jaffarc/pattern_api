const execSync = require('child_process').execSync;
const verificarArquivos = require('./verificar');

// Obter a lista de arquivos que serão commitados
const arquivos = execSync('git diff --cached --name-only --diff-filter=ACM').toString().split('\n');

// Remover itens vazios e duplicados da lista
const arquivosUnicos = [...new Set(arquivos.filter(Boolean))];

// Verificar a documentação JSDoc de todos os arquivos
const resultado = verificarArquivos(arquivosUnicos);

// Se algum arquivo não tiver documentação JSDoc, impedir o commit
if (!resultado) {
  console.error('Um ou mais arquivos não têm documentação JSDoc.');
  process.exit(1);
}