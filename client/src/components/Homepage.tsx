import "../index.css";

export const Homepage = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="sm:pt-16 h-screen w-screen relative overflow-x-hidden">
      <div className="sm:h-3/4 h-5/6 w-screen border-solid border-0 border-blue-600 flex justify-center align-middle items-center">
        <div className="select-none text-center neon-text sm:text-6xl text-3xl text-white sm:mb-36">
          {username === null ? 'Welcome to MarbleLadder!' : `Welcome to MarbleLadder, ${username}!`}
        </div>
      </div>
      <div className="sm:absolute sm:bottom-0 sm:left-0 sm:h-84 py-4 flex flex-col flex-wrap w-full bg-black-opacity-70 items-center justify-center">
        <span className="block w-full border-0 px-4 border-solid border-red-600 sm:text-4xl text-xl text-white text-center">
          MarbleLadder supports <i>Marble It Up!</i> scores and
          rankings, and is focused on Multiplayer/Gem Hunt.
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 mt-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are playing 1v1 games, navigate to 1v1 ladder and click 'Report
          Result'. Search for the player you played against, and report the
          result. The player will be notified and must confirm the result of the
          match. Any rules or best of x series are up to you and your opponent -- you can report a best of 3 series as 1 result if you wish. ELO is updated upon confirmation by both parties.
        </span>
        <br />
        <span className="block w-full sm:px-56 px-4 border-0 border-solid border-red-600 sm:text-xl text-md text-white text-center">
          If you are posting a solo gem hunt run, click 'Report Result' and fill
          out the form. With the goal of these leaderboards being as credible as possible, gem hunt submissions *must* include a screenshot or recording of
          the score and are subject to approval. There is currently no way to
          automatically parse multiplayer scores.
        </span>
      </div>
    </div>
  );
};
