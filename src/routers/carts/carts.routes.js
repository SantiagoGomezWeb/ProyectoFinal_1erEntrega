const { Router } = require("express");
const router = Router();
const ProductManager = require("../../../manager/manajers");
const manager = new ProductManager("cart.json");

// POST -> crea un cart con in id autogenerado y un array de productos [prodId, qnt]
router.post("/", async (req, res) => {
  res.json({
    status: "success",
    data: await manager.createCart(),
  });
});

// GET -> trae un cart especifico
router.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);

  if (isNaN(cid)) {
    res.status(400).send("The Param MUST be Numbers");
  } else {
    res.json({
      status: "success",
      data: await manager.getItemById(cid),
    });
  }
});



// POST -> cid/produc/pid agrega un prod a un cart ya creado. 
//si ya existe ese prod solo se agrega uno en la cantidad
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const data = await manager.addToCart(cid, pid)
  const quantity = req.body.quantity || 1;
  console.log(data)

  if (isNaN(cid) || isNaN(pid)) {
    res.status(400).send("Both Parameters MUST be Numbers");
  } else {
    res.json({
      status: "success",
      data: data
    });
  }
});

module.exports = router;
