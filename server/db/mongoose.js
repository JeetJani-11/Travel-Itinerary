const mongoose = require("mongoose")

try {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGOGBURL , {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
  })
  console.log("Connected to Database")
} catch (e) {
  console.log("Error Connecting Database : ", e.message);
}
