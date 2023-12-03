import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { GemHuntMapRecordScore } from "../types/interfaces";
import { calculateScoreColor, round, smallScreen } from "../utils/utils";
import { Tooltip } from "antd";

export let gemHuntColumns: ColumnsType<GemHuntMapRecordScore> = [
  //   {
  //   title: "Game",
  //   dataIndex: "game",
  //   key: "game",
  //   width: smallScreen() ? "auto" : "15%",
  //   render: (_) => (
  //           <img
  //           alt="Ultra Logo"
  //           className="w-3/4"
  //           src={'ultra_image_small.webp'}
  //         ></img>
  //   ),
  // },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (text) => (
      <NavLink to={{ pathname: `/player/${text}` }}>{text}</NavLink>
    ),
  },
  {
    title: (
      <Tooltip
        overlayInnerStyle={{ fontSize: "10px" }}
        title="Calculated as player score / projectedMax * 1000."
        color="#108ee9"
      >
        Run Rating ⓘ
      </Tooltip>
    ),
    dataIndex: "runRating",
    key: "runRating",
    render: (_, { runRating }: any) => (
      //div by 10 for map tabs
      <span
        style={{ color: calculateScoreColor(runRating ? runRating / 10 : 0) }}
      >
        {round(runRating, 1)}
      </span>
    ),
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "Notes",
    dataIndex: "description",
    key: "description",
    render: (_, { description }) => <p>{description || "-"}</p>,
  },
  {
    title: "Screenshot / Video",
    dataIndex: "media",
    key: "mediaLink",
    width: "auto",
    render: (_, { media }) =>
      media ? (
        <a
          className="text-cyan-400 hover:text-white"
          href={media}
          target="_blank"
          rel="noreferrer"
        >
          Link
        </a>
      ) : (
        <>See individual maps</>
      ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, { date }) =>
      date ? <>{date.toString().split("T")[0]}</> : <>N/A</>,
    defaultSortOrder: "descend",
  },
];

if (smallScreen()) {
  gemHuntColumns = gemHuntColumns.filter(
    (item) => item.key !== "game" && item.key !== "description"
  );
}
