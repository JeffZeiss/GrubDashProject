const { json } = require("express");
const { stat } = require("fs");
const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

// function hasText(req, res, next) {
//   const { data: { text } = {} } = req.body;
//   if (text) {
//     return next();
//   }
//   next({ status: 400, message: "A 'text' property is required." });
// }

function list(req, res) {
  res.json({ data: orders });
}
function hasDeliverTo(req,res,next){
const {data:{deliverTo}}=req.body
if(deliverTo&&deliverTo!==undefined){
  return next()
}
  next({
    status: 400,
    message: `Order must include a deliverTo`,
  });
}
function hasNumber(req,res,next){
  const {data: {mobileNumber}}=req.body
  if (mobileNumber){
    return next()
  }
  next({
    status: 400,
    message: `mobileNumber`,
  });
}
function hasRealNumber(req,res,next){
  const {data:{mobileNumber}}=req.body
  if (mobileNumber!==undefined){
    return next()
  }
  next({
    status: 400,
    message: `mobileNumber`,
  });
}
function dish(req,res,next){
  const{data:{dishes}}=req.body
  if (dishes)
  {res.locals.dishes=dishes
    return next()}
  next({
    status: 400,
    message: `Order must include a dish`,
  });
}
function dishArray(req,res,next){
if(Array.isArray(res.locals.dishes)&&res.locals.dishes.length>0){
  return next()
}
  next({
    status: 400,
    message: `Order must include at least one dish`,
  });
}
function dishQuant(req,res,next){
  // const {data:{dishes}}=req.body
  const dishes=res.locals.dishes
  // let index=0
  // for(let dish of dishes){
    // const {name,quantity}=dish
    // console.log (index,"index count")
    // index++
    // console.log(quantity,"quantity in each dishes dish")
    // console.log(name,"name of each dish in dishes")
    // console.log(dish,"what is each dish in dishes?t")
    // const quantNumber=Number(dish.quantity)
    // const index=dishes.findIndex((dish)=>{!dish.quantity||dish.quantity<=0||!Number.isInteger(dish.quantity)})
    let index= dishes.findIndex((dish)=>dish.quantity<=0||!dish.quantity||typeof (dish.quantity)!== "number")
    if (index > -1)
    {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });

  }
  next()
}

function create(req,res,next){
  const { data:{deliverTo,mobileNumber,status,dishes}
    // : {  } = {} 
} = req.body;
// console.log(nextId())
const newOrder = {
  id:nextId(),
  deliverTo:deliverTo,
  MobileNumber: mobileNumber,
  status:status,
  dishes:dishes
};
orders.push(newOrder);
// res
// .status(201)
// .json
// ({ data: newUrl })
res
.status(201)
.json({data: newOrder})
}


function findOrder(req, res, next) {

  const {orderId} = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder
    return next();
  }
  next({
    status: 404,
    message: `Order not found`,
  });
}
function orderIdFunc(req, res, next) {
  const {orderId} = req.params;
  urlOrderId=Number(orderId)
  console.log(urlOrderId,'urlOrderId')
  const{data:{id}}=req.body
  if(id){
    if(urlOrderId!==Number(id)){
      return next({ 
        status: 400,
        message: `Order id does not match route id. Order:${id}, Route:${urlOrderId}`
      }) 
    }
  }
   next()}
  // const urlIdNum = Number(urlId)

  function orderStatus(req,res,next){
    const {data:{status}}=req.body
    console.log(status,"status")
    if (!status){
      return next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
      })
    }else if(status==="pending"||status==="preparing"||status==="out-for-delivery"||status==="delivered"){
      res.locals.status=status
      return next()
    }
     next({status: 400,message:"Order must have a status of pending, preparing, out-for-delivery, delivered"})
  }
  function notDelivered(req,res,next){
    if(res.locals.order.status==="delivered"){
      return next({status:404, message: "A delivered order cannot be changed"})
    }
     next()}
    


  function update(req,res,next){
    const{data:{deliverTo,mobileNumber,status,dishes}}=req.body

      req.body.data
  
    res.locals.order.deliverTo=deliverTo
    res.locals.order.mobileNumber=mobileNumber
    res.locals.order.status=status
    res.locals.order.dishes=[...dishes]
    res.status(200)
    .json({data: res.locals.order})
  }

  function findDeleteOrder(req, res, next) {

    const {orderId} = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      res.locals.order = foundOrder
      return next();
    }
    next({
      status: 404,
      message: `Order ${orderId} not found`,
    });
  }

function statusPending (req,res,next){
  if(res.locals.order.status==="pending"){
    return next()
  }
  next({status:400,message:"An order cannot be deleted unless it is pending"})
}



function read(req, res) {
  res
    .json({ data: res.locals.order });
}

function destroy(req, res) {
  const actualOrder= res.locals.order
  const index = orders.findIndex((order) => order.id === Number(actualOrder));
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

///Note what is index for post check? dishQuant?

module.exports = {
  // create: [hasText, create],
  list,
  read: [findOrder,  read],
  update: [findOrder, 
    orderIdFunc, 
    orderStatus, 
    notDelivered,
    hasDeliverTo,
    hasNumber,
    hasRealNumber,
    dish,
    dishArray,
    dishQuant,
    update
  ],
  delete: [findDeleteOrder, statusPending, destroy],
  create: [hasDeliverTo,hasNumber,hasRealNumber,dish,dishArray, dishQuant, create],//has deliver to, dishArray 2 checks
  // noteExists
};

// TODO: Implement the /orders handlers needed to make the tests pass
