const items = require("../models/items");
const getAllItemCanBeCraft = require("./shared/getAllItemCanBeCraft");
const getAllMaterials = require("./shared/getAllMaterials");
const getInfo = require("./shared/getInfo");

const canCrafting = async (req, res) => {
  const { itemName } = req.body;
  try {
    const material = await items.findOne({
      name: itemName?.toLowerCase(),
    });
    if (material) {
      var itemCanBeCraftArray = [];
      await getAllItemCanBeCraft(material.name, itemCanBeCraftArray);
      const arrayObj = await getInfo(itemCanBeCraftArray)
      res.status(200).json(arrayObj);
    } else res.status(404).send(`material doesn't exsist`);
  } catch (error) {
    console.error(error);
    res.status(405).send("something went wrong");
  }
};

module.exports = canCrafting;
