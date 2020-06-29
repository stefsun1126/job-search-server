const mongoose = require('mongoose');

// connect
mongoose.connect('mongodb://localhost:27017/job-search', { useNewUrlParser: true, useUnifiedTopology: true });

// listener
// success
mongoose.connection.on('open', () => {
    console.log('mongoose success connect !!!')
})
// fail
mongoose.connection.on('error', (err) => {
    console.log('mongoose fail connect , error is:' + err)
})