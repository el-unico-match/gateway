const promClient = require('prom-client');
const { v4: uuidv4 } = require('uuid');

promClient.collectDefaultMetrics();

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code']
});

// Define a counter for counting calls to /stats
const routeRequestCounter = new promClient.Counter({
    name: 'route_endpoint_calls_total', // Metric name
    help: 'Total number of calls to all routes', // Description
    labelNames: ['method', 'route', 'code'] // Labels to differentiate metrics
});


const initializePrometheus = function(app) {
    app.use((req, res, next) => {
        const params = {
            method: req.method, 
            code: res.statusCode, 
            processid: uuidv4(),
            route: req.route ? req.route.path : req.path,
        };

        routeRequestCounter.inc(params);
        const end = httpRequestDurationMicroseconds.startTimer();
        res.on('finish', () => { end(params); });

        next();
    });
    
    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
    });
}

module.exports = {
    initializePrometheus
}