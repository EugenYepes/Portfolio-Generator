"use client"
import { useEffect, useState } from "react";
import { useBaseUrl } from "./context/BaseUrlContext";
import Contact from "./Contact";
import Experience from "./Experience";
import Presentation from "./Presentation";
import AboutMe from "./AboutMe";
import Certificates from "./Certificates";
import Projects from "./Projects.jsx"
import Technologies from "./Technologies.jsx"

const DEFAULT_USER = "nombre_usuario5";

export default function Home() {
	const baseUrl = useBaseUrl();
	const [portfolio, setPortfolio] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	console.log("Portfolio", portfolio);

	useEffect(() => {
		fetch(`${baseUrl}/portfolio/${DEFAULT_USER}`)
			.then(res => {
				console.log("Respuesta", res)
				return res.json();
			})
			.then(data => {
				console.log("Data: ", data)
				setPortfolio(data);
				setIsLoading(false);
			})
			.catch(error => {
				console.log(error);
				setIsLoading(false);
			});
	}, []);


	if (isLoading) {
		return <div>Cargando...</div>
	}

	if (!portfolio || !portfolio.aboutMe || !portfolio.certificates) {
		return <div>No se encontraron datos</div>;
	}

	return (
		<div>
			<Presentation presentation={portfolio.presentation} />
			<AboutMe aboutMe={portfolio.aboutMe} />
			<Experience experiences={portfolio.experience} />
			<Certificates certificates={portfolio.certificates} />
			<div className="flex justify-center space-x-4">
				<Projects projects={portfolio.projects} />
			</div>
			<Contact contact={portfolio.contact} />
		</div>
	);
}