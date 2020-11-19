const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Group = require("../models/Group");
const Cost = require("../models/Cost");
const Expense = require("../models/Expense");

const withAuth = require("../helpers/middleware");
const User = require("../models/User");

router.get("/groups", withAuth, async (req, res, next) => {
  try {
    const allGroups = await Group.find({ email: req.email });
    res.json(allGroups);
  } catch (error) {
    res.json(error);
  }
});

router.post("/groups/add", withAuth, async (req, res, next) => {

  
  try {
    const activeUser = await User.findOne({email:req.email})
    activeUserId = activeUser._id
    console.log(activeUser._id , "hhhh")

    const newGroup = {
      name: req.body.name,
      image: req.body.image,
      members: [activeUserId],
      costs: [],
    };

    const theGroup = await Group.create(newGroup);

    //console.log(theGroup)
    res.json(theGroup);
  } catch (error) {
    res.json(error);
  }
});
//Edit group

router.post("/groups/edit/:id", async (req, res, next) => {
  const updatedGroup = {
    name: req.body.name,
    image: req.body.image,
    members: [],
    costs: [],
  };

    const id = req.body.userID

    try {
      const theUser = await User.findById(id)
      console.log(theUser, "hhhhh")
      console.log(theUser._id, "jjjj")
      const theGroup = await Group.findByIdAndUpdate(req.params.id, {$push: { members: theUser._id }}, {new:true})
      console.log(theGroup)

      res.json(theGroup);
    } catch (error) {
      res.json(error);
    }
  });


//Delete group
router.delete("/groups/delete/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const theRemovedGroup = await Group.findByIdAndRemove(req.params.id);
    res.json("The group was deleted");
  } catch (error) {
    res.json(error);
  }
});

router.get("/groups/group-details/:id", withAuth, async (req, res, next) => {
  try {
    const thisGroup = await await Group.findById(req.params.id);
    //   const allCosts = await Cost.findOne(thisGroup._id);
    //   const allExpenses = await Expense.findOne(allCosts._id);

    res.json(thisGroup);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;