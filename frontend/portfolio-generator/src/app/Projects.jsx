const Projects = ({ imageSrc, projectUrl, description }) => {
    return (
      <div className="border border-gray-300 rounded-lg shadow-md p-4 m-4 text-center hover:shadow-lg transition-shadow duration-300">
        <img src={imageSrc} alt="Project" className="w-full h-auto rounded-t-lg" />
        <h2 className="text-xl font-bold mt-4">Project</h2>
        <p className="text-gray-700 mt-2">{description}</p>
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 mt-4 inline-block hover:underline"
        >
          Visit project
        </a>
      </div>
    );
  };
  
  export default Projects;  