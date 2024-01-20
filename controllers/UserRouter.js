const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Exercise = require('../models/Exercise')
const Log = require('../models/Log')
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        const savedUser = await newUser.save();
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(400).json({
            err: error.message
        })
    }
})

router.post('/:_id/exercises', async (req, res) => {
    try {
        const findUser = await User.findById(req.params._id)
        if (findUser) {
            const ExerciseDoc = {
                username: findUser?.username || "",
                description: req.body.description || "",
                duration: req.body.duration || "",
                date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
            }

            console.log("Check exerciseDoc >>> ", ExerciseDoc);

            const newExercise = await Exercise.create(ExerciseDoc)
            const savedExercise = await newExercise.save();

            const findLog = await Log.findOne({ userId: findUser._id })
            if (!findLog) {

                const LogDoc = {
                    userId: findUser._id,
                    username: findUser.username,
                    count: 1,
                    log: [{
                        description: savedExercise.description,
                        duration: savedExercise.duration,
                        date: new Date(savedExercise.date).toDateString()
                    }]
                }
                const newLog = await Log.create(LogDoc)
                await newLog.save()
            } else {
                await Log.findByIdAndUpdate(
                    findLog._id,
                    {
                        userId: findLog.userId,
                        username: findLog.username,
                        count: parseInt(findLog.log.length) + 1,
                        log: [...findLog.log, {
                            description: savedExercise.description,
                            duration: savedExercise.duration,
                            date: new Date(savedExercise.date).toDateString()
                        }]
                    }
                )
            }

            console.log("Check res.json >>> ", {
                _id: findUser._id.toString(),
                username: findUser.username,
                description: savedExercise.description,
                duration: savedExercise.duration,
                date: new Date(savedExercise.date).toDateString()
            });

            res.status(200).json({
                _id: findUser._id.toString(),
                username: findUser.username,
                description: savedExercise.description,
                duration: savedExercise.duration,
                date: new Date(savedExercise.date).toDateString()
            })

        } else {
            throw new Error("User not found!")
        }
    } catch (error) {
        res.json({
            err: error.message
        })
    }
})

function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

router.get('/:_id/logs', async (req, res) => {
    try {

        const { from, to, limit } = req.query;
        const _id = req.params._id
        const dataFull = await Log.find({ userId: _id })
        const [data] = dataFull
        console.log("Check data >>> ", data);
        if (data) {

            if (from) {
                data.log = data.log
                    .filter((item) =>
                        new Date(item.date) >= new Date(from)
                    )

                data.count = data.log.length
            }

            if (to) {
                data.log = data.log
                    .filter((item) =>
                        new Date(item.date) <= new Date(to)
                    )
                data.count = data.log.length
            }

            if (limit && limit < data.log.length) {
                data.log = data.log.slice(0, limit)
                data.count = data.log.length
            }

            const dataDoc = {
                username: data.username,
                count: data.count,
                _id: data.userId,
                log: data.log.map((item) => {
                    return {
                        description: item.description.toString(),
                        duration: parseInt(item.duration),
                        date: new Date(item.date).toDateString()
                    }
                })
            }

            console.log("Check data doc >>> ", dataDoc);
            res.json(dataDoc)
        } else {
            throw new Error("Log not found!")
        }
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const data = await User.find();
        if (data) {
            res.status(200).json(data)
        }
    } catch (error) {
        res.status(400).json({
            err: error.message
        })
    }
})


module.exports = router