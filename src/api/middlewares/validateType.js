const validateType = (req, res, next) => {
    try {
        // let o = schema.validate();
        let url = req._parsedUrl;
        console.log(url)
        console.log('OOO',req.method, url.query, url.pathname)
      
        next()
    }
    catch (err) {
        console.log('CAIU no validate')
        next(err);
    }
}
module.exports ={
    validateType
}