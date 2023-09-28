import "../index.css";

export const About = () => {
  return (
    <div className="flex h-screen relative justify-center items-center">
      <div className="sm:w-2/5 w-4/5 sm:px-16 sm:pb-8 pt-8 pb-4 bg-black-opacity-90 rounded-md text-center">
        <span className="block sm:text-4xl text-2xl text-white pb-4">What is MarbleLadder?</span>
        <span className="block sm:text-xl text-md p-4 text-white">
          MarbleLadder is geared towards 1v1 gem hunt play with leaderboard tracking and ELO distribution. To participate in the 1v1 Gem Hunt Ladder, sign up for an account and look for opponents in the multiplayer channel of the MIU Discord. One of the participants will need to record the game results after games are over. This can be done on the ladder page.
        </span>
        <span className="block sm:text-xl text-md p-4 text-white">
          MarbleLadder is a site I built in my spare time to try and support competitive multiplayer play. MarbleLadder is not affiliated with Marble Collective in any capacity. There are likely bugs,
          and certain features are not yet complete. If you find major bugs,
          feel free to contact me on Discord at msi#8029.
        </span>
      </div>
    </div>
  );
};
