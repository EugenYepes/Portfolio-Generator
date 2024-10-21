
const Projects = ({ imageSrc, projectUrl, description }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px', textAlign: 'center' }}>
      <img src={imageSrc} alt="Project" style={{ width: '100%', height: 'auto' }} />
      <h2>Project</h2>
      <p>{description}</p>
      <a href={projectUrl} target="_blank" rel="noopener noreferrer">
        Visit project
      </a>
    </div>
  );
};

export default Projects;