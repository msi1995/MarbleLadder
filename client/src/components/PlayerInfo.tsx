import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, FormEvent, useRef } from "react";
import { BASE_ROUTE } from "../App";
import { Table, Tag } from "antd";
import { Tooltip as ReactTooltip } from "react-tooltip";
import type { ColumnsType } from "antd/es/table";
import Cookies from "universal-cookie";
import { above1080, handleLogout, smallScreen } from "../utils/utils";
import { useNavigate, NavLink } from "react-router-dom";
import { round } from "../utils/utils";
import { LadderData } from "../App";
import moment from "moment";
import { Modal } from "./Modal";
import {
  GemHuntMapRecord,
  LadderPlayer,
  matchResult,
} from "../types/interfaces";

export const PlayerInfo = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const ladderData: LadderPlayer[] = useContext(LadderData);
  const [playerData, setPlayerData] = useState<LadderPlayer>();
  const [gemHuntMapData, setGemHuntMapData] = useState<GemHuntMapRecord[]>([]);
  const [playerLadderRank, setPlayerLadderRank] = useState<number | null>(null);
  const [personalGemHuntTotalRecord, setPersonalGemHuntTotalRecord] =
    useState<number>(0);
  const [gemHuntWRCount, setGemHuntWRCount] = useState<number>(0);
  const [playerMatchData, setPlayerMatchData] = useState<matchResult[]>([]);
  const [replayModalOpen, setReplayModalOpen] = useState(false);
  const [matchWinner, setMatchWinner] = useState<string>("");
  const [matchLoser, setMatchLoser] = useState<string>("");
  const [matchWinnerScore, setMatchWinnerScore] = useState<number>();
  const [matchLoserScore, setMatchLoserScore] = useState<number>();
  const [matchMap, setMatchMap] = useState<string>("");
  const [MatchTraceIDToAddReplayTo, setMatchTraceIDToAddReplayTo] =
    useState<string>("");
  const [replayURL, setReplayURL] = useState<string>("");
  const [rival, setRival] = useState<string | null>(null);
  const [rivalWins, setRivalWins] = useState<number | null>(null);
  const [averagePointDifferential, setAveragePointDifferential] = useState<
    number | null
  >(null);
  const [gemHuntRecordDictionary, setGemHuntRecordDictionary] = useState<
    Record<string, number>
  >({});
  const [gemHuntMapWorldRecordDictionary, setGemHuntMapWorldRecordDictionary] =
    useState<Record<string, number>>({});
  const [tableRowHeight, setTableRowHeight] = useState<number>(55);
  const { name: player_name } = useParams();

  useEffect(() => {
    getPlayerPageData(player_name);
    fetchGemHuntRecordData();
  }, [player_name]);

  useEffect(() => {
    getLadderPositionFromLadderData(ladderData);
    getGemHuntRecordsFromPlayerData(playerData);
    getGemHuntMapRecords(gemHuntMapData);
  }, [ladderData, playerData, gemHuntMapData, player_name]);

  useEffect(() => {
    calculatePointDifferential(playerMatchData);
    calculateRival(playerMatchData);
  }, [playerMatchData]);

  useEffect(() => {
    // setGemHuntTotalWR(Object.values(
    //   gemHuntMapWorldRecordDictionary
    // )?.reduce((acc, val) => acc + val, 0));

    setPersonalGemHuntTotalRecord(
      Object.values(gemHuntRecordDictionary)?.reduce((acc, val) => acc + val, 0)
    );
  }, [gemHuntMapWorldRecordDictionary, gemHuntRecordDictionary]);

  const fetchGemHuntRecordData = async () => {
    try {
      const res: Response = await fetch(BASE_ROUTE + `/gem-hunt-map-records`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
      const mapData: GemHuntMapRecord[] = await res.json();
      setGemHuntMapData(mapData);
    } catch (e) {
      console.log(e);
    }
  };

  const getGemHuntRecordsFromPlayerData = (
    player: LadderPlayer | undefined
  ) => {
    if (player) {
      const gemRecordDict: Record<string, number> = {};
      player.gemHuntRecords.forEach(
        (entry) => (gemRecordDict[entry.map] = entry.score)
      );
      setGemHuntRecordDictionary(gemRecordDict);
    } else {
      return;
    }
  };

  const getGemHuntMapRecords = (gemHuntMapData: GemHuntMapRecord[]) => {
    const gemMapWorldRecordDict: Record<string, number> = {};
    gemHuntMapData.forEach(
      (entry) => (gemMapWorldRecordDict[entry.mapName] = entry.worldRecord)
    );
    setGemHuntMapWorldRecordDictionary(gemMapWorldRecordDict);
  };

  const handleAddReplayToMatch = (
    traceID: string,
    matchP1Name: string,
    matchP2Name: string,
    matchWinnerName: string,
    P1Score: number,
    P2Score: number,
    map: string
  ) => {
    setMatchWinner(matchWinnerName);
    setMatchMap(map);
    if (matchWinnerName.toLowerCase() === matchP1Name.toLowerCase()) {
      setMatchWinnerScore(P1Score);
      setMatchLoser(matchP2Name);
      setMatchLoserScore(P2Score);
    } else {
      setMatchWinnerScore(P2Score);
      setMatchLoser(matchP1Name);
      setMatchLoserScore(P1Score);
    }
    openReplayModal();
    setMatchTraceIDToAddReplayTo(traceID);
  };
  const openReplayModal = () => {
    setReplayModalOpen(true);
  };

  const closeReplayModal = () => {
    setReplayModalOpen(false);
  };

  const handleURLModalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await fetch(
        BASE_ROUTE + `/add-replay/${MatchTraceIDToAddReplayTo}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            replayURL: replayURL,
          }),
        }
      );
      if (res.status === 200) {
        setReplayModalOpen(false);
        window.location.reload();
      }
      if (res.status === 403) {
        //do something
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLadderPositionFromLadderData = (ladderData: LadderPlayer[]) => {
    let sortedData;
    sortedData = [...ladderData]?.sort((a, b) => {
      // compare by wins or losses
      if (a.wins > 0 || a.losses > 0) {
        if (!(b.wins > 0 || b.losses > 0)) {
          return -1; // a has played a game but b hasn't, so A is first
        }
      } else if (b.wins > 0 || b.losses > 0) {
        return 1; // B has played a game but A hasn't, so B is first
      }
  
      // if both have played a game, sort by rating score
      return b.ratingScore - a.ratingScore;
    })
    //assign ladder rank to sorted data
    sortedData.forEach((item, index) => {
      item.rank = index + 1;
      item.key = `${index + 1}`;
    });
    const player = sortedData.find((entry) => entry.username === player_name);
    const ladderPosition = player?.rank || null;
    setPlayerLadderRank(ladderPosition);
  };

  const calculatePointDifferential = (matches: matchResult[]) => {
    if (!matches) {
      setAveragePointDifferential(null);
    }
    let diff = 0;
    for (let i = 0; i < matches?.length; i++) {
      if (matches[i].P1Score !== 0 || matches[i].P2Score !== 0) {
        matches[i].matchWinnerName === player_name
          ? (diff += Math.abs(matches[i].P1Score - matches[i].P2Score))
          : (diff -= Math.abs(matches[i].P1Score - matches[i].P2Score));
      }
    }
    diff = Math.round(diff / matches?.length);
    setAveragePointDifferential(diff);
  };

  const calculateRival = (matches: matchResult[]) => {
    const dict: Record<string, number> = {};
    for (let i = 0; i < matches?.length; i++) {
      if (matches[i].matchWinnerName !== player_name) {
        dict[matches[i].matchWinnerName]
          ? (dict[matches[i].matchWinnerName] += 1)
          : (dict[matches[i].matchWinnerName] = 1);
      }
    }
    let rivalName = null;
    let maxValue = 0;
    for (const key in dict) {
      if (dict[key] > maxValue) {
        rivalName = key;
        maxValue = dict[key];
      }
    }
    if (maxValue > 0 && rivalName) {
      setRival(rivalName);
      setRivalWins(maxValue);
    } else {
      setRival(null);
      setRivalWins(null);
    }
  };

  const getPlayerPageData = async (playerName: string | undefined) => {
    try {
      const res: Response = await fetch(
        BASE_ROUTE + `/player-page-data/${playerName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setPlayerData(data.playerData);
        setPlayerMatchData(data.matchData);
      }
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
    } catch (e) {
      console.log(e);
    }
  };

  let columns: ColumnsType<matchResult> = [
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      align: "center",
      width: smallScreen() ? "auto" : "10%",
      render: (_, { matchDate }) => <>{matchDate.toString().split("T")[0]}</>,
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const dateA = moment(a.matchDate);
        const dateB = moment(b.matchDate);
        if (dateA.isBefore(dateB)) {
          return -1;
        }
        if (dateA.isAfter(dateB)) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: "Map",
      dataIndex: "map",
      key: "map",
      align: "center",
      width: smallScreen() ? "auto" : "10%",
      render: (_, { map }) => (
        <div className="flex justify-center">
          <img
            alt="Level Thumbnail"
            data-tooltip-id={map.replace(/'/g, "")}
            className="sm:w-28 sm:h-20 w-20 rounded-md"
            src={`/Level_Images/${map || "NoMap"}_128.webp`}
          ></img>
        </div>
      ),
    },
    {
      title: "Result",
      key: "result",
      align: "left",
      dataIndex: "result",
      width: smallScreen() ? "20%" : "15%",
      render: (
        _,
        {
          matchWinnerName,
          matchP1Name,
          matchP2Name,
          matchP1Rating,
          matchP2Rating,
        }
      ) => (
        <>
          <Tag color={matchWinnerName === player_name ? "green" : "volcano"}>
            {matchWinnerName === player_name ? "Victory" : "Defeat"}
          </Tag>
          against{" "}
          <b>
            {matchP1Name === player_name ? (
              <NavLink to={`/player/${matchP2Name}`}>{`${matchP2Name} [${
                matchP2Rating ?? "?"
              }]`}</NavLink>
            ) : (
              <NavLink to={`/player/${matchP1Name}`}>{`${matchP1Name} [${
                matchP1Rating ?? "?"
              }]`}</NavLink>
            )}
          </b>
        </>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "left",
      width: smallScreen() ? "auto" : "10%",
      render: (_, { matchWinnerName, P1Score, P2Score }) => (
        <div
          className={
            matchWinnerName === player_name ? "text-green-600" : "text-red-600"
          }
        >
          {matchWinnerName === player_name
            ? Math.max(P1Score, P2Score)
            : Math.min(P1Score, P2Score)}{" "}
          -{" "}
          {matchWinnerName === player_name
            ? Math.min(P1Score, P2Score)
            : Math.max(P1Score, P2Score)}
        </div>
      ),
    },
    {
      title: "New ELO",
      key: "ELO_change",
      align: "left",
      width: smallScreen() ? "auto" : "10%",
      render: (
        _,
        {
          matchWinnerName,
          matchP1Name,
          matchP1Rating,
          matchP2Rating,
          matchWinnerELOChange,
          matchLoserELOChange,
        }
      ) => {
        let ELO_string;

        if (!matchWinnerELOChange || !matchLoserELOChange) {
          ELO_string = "No data";
        } else {
          const isWinner = player_name === matchWinnerName;
          const isP1 = player_name === matchP1Name;
          const baseRating = isP1 ? matchP1Rating : matchP2Rating;
          const eloChange = isWinner
            ? matchWinnerELOChange
            : matchLoserELOChange;
          const eloChangeString = isWinner
            ? `[+${eloChange}]`
            : `[${eloChange}]`;

          ELO_string = `${baseRating + eloChange} ${eloChangeString}`;
        }
        return (
          <div
            className={
              matchWinnerName === player_name
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {ELO_string}
          </div>
        );
      },
    },
    {
      title: "Replay",
      dataIndex: "replay",
      align: "center",
      width: smallScreen() ? "18%" : "15%",
      render: (
        _,
        {
          replays,
          traceID,
          matchP1Name,
          matchP2Name,
          matchWinnerName,
          P1Score,
          P2Score,
          map,
        }
      ) => (
        <div className="flex flex-col items-center">
          {replays?.length > 0 ? (
            replays.map((replay) => (
              <a
                className="text-cyan-400 hover:text-cyan-300"
                href={replay.URL}
                target="_blank"
                rel="noreferrer"
              >
                {replay.submitter} pov
              </a>
            ))
          ) : (
            <span className="text-cyan-400">N/A</span>
          )}
          {(matchP1Name === username || matchP2Name === username) && (
            <button
              onClick={() =>
                handleAddReplayToMatch(
                  traceID,
                  matchP1Name,
                  matchP2Name,
                  matchWinnerName,
                  P1Score,
                  P2Score,
                  map
                )
              }
              className="text-white hover:text-cyan-300 italic"
            >
              Add Replay
            </button>
          )}
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "traceID",
      key: "traceID",
      align: "center",
      width: smallScreen() ? "auto" : "9%",
    },
  ];

  //don't show match ID on mobile. too long, doesn't matter.
  if (smallScreen()) {
    columns = columns.filter((item) => item.key !== "traceID" && item.key !== 'ELO_change');
  }

  const tableRef: any = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      setTableRowHeight(
        tableRef.current.querySelectorAll(".ant-table-row")[0]?.offsetHeight
      );
    }
  }, [playerMatchData]);

  return (
    <div className="sm:pt-28 pt-20 h-screen w-screen overflow-x-hidden border-0 border-solid border-red-600">
      <Modal isOpen={replayModalOpen} onClose={closeReplayModal}>
        <div className="flex flex-col items-center sm:px-16 py-4 gap-y-4">
          <span className="sm:text-4xl text-2xl font-bold">
            Submit Match Replay
          </span>
          <span className="text-green-600 text-lg">
            {matchWinner} defeats {matchLoser} | {matchWinnerScore} -{" "}
            {matchLoserScore} on {matchMap}
          </span>
          <span className="sm:w-128 w-64 text-center text-md">
            To submit a match replay, provide a YouTube link to the match below.
            You can also replace a replay by submitting this form again if you
            made a mistake.
          </span>
          <form
            onSubmit={handleURLModalSubmit}
            className="block w-full flex flex-col items-center gap-y-4"
          >
            <input
              type="text"
              onChange={(e) => setReplayURL(e.target.value)}
              placeholder="Example: youtube.com/watch?v=dQw4w9WgXcQ"
              className="block w-full border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
            <button
              type="submit"
              className="w-1/3 mt-2 py-1 px-1 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded transition duration-200"
            >
              Submit Replay
            </button>
          </form>
        </div>
      </Modal>
      <div className="mx-auto rounded-lg bg-black/90 w-5/6 sm:w-2/3">
        <div className="flex mx-auto py-6 gap-x-2 flex-wrap justify-center items-center flex-row text-white sm:text-5xl text-2xl border-1 border-solid border-red-600">
          {playerLadderRank === 1 && (
            <img
              alt="blue gem"
              className="sm:h-16 sm:w-16 sm:mr-4 h-12 w-12 mr-2"
              src={`/gem_blue.webp`}
            ></img>
          )}
          {playerLadderRank === 2 && (
            <img
              alt="blue gem"
              className="sm:h-16 sm:w-16 sm:mr-4 h-12 w-12 mr-2"
              src={`/gem_yellow.webp`}
            ></img>
          )}
          {playerLadderRank === 3 && (
            <img
              alt="blue gem"
              className="sm:h-16 sm:w-16 sm:mr-4 h-12 w-12 mr-2"
              src={`/gem_red.webp`}
            ></img>
          )}
          <span className="flex items-center">{player_name}</span>
          <a
            href="/ladder"
            className="flex items-center sm:text-3xl text-lg sm:pt-2 pt-1 text-cyan-400 hover:text-cyan-300"
          >
            [{playerData?.ratingScore}]
          </a>
        </div>
        <div className="flex mx-auto flex-wrap justify-evenly flex-row text-white sm:text-xl text-md border-1 border-solid border-red-600">
          <a
            href="/ladder"
            className="flex items-center text-yellow-400 sm:text-lg hover:text-cyan-400"
          >
            Ladder Position: #{playerLadderRank}
          </a>
        </div>
        <div className="flex mx-auto py-6 flex-wrap justify-around flex-row text-white sm:text-xl text-md border-1 border-solid border-red-600">
          <div>
            <span>Record: </span>
            <span className="text-green-600">{playerData?.wins}W</span>
            <span> - </span>
            <span className="text-red-600">{playerData?.losses}L</span>
          </div>
          <span>
            Winrate:{" "}
            {playerData?.wins || playerData?.losses
              ? `${round(
                  (playerData?.wins / (playerData?.wins + playerData?.losses)) *
                    100,
                  1
                )}%`
              : "None"}
          </span>
          <div>
            <span>Average Margin: </span>
            {averagePointDifferential ? (
              <span
                className={
                  averagePointDifferential > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {averagePointDifferential} pts
              </span>
            ) : (
              <span>None</span>
            )}
          </div>
          <div>
            <span>Peak Rating: </span>
            <span className="">{playerData?.peakRatingScore}</span>
          </div>
          <span>
            Streak:{" "}
            {playerData?.currentStreak === 0
              ? `No match data yet.`
              : playerData?.currentStreak! > 0
              ? `${Math.abs(playerData?.currentStreak!)} Wins`
              : `${Math.abs(playerData?.currentStreak!)} Losses`}
          </span>
        </div>
        <div className="flex sm:mx-auto mx-4 py-2 flex-wrap text-center justify-center flex-row text-white sm:text-xl text-md border-1 border-solid border-red-600">
          <span className="text-red-600 sm:pr-2 text-xl">Rival:</span>
          {rivalWins ? (
            <div className="basis-full">
              <NavLink
                className="text-cyan-300 hover:text-cyan-400"
                to={`/player/${rival}`}
              >
                {rival}{" "}
              </NavLink>
              <span>has beaten this player {rivalWins} times.</span>
            </div>
          ) : (
            <span>No rival yet.</span>
          )}
          <div className="w-full my-4 mx-8 bg-white/40 rounded-lg h-0.5"></div>
          <span className="font-bold basis-full mb-4 hover:text-cyan-400">
            <a href="/gem-hunt-records">Solo Gem Hunt Records </a>
            {gemHuntWRCount > 0 && (
              <span> - {gemHuntWRCount} solo world records</span>
            )}
          </span>
          <div className="flex flex-row flex-wrap w-full sm:justify-evenly justify-between gap-y-2 sm:text-lg text-normal sm:text-center text-left">
            <div className="basis-full mb-6 text-center">
              <a href="/gem-hunt-records" className=" hover:text-cyan-400">
                Total:{" "}
                <span className="font-light">
                  {personalGemHuntTotalRecord + " "}
                  pts
                </span>
              </a>
            </div>
            <div className="sm:ml-0 ml-6 flex flex-row flex-wrap w-full sm:justify-evenly justify-between gap-y-2 sm:text-lg text-sm sm:text-center text-left">
              <a
                href="/gem-hunt-records?mapIdx=1"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Arcadia:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Arcadia"] || "-"}
                </span>
                {gemHuntRecordDictionary["Arcadia"] ===
                  gemHuntMapWorldRecordDictionary["Arcadia"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=2"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Assault:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Assault"] || "-"}
                </span>
                {gemHuntRecordDictionary["Assault"] ===
                  gemHuntMapWorldRecordDictionary["Assault"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=3"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Brawl:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Brawl"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Brawl"] ===
                  gemHuntMapWorldRecordDictionary["Brawl"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=4"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Frostbite:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Frostbite"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Frostbite"] ===
                  gemHuntMapWorldRecordDictionary["Frostbite"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=5"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Jumphouse:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Jumphouse"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Jumphouse"] ===
                  gemHuntMapWorldRecordDictionary["Jumphouse"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=6"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Mosh Pit:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Mosh Pit"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Mosh Pit"] ===
                  gemHuntMapWorldRecordDictionary["Mosh Pit"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=7"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Nexus:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Nexus"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Nexus"] ===
                  gemHuntMapWorldRecordDictionary["Nexus"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=8"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Pythagoras:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Pythagoras"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Pythagoras"] ===
                  gemHuntMapWorldRecordDictionary["Pythagoras"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=9"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Stadion:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Stadion"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Stadion"] ===
                  gemHuntMapWorldRecordDictionary["Stadion"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>

              <a
                href="/gem-hunt-records?mapIdx=10"
                className=" sm:basis-1/5 basis-1/2 hover:text-cyan-400"
              >
                Surf's Up:{" "}
                <span className="font-light">
                  {gemHuntRecordDictionary["Surf's Up"] || "-"}
                </span>{" "}
                {gemHuntRecordDictionary["Surf's Up"] ===
                  gemHuntMapWorldRecordDictionary["Surf's Up"] && (
                  <span className="text-yellow-400 sm:text-sm text-xs">
                    {" "}
                    WR
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:pt-12 pt-12 flex flex-col items-center opacity-95 pb-8">
        <div className="pb-8">
          <span className="bg-black/50 py-2 px-4 text-white text-3xl rounded-md">
            Match History
          </span>
        </div>
        {playerMatchData.length ? (
          <Table
            ref={tableRef}
            className="sm:w-3/5 w-full sm:px-0 px-1"
            columns={columns}
            dataSource={playerMatchData}
            scroll={
              above1080()
                ? { y: tableRowHeight * 5 }
                : smallScreen()
                ? { y: tableRowHeight * 5 }
                : { y: tableRowHeight * 5 }
            }
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 25,
              pageSizeOptions: [5, 25, 50, 100],
            }}
          />
        ) : (
          <span className="bg-black/50 sm:py-32 sm:px-48 sm:mb-8 p-4 mb-2 text-white sm:text-3xl text-lg rounded-md">
            This user hasn't played any matches yet.
          </span>
        )}
        <ReactTooltip id="Arcadia" place="top" content="Arcadia" />
        <ReactTooltip id="Assault" place="top" content="Assault" />
        <ReactTooltip id="Brawl" place="top" content="Brawl" />
        <ReactTooltip id="Frostbite" place="top" content="Frostbite" />
        <ReactTooltip id="Jumphouse" place="top" content="Jumphouse" />
        <ReactTooltip id="Nexus" place="top" content="Nexus" />
        <ReactTooltip id="Mosh Pit" place="top" content="Mosh Pit" />
        <ReactTooltip id="Pythagoras" place="top" content="Pythagoras" />
        <ReactTooltip id="Stadion" place="top" content="Stadion" />
        <ReactTooltip id="Surfs Up" place="top" content="Surf's Up" />
      </div>
    </div>
  );
};
