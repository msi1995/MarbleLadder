import "../index.css";

export const Homepage = () => {
  const username = localStorage.getItem("username");
  return (
    <div className="sm:pt-16 h-screen w-screen relative overflow-x-hidden">
      <div className="flex flex-col h-3/4 w-screen border-solid border-0 border-blue-600 flex justify-center align-middle items-center">
        <div className="select-none text-center neon-text sm:text-6xl text-3xl text-white mb-8">
          {username === null
            ? "Welcome to MarbleLadder!"
            : `Welcome to MarbleLadder, ${username}!`}
        </div>
        <div className="select-none text-center neon-text sm:text-3xl text-xl text-white">
          <a href='https://discord.gg/marbleitup'>Click to join the MIU Discord and find opponents!</a>
        </div>
      </div>
      <div className="sm:fixed sm:bottom-0 relative py-4 w-full bg-black-opacity-70 items-center justify-center">
        <span className="block w-full border-0 px-4 border-solid border-red-600 sm:text-4xl text-xl text-white text-center">
          MarbleLadder supports <i>Marble It Up!</i> scores and rankings for multiplayer play.
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 mt-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are playing 1v1 gem hunt, navigate to the 1v1 ladder, login, and
          click Report Match Results. Your opponent will be notified and must
          confirm the result of the matches. You can look for opponents in the
          MIU Discord, and then host private matches to play your games. PC, Xbox, and Switch currently have cross-platform play in MIU.
        </span>
        <br />
        <span className="hidden block w-full sm:px-56 px-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are posting a solo gem hunt run, click 'Report Result' and fill
          out the form. With the goal of these leaderboards being as credible as
          possible, gem hunt submissions *must* include a screenshot or
          recording of the score and are subject to approval. There is currently
          no way to automatically parse multiplayer scores.
        </span>
      </div>
    </div>
  );
};
