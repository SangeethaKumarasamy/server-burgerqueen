const mongoose=require("mongoose");

const burgerSchema=mongoose.Schema({
    name:{type:"string",require},
    variants:[],
    prices:[],
    category:{type:"string",require},
    image:{type:"string",require},
    description:{type:"string",require}
},{
    timestamps:true,
})

const burgerModel=mongoose.model('burgers',burgerSchema);

module.exports=burgerModel;