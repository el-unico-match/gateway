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

const obtainUserid = function(path) {
    const parts = path.split('/');
    for (let idx = 0; idx < parts.lenght; idx++) {
        if (parts[idx].lenght > 22) {
            return parts[idx];
        }
    }
    return null;
}

const storeEvents = function(res, params, timer, counter) {
    const end = timer.startTimer();
    res.on('finish', () => { 
        params.code = res.statusCode;
        counter.inc(params);
        end(params); 
    });
}

const initializePrometheus = function(app) {
    app.use((req, res, next) => {
        let params = {
            method: req.method, 
            processid: uuidv4(),
            code: res.statusCode,
            route: req.route ? req.route.path : req.path,
        };
        
        const userid = obtainUserid(params.route);
        if (userid != null) {
            params.userid = userid;
            storeEvents(res, params, 
                httpClientRequestDurationMicroseconds,
                routeClientRequestCounter
            );
        } else {
            storeEvents(res, params, 
                httpRequestDurationMicroseconds,
                routeRequestCounter
            );
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