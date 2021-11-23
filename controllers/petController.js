const Pet = require("../models/Pet");
const Tag = require("../models/Tag");

//get all pets
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).send(pets);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// add pet info
const addPet = async (req, res) => {
  try {
    const {
      name,
      description,
      pet_pictures,
      type,
      owner_id,
      questionnaire,
      tag,
    } = req.body;

    const tagObjArr = await Tag.find({ name: { $in: tag } });

    const savedPet = await Pet.create({
      name: name,
      description: description,
      pet_pictures: pet_pictures,
      type: type,
      owner_id: owner_id,
      questionnaire: questionnaire,
      tag: tagObjArr,
    });
    res.status(200).send(savedPet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get pet info
const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.status(200).send(pet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get pet info by ower_id
const getPetByOwnerId = async (req, res) => {
  try {
    const { user_id } = req.user;
    const pet = await Pet.findOne({ owner_id: user_id });
    res.status(200).send(pet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get pets by pet type
const getPetsByType = async (req, res) => {
  try {
    const pets = await Pet.find({ type: req.params.type.toLowerCase() });
    res.status(200).send(pets);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get pets by pet tag
const getPetsBySingleTag = async (req, res) => {
  try {
    const params = req.query.name;
    const modifiedParam = JSON.parse(params);

    const matchPets = await Pet.find({ "tag.name": { $in: modifiedParam } });

    res.status(200).send(matchPets);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get pets by pet tag
const getPetsByAllTag = async (req, res) => {
  try {
    const params = req.query.name;
    const modifiedParam = JSON.parse(params);

    const matchPets = await Pet.find({ "tag.name": { $all: modifiedParam } });

    res.status(200).send(matchPets);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// update pet info
const updatePet = async (req, res) => {
  try {
    await Pet.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).send("Pet info is successfully updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// delete pet info
const deletePet = async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).send("Pet info is successfully deleted!");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// get all requests for pet

module.exports = {
  addPet,
  getPet,
  getPetByOwnerId,
  getPetsByType,
  getPetsBySingleTag,
  getPetsByAllTag,
  updatePet,
  deletePet,
  getAllPets,
};
