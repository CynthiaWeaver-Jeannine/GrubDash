const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// existing dish validation needed for destroy(), read(), and update*()
function validateDishExists(req, res, next) {
  let dishId = req.params.dishId;
  let foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next()
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`
    })
}

// retrieve a dish 
function read(req, res) { 
  res.json({data: res.locals.dish})
};

// create a new dish with valid properties
function create(req, res) {
  const dish = req.body.data
  dish.id = nextId();
    dishes.push(dish);
    res.status(201).json({data: dish});
}

// retrieve a list of all existing dishes data
function list(req, res) {
    res.json({ data: dishes });    
}

// delete an existing dish
function destroy(req, res, next) {
  let { dishId } = req.params;
  const index = dishes.findIndex((dish) => dish.id ===Number(dishId));
  if(index > -1) {
    dishes.splice(index, 1)
    res.send(204).send()
  }else{
    next({
      status: 404,
      message: "An order cannot be deleted unless it is pending."
    })
  }
  
}

// name validation needed for create() and update()
function validateNameProperty(req, res, next) {
  const {data: {name} ={} } = req.body;
  if (name) {
    return next()
  }else{
    next({
      status: 400,
      message:  "Dish must include a name"
    })
  }
}

// image validation needed for create() and update()
function validateImageProperty(req, res, next) {
  const {data: {image_url} ={} } = req.body;
  if (image_url && image_url !== "") {
    return next()
  }else{
    next({
      status: 400,
      message: "Dish must include a image_url"
    })
  }
}

// description validation needed for create() and update()
function validateDescriptionProperty(req, res, next) {
  const {data: {description} ={} } = req.body;
  if (description && description !== "") {
    return next()
  }else{
    next({
      status: 400,
      message: "Dish must include a description"
    })
  }
}


// price validation needed for create() and update()
function validatePriceProperty(req, res, next) {
  const { data: {price} } = req.body;
  if( typeof price ==="number" && !isNaN(price) && price > 0 ) {
    return next()
  }else{
    next({
      status: 400,
      message: "price",
    })
  }
}

// id validation needed for create() and update()
function validateIdProperty(req, res, next) {
  const {dishId} = req.params;
  const {data: {id}} = req.body;
  if(dishId === id || id === undefined || id === null || !id){
    return next()
  }else{
    next({
      status: 400,
      message: `id: ${id}`
    })
  }
}


// update an existing dish
function update(req, res, next) {
  const { data: { name, description, price, image_url, id } = {} } = req.body;
  const { dishId } = req.params;
  if (id && dishId !== id) {
    return next({
      status: 400,
      message: `Dish id ${id} does not match route id ${dishId}.`
    });
  }
  res.locals.dish = {
    ...res.locals.dish,
    name,
    description,
    price,
    image_url,
  };
  res.json({ data: res.locals.dish });
}




module.exports = {
   create: [validateNameProperty, validateDescriptionProperty, validatePriceProperty, validateImageProperty, create],
   delete: [validateDishExists, destroy],
   list,
   read: [validateDishExists, read],
   update: [validateDishExists, validateIdProperty,  validateNameProperty, validateDescriptionProperty, validatePriceProperty, validateImageProperty, update],   
 
}