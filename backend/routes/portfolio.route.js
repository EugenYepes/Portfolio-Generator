import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeOwner } from "../middleware/authorizeOwner.js";
import {
	editPresentationSection,

	editAboutMe,

	editExperienceSection,
	addExperience,
	editExperience,

	editProjectSection,
	addProject,
	editProject,

	editEducationSection,
	addEducation,
	editEducation,

	editCertificatesSection,
	addCertificate,
	editCertificate,

	editTechnologiesSection,
	addTechnology,
	editTechnology,

	sendContactSectionEmail,
	editContactSection,

	getSection,
	deleteSectionItem,
} from "../controllers/portfolio.controller.js";

import {
	presentation,
	aboutMe,
	experience,
	project,
	education,
	certificate,
	technology,
	contact,
} from '../models/portfolio.model.js'

const router = express.Router();
const defaultMulter = multer()

// Presentation
router.get("/:userName/presentation", (req, res) => getSection(req, res, presentation.section));
router.put("/:userName/edit/presentation", verifyToken, authorizeOwner, defaultMulter.single("image"), editPresentationSection);

// About Me
router.get("/:userName/aboutme", (req, res) => getSection(req, res, aboutMe.section));
router.put("/:userName/edit/aboutMe", verifyToken, authorizeOwner, defaultMulter.none(), editAboutMe);

// Experience
router.get("/:userName/experience", (req, res) => getSection(req, res, experience.section));
router.put("/:userName/edit/experiencesection", verifyToken, authorizeOwner, defaultMulter.none(), editExperienceSection);
router.post("/:userName/add/experience", verifyToken, authorizeOwner, defaultMulter.none(), addExperience);
router.put("/:userName/edit/experience/:id", verifyToken, authorizeOwner, defaultMulter.none(), editExperience);
router.delete("/:userName/delete/experience/:id", verifyToken, authorizeOwner, (req, res) => deleteSectionItem(req, res, experience.section, experience.subSection));

// Projects
router.get("/:userName/projects", (req, res) => getSection(req, res, project.section));
router.put("/:userName/edit/projectsection", verifyToken, authorizeOwner, defaultMulter.none(), editProjectSection);
router.post("/:userName/add/project", verifyToken, authorizeOwner, defaultMulter.single('image'), addProject);
router.put("/:userName/edit/project/:id", verifyToken, authorizeOwner, defaultMulter.single('image'), editProject);
router.delete("/:userName/delete/project/:id", verifyToken, authorizeOwner, (req, res) => deleteSectionItem(req, res, project.section, project.subSection));

// Education
router.get("/:userName/education", (req, res) => getSection(req, res, education.section));
router.put("/:userName/edit/educationsection", verifyToken, authorizeOwner, defaultMulter.none(), editEducationSection);
router.post("/:userName/add/education", verifyToken, authorizeOwner, defaultMulter.none(), addEducation);
router.put("/:userName/edit/education/:id", verifyToken, authorizeOwner, defaultMulter.none(), editEducation);
router.delete("/:userName/delete/education/:id", verifyToken, authorizeOwner, (req, res) => deleteSectionItem(req, res, education.section, education.subSection));

// Certificates
router.get("/:userName/certificates", (req, res) => getSection(req, res, certificate.section));
router.put("/:userName/edit/certificatesection", verifyToken, authorizeOwner, defaultMulter.none(), editCertificatesSection);
router.post("/:userName/add/certificate", verifyToken, authorizeOwner, defaultMulter.single('image'), addCertificate);
router.put("/:userName/edit/certificate/:id", verifyToken, authorizeOwner, defaultMulter.single('image'), editCertificate);
router.delete("/:userName/delete/certificate/:id", verifyToken, authorizeOwner, (req, res) => deleteSectionItem(req, res, certificate.section, certificate.subSection));

// Techonologies
router.get("/:userName/technologies", (req, res) => getSection(req, res, technology.section));
router.put("/:userName/edit/technologiessection", verifyToken, authorizeOwner, defaultMulter.none(), editTechnologiesSection);
router.post("/:userName/add/technology", verifyToken, authorizeOwner, defaultMulter.single('image'), addTechnology);
router.put("/:userName/edit/technology/:id", verifyToken, authorizeOwner, defaultMulter.single('image'), editTechnology);
router.delete("/:userName/delete/technology/:id", verifyToken, authorizeOwner, (req, res) => deleteSectionItem(req, res, technology.section, technology.subSection));

// Contact
router.post("/:userName/send-email", sendContactSectionEmail);
router.get("/:userName/contact", (req, res) => getSection(req, res, contact.section));
router.put("/:userName/edit/contact", verifyToken, authorizeOwner, defaultMulter.none(), editContactSection);

export default router;