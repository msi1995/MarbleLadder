const express = require('express');
const auth = require("../auth");
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const gemHuntMapRecord = require('../models/GemHuntRecord');
const ladderPlayer = require('../models/LadderPlayer');
const router = express.Router();


router.get('/gem-hunt-map-records/', async (req, res) => {
    try {
        const gemHuntRecordData = await gemHuntMapRecord.find({})
        res.status(200).json(gemHuntRecordData)
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

router.get('/gem-hunt-map-records/unverified', async (req, res) => {
    try {
        const mapsWithUnverifiedScores = await gemHuntMapRecord.find({ 'scores.verified': false })
        const allUnverifiedScores = [];
        mapsWithUnverifiedScores.forEach((map) => {
            const unverifiedScoresSingleMap = map.scores.filter((score) => !score.verified);
            allUnverifiedScores.push(...unverifiedScoresSingleMap);
          });
          

        res.status(200).json(allUnverifiedScores)
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});


router.post('/submit-gem-hunt-record/', auth, async (req, res) => {
    let mediaType;
    const score = req.body.score;
    const map = req.body.map;
    const mediaLink = req.body.mediaLink;
    const youtubeURLPattern = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;
    const imgurURLPattern = /^https?:\/\/(?:www\.)?(?:i\.imgur\.com\/|imgur\.com\/)([a-zA-Z0-9]{7})\.(?:jpg|jpeg|png|gif|bmp)$/;
    if (youtubeURLPattern.test(mediaLink)) {
        mediaType = 'YouTube'
    }
    if (imgurURLPattern.test(mediaLink)) {
        mediaType = 'Imgur'
    }
    if (mediaType === undefined) {
        res.status(400).send({ error: "Bad media URL. Please provide an Imgur or Youtube URL." });
    }
    try {

        const runID = uuidv4();


        //UPDATES TO MAP RECORD COLLECTION
        await gemHuntMapRecord.updateOne({
            mapName: map
        }, {
            $push: {
                scores: {
                    runID: runID,
                    player: req.user.username,
                    score: score,
                    media: mediaLink,
                    verified: false,
                    date: new Date(),
                }
            }
        });


        //UPDATES TO LADDERPLAYER COLLECTION
        const { gemHuntRecords } = await ladderPlayer.findOne({
            _id: new ObjectId(req.user.userId)
        })
        const mapRecord = gemHuntRecords.find((entry) => entry.map === map)

        //if user has no reported score on this map, add an entry
        if (mapRecord === undefined) {
            await ladderPlayer.updateOne({
                _id: new ObjectId(req.user.userId)
            }, {
                $push: {
                    gemHuntRecords: {
                        runID: runID,
                        map: map,
                        score: score,
                        mediaLink: mediaLink,
                        date: new Date(),
                        verified: false,
                    }
                }
            });
            res.status(201).send({ message: "Record created." })
            return;
        }

        //only update player's best if the new score is better than previous
        if (score > mapRecord.score) {
            await ladderPlayer.updateOne({
                _id: new ObjectId(req.user.userId),
                'gemHuntRecords.map': map
            }, {
                $set: {
                    'gemHuntRecords.$.runID': runID,
                    'gemHuntRecords.$.score': score,
                    'gemHuntRecords.$.mediaLink': mediaLink,
                    'gemHuntRecords.$.date': new Date(),
                    'gemHuntRecords.$.verified': false,
                }
            });
            res.status(201).send({ message: "Record updated with new best." });
        }
        else {
            res.status(200).send({ message: 'Received, but existing record was higher.' })

        }
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

module.exports = router;
