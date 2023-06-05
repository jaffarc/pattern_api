exports.capturelogMiddleware = () => {
  return (req, res, next) => {
    if (req.path === "/favicon.ico") {
      return next();
    }
    let startTime = Date.now();
    const formattedHeaders = {};
    
    for (const key in req.headers) {
      const formattedKey = key.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
      formattedHeaders[formattedKey] = req.headers[key];
    }
    
    const requestTime = new Date().toISOString();
    const apiVersion = req.headers["api-version"];
    const { method, path, httpVersion } = req;
    const ipAddress = req.ip;
    const headers = formattedHeaders;
    const requestBody = req.body;
    let responseBody;
    
    const antigoSend = res.send;
    res.send = function (data) {
      responseBody = data;
      antigoSend.call(this, data);
    };

    res.on("finish", () => {
      const responseData = res.locals.responseData || null;
      let router = req.route.path;
      
      const logObject = {
        request: {
          time: requestTime,
          uri: req.get('host') + req.originalUrl,
          verb: method,
          api_version: apiVersion,
          ip_address: ipAddress,
          http_version: httpVersion,
          headers,
          body: requestBody,
          params: req.params
        },
        response: {
          time: new Date().toISOString(),
          totalTime: (Date.now() - startTime) / 1000,
          status: res.statusCode,
          headers: res.getHeaders(),
          body: responseBody,
        },
        router
      };
      
      console.log("Log:", logObject);
    });

    next();
  };
};