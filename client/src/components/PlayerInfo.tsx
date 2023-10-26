import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_ROUTE } from "../App";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Cookies from "universal-cookie";
import { handleLogout } from "../utils/utils";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import moment from "moment";

export const PlayerInfo = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const location = useLocation();
  const { state } = location;
  const [playerData, setPlayerData] = useState<any>();
  const [playerMatchData, setPlayerMatchData] = useState<any>();
  const [averagePointDifferential, setAveragePointDifferential] =
    useState<number>(0);
  const { name: player_name } = useParams();

  useEffect(() => {
    getPlayerPageData(player_name);
  }, [player_name]);

  useEffect(() => {
    calculatePointDifferential(playerMatchData);
  }, [playerMatchData]);

  const smallScreen = () => {
    return window.innerWidth <= 850;
  };

  const calculatePointDifferential = (matches: any[]) => {
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

  interface PlayerMatchHistory {
    traceID: string;
    matchDate: Date;
    matchP1Name: string;
    matchP1Rating: number;
    matchP2Name: string;
    matchP2Rating: number;
    P1Score: number;
    P2Score: number;
    matchWinnerName: string;
    matchWinnerELOChange: number;
    matchLoserELOChange: number;
    map: string;
  }

  let columns: ColumnsType<PlayerMatchHistory> = [
    {
      title: "Match ID",
      dataIndex: "traceID",
      key: "traceID",
      align: "center",
      width: smallScreen() ? "15%" : "15%",
    },
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      align: "center",
      width: smallScreen() ? "25%" : "20%",
      render: (_, { matchDate }) => <>{matchDate.toString().split("T")[0]}</>,
      defaultSortOrder: "descend",
      sorter: (a, b) => moment(a.matchDate).unix() - moment(b.matchDate).unix(),
    },
    {
      title: "Map",
      dataIndex: "map",
      key: "map",
      align: "left",
      width: smallScreen() ? "auto" : "15%",
      render: (_, { map }) => (
        <>
          <img
            className="sm:w-32 sm:h-24 w-16 rounded-md"
            src={`/Level_Images/${map || "NoMap"}.png`}
          ></img>
        </>
      ),
    },
    {
      title: "Result",
      key: "result",
      align: "left",
      dataIndex: "result",
      width: smallScreen() ? "auto" : "20%",
      render: (_, { matchWinnerName, matchP1Name, matchP2Name }) => (
        <>
          <Tag color={matchWinnerName === player_name ? "green" : "volcano"}>
            {matchWinnerName === player_name ? "Victory" : "Defeat"}
          </Tag>
          against{" "}
          <b>
            {matchP1Name === player_name ? (
              <NavLink to={`/player/${matchP2Name}`}>{matchP2Name}</NavLink>
            ) : (
              <NavLink to={`/player/${matchP1Name}`}>{matchP1Name}</NavLink>
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
      width: smallScreen() ? "auto" : "20%",
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
      width: smallScreen() ? "auto" : "20%",
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

        if (matchWinnerELOChange === null || matchLoserELOChange === null) {
          ELO_string = "No data";
        } else {
          const isWinner = player_name === matchWinnerName;
          const isP1 = player_name === matchP1Name;
          const baseRating = isP1 ? matchP1Rating : matchP2Rating;
          const eloChange = isWinner ? matchWinnerELOChange : matchLoserELOChange;
          const eloChangeString = isWinner ? `[+${eloChange}]` : `[${eloChange}]`;
        
          ELO_string = `${baseRating + eloChange} ${eloChangeString}`;
        }
        return (
          <div
            className={
              matchWinnerName === player_name
                ? "text-green-600"
                : "text-red-600"
            }
          >{ELO_string}</div>
        );
      },
    },
  ];

  //don't show match ID on mobile. too long, doesn't matter.
  if (smallScreen()) {
    columns = columns.filter((item) => item.key !== "traceID");
  }

  return (
    <div className="sm:pt-24 pt-24 h-screen w-screen overflow-x-hidden border-0 border-solid border-red-600">
      <div className="mx-auto rounded-lg bg-black/90 w-5/6 sm:w-2/3">
        <div className="flex mx-auto py-6 gap-x-2 flex-wrap justify-center items-center flex-row text-white sm:text-5xl text-2xl border-1 border-solid border-red-600">
          <span className="flex items-center">{player_name}</span>
          <span className="flex items-center sm:text-3xl text-lg sm:pt-2 pt-1">
            [{playerData?.ratingScore}]
          </span>
        </div>
        <div className="flex mx-auto flex-wrap justify-evenly flex-row text-white sm:text-xl text-md border-1 border-solid border-red-600">
          {state && (
            <span className="flex items-center text-yellow-400 sm:text-lg">
              Ladder Position: #{state?.rank}
            </span>
          )}
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
            {Math.round(
              (playerData?.wins / (playerData?.wins + playerData?.losses)) * 100
            )}
            %
          </span>
          <div>
            <span>Average Margin: </span>
            <span
              className={
                averagePointDifferential > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {averagePointDifferential} pts
            </span>
          </div>
          <div>
            <span>Rating: </span>
            <span
              className={
                playerData?.ratingScore < 1500
                  ? "text-red-300"
                  : "text-green-400"
              }
            >
              {playerData?.ratingScore}
            </span>
          </div>
          <span>
            Streak:{" "}
            {playerData?.currentStreak === 0
              ? `No match data yet.`
              : playerData?.currentStreak > 0
              ? `${Math.abs(playerData?.currentStreak)} Wins`
              : `${Math.abs(playerData?.currentStreak)} Losses`}
          </span>
        </div>
        <div className="flex mx-auto py-6 flex-wrap justify-evenly flex-row text-white sm:text-xl text-md border-1 border-solid border-red-600">
          <span>Nemesis: work in progress</span>
        </div>
      </div>
      <div className="sm:pt-12 pt-12 flex flex-col items-center border-0 border-solid border-green-600">
        <div className="pb-8">
          <span className="bg-black/50 py-2 px-4 text-white text-3xl rounded-md">
            Match History
          </span>
        </div>
        <Table
          className="sm:w-3/5 w-full sm:px-0 px-2"
          columns={columns}
          dataSource={playerMatchData}
          showHeader={true}
          scroll={{ y: 650 }}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: smallScreen() ? 5 : 25,
            pageSizeOptions: [5, 25, 50, 100],
          }}
        />
      </div>
    </div>
  );
};
