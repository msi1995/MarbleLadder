import "../index.css";

export const About = () => {
  return (
    <div className="flex pt-16 h-screen w-screen relative overflow-x-hidden justify-center items-center">
      <div className="flex flex-col sm:w-2/5 w-4/5 relative overflow-x-hidden sm:px-16 sm:py-16 overflow-y-hidden justify-start items-start text-left bg-black-opacity-70 rounded-md text-center">
        <span className="block sm:text-2xl text-xl px-4 py-4 text-white">
          MarbleLadder is not affiliated with Marble Collective or the Marble It
          Up development team. This site is standalone and does not currently
          interface directly with any title or service.
        </span>
        <span className="block sm:text-2xl text-xl px-4 py-4 text-white">
          MarbleLadder is not affiliated with Marble Collective or the Marble It
          Up development team. This site is standalone and does not currently
          interface directly with any title or service.{" "}
        </span>
      </div>
    </div>
  );
};
