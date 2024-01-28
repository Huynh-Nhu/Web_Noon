const staffRouter = require('./staff')
const customerRouter = require('./customer')
function route(app) {
    app.use('/staffs',staffRouter )
    app.use('/customer',customerRouter )


}

module.exports = route;