import "../index.css";

export const Homepage = () => {
  const username = localStorage.getItem("username");
  return (
    <div className="sm:pt-0 pt-48 h-screen w-screen relative overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col w-screen h-screen sm:justify-center sm:items-center sm:pb-40">
        <div className="select-none text-center neon-text-allsize sm:text-6xl text-3xl text-white mb-8">
          {username === null
            ? "Welcome to MarbleLadder!"
            : `Welcome to MarbleLadder, ${username}!`}
        </div>
        <div className="select-none text-center neon-text-allsize sm:text-3xl text-xl text-white">
          <a href='https://discord.gg/marbleitup'>Click to join the MIU Discord and find opponents!</a>
        </div>
      </div>
      <div className="fixed bottom-0 py-4 w-full bg-black/70 items-center justify-center">
        <span className="block w-full border-0 px-4 border-solid border-red-600 sm:text-4xl text-lg text-white text-center">
          MarbleLadder implements features supporting <i className='neon-text-allsize'>Marble It Up! Ultra</i> ranked matches and gem hunt record tracking!
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 mt-4 border-0 border-solid border-red-600 sm:text-xl text-sm text-white text-center">
          Play and report online 1v1 matches against opponents on PC, Xbox, PlayStation or Switch to try and climb the 1v1 Gem Hunt ladder, or play solo to try your luck at setting a Solo Gem Hunt world record! You can look for opponents in the
          MIU Discord and then host a private game to play ranked ladder matches.
        </span>
      </div>
    </div>
  );
};
