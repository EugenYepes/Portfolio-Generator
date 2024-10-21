const Technologies = ({ techList }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {techList.map((tech, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img src={tech.logo} alt={tech.name} style={{ width: '50px', height: '50px' }} />
            <p>{tech.name}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default Technologies;