const promClient = require('prom-client');
const { v4: uuidv4 } = require('uuid');

promClient.collectDefaultMetrics();

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms', // Metric name
    help: 'Duration of HTTP requests in ms', // Description
    labelNames: ['method', 'route', 'code', 'processid'] // Labels to differentiate metrics
});

const routeRequestCounter = new promClient.Counter({
    name: 'route_endpoint_calls_total', // Metric name
    help: 'Total number of calls to all routes', // Description
    labelNames: ['method', 'route', 'code', 'processid'] // Labels to differentiate metrics
});


const httpClientRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_user_request_duration_ms', // Metric name
    help: 'Duration of HTTP requests in ms', // Description
    labelNames: ['method', 'route', 'code', 'processid', 'userid'] // Labels to differentiate metrics
});

const routeClientRequestCounter = new promClient.Counter({
    name: 'route_user_endpoint_calls_total', // Metric name
    help: 'Total number of calls to all routes', // Description
    labelNames: ['method', 'route', 'code', 'processid', 'userid'] // Labels to differentiate metrics
});

const initializePrometheus = function(app) {
    app.use((req, res, next) => {
        let params = {
            method: req.method, 
            code: res.statusCode, 
            processid: uuidv4(),
            route: req.route ? req.route.path : req.path,
        };
        
        let idx = -1;
        const parts = params.route.split('/');
        for (let i = 0; i < parts.lenght; i++) {
            if (parts[i].lenght > 22 && (parts[i-1] == 'user' || parts[i-1] == 'users' || parts[i-1] == 'profile')) {
                idx = i;
                break;
            }
        }
        
        const hasGID = (idx >= 0);
        const isUser = hasGID;
        if (isUser) {
            routeRequestCounter.inc(params);
            const end = httpRequestDurationMicroseconds.startTimer();
            res.on('finish', () => { end(params); });
        } else {
            params.userid = parts[idx];
            routeClientRequestCounter.inc(params);
            const end = httpClientRequestDurationMicroseconds.startTimer();
            res.on('finish', () => { end(params); });
        }

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