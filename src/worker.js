const { parentPort, workerData } = require('worker_threads');
const { start, end } = workerData;

// Função para gerar os documentos em um lote
function generateDocuments(start, end) {
  const documents = [];
  for (let i = start; i < end; i++) {
    const document = {
      name: `Product ${i}`,
      sku: `SKU${i}`,
      segment: i % 2 === 0 ? ['segmento 1', 'segmento 2'] : 'all',
      grade: i % 2 === 0 ? ['série 1', 'série 2'] : 'all',
      visualization: i % 2 === 0 ? ['CUPOM1', 'CUPOM2'] : 'all',
      stars: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 1000) + 1,
      priceDiscount: Math.floor(Math.random() * 200) + 1,
      stock: Math.floor(Math.random() * 100),
      description: 'Product description',
      descriptionItens: 'Product item description',
      category: ['category1', 'category2'],
      nVlPeso: '1 kg',
      nCdFormato: 'format',
      nVlComprimento: '10 cm',
      nVlAltura: '5 cm',
      nVlLargura: '3 cm',
      nCdServico: ['service1', 'service2'],
      nVlDiametro: '5 cm',
      status: true,
      delete: false,
    };
    documents.push(document);
  }
  return documents;
}

// Recebe a mensagem do worker e envia os documentos gerados de volta para o processo principal
parentPort.postMessage(generateDocuments(start, end));
