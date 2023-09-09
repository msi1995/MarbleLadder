import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { BASE_ROUTE } from "../App";
import SelectSearch from "react-select-search";
import Cookies from "universal-cookie";
import "react-select-search/style.css";

interface PlayerLadderData {
  rank: number;
  key: string;
  username: string;
  ratingScore: number;
  wins: number;
  losses: number;
  currentStreak: number;
}

interface LadderPlayer {
  matchHistory: object;
  username: string;
}

interface LadderMatch {
  matchP1: string;
  matchP2: string;
  matchWinner: string;
  matchDate: Date;
  confirmed: boolean;
  disputed: boolean;
  userIsSubmitter: boolean;
}

interface OpponentData {
  name: string;
  value: string;
}

const columns: ColumnsType<PlayerLadderData> = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    width: "15%",
  },
  {
    title: "Player",
    dataIndex: "username",
    key: "username",
    width: "25%",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Rating",
    dataIndex: "ratingScore",
    key: "ratingScore",
    width: "20%",
  },
  {
    title: "W/L",
    dataIndex: "winloss",
    width: "20%",
    render: (_, record) => (
      <span>
        {record.wins}-{record.losses}
      </span>
    ),
  },
  {
    title: "Streak",
    key: "streak",
    dataIndex: "streak",
    width: "20%",
    render: (_, { currentStreak }) => (
      <>
        <Tag
          color={currentStreak >= 0 ? "green" : "volcano"}
          key={currentStreak}
        >
          {currentStreak == 0
            ? "No games yet!"
            : currentStreak > 0
            ? `${currentStreak}W`
            : `${Math.abs(currentStreak)}L`}
        </Tag>
      </>
    ),
  },
];

export const SoloLadder = () => {
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const [ladderData, setLadderData] = useState<PlayerLadderData[]>([]);
  const [opponentData, setOpponentData] = useState<OpponentData[]>([]);
  const [matchData, setMatchData] = useState<any>();
  const [playerOpponent, setPlayerOpponent] = useState<string>("");
  const [reporterIsWinner, setReporterIsWinner] = useState<boolean | null>(
    null
  );
  const [reportedMap, setReportedMap] = useState<string>("Brawl");
  const [playerScore, setPlayerScore] = useState<number | null>(null);
  const [opponentScore, setOpponentScore] = useState<number | null>(null);
  const [matchConfirmationIdx, setMatchConfirmationIdx] = useState<number>(0);
  const [reportMatchModalVisible, setReportMatchModalVisible] =
    useState<Boolean>(false);
  const [confirmMatchModalVisible, setConfirmMatchModalVisible] =
    useState<Boolean>(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    getLadderData();
    checkUnconfirmedMatches();
  }, []);

  const getLadderData = async () => {
    try {
      const res: Response = await fetch(BASE_ROUTE + "/ladder-data");
      const data: PlayerLadderData[] = await res.json();
      setLadderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkUnconfirmedMatches = async () => {
    try {
      const res: Response = await fetch(
        BASE_ROUTE + "/matches-pending-confirmation",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data: LadderPlayer = await res.json();
      setMatchData(data.matchHistory);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenMatchReportModal = async (event: any) => {
    setReportMatchModalVisible(true);
    ladderData.forEach((entry) => {
      if (
        !opponentData.some((opponent) => opponent.name === entry.username) &&
        entry.username != username
      ) {
        setOpponentData((opponentData) => [
          ...opponentData,
          { name: entry.username, value: entry.username },
        ]);
      }
    });
  };

  const handleMatchResultsReported = async (event: any) => {
    event.preventDefault();
    setReportMatchModalVisible(false);

    try {
      const data = await fetch(BASE_ROUTE + "/match-results", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opponentUsername: playerOpponent,
          reporterIsWinner: reporterIsWinner,
          map: reportedMap,
          playerScore: playerScore,
          opponentScore: opponentScore,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (actionType: string) => {
    try {
      const endpoint =
        actionType === "confirm"
          ? BASE_ROUTE + "/confirm-match"
          : BASE_ROUTE + "/dispute-match";

      const data = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traceID: unconfirmedMatches[matchConfirmationIdx].traceID,
        }),
      });

      setMatchConfirmationIdx(matchConfirmationIdx + 1);
      if (matchConfirmationIdx >= unconfirmedMatches.length - 1) {
        setConfirmMatchModalVisible(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmMatch = () => {
    handleAction("confirm");
  };

  const handleDisputeMatch = () => {
    handleAction("dispute");
  };

  const data: PlayerLadderData[] = ladderData;
  let sortedData;
  try {
    sortedData = [...data]?.sort((a, b) => b.ratingScore - a.ratingScore);
    sortedData.forEach((item, index) => {
      item.rank = index + 1;
      item.key = `${index + 1}`;
    });
  } catch (e) {
    console.log(e);
  }

  const unconfirmedMatches = matchData?.filter(
    (match: LadderMatch) =>
      !match.confirmed && !match.userIsSubmitter && !match.disputed
  );

  const handleOpponentSelectChange = (opponent: any) => {
    setPlayerOpponent(opponent);
  };

  return (
    <div className="pt-16 h-screen w-screen relative overflow-x-hidden">
      {Boolean(confirmMatchModalVisible) && (
        <div className="absolute sm:top-1/3 top-1/2 left-1/2 sm:w-1/3 w-full -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-black-opacity-90 z-10 text-white">
          <div className="flex flex-col pb-16 pb-12 justify-center items-center">
            <span className="text-4xl pt-4 pb-6">Confirm/Deny Match</span>
            <div className="flex flex-row gap-x-1.5 text-2xl pb-4">
              <span
                className={
                  unconfirmedMatches[matchConfirmationIdx]?.matchWinnerName ===
                  username
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {unconfirmedMatches[matchConfirmationIdx]?.matchWinnerName ===
                username
                  ? "Victory"
                  : "Defeat"}
              </span>
              <span>
                {" "}
                against {unconfirmedMatches[matchConfirmationIdx]?.matchP1Name}!
              </span>
            </div>
            {Boolean(unconfirmedMatches[matchConfirmationIdx]?.P2Score) && (
              <div className="flex flex-row gap-x-1.5 text-2xl">
                <span className="text-xl">
                  {" "}
                  {unconfirmedMatches[matchConfirmationIdx]?.P2Score} -{" "}
                  {unconfirmedMatches[matchConfirmationIdx]?.P1Score} on{" "}
                  {unconfirmedMatches[matchConfirmationIdx]?.map}
                </span>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row gap-6 justify-center pb-8">
            <button
              onClick={handleConfirmMatch}
              className="block w-1/3 rounded-md  bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Confirm
            </button>
            <button
              onClick={handleDisputeMatch}
              className="block w-1/3 rounded-md bg-red-500 hover:bg-red-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Dispute
            </button>
          </div>
        </div>
      )}
      {Boolean(reportMatchModalVisible) && (
        <div className="absolute sm:w-1/4 sm:left-1/3 w-5/6 ml-10 mt-10 sm:top-60 sm:px-24 sm:py-8 px-8 py-6 rounded-md bg-black-opacity-90 z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Report Match Results
            </h2>
            <p className="mt-4 sm:text-lg text-md leading-8 text-white">
              Pick who you played, who won, and optionally include score or map
              info.
            </p>
            <p className="mt-2 sm:text-lg text-md leading-8 text-white">
              Your opponent will be able to confirm or deny the match result.
            </p>
          </div>
          <form
            onSubmit={handleMatchResultsReported}
            className="mx-auto z-20 mt-12 max-w-2xl"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="opponentName"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Opponent username<span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5">
                  <SelectSearch
                    options={opponentData}
                    search={true}
                    onChange={handleOpponentSelectChange}
                    placeholder="Search opponent"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="reporterIsWinner"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Who won?
                  <span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5 flex flex-col w-full gap-y-2 block text-sm font-semibold leading-6 text-white">
                  <div className="flex align-center">
                    <input
                      type="radio"
                      value="Yes"
                      name="reporterIsWinner"
                      className="custom-radio"
                      onClick={() => setReporterIsWinner(true)}
                    />{" "}
                    Me ({username})
                  </div>
                  <div className="flex align-center">
                    <input
                      type="radio"
                      value="No"
                      name="reporterIsWinner"
                      className="custom-radio"
                      onClick={() => setReporterIsWinner(false)}
                    />{" "}
                    Opponent {playerOpponent ? `(${playerOpponent})` : ""}
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Map (optional)
                </label>
                <div className="mt-2.5">
                  <select
                    className="block w-2/3 sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={reportedMap}
                    onChange={(e) => setReportedMap(e.target.value)}
                  >
                    <option value="Select">Select</option>
                    <option value="Arcadia">Arcadia</option>
                    <option value="Assault">Assault</option>
                    <option value="Brawl">Brawl</option>
                    <option value="Frostbite">Frostbite</option>
                    <option value="Jumphouse">Jumphouse</option>
                    <option value="Nexus">Nexus</option>
                    <option value="Mosh Pit">Mosh Pit</option>
                    <option value="Pythagoras">Pythagoras</option>
                    <option value="Stadion">Stadion</option>
                    <option value="Surf's Up">Surf's Up</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-1 col-span-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  My score (optional)
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="myScore"
                    id="myScore"
                    maxLength={3}
                    onChange={(e) => setPlayerScore(Number(e.target.value))}
                    className="block w-full sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-1 col-span-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Opponent score (optional)
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="opponentScore"
                    id="opponentScore"
                    maxLength={3}
                    onChange={(e) => setOpponentScore(Number(e.target.value))}
                    className="block w-full sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-row space-x-12 justify-center">
              <button
                type="submit"
                className="block w-full rounded-md bg-emerald-600 hover:bg-blue-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit Match Info
              </button>
              <button
                onClick={() => setReportMatchModalVisible(false)}
                type="submit"
                className="block w-full rounded-md bg-red-500 hover:bg-red-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Nevermind
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="pt-24 flex flex-row flex-wrap relative overflow-x-hidden justify-center opacity-95">
        <div className="border-0 border-solid border-red-600 flex sm:w-3/5 w-full justify-end px-2">
          {Boolean(unconfirmedMatches?.length) && (
            <button
              onClick={(e) => setConfirmMatchModalVisible(true)}
              className="block sm:w-64 w-48 rounded-md bg-emerald-600 hover:bg-blue-500  bg-black px-4 py-2.5 sm:mr-4 mr-2 mb-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Confirm Results ({unconfirmedMatches.length} pending!)
            </button>
          )}
          {Boolean(token) && (
            <button
              onClick={handleOpenMatchReportModal}
              className="block sm:w-64 w-48 rounded-md hover:bg-blue-500 bg-black px-4 py-2.5 sm:mr-4 mr-2 mb-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Report Match Results
            </button>
          )}
        </div>

        <Table
          className="sm:w-3/5 w-full"
          columns={columns}
          dataSource={sortedData}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 15,
            pageSizeOptions: [5, 15, 25, 50],
          }}
        />
      </div>
    </div>
  );
};
