import { ColumnsType } from "antd/es/table";
import { NavLink } from "react-router-dom";
import { GemHuntMapRecordScore} from "../types/interfaces";
import { smallScreen } from "../utils/utils";

export let gemHuntColumns: ColumnsType<GemHuntMapRecordScore> = [
    {
    title: "Game",
    dataIndex: "game",
    key: "game",
    width: smallScreen() ? "auto" : "15%",
    render: (_) => (
            <img
            alt="Ultra Logo"
            className="w-3/4"
            src={'ultra_image_small.webp'}
          ></img>
    ),
  },
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
      <NavLink
        to={{ pathname: `/player/${text}` }}
      >
        {text}
      </NavLink>
    ),
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
    render: (_, { score, totalScore }) => (
      //render score if available, otherwise render totalScore (for overall tab)
      <p>{score || totalScore}
      </p>
    ),
  },
  {
    title: "Notes",
    dataIndex: "description",
    key: "description",
    render: (_, { description }) => (
      <p>{description || '-'}
      </p>
    ),
  },
  {
    title: "Screenshot / Video",
    dataIndex: "media",
    key: "mediaLink",
    width: "auto",
    render: (_, { media }) => (
      media ? 
      <a className='text-cyan-400 hover:text-white' href={media} target="_blank" rel="noreferrer">
        Link
      </a> : <>See individual maps</>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, { date }) => date ? <>{date.toString().split("T")[0]}</> : <>N/A</>,
    defaultSortOrder: "descend",
  },
];

if (smallScreen()) {
  gemHuntColumns = gemHuntColumns.filter((item) => item.key !== "game" && item.key !== "notes");
}