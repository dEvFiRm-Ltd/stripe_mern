const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    
    email:String,
    stripeId: String,
    paid: {
        type: Boolean,
        default: false
    }
});


module.exports= model('User',userSchema);