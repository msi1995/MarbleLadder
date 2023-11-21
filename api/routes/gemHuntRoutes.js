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
        mapsWithUnverifiedScores.forEach((mapEntry) => {
            const unverifiedScoresSingleMap = mapEntry.scores.filter((score) => !score.verified && !score.denied);

            unverifiedScoresSingleMap.forEach((scoreEntry) => {
                //use toObject to avoid this being in a very strange format when returned
                const plainScoreEntry = scoreEntry.toObject();
                const scoreWithMap = {
                    ...plainScoreEntry,
                    map: mapEntry.mapName,
                };
                allUnverifiedScores.push(scoreWithMap);
            });
        });


        res.status(200).json(allUnverifiedScores)
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

router.post('/approve-gem-hunt-record/', auth, async (req, res) => {
    const { admin } = await ladderPlayer.findOne({ _id: new ObjectId(req.user.userId) })
    if (!Boolean(admin)) {
        res.status(403).send({ message: "Forbidden. You do not have access to this operation." })
    }
    const runID = req.body.runID;
    const map = req.body.map;
    const runner = req.body.runPlayer;
    // const mapres = await gemHuntMapRecord.findOne({ mapName: map })
    const { worldRecord: mapWR } = await gemHuntMapRecord.findOne({ mapName: map })
    try {
        const unverifiedMatch = await gemHuntMapRecord.findOne({ "scores.runID": runID }, { "scores.$": 1 })
        //WR will be new WR if approved score beats it
        const WR = Math.max(unverifiedMatch.scores[0].score, mapWR)

        await gemHuntMapRecord.updateOne(
            { "scores.runID": runID },
            {
                $set: {
                    "scores.$.verified": true,
                    "scores.$.verifiedBy": req.user.username,
                    "worldRecord": WR
                },
            }
        );


        //UPDATES TO LADDERPLAYER COLLECTION
        const { gemHuntRecords } = await ladderPlayer.findOne({
            username: runner,
        })
        const mapRecord = gemHuntRecords.find((entry) => entry.map === map)

        //if user has no verified score on this map, add an entry
        if (mapRecord === undefined) {
            await ladderPlayer.updateOne({
                username: runner
            }, {
                $push: {
                    gemHuntRecords: {
                        runID: runID,
                        map: map,
                        score: unverifiedMatch.scores[0].score,
                        mediaLink: unverifiedMatch.scores[0].media,
                        date: new Date(),
                        verified: true,
                    }
                }
            });
            res.status(201).send({ message: "Record created." })
            return;
        }
        //only update player's best if the new score is better than previous
        if (unverifiedMatch.scores[0].score > mapRecord.score) {
            await ladderPlayer.updateOne({
                username: runner,
                'gemHuntRecords.map': map
            }, {
                $set: {
                    'gemHuntRecords.$.runID': runID,
                    'gemHuntRecords.$.score': unverifiedMatch.scores[0].score,
                    'gemHuntRecords.$.mediaLink': unverifiedMatch.scores[0].media,
                    'gemHuntRecords.$.date': new Date(),
                    'gemHuntRecords.$.verified': true,
                }
            });
            res.status(201).send({ message: "Record verified." });
        }
        else {
            res.status(200).send({ message: "Record verified, but personal best was not updated because a higher record existed." })
        }
    } catch (err) {
        console.error(`error: ${err}`);
    }
});


router.post('/deny-gem-hunt-record/', auth, async (req, res) => {
    const { admin } = await ladderPlayer.findOne({ _id: new ObjectId(req.user.userId) })
    if (!Boolean(admin)) {
        res.status(403).send({ message: "Forbidden. You do not have access to this operation." })
    }
    const runID = req.body.runID;
    try {
        await gemHuntMapRecord.updateOne(
            { "scores.runID": runID },
            { $set: { "scores.$.denied": true } }
        );
        res.status(200).send({ message: "Run updated as denied." })
    } catch (err) {
        console.error(`error: ${err}`);
    }
});

router.post('/submit-gem-hunt-record/', auth, async (req, res) => {
    try {
        // let mediaType;
        const score = req.body.score;
        const map = req.body.map;
        const mediaLink = req.body.mediaLink;
        const description = req.body.description;
        // const youtubeURLPattern = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;
        // const imgurURLPattern = /^https?:\/\/(?:www\.)?(?:i\.imgur\.com\/|imgur\.com\/)([a-zA-Z0-9]{7})\.(?:jpg|jpeg|png|gif|bmp)$/;
        // if (youtubeURLPattern.test(mediaLink)) {
        //     mediaType = 'YouTube'
        // }
        // if (imgurURLPattern.test(mediaLink)) {
        //     mediaType = 'Imgur'
        // }
        // if (mediaType === undefined) {
        //     res.status(400).send({ error: "Bad media URL. Please provide an Imgur or Youtube URL." });
        //     return;
        // }
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
                    description: description,
                    verified: false,
                    denied: false,
                    date: new Date(),
                }
            }
        });

        res.status(201).send({ message: "Record created." })

    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

module.exports = router;
