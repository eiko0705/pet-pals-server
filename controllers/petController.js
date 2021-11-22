const Pet = require("../models/Pet");
const Tag = require("../models/Tag");

const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).send(pets);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

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

const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.status(200).send(pet);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

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
const getPetsByTag = async (req, res) => {
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

const updatePet = async (req, res) => {
  console.log(req.body);
  try {
    const insertResult = await Pet.updateOne(
      { _id: req.params.id },
      {
        $push: {
          pet_pictures: req.body.pet_pictures,
          questionnaire: req.body.questionnaire,
        },
      }
    );

    const result = await Pet.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
        },
      },
      { multi: true }
    );

    if (result.acknowledged || insertResult.acknowledged) {
      const pet = await Pet.findById(req.params.id);
      res.status(200).send(pet);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// not use for now
const updateQuestionnaire = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    const result = await pet.updateOne({
      $push: { questionnaire: req.body.questionnaire },
    });

    if (result.acknowledged) {
      const updated = await Pet.findById(req.params.id);
      res.status(200).send(updated);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteQuestionnaire = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    const result = await pet.updateOne({
      $pull: { questionnaire: req.body.questionnaire },
    });

    if (result.acknowledged) {
      const updated = await Pet.findById(req.params.id);
      res.status(200).send(updated);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

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
  getPetsByTag,
  updatePet,
  // updateQuestionnaire,
  deleteQuestionnaire,
  deletePet,
  getAllPets,
};
