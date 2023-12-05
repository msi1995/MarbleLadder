import { gemHuntColumns } from "../antd/gemHuntColumns";
import { Table } from "antd";
import Cookies from "universal-cookie";
import { BASE_ROUTE } from "../App";
import {
  above1080,
  handleLogout,
  smallScreen,
  userIsAdmin,
  projectedMaxes,
} from "../utils/utils";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { YoutubeEmbedded } from "./youtubeEmbedded";
import ToggleButton from "react-toggle-button";
import {
  GemHuntMapRecord,
  GemHuntMapRecordScore,
  GemHuntMapRecordScoreWithMap,
  PlayerTotalScoreObject,
} from "../types/interfaces";
import { gemHuntOverallColumns } from "../antd/gemHuntOverallColumns";

export const GemHuntRecords = () => {
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const navigate = useNavigate();
  const maps = [
    "Total Rating",
    "Arcadia",
    "Assault",
    "Brawl",
    "Frostbite",
    "Jumphouse",
    "Mosh Pit",
    "Nexus",
    "Pythagoras",
    "Stadion",
    "Surf's Up",
  ];
  const [searchParams] = useSearchParams();
  const paramIdx = searchParams.get("mapIdx");
  const [admin, setAdmin] = useState<boolean>(false);
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [selectedMap, setSelectedMap] = useState<string>(maps[1]);
  const [allMapData, setAllMapData] = useState<GemHuntMapRecord[]>([]);
  const [communityWorldRecord, setCommunityWorldRecord] = useState<number>(0);
  const [YTEmbedURL, setYTEmbedURL] = useState<string>("");
  const [allRuns, setAllRuns] = useState<boolean>(
    localStorage.getItem("showAllRunsEnabled") === "true" ? true : false
  );
  const [showWRVideoBackground, setShowWRVideoBackground] = useState<boolean>(
    localStorage.getItem("WRVideoBackgroundEnabled") === "true" ? true : false
  );
  const [sortedMapRecordAllData, setSortedMapRecordAllData] = useState<
    GemHuntMapRecordScore[]
  >([]);
  const [sortedMapRecordUniqueData, setSortedMapRecordUniqueData] = useState<
    GemHuntMapRecordScore[]
  >([]);
  const [playerTotalScoreData, setPlayerTotalScoreData] = useState<
    PlayerTotalScoreObject[]
  >([]);
  const [mapWorldRecord, setMapWorldRecord] = useState<number>(0);
  const [mapWorldRecordHolder, setMapWorldRecordHolder] = useState<string>("");
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [verifyRunsModalOpen, setVerifyRunsModalOpen] = useState(false);
  const [reportedScore, setReportedScore] = useState<number | null>(null);
  const [mediaLink, setMediaLink] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [unverifiedRuns, setUnverifiedRuns] = useState<
    GemHuntMapRecordScoreWithMap[]
  >([]);
  const [runConfirmationIdx, setRunConfirmationIdx] = useState<number>(0);
  const [tableRowHeight, setTableRowHeight] = useState<number>(0);

  useEffect(() => {
    fetchGemHuntRecordData();
    fetchUnverifiedGemHuntRecords();
    if (token) {
      checkAdmin();
    }
  }, []);

  useEffect(() => {
    if (paramIdx) {
      setMapIndex(parseInt(paramIdx));
    }
  }, [paramIdx]);

  //set overall community record
  useEffect(() => {
    setCommunityWorldRecord(
      allMapData.reduce((acc, val) => acc + val.worldRecord, 0)
    );
  }, [allMapData]);

  useEffect(() => {
    // handle overall tab (no map)
    if (mapIndex === 0) {
      setSelectedMap(maps[1]); // default to Arcadia for submission from Overall tab
      handleOverallTabData(allMapData);
      return;
    }

    // handle selected map
    setSelectedMap(maps[mapIndex]);
    const selectedMapData = allMapData.find(
      (item: GemHuntMapRecord) => item.mapName === maps[mapIndex]
    );
    if (selectedMapData?.scores.length) {
      // from the map data, set the Unique Runs data and All Runs data
      getUniqueBestRunsOnMap(selectedMapData.scores);
      getAllBestRunsOnMap(selectedMapData.scores);
    } else {
      setSortedMapRecordAllData([]);
      setSortedMapRecordUniqueData([]);
      setMapWorldRecord(0);
    }
  }, [mapIndex, allMapData]);

  const getAllBestRunsOnMap = (mapScoreRecordData: GemHuntMapRecordScore[]) => {
    const filteredAllRecords = mapScoreRecordData
      .filter((entry) => entry.verified !== false)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        } else {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          return dateA - dateB; // Sort by date if the scores are equal. Earliest instance of score should keep WR
        }
      })
      .map((item, index) => ({
        ...item,
        runRating:
          (item.score / projectedMaxes[maps[mapIndex]]) * 1000,
        rank: index + 1,
        key: `${index + 1}`,
      }));

    if (filteredAllRecords.length) {
      setSortedMapRecordAllData(filteredAllRecords);
    } else {
      setSortedMapRecordAllData([]);
    }
  };

  const getUniqueBestRunsOnMap = (
    mapScoreRecordData: GemHuntMapRecordScore[]
  ) => {
    const filteredUniqueRecords = mapScoreRecordData
      .filter((entry: GemHuntMapRecordScore) => entry.verified !== false)
      .reduce(
        (
          accumulator: GemHuntMapRecordScore[],
          current: GemHuntMapRecordScore
        ) => {
          const existingPlayerIndex = accumulator.findIndex(
            (item) => item.player === current.player
          );
          if (existingPlayerIndex !== -1) {
            // Player already exists
            if (current.score > accumulator[existingPlayerIndex].score) {
              // Replace if score being checked is higher
              accumulator[existingPlayerIndex] = current;
            }
          } else {
            // Player doesn't exist in accumulator, add them
            accumulator.push(current);
          }

          return accumulator;
        },
        []
      )
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        } else {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        }
      })
      .map((item, index) => ({
        ...item,
        // using maps[mapIndex] which returns the name of the selected map to get the projectedMax
        // entry for the map. Don't have an easy way to access map name here. not ideal. maybe revisit.
        runRating:
          (item.score / projectedMaxes[maps[mapIndex]]) * 1000,
        rank: index + 1,
        key: `${index + 1}`,
      }));

    if (filteredUniqueRecords.length) {
      setSortedMapRecordUniqueData(filteredUniqueRecords);
      setMapWorldRecordHolder(filteredUniqueRecords[0].player);
      setMapWorldRecord(filteredUniqueRecords[0].score);
      setYTEmbedURL(filteredUniqueRecords[0].media);
    } else {
      setSortedMapRecordUniqueData([]);
      setMapWorldRecord(0);
    }
  };

  const handleOverallTabData = (mapRecordData: GemHuntMapRecord[]) => {
    const allScoresWithMapName: GemHuntMapRecordScoreWithMap[] = mapRecordData
      .flatMap((mapEntry: GemHuntMapRecord) =>
        mapEntry.scores.map((score: GemHuntMapRecordScore) => ({
          ...score,
          map: mapEntry.mapName,
          runRating: 5,
        }))
      )
      .filter((score) => score.verified !== false);

    const playerTotalScoreObjects: Record<string, PlayerTotalScoreObject> = {};

    allScoresWithMapName.forEach((score) => {
      const { player, score: currentScore, map } = score;

      // create player entry if player isn't in dict already
      if (!playerTotalScoreObjects[player]) {
        playerTotalScoreObjects[player] = {
          player: player,
          totalScore: 0,
          totalRunRating: 0,
          bestScoresByMap: {},
          runRatingByMap: {},
        };
      }

      // if no score for map, or score being evaluated is > best score on map
      if (
        !playerTotalScoreObjects[player].bestScoresByMap[map] ||
        currentScore > playerTotalScoreObjects[player].bestScoresByMap[map]
      ) {
        // set best scores/rating
        playerTotalScoreObjects[player].bestScoresByMap[map] = currentScore;
        playerTotalScoreObjects[player].runRatingByMap[map] = 
          (currentScore / projectedMaxes[map]) * 1000;
      }
    });

    // sum the best scores for each map
    Object.values(playerTotalScoreObjects).forEach((playerObject) => {
      const { bestScoresByMap, runRatingByMap } = playerObject;

      // reduce function
      const reduceScores = (sum: number, value: number) => sum + value;

      playerObject.totalScore = Object.values(bestScoresByMap).reduce(
        reduceScores,
        0
      );
      playerObject.totalRunRating = Object.values(runRatingByMap).reduce(
        reduceScores,
        0
      );
    });

    const playerBestTotalScores: PlayerTotalScoreObject[] = Object.values(
      playerTotalScoreObjects
    );
    const sortedPlayerBestTotalScores = playerBestTotalScores
      .sort((a, b) => {
        return b.totalRunRating - a.totalRunRating;
      })
      .map((item: PlayerTotalScoreObject, index: number) => ({
        ...item,
        rank: index + 1,
        key: `${index + 1}`,
      }));
    setPlayerTotalScoreData(sortedPlayerBestTotalScores);
    setMapWorldRecordHolder(sortedPlayerBestTotalScores[0]?.player);
    setMapWorldRecord(sortedPlayerBestTotalScores[0]?.totalScore);
  };
  const mapForward = () => {
    setMapIndex((mapIndex + 1) % maps.length);
  };

  const mapBackward = () => {
    setMapIndex((mapIndex - 1 + maps.length) % maps.length);
  };

  const checkAdmin = async () => {
    setAdmin(await userIsAdmin(token));
  };

  const fetchUnverifiedGemHuntRecords = async () => {
    try {
      const res: Response = await fetch(
        BASE_ROUTE + `/gem-hunt-map-records/unverified`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const unverifiedRunsData = await res.json();
      setUnverifiedRuns(unverifiedRunsData);
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      setAllMapData(mapData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGemHuntModalSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();
    if (!mediaLink || !reportedScore) {
      alert("Score & screenshot or YT link are required.");
      return;
    }
    try {
      const res: Response = await fetch(
        BASE_ROUTE + `/submit-gem-hunt-record/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            map: selectedMap,
            score: reportedScore,
            mediaLink: mediaLink,
            description: description,
          }),
        }
      );
      if (res.status === 201) {
        setSubmissionModalOpen(false);
        setReportedScore(null);
      }
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleVerifyAction = async (actionType: string) => {
    try {
      const endpoint =
        actionType === "approve"
          ? BASE_ROUTE + "/approve-gem-hunt-record"
          : BASE_ROUTE + "/deny-gem-hunt-record";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runID: unverifiedRuns[runConfirmationIdx].runID,
          map: unverifiedRuns[runConfirmationIdx]?.map,
          runPlayer: unverifiedRuns[runConfirmationIdx]?.player,
        }),
      });

      setRunConfirmationIdx(runConfirmationIdx + 1);
      if (runConfirmationIdx >= unverifiedRuns.length - 1) {
        setVerifyRunsModalOpen(false);
        window.location.reload();
      }
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmRun = () => {
    handleVerifyAction("approve");
  };

  const handleDenyRun = () => {
    handleVerifyAction("deny");
  };

  const tableRef: any = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      setTableRowHeight(
        tableRef.current.querySelectorAll(".ant-table-row")[0]?.offsetHeight
      );
    }
  }, [playerTotalScoreData, sortedMapRecordAllData, sortedMapRecordUniqueData]);

  return (
    <div className="sm:pt-28 pt-20 h-screen w-screen relative overflow-x-hidden">
      {showWRVideoBackground && (
        <div
          className={`${
            showWRVideoBackground ? `` : `-z-10`
          } fixed w-screen h-screen sm:-mt-4`}
        >
          <div className="flex flex-col h-screen items-center justify-center">
            <YoutubeEmbedded YTUrl={YTEmbedURL} />
          </div>
        </div>
      )}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
      >
        <div className="flex flex-col items-center sm:px-16 sm:py-4 px-2 pt-4 pb-2 gap-y-4">
          <span className="sm:text-4xl text-2xl font-bold">
            Submit Gem Hunt Record
          </span>
          <span className="text-green-600 text-2xl">
            Submitting for: {selectedMap}
          </span>
          <span className="sm:w-128 w-64 text-center sm:text-lg text-sm">
            With the goal of these records being highly credible, all
            submissions will be verified before appearing on the leaderboard.
          </span>
          <span className="font-semibold sm:text-lg text-sm">
            A screenshot or video is required.
          </span>
          <form
            onSubmit={handleGemHuntModalSubmit}
            className="block w-full flex flex-col items-center gap-y-2 mt-2"
          >
            <div className="flex items-center w-full gap-x-2">
              <label htmlFor="text" className="block text-sm font-semibold">
                Your score: <span className="text-red-600"> *</span>
              </label>
              <input
                type="number"
                placeholder="999"
                onChange={(e) =>
                  parseInt(e.target.value) > 999
                    ? setReportedScore(1)
                    : setReportedScore(parseInt(e.target.value))
                }
                value={reportedScore ?? ""}
                className="block sm:text-md text-sm w-16 border-solid border-2 border-slate-500 rounded-md border-0 px-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></input>
            </div>
            <label
              htmlFor="text"
              className="block text-sm font-semibold w-full"
            >
              Screenshot or Youtube Link:{" "}
              <span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              onChange={(e) => setMediaLink(e.target.value)}
              value={mediaLink ?? ""}
              placeholder="Ex: https://i.imgur.com/BB7F6Oa.jpg"
              className="block sm:text-md text-sm w-full border-solid border-2 border-slate-500 rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
            <label
              htmlFor="text"
              className="block text-sm font-semibold w-full"
            >
              Description (optional)
            </label>
            <input
              type="textarea"
              maxLength={36}
              onChange={(e) => setDescription(e.target.value)}
              value={description ?? ""}
              placeholder="Brief info/notes if desired"
              className="block sm:text-md text-sm w-full border-solid border-2 border-slate-500 rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
            <button
              type="submit"
              className="w-1/2 mt-2 py-1 px-1 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded transition duration-200"
            >
              Submit score
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={verifyRunsModalOpen}
        onClose={() => setVerifyRunsModalOpen(false)}
      >
        <div className="flex flex-col items-center sm:px-16 py-4 gap-y-4">
          <span className="sm:text-4xl text-2xl font-bold">
            Verify Gem Hunt Record
          </span>
          <span className="text-green-600 text-2xl">
            {unverifiedRuns[runConfirmationIdx]?.player} -{" "}
            {unverifiedRuns[runConfirmationIdx]?.score} points on{" "}
            {unverifiedRuns[runConfirmationIdx]?.map}
          </span>
          {unverifiedRuns[runConfirmationIdx]?.description && (
            <span>
              Player notes: {unverifiedRuns[runConfirmationIdx]?.description}
            </span>
          )}
          <span className="sm:w-128 w-64 text-center text-md font-semibold">
            Please check the attached media and either approve or deny the run.
          </span>
          <a
            className="text-blue-500"
            href={unverifiedRuns[runConfirmationIdx]?.media}
            target="_blank"
            rel="noreferrer"
          >
            {unverifiedRuns[runConfirmationIdx]?.media}
          </a>
          <div className="flex flex-row border-0 border-red-600 border-solid w-full justify-center gap-x-8">
            <button
              onClick={handleConfirmRun}
              className="w-36 h-8 mt-2 py-1 px-1 bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold rounded transition duration-200"
            >
              Approve Run
            </button>
            <button
              onClick={handleDenyRun}
              className="w-36 h-8 mt-2 py-1 px-1 bg-red-600 hover:bg-red-700 text-sm text-white font-semibold rounded transition duration-200"
            >
              Deny Run
            </button>
          </div>
        </div>
      </Modal>
      <div className="sm:w-1/2 w-full flex flex-col mx-auto justify-center items-center md:text-2xl text-md text-white text-center pb-2">
        <div className="z-10 flex items-center justify-center sm:text-6xl text-4xl pb-1 sm:mb-8 mb-4 sm:bg-inherit bg-black/50 px-2 rounded-md">
          <button
            onClick={mapBackward}
            className="sm:text-7xl mr-8 pb-1 neon-text"
          >
            {"<"}
          </button>
          <div className="sm:text-6xl text-3xl italic sm:w-80 w-40 inline-block">
            <span className="whitespace-nowrap">{maps[mapIndex]}</span>
          </div>
          <button
            onClick={mapForward}
            className="sm:text-7xl ml-8 pb-1 neon-text"
          >
            {">"}
          </button>
        </div>
        {mapWorldRecord !== 0 ? (
          <>
            <span className="bg-black/50 sm:text-3xl text-xl py-1 px-2 rounded-md mb-4">
              <span className="text-yellow-400">👑 Solo World Record:</span>{" "}
              {mapWorldRecord} points by{" "}
              <NavLink
                className="hover:text-cyan-400"
                to={{ pathname: `/player/${mapWorldRecordHolder}` }}
              >
                {mapWorldRecordHolder}
              </NavLink>
            </span>
            {mapIndex !== 0 && (
              <span className="text-lg text-cyan-400 italic">
                Projected Max: {projectedMaxes[maps[mapIndex]]}
              </span>
            )}
            {mapIndex === 0 && (
              <span className="bg-black/70 sm:text-xl text-md py-1 px-2 rounded-md mb-8">
                <span className="text-cyan-400">
                  Sum of All Bests: <span>{communityWorldRecord}</span>
                </span>
              </span>
            )}
          </>
        ) : (
          <span className="bg-black/40 sm:text-3xl text-xl py-1 px-2 rounded-md">
            No records for this map yet.
          </span>
        )}
        <div className="flex flex-row w-full">
          <div className="flex flex-col gap-y-1 sm:justify-start justify-end">
            {!smallScreen() && (
              <div className="z-10 flex flex-row justify-between h-8 px-2 gap-x-2 sm:ml-0 ml-2 items-center bg-black/80 rounded-md">
                <span className="sm:pb-1 px-2 sm:text-sm text-xs font-semibold whitespace-nowrap text-left">
                  WR Videos
                </span>
                <ToggleButton
                  inactiveLabel={"Off"}
                  activeLabel={"On"}
                  value={showWRVideoBackground}
                  onToggle={(showVideo: boolean) => {
                    localStorage.setItem(
                      "WRVideoBackgroundEnabled",
                      showVideo === false ? "true" : "false"
                    );
                    setShowWRVideoBackground(!showVideo);
                  }}
                  thumbStyle={{ borderRadius: 2 }}
                  trackStyle={{ borderRadius: 2 }}
                />
              </div>
            )}
            <div className="z-10 flex flex-row justify-between h-8 px-2 gap-x-2 sm:ml-0 ml-2 items-center bg-black/80 rounded-md">
              <span className="sm:pb-1 px-2 sm:text-sm text-xs font-semibold whitespace-nowrap text-left">
                Display All Runs
              </span>
              <ToggleButton
                inactiveLabel={"Off"}
                activeLabel={"On"}
                value={allRuns}
                onToggle={(uniqueOnly: boolean) => {
                  localStorage.setItem(
                    "showAllRunsEnabled",
                    uniqueOnly === false ? "true" : "false"
                  );
                  setAllRuns(!uniqueOnly);
                }}
                thumbStyle={{ borderRadius: 2 }}
                trackStyle={{ borderRadius: 2 }}
              />
            </div>
          </div>
          <div className="basis-full justify-end flex sm:flex-row flex-col gap-x-4">
            {Boolean(admin) && (
              <button
                onClick={() =>
                  unverifiedRuns?.length > 0
                    ? setVerifyRunsModalOpen(true)
                    : setVerifyRunsModalOpen(false)
                }
                className="block self-end sm:w-48 w-36 px-2 py-2 mt-2 mr-2 sm:mr-0 sm:text-sm text-xs font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md hover:bg-blue-500 bg-green-600"
              >
                Awaiting Approval ({unverifiedRuns?.length})
              </button>
            )}
            <a
              href="/timeline"
              className="block self-end text-cyan-400  sm:w-48 w-36 px-2 py-2 mt-2 mr-2 sm:mr-0 sm:text-sm text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md hover:text-white bg-black"
            >
              View Timeline
            </a>
              <button
              disabled={!Boolean(token)}
                onClick={() => setSubmissionModalOpen(true)}
                className={`${Boolean(token) ? 'opacity-100 hover:text-white' : 'opacity-60'} block self-end text-cyan-400  sm:w-48 w-36 px-2 py-2 mt-2 mr-2 sm:mr-0 sm:text-sm text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md bg-black`}
              >
                {Boolean(token) ? 'Report a run' : 'Log in to report runs'}
              </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          showWRVideoBackground && mapIndex !== 0 ? "opacity-0" : "opacity-95"
        } flex flex-row flex-wrap relative overflow-x-hidden justify-center pb-8`}
      >
        <Table
          ref={tableRef}
          className="sm:w-1/2 w-full sm:px-0 px-2"
          columns={mapIndex === 0 ? gemHuntOverallColumns : gemHuntColumns}
          scroll={
            above1080()
              ? { y: tableRowHeight * 15 }
              : smallScreen()
              ? { y: tableRowHeight * 5 }
              : { y: tableRowHeight * 10 }
          }
          dataSource={(() => {
            if (mapIndex === 0) {
              return playerTotalScoreData;
            } else {
              if (!allRuns) {
                return sortedMapRecordUniqueData;
              } else {
                return sortedMapRecordAllData;
              }
            }
          })()}
          pagination={{
            defaultPageSize: 50,
          }}
        />
      </div>
    </div>
  );
};
