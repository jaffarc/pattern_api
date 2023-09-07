const mongoose = require("mongoose");
const { Worker } = require('worker_threads');
const numWorkers = 4;
const batchSize = 800000;
// const totalInserts = 80000000;
const totalInserts = 800000;
const url =
  "mongodb://api:123456@127.0.0.1:27017/api?authSource=api&authMechanism=SCRAM-SHA-1";
const databaseName = "api";
const collectionName = "contrato";
const { Schema } = mongoose;

const contratoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    segment: {
      type: Schema.Types.Mixed,
      default: "all",
    },
    grade: {
      type: Schema.Types.Mixed,
      default: "all",
    },
    visualization: {
      type: Schema.Types.Mixed,
      default: "all",
    },
    stars: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
    description: {
      type: String,
    },
    descriptionItens: {
      type: String,
    },
    category: [String],
    nVlPeso: {
      type: String,
    },
    nCdFormato: {
      type: String,
    },
    nVlComprimento: {
      type: String,
    },
    nVlAltura: {
      type: String,
    },
    nVlLargura: {
      type: String,
    },
    nCdServico: {
      type: Array,
      default: [],
    },
    nVlDiametro: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "contrato",
    timestamps: true,
  }
);
contratoSchema.set("autoIndex", false);

let options = {
  connectTimeoutMS: 300000,
  socketTimeoutMS: 300000,
  bufferCommands: true,
  maxPoolSize: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// Função para criar e iniciar um worker
function createWorker(start, end) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: { start, end } });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Função principal para executar o processo de montagem dos documentos
async function run() {
  console.log('Iniciando o processo de montagem dos documentos...');

  let db = await mongoose.createConnection(url, options);

  await new Promise((resolve, reject) => {
    db.once("connected", () => {
      console.log("Conectado ao banco de dados MongoDB");
      resolve();
    });
    db.on("error", (error) => {
      reject(error);
    });
  });
  const contrato = db.model("contrato", contratoSchema);
  const startTime = new Date();
  let insertedCount = 0;


  const documentsPerWorker = Math.ceil(totalInserts / numWorkers);
  const workers = [];


  for (let i = 0; i < numWorkers; i++) {
    const start = i * batchSize + 1;
    const end = Math.min(start + batchSize, totalInserts + 1);
    console.log(start, end);
    workers.push(createWorker(start, end));
  }
  

  
  const results = await Promise.all(workers);


  for (const documents of results) {
    try {
      await contrato.insertMany(documents);
      insertedCount += documents.length;
    } catch (error) {
      console.error('Erro ao inserir documentos:', error);
    }
  }
  const endTime = new Date();
  const totalTime = (endTime - startTime) / 1000; // Converter para segundos

  console.log(`Concluído ${insertedCount} inserções em ${totalTime} segundos.`);
}

run().catch((error) => {
  console.error('Ocorreu um erro:', error);
});
