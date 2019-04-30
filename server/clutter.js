const cluster = require('cluster');
const os = require('os');
// get cpu info
const CPUS = os.cpus();
if (cluster.isMaster) {
    // create a worker for each cpu
    CPUS.forEach(() => cluster.fork());
 
    cluster.on("listening", worker => {
        console.log("Cluster %d connected", worker.process.pid);
    });
 
    cluster.on("disconnect", worker => {
        console.log("Cluster %d disconnected", worker.process.pid);
    });
 
    cluster.on("exit", worker => {
        console.log("Cluster %d is dead", worker.process.pid);
         // Ensure starts of a new cluster if an old one dies 
        cluster.fork();      
    });
 
} else {
    require("./index.js"); // your server.js or index.js file.
}