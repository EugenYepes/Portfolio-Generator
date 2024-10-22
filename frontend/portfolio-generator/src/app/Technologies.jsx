const Technologies = ({ techList }) => {
    return (
      <div className="flex justify-center gap-4 flex-wrap">
        {techList.map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 shadow dark:bg-gray-800 flex items-center justify-center rounded-md shadow-lg">
              <img src={tech.logo} className="h-12 w-12 object-contain transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0" alt={tech.name} />
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-2">{tech.name}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default Technologies;  