const express = require('express')
const routes = express.Router()
const model = require('../models')
const Transaction = model.Transaction

routes.get('/report',(req,res)=>{
    Transaction.findAll()
    .then(transactions=>{
        var lateTransaction = []
        var total = 0
        for(var i = 0; i < transactions.length; i++){
            if(transactions[i].arrivalTime>transactions[i].eta){
                var LateTransaction = transactions[i].LateTransaction()
                total += LateTransaction
                transactions[i].lateTransaction = LateTransaction
                console.log(transactions[i]);
                lateTransaction.push(transactions[i])
            }
        }
        // console.log(lateTransaction);
        
        // res.json(lateTransaction)
        res.render('report',{lateTransaction:lateTransaction,total:total})
    })
    .catch(err=>{
        res.json(err)
    })
    // res.send('di transaction nichhh')
})


module.exports = routes