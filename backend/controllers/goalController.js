const asyncHandler=require('express-async-handler')
const Goals=require("../model/goalsModel")
const User=require("../model/userModel")


//@desc Get Goals
//@route GET/api/goals
//@access PRIVATE

const getGoals=asyncHandler(async(req,res)=>{
    const goal= await Goals.find({user:req.user.id})
   res.status(200).json(goal)
})
//@desc Set Goals
//@route PUSH/api/goals
//@access PRIVATE

const setGoals=asyncHandler(async(req,res)=>{
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal=await Goals.create({
        text:req.body.text,
        user:req.user.id
    })
    res.json(goal)
})
//@desc Get Goals
//@route PUT/api/goals:id
//@access PRIVATE

const updateGoals=asyncHandler(async(req,res)=>{
    const goal=await Goals.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error ("Goal Not Found")
    }
    //Check for user
    if(!req.user){
        res.status(401)
        throw new error("User not Found")
    }

    //Make sure the logged in user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new error("User not Found")

    }
    const updateGoal=await Goals.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
    })
    res.json(updateGoal)
})
//@desc Get Goals
//@route Delete/api/goals:id
//@access PRIVATE

const deleteGoals=asyncHandler(async(req,res)=>{
    const goal=await Goals.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error ("Goal Not Found")
    }
    //Check for user
    if(!req.user){
        res.status(401)
        throw new error("User not Found")
    }

    //Make sure the logged in user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new error("User not Found")

    }
    await goal.remove()
    res.json({id:req.params.id})
})

module.exports={
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals,
}