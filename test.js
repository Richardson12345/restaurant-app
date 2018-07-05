const model = require('./models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

Transaction.findById(2)
.then(transaction=>{
    var hourUpdated = (transaction.updatedAt.getHours())*60
    var hourCreated = (transaction.createdAt.getHours())*60
    var minutesUpdate = transaction.updatedAt.getMinutes()
    var minutesCreate = transaction.createdAt.getMinutes()
    var Update = hourUpdated+minutesUpdate
    var Create = hourCreated+minutesCreate
    console.log(hourUpdated,"jamupdate");
    console.log(hourCreated,"jamcreate");
    console.log(minutesUpdate,"menitupdate");
    console.log(minutesCreate,"menitcreate");

    
    console.log(Update-Create);
    
})
.catch()