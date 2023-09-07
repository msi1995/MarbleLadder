export const PageNotFound = () => {
  return (
    <div className="flex flex-col pt-16 h-screen w-screen relative overflow-x-hidden justify-center items-center">
        <span className="text-8xl text-white opacity-80 pb-2 mb-8 px-4">
        404!
      </span>
      <span className="sm:text-4xl text-lg text-yellow-400 bg-black opacity-80 pb-2 px-4 text-center">
        Are you sure you didn't take a wrong turn?
      </span>
    </div>
  );
};
