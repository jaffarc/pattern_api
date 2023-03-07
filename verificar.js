const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');

// Verificar se uma função tem documentação JSDoc
function verificarFuncao(doc) {
  if (doc.kind === 'function' && !doc.description) {
    console.warn(`A função ${doc.name} não tem documentação JSDoc.`);
    return false;
  }
  return true;
}

// Verificar a documentação JSDoc de um arquivo
function verificarArquivo(arquivo) {
  // Ler o arquivo JavaScript com as funções
  const file = fs.readFileSync(arquivo, 'utf8');

  // Obter a documentação JSDoc das funções
  const docs = jsdoc2md.getTemplateDataSync({ source: file });

  // Verificar se cada função tem documentação JSDoc
  const resultado = docs.every(verificarFuncao);

  return resultado;
}

// Verificar a documentação JSDoc de vários arquivos
function verificarArquivos(arquivos) {
  // Verificar cada arquivo individualmente
  const resultado = arquivos.map(verificarArquivo);

  return resultado.every(Boolean);
}

module.exports = verificarArquivos;
