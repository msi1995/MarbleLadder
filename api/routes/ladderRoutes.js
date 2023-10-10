const express = require('express');
const auth = require("../auth");
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const ladderPlayer = require('../models/LadderPlayer');
const matchResult = require('../models/MatchResult');
const router = express.Router();

router.get('/ladder-data', async (req, res) => {
    try {
        const ladderData = await ladderPlayer.find({});
        const sanitizedLadderData = ladderData.map((player) => ({
            _id: player._id,
            username: player.username,
            ratingScore: player.ratingScore,
            wins: player.wins,
            losses: player.losses,
            currentStreak: player.currentStreak
        }))
        res.status(200).json(sanitizedLadderData);
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

router.post('/match-results', auth, async (req, res) => {
    let matchWinnerID;
    let matchWinnerName;

    //Grab all player info
    const playerInfo = await ladderPlayer.findOne({
        _id: new ObjectId(req.user.userId)
    })
    //Grab all opponent info
    const opponentInfo = await ladderPlayer.findOne({
        username: req.body.opponentUsername
    })

    if (playerInfo._id === opponentInfo._id) {
        res.status(500).send({
            message: "Don't do that."
        })
        return;
    }
    //Convert objectID to string for opponent UID
    const opponentID = opponentInfo._id.toString();

    //Set winner UID
    req.body.reporterIsWinner ? matchWinnerID = req.user.userId : matchWinnerID = opponentID;
    req.body.reporterIsWinner ? matchWinnerName = playerInfo.username : matchWinnerName = opponentInfo.username

    const traceID = uuidv4();

    try {
        const newMatchResult = new matchResult({
            traceID: traceID,
            matchP1: req.user.userId,
            matchP1Name: playerInfo.username,
            matchP2: opponentID,
            matchP2Name: opponentInfo.username,
            P1Score: req.body.playerScore,
            P2Score: req.body.opponentScore,
            matchWinner: matchWinnerID,
            matchWinnerName: matchWinnerName,
            matchDate: new Date(),
            confirmed: false,
            disputed: false,
            map: req.body.map
        })
        newMatchResult.save()

        await ladderPlayer.updateOne({
            _id: new ObjectId(req.user.userId)
        }, {
            $push: {
                matchHistory: {
                    traceID: traceID,
                }
            }
        });
        await ladderPlayer.updateOne({
            _id: new ObjectId(opponentID)
        }, {
            $push: {
                matchHistory: {
                    traceID: traceID,
                }
            }
        });
        res.status(200).send({
            message: `Match submitted`,
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).send({
            message: `Server error -- ${e}`
        })
    }

});

//endpoint for comma separated bulk match reporting
router.post('/match-results/bulk', auth, async (req, res) => {

    const mapMapper = {
        "arcadia": "Arcadia",
        "assault": "Assault",
        "brawl": "Brawl",
        "frostbite": "Frostbite",
        "jumphouse": "Jumphouse",
        "nexus": "Nexus",
        "moshpit": "Mosh Pit",
        "pythagoras": "Pythagoras",
        "stadion": "Stadion",
        "surfsup": `Surf's Up`
    }

    //Grab all player info
    const playerInfo = await ladderPlayer.findOne({
        _id: new ObjectId(req.user.userId)
    })
    //Grab all opponent info
    const opponentInfo = await ladderPlayer.findOne({
        username: req.body.opponentUsername
    })

    const P1Name = playerInfo.username.toLowerCase();
    const P2Name = opponentInfo.username.toLowerCase();
    const maps = ["arcadia", "assault", "brawl", "frostbite", "jumphouse", "nexus", "moshpit", "pythagoras", "stadion", "surfsup"]

    if (playerInfo._id === opponentInfo._id) {
        res.status(500).send({
            message: "Don't do that."
        })
        return;
    }
    //Convert objectID to string for opponent UID
    const opponentID = opponentInfo._id.toString();

    const resultArr = req.body.results.split(",")
    const processedArr = resultArr.map((entry) => entry = entry.trimStart())
    const enteredPlayerNames = processedArr.map((result) => result.split(' ')[0].toLowerCase())
    const enteredScores = processedArr.map((result) => result.split(' ')[1])
    const enteredMapsRaw = processedArr.map((result) => result.split(' '))

    //this might need to be revisited. band aid for now but will break if there is ever a map with 3 words.
    const enteredMapsProcessed = enteredMapsRaw.map((entries) => entries.length === 4 ? entries[2]?.replace(/\W|_/g, '').toLowerCase() + entries[3]?.replace(/\W|_/g, '').toLowerCase() : entries[2]?.replace(/\W|_/g, '').toLowerCase());


    //ensure that no names were entered that don't match player 1 or player 2.
    const namesValid = enteredPlayerNames.every(entry => {
        return entry === P1Name || entry === P2Name
    })
    const scoresValid = enteredScores.every(score => {
        // regex length 7, numbers only except 1 hyphen
        const pattern = /^[\d-]{1,7}$/;
        return pattern.test(score);
    });
    const mapsValid = enteredMapsProcessed.every(map => {
        return maps.includes(map);
    }
    )

    //if reported name in each entry matches P1 or P2 && score follows regex && map exists in map array && all 
    // arrs are same length -- this should ensure everything is valid
    if(namesValid && scoresValid && mapsValid && enteredPlayerNames.length == enteredScores.length && enteredScores.length == enteredMapsProcessed.length) {
    }
    else {
        res.status(400).send({
            message: `Entry failed validation. Please double check the example. Make sure you have selected the correct opponent above, no trailing commas, etc.`,
        })
        return;
    }
    try {
        for (i = 0; i < processedArr.length; i++) {
            //match ID
            const traceID = uuidv4();

            //get correct username capitalization
            const matchWinnerNameRaw = enteredPlayerNames[i];
            const matchWinnerName = matchWinnerNameRaw === playerInfo.username.toLowerCase() ? playerInfo.username : opponentInfo.username;

            //proecss player scores
            const playerScores = (enteredScores[i].split('-'));
            const intScores = playerScores.map((score) => parseInt(score, 10));
            const winnerScore = Math.max(...intScores);
            const loserScore = Math.min(...intScores);

            //ties are voided.
            if(winnerScore === loserScore){
                continue;
            }
            const P1Score = matchWinnerName === playerInfo.username.toLowerCase() ? winnerScore : loserScore;
            const P2Score = matchWinnerName === opponentInfo.username.toLowerCase() ? winnerScore : loserScore;

            //grab and process map name
            const map = enteredMapsProcessed[i];

            //
            const matchWinnerID = matchWinnerName === playerInfo.username ? req.user.userId : opponentInfo._id.toString();

            const newMatchResult = new matchResult({
                traceID: traceID,
                matchP1: req.user.userId,
                matchP1Name: playerInfo.username,
                matchP2: opponentID,
                matchP2Name: opponentInfo.username,
                P1Score: P1Score,
                P2Score: P2Score,
                matchWinner: matchWinnerID,
                matchWinnerName: matchWinnerName,
                matchDate: new Date(),
                confirmed: false,
                disputed: false,
                map: mapMapper[map]
            })
            await newMatchResult.save()

            await ladderPlayer.updateOne({
                _id: new ObjectId(req.user.userId)
            }, {
                $push: {
                    matchHistory: {
                        traceID: traceID,
                    }
                }
            });
            await ladderPlayer.updateOne({
                _id: new ObjectId(opponentID)
            }, {
                $push: {
                    matchHistory: {
                        traceID: traceID,
                    }
                }
            });
        }
        res.status(200).send({
            message: `Matches submitted.`,
        })
    }
    catch (e) {
        console.log(e);
        return;
    }

});

router.get('/matches-pending-confirmation', auth, async (req, res) => {
    try {
        //can search for matchP2 because matchP1 is always the user who reported the match (and the reporter doesn't need to confirm.)
        const unconfirmedMatchData = await matchResult.find({ matchP2: req.user.userId, confirmed: false });
        res.status(200).json(unconfirmedMatchData);
        return;
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

module.exports = router;

//set match confirmed. Distribute win or loss to each user. Update streak. Update elo. 
router.post('/confirm-match', auth, async (req, res) => {

    // use the traceID to grab the match from matchresults collection. set it to confirmed.
    // grab the winner and loser ID from the match. Give winner elo/win, loser loss and lose elo. set streak.
    // have to confirm the right match.

    try {
        let matchWinner, matchLoser;

        const unconfirmedMatch = await matchResult.findOne({
            traceID: req.body.traceID
        })

        if (unconfirmedMatch.confirmed) {
            res.status(400).send({
                message: `Couldn't complete the request. This should never happen. Contact site owner`,
            })
            return;
        }

        matchWinner = unconfirmedMatch.matchWinner;
        matchLoser = matchWinner === unconfirmedMatch.matchP1 ? unconfirmedMatch.matchP2 : unconfirmedMatch.matchP1;

        //fetch winner/loser to calculate their streak value. Mongo not cooperating with update conditionals for this calculation
        const winningPlayer = await ladderPlayer.findOne({
            _id: new ObjectId(matchWinner)
        })
        const losingPlayer = await ladderPlayer.findOne({
            _id: new ObjectId(matchLoser)
        })
        const matchWinnerOldStreak = winningPlayer.currentStreak;
        const matchLoserOldStreak = losingPlayer.currentStreak;

        //If match winner was on a W streak, increment by 1 to further streak. Else set to 1 (started a W streak)
        const matchWinnerNewStreak = matchWinnerOldStreak >= 0 ? matchWinnerOldStreak + 1 : 1
        //If match loser was on an L streak, decrement by 1 to further streak. Else set to -1 (started an L streak)
        const matchLoserNewStreak = matchLoserOldStreak <= 0 ? matchLoserOldStreak - 1 : -1

        //ELO calculation (glicko)
        const matchWinnerRatingScore = winningPlayer.ratingScore;
        const matchLoserRatingScore = losingPlayer.ratingScore;
        let updatedWinnerRating, updatedLoserRating;

        function winProbability(rating1, rating2) {
            return (
                (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
            );
        }
        function EloRating(ratingMatchWinner, ratingMatchLoser, K) {

            // To calculate the Winning
            // Probability of Player A
            let matchWinnerExpectedOdds = winProbability(ratingMatchLoser, ratingMatchWinner);

            // To calculate the Winning
            // Probability of Player B
            let matchLoserExpectedOdds = winProbability(ratingMatchWinner, ratingMatchLoser);

            ratingMatchWinner = ratingMatchWinner + K * (1 - matchWinnerExpectedOdds);
            ratingMatchLoser = ratingMatchLoser + K * (0 - matchLoserExpectedOdds);

            updatedWinnerRating = Math.round(ratingMatchWinner);
            updatedLoserRating = Math.round(ratingMatchLoser);
        }

        EloRating(matchWinnerRatingScore, matchLoserRatingScore, 30);

        //confirm match in matchresults
        await matchResult.updateOne({ traceID: req.body.traceID },
            {
                $set: {
                    confirmed: true
                }
            }
        )

        //update the winning player accordingly (W/L, ELO, streak, confirm match)
        await ladderPlayer.updateOne(
            {
                _id: new ObjectId(matchWinner),
                "matchHistory.traceID": req.body.traceID
            },
            {
                $inc: {
                    wins: 1,
                },
                $set: {
                    ratingScore: updatedWinnerRating,
                    currentStreak: matchWinnerNewStreak,
                    "matchHistory.$.confirmed": true
                }
            }
        );

        //update the losing player accordingly (W/L, ELO, streak, confirm match)
        await ladderPlayer.updateOne({
            _id: new ObjectId(matchLoser),
            "matchHistory.traceID": req.body.traceID
        }, {
            $inc: {
                losses: 1,
            },
            $set: {
                ratingScore: updatedLoserRating,
                currentStreak: matchLoserNewStreak,
                "matchHistory.$.confirmed": true
            }
        })
        res.status(200).send({
            message: `Users updated`,
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).send({
            message: `some error happened -- ${e}`
        })
    }
});

//player 2 disputes match result. do nothing, maybe add a dispute int on the users involved? probably don't wipe match, just keep unconfirmed
router.post('/dispute-match', async (req, res) => {
    try {
        const unconfirmedMatch = await matchResult.findOne({
            traceID: req.body.traceID
        })
        matchWinner = unconfirmedMatch.matchWinner;
        matchLoser = matchWinner === unconfirmedMatch.matchP1 ? unconfirmedMatch.matchP2 : unconfirmedMatch.matchP1;

        await matchResult.updateOne({ traceID: req.body.traceID },
            {
                $set: {
                    confirmed: true,
                    disputed: true,
                }
            }
        )
        await ladderPlayer.updateOne(
            {
                _id: new ObjectId(matchWinner),
                "matchHistory.traceID": req.body.traceID
            },
            {
                $set: {
                    "matchHistory.$.disputed": true
                },
                $push: {
                    disputes: {
                        traceID: req.body.traceID,
                    }
                }
            }
        );
        await ladderPlayer.updateOne(
            {
                _id: new ObjectId(matchLoser),
                "matchHistory.traceID": req.body.traceID
            },
            {
                $set: {
                    "matchHistory.$.disputed": true
                },
                $push: {
                    disputes: {
                        traceID: req.body.traceID,
                    }
                }
            }
        );
        res.status(200).send({})
    }
    catch (e) {
        console.log(e)
        res.status(500).send({
            message: `some error happened -- ${e}`
        })
    }
});