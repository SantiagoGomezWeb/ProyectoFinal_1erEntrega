const { Router } = require("express");
const router = Router(); 
const ProductManager = require("../../../manager/manajers");
const manager = new ProductManager("products.json");


//RUTAS
// GET -> trae todos los productos
router.get("/", async (req, res) => {
  const products = await manager.getItems();
  const limit = Number(req.query.limit);

  if (isNaN(limit)) {
    res.status(400).send("The PARAM must be a Number");
  } else {
    
    if (limit) {
      const limitProducts = products.slice(0, limit);
      res.json({
        status: "success",
        data: limitProducts,
      });
    } else {
      res.json({
        status: "success",
        data: products,
      });
    }
  }
});

//  GET -> trae un prod en especifico
router.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const data = await manager.getItemById(pid);

  if (isNaN(pid)) {
    res.status(400).send("The ID must be a Number");
  }

  if (data) {
    res.json({
      status: "success",
      data: data,
    });
  } else {
    res.status(400).send("Invalid Data");
  }
});

// POST -> agrega un producto al array de productos
router.post("/", async (req, res) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.status ||
    !product.category 
  ) {
    res.status(400).send("All fields are Required");
  } else {
    res.json({
      status: "success",
      data: await manager.addProduct(product),
    });
  }
});

// PUT -> -> actualiza por los campos enviados desde body
router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const fieldsToUpdate = req.body;
  const foundId = fieldsToUpdate.hasOwnProperty("id");
  const data = await manager.updateProduct(pid, fieldsToUpdate)
  console.log(data)

  if (foundId) {
    res.status(400).send("Cannot modify ID property");
  } else {
    if(data){
      res.json({
        status: "succes",
        data: data
      });
    } else {
      res.status(400).send("Product not Found")
    }
  }
});

// DELETE -> borra un producto segun id
router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  if (isNaN(pid)) {
    res.status(400).send("The PARAM must be a Number");
  } else {
    res.json({
      status: "succes",
      data: await manager.deleteProduct(pid),
    });
  }
});

module.exports = router;
