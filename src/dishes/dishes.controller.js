const path = require("path");
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));


// function hasText(req, res, next) {
//   const { data: { text } = {} } = req.body;

//   if (text) {
//     return next();
//   }
//   next({ status: 400, message: "A 'text' property is required." });
// }
// function hasUrl(req, res, next) {
//     const { data: { href } = {} } = req.body;
    
//     if (href) {
//       return next();
//     }
//     next({ status: 400, message: "An 'href' property is required." });
//   }
function nameLegit(req,res,next){
    const {data:{name}}=req.body
    // console.log(name)
    if(name&&name!==undefined){
        res.locals.name=name
        return next()
    }
    next({status:400,message:"name must be legit yo"})
}
function descLegit(req,res,next){
    const {data:{description}}=req.body
    // console.log(description)
    if(description&&description!==undefined){
        res.locals.desc=description
        return next()
    }
    next({status:400,message:"description"})
}
function priceLegit(req,res,next){
    const {data:{price}}=req.body
    // console.log(description)
    if(price&&price>0&&Number.isInteger(price)&&price>0){
        res.locals.price=price
        return next()
    }
    next({status:400,message:"price"})
}
function imgLegit(req,res,next){
    const {data:{image_url}}=req.body
    const img=image_url
    if(img&&img!==undefined){
        res.locals.img=img
        return next()
    }
    next({status:400,message:"image_url"})
}

function create(req, res) {
    const { data
        // : {  } = {} 
    } = req.body;
    // console.log(nextId())
    const newDish = {
    id: nextId(), // id util
    name: res.locals.name,//from res body
    description: res.locals.desc,//"Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
    price: res.locals.price,//19,
    image_url: res.locals.img//from reqbody
    };
    dishes.push(newDish);
    // res
    // .status(201)
    // .json
    // ({ data: newUrl })
    res
    .status(201)
    .json({data: newDish})
  }

function list(req, res) {
  res.json({ data: dishes });
}

// function useExists(req, res, next) {
//   console.log("we're in read")
//   const useId = Number(req.params.useId);
//   const foundUse = uses.find((use) => use.id === useId);
//   if (foundUse) {
//     res.locals.use = foundUse
//     console.log("useExistspassed")
//     return next();
//   }
//   next({
//     status: 404,
//     message: `use id not found: ${req.params.useId}`,
//   });
// }
function urlUseCheck(req, res, next) {
  const { urlId, useId } = req.params;
  // if(!urlId){return next()}
  // const urlIdNum = Number(urlId)
  if (urlId && Number(urlId) 
  !== res.locals.use.urlId){
      next({ 
        message: "suckanegg", 
        status: 404 }) 
      }
  return next();
}
function findDish(req,res,next){
    const dishId =
    //  Number(
      req.params.dishId
      // );
    const foundDish = dishes.find((dish) => (dish.id = dishId));
    if(foundDish){
    res.locals.dish=foundDish
    res.locals.urlId=dishId
    next()
}
next({status:404,message:`Dish does not exist:${dishId}`})
}
function read(req, res,next) {
//   console.log("read is reached")
     res.status(200)
    .json({ data: res.locals.dish });
}


// function destroy(req, res) {
//   const { useId } = req.params;
//   const index = uses.findIndex((use) => use.id === Number(useId));
//   if (index > -1) {
//     uses.splice(index, 1);
//   }
//   res.sendStatus(204);
// }
function findUpdateDish(req,res,next){
    const dishId = 
    // Number(
      req.params.dishId
      // );
    const foundDish = dishes.find((dish) => (dish.id = dishId));
    if(foundDish){
    res.locals.dish=foundDish
    res.locals.urlId=dishId
    next()
}
next({status:404,message:`Dish does not exist:${dishId}`})
}
function updateDishChecker(req,res,next){
    const {data:{id}}=req.body
    // console.log(id,"id",res.locals.urlId,"local id")
    if(id&&res.locals.urlId!==id){
        next({status:400,message:`Dish id does not match route id. Dish: ${id}, Route: ${res.locals.urlId}`})
    }
        next()
}

function update(req,res,next){

        // const noteId = Number(req.params.noteId);
        // const foundNote = notes.find((note) => note.id === noteId);
      // console.log("updatereached")
        const { data: { name,description,
        image_url,price } } = req.body;
            // console.log (price,"price from req")
            // console.log(res.locals.dish.name,"localsname")
        res.locals.dish.name = name;
        
        res.locals.dish.description= description
        res.locals.dish.image_url=image_url
        res.locals.dish.price=price;    
// const updateItem={name: name,
// id:res.locals.urlId,
// description:description,
// image_url:image_url,
// price:price};   
//   dishes

        res.status(200)
        .json({ data: res.locals.dish });
      }


module.exports = {
    list,
  create: [nameLegit,
    descLegit,
      priceLegit,
    imgLegit, 
    create],
  read: [findDish,
    // dishExists,
    //  urlUseCheck, 
    read],
    update: [
        findUpdateDish,
        nameLegit, 
        descLegit,
        imgLegit,
        priceLegit,
        updateDishChecker,
    update],


  //   delete: [useExists, destroy],
  // noteExists
};




// TODO: Implement the /dishes handlers needed to make the tests pass
