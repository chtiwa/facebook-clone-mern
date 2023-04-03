const mongoose = require('mongoose')

const connectDB = (uri) => {
  return mongoose.connect(uri, {
    useUnifiedTopology: true
  })
    .then(() => console.log(`CONNECTED TO THE DATABASE`))
    .catch((err) => console.log(err))
}

module.exports = connectDB