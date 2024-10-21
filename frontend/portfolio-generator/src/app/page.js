"use client"
import { useEffect, useState } from "react";
import Projects from "./Projects.jsx"
import Technologies from "./Technologies.jsx"
const DEFAULT_USER = "nombre_usuario1";

export default function Home() {
    const [portfolio, setPortfolio] = useState(null);

	const techList = [
		{ name: 'GitHub', logo: '/images/github-logo.png' },
		{ name: 'React', logo: '/images/react-logo.png' },
		{ name: 'Node.js', logo: '/images/nodejs-logo.png' },
	  ];

	useEffect(() => {
		fetch(`http://localhost:3000/portfolio/${DEFAULT_USER}`)
			.then(res => res.json())
			.then(data => setPortfolio(data))
			.catch(error => console.log(error));
	}, []);
	
	return (
		<div>

			<h1>My Projects</h1>
			<Projects 
				imageSrc="/images/project1.png" 
				projectUrl="https://example.com"
				description="This is a cool project." 
			/>

			<h1>Technologies</h1>
			<Technologies techList={techList} />
		</div>
	);
}
