import "../index.css";

export const About = () => {
  return (
    <div className="flex w-full h-screen sm:px-0 px-4 items-center overflow-y-hidden">
      <div className="sm:w-3/5 w-full sm:p-8 p-4 mx-auto bg-black/90 rounded-md text-center">
        <span className="block sm:text-4xl text-2xl text-white pb-4">
          What is MarbleLadder?
        </span>
        <span className="block sm:text-lg text-sm p-4 text-white">
          MarbleLadder implements a ranked ladder with a functional ELO system
          and persistent multiplayer stat tracking. It also maintains a verified
          leaderboard of solo Gem Hunt records. To participate, sign up for an
          account and you will be able to post runs or find ranked games against
          players in the MIU discord. PC, Xbox, Switch, and PlayStation all
          currently have crossplay functionality, so you can find opponents on
          any of these platforms.
        </span>
        <span className="block sm:text-lg text-sm p-4 text-white">
          MarbleLadder is a passion project built to try and support competitive
          multiplayer play. MarbleLadder is not affiliated with Marble
          Collective in any capacity. If you find major bugs, feel free to
          contact me on Discord at msi#8029.
        </span>
      </div>
    </div>
  );
};
