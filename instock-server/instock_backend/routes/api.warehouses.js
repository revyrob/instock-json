const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const { toUnicode } = require("punycode");
const fs2 = require("fs");
const { v4 } = require("uuid");

const pathWarehouses = "./data/warehouses.json";
const pathInventory = "./data/inventories.json";

/**
 *
 * GET ALL WAREHOUSES ITEMS
 */
router.get("/", (req, res) => {
  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send("error reading file");
    });
});

router.get("/names", (req, res) => {
  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      const dataArr = JSON.parse(data);

      const warehousesName = [];
      dataArr.forEach((warehouse) => {
        warehousesName.push(warehouse.name);
      });

      const uniqueNamesSet = new Set(warehousesName);

      const uniqueArr = Array.from(uniqueNamesSet);

      res.status(200).json(uniqueArr);
    })
    .catch((err) => {
      res.status(400).send("error reading file");
    });
});

/**
 *
 * GET 1 WAREHOUSE BY ID
 *
 */
router.get("/:id", (req, res) => {
  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      const warehousesArray = JSON.parse(data);

      // find the warehouse with params id
      const foundWarehouse = warehousesArray.filter(
        (warehouse) => warehouse.id === req.params.id
      );

      // If warehouse not found, filter returns an empty array. Evaluate this condition.
      if (foundWarehouse.length > 0) {
        const warehouse = foundWarehouse[0];

        res.status(200).send(JSON.stringify(warehouse));
      } else if (foundWarehouse.length === 0) {
        res.status(400).json({
          "request error": `No warehouse with the id of ${req.params.id}`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send("error reading warehouse file");
    });
});

/**
 *
 *  GET WAREHOUSE BY ID + ALL CORRESPONDING INVENTORY ITEMS
 *
 */
router.get("/:id/withinventory", (req, res) => {
  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      const warehousesArray = JSON.parse(data);

      // find the warehouse with params id
      const foundWarehouse = warehousesArray.filter(
        (warehouse) => warehouse.id === req.params.id
      );

      // If warehouse not found, filter returns an empty array. Evaluate this condition.
      if (foundWarehouse.length > 0) {
        // const mergedArray = [...foundWarehouse];
        const inventories = [];

        const warehouse = foundWarehouse[0];

        // Read inventory files
        fs.readFile(pathInventory, "utf-8").then((inventoryData) => {
          // parse json string to array
          const inventoriesArray = JSON.parse(inventoryData);

          // push every warehouse inventory item into mergedArray
          inventoriesArray.forEach((inventory) => {
            if (inventory.warehouseID === warehouse.id) {
              inventories.push(inventory);
            }
          });

          res.status(200).send(JSON.stringify({ warehouse, inventories }));
        });
      } else if (foundWarehouse.length === 0) {
        res.status(400).json({
          "request error": `No warehouse with the id of ${req.params.id}`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send("error reading warehouse file");
    });
});

/**
 *
 *
 * POST A WAREHOUSE ITEM
 *
 *
 */
router.post("/", (req, res) => {
  // GUARD CLAUSE : FIELDS CANNOT BE EMPTY
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.contact.name ||
    !req.body.contact.position ||
    !req.body.contact.phone ||
    !req.body.contact.email
  ) {
    res.status(400).send("Fields cannot be empty");
    next();
  }

  const newWarehouse = {
    id: v4(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.contact.name,
      position: req.body.contact.position,
      phone: req.body.contact.phone,
      email: req.body.contact.email,
    },
  };

  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      // parse data as JS array obj
      const parsedData = JSON.parse(data);

      // push the new warehouse
      parsedData.push(newWarehouse);

      // stringify the JS array obj to write to file
      const newFileContent = JSON.stringify(parsedData);

      fs.writeFile(pathWarehouses, newFileContent)
        .then((data) => {
          console.log("new file", data);
        })
        .catch((err) => {
          console.error(err);
        });

      res.status(200).json(parsedData);
    })
    .catch((err) => {
      res.send("error from Express reading file");
    });
});

/**
 *
 * Edit A WAREHOUSE ITEM
 *
 */

router.put("/:id", (req, res) => {
  let editedWarehouse;
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact.name ||
    !req.body.contact.position ||
    !req.body.contact.phone ||
    !req.body.contact.email
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide name, manager, address,position, phone and email fields in a request"
      );
  } else if (!req.body.contact.email.includes("@")) {
    return res.status(400).send("err email");
  } else {
    editedWarehouse = {
      id: req.params.id,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact: {
        name: req.body.contact.name,
        position: req.body.contact.position,
        phone: req.body.contact.phone,
        email: req.body.contact.email,
      },
    };
    readFile(editedWarehouse);
  }

  function readFile(editedWarehouse) {
    fs2.readFile(pathWarehouses, "utf-8", (err, data) => {
      if (err) {
        console.log("err reading in put warehouse");
        res.send("error reading file");
      }
      const warehouses = JSON.parse(data);
      let idx = warehouses.findIndex((warehouse) => {
        return warehouse.id === editedWarehouse.id;
      });
      console.log(idx);
      if (idx !== -1) {
        warehouses[idx] = editedWarehouse;
        writeFile(JSON.stringify(warehouses));
      } else {
        res.send("id not found");
      }
    });
  }

  function writeFile(warehouses) {
    fs2.writeFile(pathWarehouses, warehouses, (err) => {
      if (err) {
        res.send("err writing to file");
      } else {
        res.json(editedWarehouse);
      }
    });
  }
});

/**
 *
 * Delete A WAREHOUSE
 *
 */
router.delete("/:id", (req, res) => {
  fs.readFile(pathWarehouses, "utf-8")
    .then((data) => {
      // parse data as JS array obj
      const warehousesArray = JSON.parse(data);

      //loop through the warehouseArray to find the matching warehouse id
      //to the req.pararms and to have the index
      for (let i = 0; i < warehousesArray.length; i++) {
        if (warehousesArray[i].id == req.params.id) {
          //splice the wanted deleted warehouse from the warehouseArray
          warehousesArray.splice(i, 1);
        } else console.log(`There is no warehouse that matches.`);
      }

      // stringify the JS array obj to write to file
      const newFileContent = JSON.stringify(warehousesArray);

      fs.writeFile(pathWarehouses, newFileContent)
        .then((data) => {
          console.log("new file", data);
        })
        .catch((err) => {
          console.error(err);
        });

      res.status(200).json(warehousesArray);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
