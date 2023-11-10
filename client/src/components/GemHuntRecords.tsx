import {
  GemHuntLadderData,
  gemHuntColumns,
  smallScreen,
} from "../antd/gemHuntColumns";
import { Table } from "antd";
import Cookies from "universal-cookie";
import { BASE_ROUTE } from "../App";
import { handleLogout, userIsAdmin } from "../utils/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "./Modal";

export const GemHuntRecords = () => {
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const navigate = useNavigate();
  const maps = [
    "Arcadia",
    "Assault",
    "Brawl",
    "Frostbite",
    "Jumphouse",
    "Nexus",
    "Mosh Pit",
    "Pythagoras",
    "Stadion",
    "Surf's Up",
  ];

  const [admin, setAdmin] = useState<boolean>(false);
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [selectedMap, setSelectedMap] = useState<string>(maps[0]);
  const [allMapData, setAllMapData] = useState<any>([]);
  const [rawMapRecordData, setRawMapRecordData] = useState<any>([]);
  const [sortedMapRecordData, setSortedMapRecordData] = useState<any>([]);
  const [mapWorldRecord, setMapWorldRecord] = useState<number>(0);
  const [mapWorldRecordHolder, setMapWorldRecordHolder] = useState<string>("");
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [reportedScore, setReportedScore] = useState<number>();
  const [mediaLink, setMediaLink] = useState<string | null>(null);
  const [unverifiedRuns, setUnverifiedRuns] = useState<number>(0);

  useEffect(() => {
    fetchGemHuntRecordData();
    fetchUnverifiedGemHuntRecords();
    checkAdmin()

  }, []);

  useEffect(() => {
    setSelectedMap(maps[mapIndex]);
    const selectedMapData = allMapData.find(
      (item: any) => item.mapName === maps[mapIndex]
    );

    setRawMapRecordData(selectedMapData?.scores ?? null);
  }, [mapIndex, allMapData]);

   useEffect(() => {
    let sortedMapRecords;
    try {
      if (rawMapRecordData?.length) {
        sortedMapRecords = [...rawMapRecordData]?.sort(
          (a, b) => b.score - a.score
        );
        sortedMapRecords = sortedMapRecords.filter(
          (entry) => entry.verified !== false
        );
        if (sortedMapRecords?.length) {
          //Do not display unverified entries to the user
          sortedMapRecords?.forEach((item, index) => {
            item.rank = index + 1;
            item.key = `${index + 1}`;
          });
          setSortedMapRecordData(sortedMapRecords?.slice(0, 5));
          setMapWorldRecordHolder(sortedMapRecords[0].player);
          setMapWorldRecord(sortedMapRecords[0].score);
        }
      } else {
        setSortedMapRecordData([]);
        setMapWorldRecord(0);
      }
    } catch (e) {
      console.log(e);
    }
  }, [rawMapRecordData]);
  
  const mapForward = () => {
    setMapIndex((mapIndex + 1) % maps.length);
  };

  const mapBackward = () => {
    setMapIndex((mapIndex - 1 + maps.length) % maps.length);
  };

  const checkAdmin = async () => {
    setAdmin(await userIsAdmin(token));
  }

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
      const unverifiedRuns = await res.json();
      setUnverifiedRuns(unverifiedRuns.length);
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
      const allMapData: GemHuntLadderData[] = await res.json();
      setAllMapData(allMapData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGemHuntModalSubmit = (event: any) => {
    event?.preventDefault();
    submitGemHuntRecord();
  };

  const submitGemHuntRecord = async () => {
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
          }),
        }
      );
      setSubmissionModalOpen(false);
      if (res.status === 403) {
        handleLogout(navigate, cookies);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="pt-48 h-screen w-screen relative overflow-x-hidden">
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
      >
        <div className="flex flex-col items-center sm:px-16 py-4 gap-y-4">
          <span className="sm:text-4xl text-2xl font-bold">
            Submit Gem Hunt Record
          </span>
          <span className="text-green-600 text-2xl">
            Submitting for: {selectedMap}
          </span>
          <span className="sm:w-128 w-64 text-center text-md">
            With the goal of these records being highly credible, all
            submissions will be verified before appearing on the leaderboard.
          </span>
          <span className="font-semibold">
            A screenshot or video is required.
          </span>
          <form
            onSubmit={handleGemHuntModalSubmit}
            className="block w-full flex flex-col items-center gap-y-4 mt-4"
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
                value={reportedScore}
                className="block w-16 border-solid border-2 border-slate-500 rounded-md border-0 px-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></input>
            </div>
            <label
              htmlFor="text"
              className="block text-sm font-semibold w-full"
            >
              Imgur or Youtube Link: <span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              onChange={(e) => setMediaLink(e.target.value)}
              value={mediaLink ?? ""}
              placeholder="Example: https://i.imgur.com/BB7F6Oa.jpg"
              className="block w-full border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
            <button
              type="submit"
              className="w-1/3 mt-2 py-1 px-1 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded transition duration-200"
            >
              Submit score
            </button>
          </form>
        </div>
      </Modal>
      <div className="sm:w-1/2 w-full flex flex-col mx-auto justify-center items-center md:text-2xl text-md text-white text-center pb-2">
        <div className="sm:text-6xl text-4xl sm:mb-8 mb-2">
          <button
            onClick={mapBackward}
            className="sm:text-7xl text-4xl mr-8 neon-text"
          >
            {"<"}
          </button>
          <div className="sm:text-6xl italic sm:w-72 text-4xl w-42 inline-block border-0 border-red-600">
            <span>{selectedMap}</span>
          </div>
          <button
            onClick={mapForward}
            className="sm:text-7xl text-4xl ml-8 neon-text"
          >
            {">"}
          </button>
        </div>
        {mapWorldRecord !== 0 ? (
          <span className="bg-black/50 sm:text-3xl text-xl py-1 px-2 rounded-md">
            <span className="text-yellow-400">👑 World Record :</span>{" "}
            {mapWorldRecord} points by{" "}
            <NavLink
              className=""
              to={{ pathname: `/player/${mapWorldRecordHolder}` }}
            >
              {mapWorldRecordHolder}
            </NavLink>
          </span>
        ) : (
          <span className="bg-black/40 sm:text-3xl text-xl py-1 px-2 rounded-md">
            No records for this map yet.
          </span>
        )}
        <div className="self-end flex flex-row gap-x-4">
          {Boolean(admin) && (
            <button
              onClick={() => console.log("nothing yet")}
              className="block self-end sm:w-48 w-32 px-2 py-2 mt-2 mr-2 sm:mr-0  text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md hover:bg-blue-500 bg-green-600"
            >
              Unverified runs ({unverifiedRuns})
            </button>
          )}
          {Boolean(token) && (
            <button
              onClick={() => setSubmissionModalOpen(true)}
              className="block self-end sm:w-48 w-32 px-2 py-2 mt-2 mr-2 sm:mr-0  text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md hover:bg-blue-500 bg-black"
            >
              Report a run
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-row flex-wrap relative overflow-x-hidden justify-center opacity-95">
        <Table
          className="sm:w-1/2 w-full sm:px-0 px-2"
          columns={gemHuntColumns}
          dataSource={sortedMapRecordData}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: smallScreen() ? 5 : 15,
            pageSizeOptions: [5, 15, 25, 50],
          }}
        />
      </div>
    </div>
  );
};
