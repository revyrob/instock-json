const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const { nextTick, addListener } = require("process");
const { v4 } = require("uuid");

const pathInventory = "./data/inventories.json";

/**
 *
 *
 * GET ALL INVENTORY ITEMS
 *
 *
 */
router.get("/", (req, res) => {
  fs.readFile(pathInventory, "utf-8")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send("error reading file");
    });
});

/**
 *
 *
 *
 * GET 1 INVENTORY ITEM BY ID
 *
 *
 *
 */
router.get("/:id", (req, res) => {
  fs.readFile(pathInventory, "utf-8")
    .then((data) => {
      const inventoryArray = JSON.parse(data);

      // Look for existing inventory.
      const foundInventory = inventoryArray.filter(
        (inventory) => inventory.id === req.params.id
      );

      // If inventory not found, filter returns an empty array. Evaluate this condition.
      if (foundInventory.length > 0) {
        res.status(200).send(JSON.stringify(foundInventory.shift()));
      } else if (foundInventory.length === 0) {
        res.status(400).json({
          "request error": `No member with the id of ${req.params.id}`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send("error reading file");
    });
});

/**
 *
 *
 * CREATE / POST 1 INVENTORY ITEM
 *
 *
 *
 */
router.post("/", (req, res) => {
  // GUARD CLAUSE : FIELDS CANNOT BE EMPTY
  if (
    !req.body.warehouseName ||
    !req.body.itemName ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    res.status(400).send("Fields cannot be left empty");
    next();
  }

  // Read the inventory json file to update it.
  fs.readFile(pathInventory, "utf-8")
    .then((data) => {
      const parsedData = JSON.parse(data);

      // Match the name of json file and request to retrieved the warehouse id from json file.
      const matchedWarehouse = parsedData.find(
        (item) => item.warehouseName === req.body.warehouseName
      );

      // Create new object item to update json file
      const newInventory = {
        id: v4(),
        warehouseID: matchedWarehouse.warehouseID,
        warehouseName: req.body.warehouseName,
        itemName: req.body.itemName,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        quantity: req.body.quantity,
      };

      // push the new inventory item
      parsedData.push(newInventory);

      // stringify the JS array obj to write to file
      const newFileContent = JSON.stringify(parsedData);

      fs.writeFile(pathInventory, newFileContent)
        .then((data) => {
          // console.log('new file', data);
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
 * Delete A INVENTORY, from inventory/:id_inventory
 *
 */
router.delete("/:id", (req, res) => {
  fs.readFile(pathInventory, "utf-8")
    .then((data) => {
      // parse data as JS array obj
      const inventoryArray = JSON.parse(data);

      //loop through the inventory array
      //if the inventory warehouse
      for (let i = 0; i < inventoryArray.length; i++) {
        if (inventoryArray[i].id == req.params.id) {
          inventoryArray.splice(i, 1);
        } else console.log(`Sorry there isn't a matching inventory item.`);
      }
      // stringify the JS array obj to write to file
      const newFileContent = JSON.stringify(inventoryArray);

      fs.writeFile(pathInventory, newFileContent)
        .then((data) => {
          console.log("new file");
        })
        .catch((err) => {
          console.error(err);
        });
      res.status(200).json(inventoryArray);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

/**
 *
 *
 * PATCH / EDIT 1 INVENTORY ITEM
 *
 *
 *
 */
router.put("/", (req, res) => {
  // GUARD CLAUSE : FIELDS CANNOT BE EMPTY
  if (
    !req.body.id ||
    !req.body.warehouseID ||
    !req.body.warehouseName ||
    !req.body.itemName ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    res.status(400).send("Fields cannot be left empty");
    next();
  }

  // Read the inventory json file to update it.
  fs.readFile(pathInventory, "utf-8")
    .then((data) => {
      const parsedData = JSON.parse(data);

      const newInventoryArray = [];

      // Filled a new array without the requested inventory object
      parsedData.forEach((item) => {
        if (item.id !== req.body.id) {
          newInventoryArray.push(item);
        }
      });

      // Update the requested inventory into a new object
      const updatedInventory = {
        id: req.body.id,
        warehouseID: req.body.warehouseID,
        warehouseName: req.body.warehouseName,
        itemName: req.body.itemName,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        quantity: req.body.quantity,
      };

      // Add that new updated inventory object to the inventory array
      newInventoryArray.push(updatedInventory);

      // stringify the JS array obj to write to file
      stringedFileContent = JSON.stringify(newInventoryArray);

      fs.writeFile(pathInventory, stringedFileContent)
        .then((data) => {
          res.status(200).json(updatedInventory);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
