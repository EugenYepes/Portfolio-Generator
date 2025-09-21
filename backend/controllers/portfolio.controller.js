import Portfolio from "../models/portfolio.model.js";
import { sendContactEmail } from "../nodemailer/emails.js"
import fs from "fs";
import path from 'path';
import { uploadFromBuffer, deleteImage } from '../utils/cloudinary.js';

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

export const getSection = async (req, res, section) => {
	const { userName } = req.params;
	try {
		const userPortfolio = await findPortfolioByUserName(userName);
		res.status(200).json({ [section]: userPortfolio[section] });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
}

export const deleteSectionItem = async (req, res, section, subSection) => {
	const { id } = req.params;
	const { userName } = req.params;
	try {
		const userPortfolio = await Portfolio.findOneAndUpdate(
			{ "user.userName": userName },
			{ $pull: { [`${section}.${subSection}`]: { _id: id } } }
		);

		if (!userPortfolio) {
			return res.status(404).json({ message: "Portafolio no encontrado" });
		}

		// delete the image asociated if exists and is not a default one
		const deletedItem = userPortfolio[section][subSection].find(item => item._id.toString() === id);
		if (deletedItem && deletedItem.image && deletedItem.image.url) {
			await deleteImageIfNecessary(deletedItem.image.url);
		}

		res.status(200).json({
			message: `${subSection} eliminado`,
			[section]: userPortfolio[section]
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Presentation
export const editPresentationSection = async (req, res) => {
	const { userName } = req.params;

	try {
		const userPortfolio = await findPortfolioByUserName(userName);

		const presentationSection = JSON.parse(req.body.presentationSection);

		userPortfolio.presentationSection.name = presentationSection.name || userPortfolio.presentationSection.name;
		userPortfolio.presentationSection.rol = presentationSection.rol || userPortfolio.presentationSection.rol;

		if (req.file) {
			// Upload to Cloudinary
			const sectionId = userPortfolio.presentationSection._id;
  			const result = await uploadFromBuffer(req.file.buffer, 'portfolio/presentation', `${userName}-${sectionId}`);

			userPortfolio.presentationSection.image.url = `${result.public_id}.${result.format}`
		} else {
			userPortfolio.presentationSection.image.url = userPortfolio.presentationSection.image.url;
		}

		await userPortfolio.save();

		res.status(200).json({ message: "Sección 'Presentation' actualizada exitosamente" });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.message });
	}
};

//* About Me
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

//* Projects
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

		if (req.file) {
			const project = userPortfolio.projectSection.projects[userPortfolio.projectSection.projects.length - 1];
			const projectId = project._id;
			const result = await uploadFromBuffer(req.file.buffer, 'portfolio/projects', `${userName}-${projectId}`);

			project.image.url = `${result.public_id}.${result.format}`
			await userPortfolio.save()
		}

		res.status(200).json({message: 'Projecto agregado exitosamente'});
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
		project.demoLink = { text: projectSection.project.demoLink.text, link: projectSection.project.demoLink.link } || project.demoLink;
		project.gitHubLink = { text: projectSection.project.gitHubLink.text, link: projectSection.project.gitHubLink.link } || project.gitHubLink;

		if (req.file) {
			await uploadFromBuffer(req.file.buffer, 'portfolio/projects', `${userName}-${project._id}`);
		}

		await userPortfolio.save();

		res.status(200).json({ message: "Proyecto actualizado exitosamente" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Education
export const editEducationSection = async (req, res) => {
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

//* Certificates
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

		if (req.file) {
			const certificate = userPortfolio.certificateSection.certificates[userPortfolio.certificateSection.certificates.length - 1];
			const certificateId = certificate._id;
			const result = await uploadFromBuffer(req.file.buffer, 'portfolio/certificates', `${userName}-${certificateId}`);

			certificate.image.url = `${result.public_id}.${result.format}`
		}
		await userPortfolio.save()

		res.status(200).json({message: 'Certificado agregado exitosamente'});
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

		if (req.file) {
			await uploadFromBuffer(req.file.buffer, 'portfolio/certificates', `${userName}-${certificate._id}`);
		}

		await userPortfolio.save();
		res.status(200).json({ message: "Certificado actualizado" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//* Technologies
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

		if (req.file) {
			const technology = userPortfolio.technologySection.technologies[userPortfolio.technologySection.technologies.length - 1];
			const technologyId = technology._id;
			const result = await uploadFromBuffer(req.file.buffer, 'portfolio/technologies', `${userName}-${technologyId}`);

			technology.image.url = `${result.public_id}.${result.format}`
		}
		await userPortfolio.save()

		res.status(200).json({message: 'Tecnologia agregada exitosamente'});
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

		if (req.file) {
			await uploadFromBuffer(req.file.buffer, 'portfolio/technologies', `${userName}-${technology._id}`);
		}

		await userPortfolio.save();
		res.status(200).json({ message: "Tecnologia actualizada" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

//* Contact
export const sendContactSectionEmail = async (req, res) => {
	const { formData, userEmail } = req.body;
	try {
		sendContactEmail(formData.name, formData.email, formData.subject, formData.message, userEmail);
		res.status(200).json({ message: "Email de contacto enviado exitosamente" });
	} catch (error) {
		res.status(500).json({ message: error.message });
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


const renameFile = (oldPath, userName, itemId, updateReferenceCallback) => {
	const ext = path.extname(oldPath);
	const dir = path.dirname(oldPath);
	const newPath = `${dir}/${userName}-${itemId}${ext}`;

	fs.rename(oldPath, newPath, (err) => {
		if (err) {
			return updateReferenceCallback({ success: false, error: err });
		}
		updateReferenceCallback({ success: true, newPath });
	});
}

const deleteImageIfNecessary = async (imageUrl) => {
	try {
		// Don’t delete default images
		if (imageUrl.includes("default-")) {
			console.log("Image is default, not deleting:", imageUrl);
			return;
		}

		// Extract public_id from the URL
		// Example URL: https://res.cloudinary.com/de4s5tliq/image/upload/v1758406050/portfolio/presentation/test-68cf5e5b1d89e399426d5984.jpg
		const parts = imageUrl.split("/");
		const publicIdWithExt = parts.slice(-3).join("/"); // e.g. "portfolio/presentation/test-68cf5e5b1d89e399426d5984.jpg""
		const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension

		await deleteImage(publicId)

		console.log("File deleted successfully:", publicId);
	} catch (err) {
		throw new PortfolioError(500, "Error deleting the associated image");
	}
};