'use strict';
const http = require('http'),
  cluster = require('cluster'),
  os = require('os'),
  app = require('./src/server.js'),
  memoryData = process.memoryUsage();
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const CLUSTER = (process.env.CLUSTER === 'true');

// console.log(CLUSTER)
process.on('unhandledRejection', rejectionErr => {
  console.log('unhandledRejection Err::', rejectionErr);
  console.log('unhandledRejection Stack::', JSON.stringify(rejectionErr.stack));
});

process.on('uncaughtException', uncaughtExc => {
  console.log('uncaughtException Err::', uncaughtExc);
  console.log('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
});


let workers = [];
const setupWorkerProcesses = () => {
  let numCores = os.cpus().length;
  console.log(`Master cluster setting up ${numCores} workers`);
  for (let i = 0; i < numCores; i++) {
    workers.push(cluster.fork());
    workers[i].on('message', function (message) {
      console.log(message);
    });
  }
  cluster.on('online', function (worker) {
    console.log(`Worker pid:${worker.process.pid} is listening`);
  });

  cluster.on('exit', function (worker, code, signal) {

    console.log(`'Worker ${worker.process.pid} died with code:${code} and signal:${signal}`);
    console.log('Starting a new worker');
    workers.push(cluster.fork());
    workers[workers.length - 1].on('message', function (message) {
      console.log(message);
    });
  });
};

const setUpExpress = () => {
  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log(`Express server listening on port: ${process.env.PORT}`);
    console.log(memoryUsage);
  });

  
  server.on('error', (serErr, serCtx) => {
    console.error('server error', serErr.stack);
    console.error('on url', serCtx.req.url);
    console.error('with headers', serCtx.req.headers);
  });
};


const formatMemoryUsage = (data) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
const memoryUsage = {
  rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
  heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
  heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
  external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
};


/**
 * @description Caso queira iniciar como cluster ou apenas um nucleo
 * @param {Boolean} isCluster
 */
const setupServer = (isCluster) => {

  if (isCluster && cluster.isMaster) {
    return setupWorkerProcesses();
  }

 setUpExpress();

  if (CLUSTER && cluster.isMaster) {
    process.on('SIGUSR2', async () => {
      const workers = Object.values(cluster.workers);
      const restartPromises = [];
    
      for (const worker of workers) {
        console.log(`Stopping worker: ${worker.process.pid}`);
        const restartPromise = new Promise((resolve) => {
          worker.disconnect();
          worker.on('exit', () => {
            if (!worker.exitedAfterDisconnect) return;
            const newWorker = cluster.fork();
            newWorker.once('listening', resolve);
          });
        });
    
        restartPromises.push(restartPromise);
      }
    
      await Promise.all(restartPromises);
    });
    
    process.on('SIGINT', () => {
      console.log('Received SIGINT signal. Closing the process...');
      const workers = Object.values(cluster.workers);
    
      for (const worker of workers) {
        console.log(`Stopping worker: ${worker.process.pid}`);
        worker.disconnect();
      }
    
      // Exit the process after a short delay to allow workers to gracefully terminate

    });
    


    process.on('SIGUSR1', () => {
      console.log('Starting new worker');
      const newWorker = cluster.fork();
      newWorker.once('listening', () => {
        console.log(`New worker started: ${newWorker.process.pid}`);
      });
    });
    
  
    console.log(`Master cluster setting up ${workers.length} workers`)
  }
};


setupServer(CLUSTER);