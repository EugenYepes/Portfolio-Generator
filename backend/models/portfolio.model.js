import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema({
	text: { type: String, default: "Esto es un titulo por default!" },
	isBold: { type: Boolean, default: true },
	size: { type: Number, default: 22 },
	color: { type: String, default: "black" },
	font: { type: String, default: "Arial" },
	isItalic: { type: Boolean, default: false },
}, { _id: false });

//* Al usar timestamps agrega automáticamente dos campos a cada documento de la colección: 
//* createdAt: Registra la fecha y hora en que se creó el documento.
//* updatedAt: Registra la fecha y hora en que se actualizó por última vez el documento.
//* _id: true lo que hace es generar un _id para este subdocumento
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	userName: { type: String, required: true, unique: true },
	lastLogin: { type: Date, default: Date.now },
	isVerified: { type: Boolean, default: false },
	resetPasswordToken: String,//?  Almacena un token que se genera cuando un usuario solicita restablecer su contraseña -> Se utiliza para verificar que el usuario tenga permiso para cambiar la contraseña.
	resetPasswordExperiesAt: Date,//? Define la fecha y hora en la que expira el resetPasswordToken -> Esto asegura que el enlace para restablecer la contraseña solo sea válido por un período de tiempo limitado.
	verificationToken: String,//? Almacena un token que se genera cuando un usuario se registra -> Este token se envía al correo electrónico del usuario para verificar su dirección de correo y activar su cuenta.
	verificationTokenExpiresAt: Date,//? Define la fecha y hora en la que expira el verificationToken. -> Asegura que el token de verificación solo sea válido por un tiempo limitado.
}, { timestamps: true }, { _id: true })

const TextSchema = new mongoose.Schema({
	text: { type: String, default: "Esto es el texto por default!" },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
	color: { type: String, default: "black" },
	font: { type: String, default: "Arial" },
	isItalic: { type: Boolean, default: false },
}, { _id: false });

const LinkSchema = new mongoose.Schema({
	text: { type: String, default: "esto es un link" },
	link: { type: String, default: "https://www.google.com/" },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
}, { _id: false });

const DateSchema = new mongoose.Schema({
	from: { type: String, default: "20/12/2022" },
	to: { type: String, default: () => new Date().toLocaleDateString("es-ES") },
	isBold: { type: Boolean, default: false },
	size: { type: Number, default: 12 },
}, { _id: false });

const ImageSchema = new mongoose.Schema({
	url: { type: String, default: "image", get: (v) => `${process.env.BASE_URL}${v}` },
}, { _id: false, toJSON: { getters: true }, toObject: { getters: true } });

const PortfolioSchema = new mongoose.Schema({
	user: { type: userSchema, default: () => ({}) },
	presentationSection: {
		name: {
			type: TitleSchema, default: () => ({
				text: "User Full Name"
			})
		},
		rol: {
			type: TextSchema, default: () => ({
				text: "I'm a developer!"
			})
		},
		image: {
			type: ImageSchema, default: () => ({
				url: "portfolio/presentation/default-presentation.jpg"
			})
		},
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	aboutMeSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Acerca de mí"
			})
		},
		bodyText: {
			type: TextSchema, default: () => ({
				text: "This sections its to talk about me!"
			})
		},
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	experienceSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mi Experiencia"
			})
		},
		experiences: [
			{
				workName: {
					type: TextSchema, default: () => ({
						text: "Experience"
					})
				},
				description: { type: TextSchema, default: () => ({}) },
				date: { type: DateSchema, default: () => ({}) },
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
			},
		],
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	projectSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mis Proyectos"
			})
		},
		projects: [
			{
				name: {
					type: TextSchema, default: () => ({
						text: "Un proyecto"
					})
				},
				description: {
					type: TextSchema, default: () => ({
						text: "Mi primer proyecto"
					})
				},
				image: {
					type: ImageSchema, default: () => ({
						url: "portfolio/projects/default-project.jpg"
					})
				},
				demoLink: {
					type: LinkSchema, default: () => ({
						text: "link",
						link: "https://www.google.com/"
					})
				},
				gitHubLink: {
					type: LinkSchema, default: () => ({
						text: "Git Hub",
						link: "https://github.com/"
					})
				},
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
			},
		],
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	educationSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mi Educación"
			})
		},
		educations: [
			{
				name: {
					type: TextSchema, default: () => ({
						text: "Curso de programacion"
					})
				},
				description: { type: TextSchema, default: () => ({}) },
				date: { type: DateSchema, default: () => ({}) },
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
			},
		],
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	certificateSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mis Certificados"
			})
		},
		certificates: [
			{
				name: {
					type: TextSchema, default: ({
						text: "Certificado Scrumm"
					})
				},
				description: { type: TextSchema, default: () => ({}) },
				image: {
					type: ImageSchema, default: () => ({
						url: "portfolio/certificates/default-certificate.jpg"
					})
				},
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
			}
		],
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	technologySection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Skills"
			})
		},
		technologies: [
			{
				name: {
					type: TextSchema, default: ({
						text: "Java Script"
					})
				},
				image: {
					type: ImageSchema, default: () => ({
						url: "portfolio/technologies/default-technology.jpg"
					})
				},
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
			}
		],
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	},
	contactSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Contactame"
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
				text: "GitHub"
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
		bodyText: {
			type: TextSchema, default: () => ({
				text: "This sections its for contact me!"
			})
		},
		_id: { type: mongoose.Schema.Types.ObjectId, auto: true }
	}
});

const Portfolio = mongoose.model(
	"Portfolio",
	PortfolioSchema,
	"portfolio"
);

export const presentation = { section: "presentationSection" };
export const aboutMe = { section: "aboutMeSection" };
export const experience = { section: "experienceSection", subSection: "experiences" };
export const project = { section: "projectSection", subSection: "projects"  };
export const education = { section: "educationSection", subSection: "educations"  };
export const certificate = { section: "certificateSection", subSection: "certificates"  };
export const technology = { section: "technologySection", subSection: "technologies"  };
export const contact = { section: "contactSection" };

export default Portfolio;