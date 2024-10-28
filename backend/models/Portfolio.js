import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema({
	text: { type: String, default: "Esto es un titulo por default!" },
	isBold: { type: Boolean, default: true },
	size: { type: Number, default: 22 },
	color: { type: String, default: "black" },
	font: { type: String, default: "Arial" },
	isItalic: { type: Boolean, default: false },
});

const TextSchema = new mongoose.Schema({
	text: { type: String, default: "Esto es el texto por default!" },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
	color: { type: String, default: "black" },
	font: { type: String, default: "Arial" },
	isItalic: { type: Boolean, default: false },
});

const LinkSchema = new mongoose.Schema({
	text: { type: String, default: "esto es un link" },
	link: { type: String, default: "google.com" },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
});

const DateSchema = new mongoose.Schema({
	from: { type: String, default: "20/12/2022" },
	to: { type: String, default: () => new Date().toLocaleDateString("es-ES") },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
});

const ImageSchema = new mongoose.Schema({
	image: { type: String, default: "iamge" },
});

const PortfolioSchema = new mongoose.Schema({
	user: {
		userName: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		hashPassword: { type: String, required: true },
	},
	presentationSection: {
		name: {
			type: TitleSchema, default: () => ({
				text: "Juan"
			})
		},
		text: {
			type: TitleSchema, default: () => ({
				text: "I'm a developer!"
			})
		},
		image: {
			type: ImageSchema, default: () => ({
				image: "storage/profile_picture/default_profile.jpg"
			})
		},
	},
	aboutMeSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "About Me"
			})
		},
		bodyText: {
			type: TextSchema, default: () => ({
				text: "This sections its to talk about me!"
			})
		},
	},
	experienceSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Work Experience"
			})
		},
		experiences: [
			{
				workName: { type: TextSchema, default: () => ({}) },
				description: { type: TextSchema, default: () => ({}) },
				date: { type: DateSchema, default: () => ({}) },
			},
		],
	},
	educationSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Education"
			})
		},
		educations: [
			{
				name: { type: TextSchema, default: () => ({}) },
				description: { type: TextSchema, default: () => ({}) },
				date: { type: DateSchema, default: () => ({}) },
			},
		],
	},
	certificateSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Certificates"
			})
		},
		cetificates: [
			{
				name: { type: String, default: "" },
				image: { type: ImageSchema, default: () => ({}) },
				description: { type: TextSchema, default: () => ({}) },
			}
		]
	},
	technologySection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Skills"
			})
		},
		technologies: [
			{
				name: { type: String, default: "" },
				image: { type: ImageSchema, default: () => ({}) },
			},
		],
	},
	projectSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Projects"
			})
		},
		projects: [
			{
				name: { type: String, default: "" },
				description: { type: String, default: "" },
				image: { type: ImageSchema, default: () => ({}) },
			},
		],
	},
	contactSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Contact"
			})
		},
		mailTitle: {
			type: TitleSchema, default: () => ({
				text: "Mail"
			})
		},
		mail: { type: TextSchema, default: () => ({}) },
		linkdinTitle: {
			type: TitleSchema, default: () => ({
				text: "Linkdin"
			})
		},
		linkedin: {
			type: LinkSchema, default: () => ({
				text: "Linkdin",
				link: "https://www.linkedin.com/"
			})
		},
		githubTitle: {
			type: TitleSchema, default: () => ({
				text: "GitBub"
			})
		},
		github: {
			type: LinkSchema, default: () => ({
				text: "GitHub",
				link: "https://github.com/"
			})
		},
		phoneTitle: {
			type: TitleSchema, default: () => ({
				text: "Phone"
			})
		},
		phone: {
			type: TextSchema, default: () => ({
				text: "11 2211 2211"
			})
		},
		locationTitle: {
			type: TitleSchema, default: () => ({
				text: "Location"
			})
		},
		location: {
			type: TextSchema, default: () => ({
				text: "Chipre"
			})
		},
	},
});

const Portfolio = mongoose.model(
	"Portfolio",
	PortfolioSchema,
	"portfolio"
);

export default Portfolio;