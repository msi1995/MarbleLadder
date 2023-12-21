import { Checkbox } from "antd";
import "../index.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";

export const About = () => {
  const [showBasicAbout, setShowBasicAbout] = useState<boolean>(false);

  const handleCheckbox = (e: CheckboxChangeEvent) => {
    setShowBasicAbout(e.target.checked);
  };
  return (
    <div className="flex w-full h-screen items-center">
      <div className="max-h-full flex flex-row flex-wrap max-w-6xl sm:p-8 p-4 mx-auto bg-black/90 rounded-md text-center justify-center">
        <div className="w-full flex flex-row flex-wrap justify-center items-center">
          <span className="sm:basis-1/4 sm:text-4xl text-2xl text-white pb-4"></span>
          <span className="sm:basis-1/2 basis-full sm:text-4xl text-2xl text-white pb-4">
            What is MarbleLadder?
          </span>
          <Checkbox
            onChange={handleCheckbox}
            className="sm:basis-1/4 sm:text-base text-xs text-white pb-4"
          >
            More basic please
          </Checkbox>
        </div>
        {showBasicAbout ? (
          <span className="basis-full sm:text-lg text-sm px-4 py-2 text-white">
            Marble It Up Ultra is a Steam arcade game created by Marble
            Collective. The game features single player and multiplayer modes,
            but does not currently include a ranked mode. This website aims to
            facilitate ranked gameplay for players by allowing matches to be
            reported. Using reported match data, the site displays a global
            leaderboard, match history, ELO ratings, and more. The website also
            tracks 'solo Gem Hunt records', which is a player's personal best
            playing by themselves, without an opponent.
          </span>
        ) : (
          <span className="basis-full sm:text-lg text-sm px-4 py-2 text-white">
            MarbleLadder implements a ranked ladder with a functional ELO system
            and persistent multiplayer stat tracking. It also maintains a
            verified leaderboard of solo Gem Hunt records. To participate, sign
            up for an account and you will be able to post runs or find ranked
            games against players in the MIU discord. PC, Xbox, Switch, and
            PlayStation all currently have crossplay functionality, so you can
            find opponents on any of these platforms.
          </span>
        )}
        <span className="basis-full sm:text-lg text-sm p-4 text-white">
          MarbleLadder is a passion project built to try and support competitive
          multiplayer play. MarbleLadder is not affiliated with Marble
          Collective in any capacity. If you find bugs, feel free to
          send an email to marbleladder0@gmail.com.
        </span>
      </div>
    </div>
  );
};
