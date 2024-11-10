import Portfolio from "../models/portfolio.model.js";
import fs from "fs";
import path from 'path';

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
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const presentationSection = JSON.parse(req.body.presentationSection);

		userPortfolio.presentationSection.name = presentationSection.name || userPortfolio.presentationSection.name;
		userPortfolio.presentationSection.rol = presentationSection.rol || userPortfolio.presentationSection.rol;
		userPortfolio.presentationSection.image.url = req.imagePath || userPortfolio.presentationSection.image.url;

		await userPortfolio.save();

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
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const aboutMeSection = JSON.parse(req.body.aboutMeSection);

		userPortfolio.aboutMeSection.sectionTitle.text = aboutMeSection.sectionTitle.text;
		userPortfolio.aboutMeSection.bodyText.text = aboutMeSection.bodyText.text;

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

export const editExperienceSection = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const experienceSection = JSON.parse(req.body.experienceSection);
		userPortfolio.experienceSection.sectionTitle.text = experienceSection.sectionTitle.text;

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Experience' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addExperience = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const experienceSection = JSON.parse(req.body.experienceSection);

		userPortfolio.experienceSection.experiences.push({
			workName: { text: experienceSection.experience.workName.text },
			description: { text: experienceSection.experience.description.text },
			date: { from: experienceSection.experience.date.from, to: experienceSection.experience.date.to }
		});

		await userPortfolio.save();

		res.status(201).json({
			message: "Experiencia agregada exitosamente",
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editExperience = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		const experience = userPortfolio.experienceSection.experiences.id(id);
		if (!experience) {
			return res.status(404).json({ message: "Experiencia no encontrada" });
		}

		const experienceSection = JSON.parse(req.body.experienceSection);

		experience.workName.text = experienceSection.experience.workName.text || experience.workName.text;
		experience.description.text = experienceSection.experience.description.text || experience.description.text;
		experience.date = { from: experienceSection.experience.date.from, to: experienceSection.experience.date.to } || experience.date;

		await userPortfolio.save();
		res.status(200).json({ message: "Experiencia actualizada exitosamente" });
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

export const editProjectSection = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const projectSection = JSON.parse(req.body.projectSection);
		userPortfolio.projectSection.sectionTitle.text = projectSection.sectionTitle.text;

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Projects' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addProject = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const projectSection = JSON.parse(req.body.projectSection);

		const projectTmp = {
			name: { text: projectSection.project.name.text },
			description: { text: projectSection.project.description.text },
			demoLink: { text: projectSection.project.demoLink.text, link: projectSection.project.demoLink.link },
			gitHubLink: { text: projectSection.project.gitHubLink.text, link: projectSection.project.gitHubLink.link },
		};
		userPortfolio.projectSection.projects.push(projectTmp);

		await userPortfolio.save();

		const project = userPortfolio.projectSection.projects[userPortfolio.projectSection.projects.length - 1];
		const projectId = project._id;

		const ext = path.extname(req.imagePath)
		const dir = path.dirname(req.imagePath);
		const newPath = `${dir}/${userName}-${projectId}${ext}`;
		fs.rename(req.imagePath, newPath, err => {
			if (err) {
				return res.status(500).json({ message: 'Error renaming image', error: err });
			}
			project.image.url = newPath;
			userPortfolio.save()
				.then(() => {
					res.status(200).json({
						message: 'Projecto agregado exitosamente',
					});
				})
				.catch(err => {
					res.status(500).json({ message: 'Error agregando proyecto', error: err });
				});
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editProject = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;

	try {
		const userPortfolio = await Portfolio.findOne({ "user.userName": userName });
		const project = userPortfolio.projectSection.projects.id(id);
		if (!project) {
			return res.status(404).json({ message: "Proyecto no encontrado" });
		}

		const projectSection = JSON.parse(req.body.projectSection);

		project.name.text = projectSection.project.name.text || project.name.text;
		project.description.text = projectSection.project.description.text || project.description.text;
		project.image.url = req.imagePath || project.image.url;
		project.demoLink = { text: projectSection.project.demoLink.text, link: projectSection.project.demoLink.link } || project.demoLink;
		project.gitHubLink = { text: projectSection.project.gitHubLink.text, link: projectSection.project.gitHubLink.link } || project.gitHubLink;

		await userPortfolio.save();

		res.status(200).json({ message: "Proyecto actualizado exitosamente" });
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
	const { educationSection } = req.body;
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const educationSection = JSON.parse(req.body.educationSection);
		userPortfolio.educationSection.sectionTitle.text = educationSection.sectionTitle.text;

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Educación' actualizada exitosamente", });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addEducation = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const educationSection = JSON.parse(req.body.educationSection);

		const educationTmp = {
			name: { text: educationSection.education.name.text },
			description: { text: educationSection.education.description.text },
			date: { from: educationSection.education.date.from, to: educationSection.education.date.to }
		};

		userPortfolio.educationSection.educations.push(educationTmp);

		await userPortfolio.save();

		res.status(201).json({ message: "Educación agregada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editEducation = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName)
		const education = userPortfolio.educationSection.educations.id(id);
		if (!education) {
			return res.status(404).json({ message: "Educación no encontrada" });
		}

		const educationSection = JSON.parse(req.body.educationSection);

		education.name.text = educationSection.education.name.text || education.name.text;
		education.description.text = educationSection.education.description.text || education.description.text;
		education.date = { from: educationSection.education.date.from, to: educationSection.education.date.to } || education.date;

		await userPortfolio.save();

		res.status(200).json({ message: "Educación actualizada" });
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
		res.status(200).json({ message: "Educación eliminada" });
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
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const certificateSection = JSON.parse(req.body.certificateSection);

		userPortfolio.certificateSection.sectionTitle.text = certificateSection.sectionTitle.text;

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Certificados' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addCertificate = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const certificateSection = JSON.parse(req.body.certificateSection);

		userPortfolio.certificateSection.certificates.push({
			name: { text: certificateSection.certificate.name.text },
			description: { text: certificateSection.certificate.description.text },
		});

		await userPortfolio.save();

		const certificate = userPortfolio.certificateSection.certificates[userPortfolio.certificateSection.certificates.length - 1];
		const certificateId = certificate._id;

		const ext = path.extname(req.imagePath)
		const dir = path.dirname(req.imagePath);
		const newPath = `${dir}/${userName}-${certificateId}${ext}`;
		fs.rename(req.imagePath, newPath, err => {
			if (err) {
				return res.status(500).json({ message: 'Error renaming image', error: err });
			}
			certificate.image.url = newPath;
			userPortfolio.save()
				.then(() => {
					res.status(200).json({
						message: 'Certificado agregado exitosamente',
					});
				})
				.catch(err => {
					res.status(500).json({ message: 'Error agregando certificado', error: err });
				});
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editCertificate = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		const certificate = userPortfolio.certificateSection.certificates.id(id);
		if (!certificate) {
			return res.status(404).json({ message: "Certificado no encontrado" });
		}

		const certificateSection = JSON.parse(req.body.certificateSection);

		certificate.name.text = certificateSection.certificate.name.text || certificate.name.text;
		certificate.description.text = certificateSection.certificate.description.text || certificate.description.text;
		certificate.image.url = req.imagePath || certificate.image.url;

		await userPortfolio.save();
		res.status(200).json({ message: "Certificado actualizado" });
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
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const technologySection = JSON.parse(req.body.technologySection);

		userPortfolio.technologySection.sectionTitle.text = technologySection.sectionTitle.text;

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Technologies' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const addTechnology = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const technologySection = JSON.parse(req.body.technologySection);

		userPortfolio.technologySection.technologies.push({
			name: { text: technologySection.technology.name.text },
		});

		await userPortfolio.save();

		const technology = userPortfolio.technologySection.technologies[userPortfolio.technologySection.technologies.length - 1];
		const technologyId = technology._id;

		const ext = path.extname(req.imagePath)
		const dir = path.dirname(req.imagePath);
		const newPath = `${dir}/${userName}-${technologyId}${ext}`;
		fs.rename(req.imagePath, newPath, err => {
			if (err) {
				return res.status(500).json({ message: 'Error renaming image', error: err });
			}
			technology.image.url = newPath;
			userPortfolio.save()
				.then(() => {
					res.status(200).json({
						message: 'Tecnologia agregado exitosamente',
					});
				})
				.catch(err => {
					res.status(500).json({ message: 'Error agregando tecnologia', error: err });
				});
		});
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const editTechnology = async (req, res) => {
	const { id } = req.params;
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		const technology = userPortfolio.technologySection.technologies.id(id);
		if (!technology) {
			return res.status(404).json({ message: "Tecnologia no encontrada" });
		}

		const technologySection = JSON.parse(req.body.technologySection);

		technology.name.text = technologySection.technology.name.text || technology.name.text;
		technology.image.url = req.imagePath || technology.image.url;

		await userPortfolio.save();
		res.status(200).json({ message: "Tecnologia actualizada" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

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
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const contactSection = JSON.parse(req.body.contactSection)
		userPortfolio.contactSection.sectionTitle = contactSection.sectionTitle;

		userPortfolio.contactSection.mailTitle = contactSection.mailTitle;
		userPortfolio.contactSection.mail = contactSection.mail;

		userPortfolio.contactSection.linkdinTitle = contactSection.linkdinTitle;
		userPortfolio.contactSection.linkedin = contactSection.linkedin;

		userPortfolio.contactSection.githubTitle = contactSection.githubTitle;
		userPortfolio.contactSection.github = contactSection.github;

		userPortfolio.contactSection.phoneTitle = contactSection.phoneTitle;
		userPortfolio.contactSection.phone = contactSection.phone;

		userPortfolio.contactSection.locationTitle = contactSection.locationTitle;
		userPortfolio.contactSection.location = contactSection.location;

		userPortfolio.contactSection.bodyText = contactSection.bodyText

		await userPortfolio.save();

		res.status(200).json({ message: "Información de contacto actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};
