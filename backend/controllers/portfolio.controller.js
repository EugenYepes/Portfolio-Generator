import Portfolio from "../models/portfolio.model.js";

class PortfolioError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

const findPortfolioByUserName = async (userName) => {
	const userPortfolio = await Portfolio.findOne({ "user.userName": userName });
	if (!userPortfolio) {
		throw new PortfolioError(404, "Portafolio no encontrado");
	}
	return userPortfolio;
}

//* Presentation
export const getPresentation = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ presentationSection: userPortfolio.presentationSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editPresentationSection = async (req, res) => {
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el name y rol de presentationSection
		const presentationSection = JSON.parse(req.body.presentationSection);

		userPortfolio.presentationSection.name = presentationSection.name;
		userPortfolio.presentationSection.rol = presentationSection.rol;
		userPortfolio.presentationSection.image.url = req.imagePath;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({ message: "Sección 'Presentation' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

//* About Me
export const getAboutMe = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ aboutMeSection: userPortfolio.aboutMeSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editAboutMe = async (req, res) => {
	const { aboutMeSection } = req.body;
	const { userName } = req.params;
	const userId = req.userId; // Este ID proviene del middleware verifyToken

	try {
		// Busca el portafolio por el nombre de usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		// Verifica si el usuario autenticado es el dueño del portafolio
		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Si es el dueño, actualiza la sección
		userPortfolio.aboutMeSection = aboutMeSection;
		await userPortfolio.save();

		res.status(200).json({
			message: "Sección 'About Me' actualizada exitosamente"
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

//* Experience
export const getAllExperience = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ experienceSection: userPortfolio.experienceSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addExperience = async (req, res) => {
	const { experience } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.experienceSection.experiences.push({
			workName: experience.workName,
			description: experience.description,
			date: experience.date,
		});

		await userPortfolio.save();

		res.status(201).json({
			message: "Experiencia agregada exitosamente",
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editExperienceSection = async (req, res) => {
	const { experienceSection } = req.body; // Extrae el objeto experienceSection del cuerpo
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el sectionTitle de experienceSection
		userPortfolio.experienceSection.sectionTitle = experienceSection.sectionTitle;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({ message: "Sección 'Experience' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const updateExperience = async (req, res) => {
	const { id } = req.params;
	const { workName, description, date } = req.body;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOne({ "user.userName": userName });
		const experience = userPortfolio.experienceSection.experiences.id(id);
		if (!experience) {
			return res.status(404).json({ message: "Experiencia no encontrada" });
		}
		experience.workName = workName || experience.workName;
		experience.description = description || experience.description;
		experience.date = date || experience.date;
		await userPortfolio.save();
		res.status(200).json({ message: "Experiencia actualizada", experienceSection: userPortfolio.experienceSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const deleteExperience = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { "experienceSection.experiences": { _id: id } } },
			{ new: true }
		);
		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}
		res.status(200).json({ message: "Experiencia eliminada", experienceSection: userPortfolio.experienceSection });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Projects
export const getAllProjects = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ projectSection: userPortfolio.projectSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editProjectsSection = async (req, res) => {
	const { projectsSection } = req.body; // Extrae projectsSection del cuerpo de la solicitud
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el sectionTitle de projectsSection
		userPortfolio.projectSection.sectionTitle = projectsSection.sectionTitle;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({
			message: "Sección 'Projects' actualizada exitosamente",
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addProject = async (req, res) => {
	const { project } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.projectSection.projects.push({
			name: project.name,
			description: project.description,
			image: project.image,
			demoLink: project.demoLink,
			gitHubLink: project.gitHubLink,
		});

		await userPortfolio.save();

		res.status(201).json({
			message: "Proyecto agregado exitosamente",
			project,
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const updateProject = async (req, res) => {
	const { id } = req.params;
	const { name, description, image, demoLink, gitHubLink } = req.body;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOne({ "user.userName": userName });
		const project = userPortfolio.projectSection.projects.id(id);
		if (!project) {
			return res.status(404).json({ message: "Proyecto no encontrado" });
		}
		project.name = name || project.name;
		project.description = description || project.description;
		project.image = image || project.image;
		project.demoLink = demoLink || project.demoLink;
		project.gitHubLink = demoLink || project.gitHubLink;
		await userPortfolio.save();
		res.status(200).json({ message: "Proyecto actualizado", projectSection: userPortfolio.projectSection });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteProject = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { "projectSection.projects": { _id: id } } },
			{ new: true }
		);
		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}
		res.status(200).json({ message: "Proyecto eliminado", projectSection: userPortfolio.projectSection });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Education
export const getAllEducation = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ educationSection: userPortfolio.educationSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editEducationSection = async (req, res) => {
	const { educationSection } = req.body; // Extrae educationSection del cuerpo de la solicitud
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el sectionTitle de educationSection
		userPortfolio.educationSection.sectionTitle = educationSection.sectionTitle;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({ message: "Sección 'Educación' actualizada exitosamente", });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addEducation = async (req, res) => {
	const { education } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.educationSection.educations.push({
			name: education.name,
			description: education.description,
			date: education.date,
		});

		await userPortfolio.save();

		res.status(201).json({ message: "Educación agregada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const updateEducation = async (req, res) => {
	const { id } = req.params;
	const { name, description, date } = req.body;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOne({
			"user.userName": userName,
		});
		const education = userPortfolio.educationSection.educations.id(id);
		if (!education) {
			return res.status(404).json({ message: "Educación no encontrada" });
		}
		education.name = name || education.name;
		education.description = description || education.description;
		education.date = date || education.date;
		await userPortfolio.save();
		res.status(200).json({
			message: "Educación actualizada",
			educationSection: userPortfolio.educationSection,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteEducation = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { "educationSection.educations": { _id: id } } },
			{ new: true }
		);
		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}
		res
			.status(200)
			.json({
				message: "Educación eliminada",
				educationSection: userPortfolio.educationSection,
			});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Certificates
export const getAllCertificates = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ certificateSection: userPortfolio.certificateSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editCertificatesSection = async (req, res) => {
	const { certificatesSection } = req.body; // Extrae certificatesSection del cuerpo de la solicitud
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el sectionTitle de certificatesSection
		userPortfolio.certificateSection.sectionTitle = certificatesSection.sectionTitle;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({
			message: "Sección 'Certificados' actualizada exitosamente",
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addCertificate = async (req, res) => {
	const { certificate } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.certificateSection.certificates.push({
			name: certificate.name,
			image: certificate.image,
			description: certificate.description,
		});

		await userPortfolio.save();

		res.status(201).json({ message: "Certificado agregado exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const updateCertificate = async (req, res) => {
	const { id } = req.params;
	const { name, image, description } = req.body;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOne({
			"user.userName": userName,
		});
		const certificate =
			userPortfolio.certificateSection.certificates.id(id);
		if (!certificate) {
			return res.status(404).json({ message: "Certificado no encontrado" });
		}
		certificate.name = name || certificate.name;
		certificate.image = image || certificate.image;
		certificate.description = description || certificate.description;
		await userPortfolio.save();
		res.status(200).json({
			message: "Certificado actualizado",
			certificateSection: userPortfolio.certificateSection,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteCertificate = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { "certificateSection.certificates": { _id: id } } },
			{ new: true }
		);
		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}
		res.status(200).json({
			message: "Certificado eliminado",
			certificateSection: userPortfolio.certificateSection,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Technologies
export const getSelectedTechnologies = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ technologySection: userPortfolio.technologySection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editTechnologiesSection = async (req, res) => {
	const { technologiesSection } = req.body; // Extrae technologiesSection del cuerpo de la solicitud
	const { userName } = req.params; // Obtén el userName de los parámetros de la ruta
	const userId = req.userId;

	try {
		// Busca el portafolio del usuario
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		// Actualiza el sectionTitle de technologiesSection
		userPortfolio.technologySection.sectionTitle = technologiesSection.sectionTitle;

		// Guarda los cambios en la base de datos
		await userPortfolio.save();

		// Responde con un mensaje de éxito
		res.status(200).json({ message: "Sección 'Technologies' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addTechnology = async (req, res) => {
	const { technology } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.technologySection.technologies.push({
			name: technology.name,
			image: technology.image,
		});

		await userPortfolio.save();

		res.status(201).json({ message: "Tecnología agregada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const deleteTechnology = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { "technologySection.technologies": { _id: id } } },
			{ new: true }
		);
		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}
		res.status(200).json({ message: "Tecnología eliminada", technologySection: userPortfolio.technologySection });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Contact
export const sendContactSectionEmail = async (req, res) => {
	const { name, email, subject, message, userEmail } = req.body;
	try {
		sendContactEmail(name, email, subject, message, userEmail);
		res.status(200).json({ message: "Email de contacto enviado exitosamente" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getContact = async (req, res) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ contactSection: userPortfolio.contactSection });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editContactSection = async (req, res) => {
	const { contactSection } = req.body;
	const { userName } = req.params;
	const userId = req.userId;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		if (userPortfolio.user._id.toString() !== userId) {
			return res.status(403).json({ message: "No autorizado" });
		}

		userPortfolio.contactSection = contactSection;
		await userPortfolio.save();

		res.status(200).json({ message: "Información de contacto actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};
