const mongoose=require('mongoose')
const mongo_rul=process.env.MONGO_CON;
mongoose.connect(mongo_rul)
.then(()=>{
    console.log("MongoDB Connected..")
}).catch((err)=>{
    console.log("Erro in Connection of MongoDB",err)
})