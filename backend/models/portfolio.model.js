import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema({
	text: { type: String, default: "Esto es un titulo por default!" },
	isBold: { type: Boolean, default: true },
	size: { type: Number, default: 22 },
	color: { type: String, default: "black" },
	font: { type: String, default: "Arial" },
	isItalic: { type: Boolean, default: false },
}, {_id: false});

//* Al usar timestamps agrega automáticamente dos campos a cada documento de la colección: 
//* createdAt: Registra la fecha y hora en que se creó el documento.
//* updatedAt: Registra la fecha y hora en que se actualizó por última vez el documento.
//* _id: true lo que hace es generar un _id para este subdocumento
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  name: { type: String },
  userName: { type: String, required: true, unique: true },
  lastLogin: {type: Date, default: Date.now},
  isVerified: {type: Boolean, default: false},
  resetPasswordToken: String,//?  Almacena un token que se genera cuando un usuario solicita restablecer su contraseña -> Se utiliza para verificar que el usuario tenga permiso para cambiar la contraseña.
  resetPasswordExperiesAt: Date,//? Define la fecha y hora en la que expira el resetPasswordToken -> Esto asegura que el enlace para restablecer la contraseña solo sea válido por un período de tiempo limitado.
  verificationToken: String,//? Almacena un token que se genera cuando un usuario se registra -> Este token se envía al correo electrónico del usuario para verificar su dirección de correo y activar su cuenta.
  verificationTokenExpiresAt: Date,//? Define la fecha y hora en la que expira el verificationToken. -> Asegura que el token de verificación solo sea válido por un tiempo limitado.
},{timestamps: true}, { _id: true })

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
	user: { type: userSchema, default: () => ({})},
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
				image: "storage/profile_picture/default_profile.jpg"
			})
		},
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
	},
	experienceSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mi Experiencia"
			})
		},
		experiences: [
			{
				workName: { type: TextSchema, default: () => ({
					text: "Experience"
				}) },
				description: { type: TextSchema, default: () => ({}) },
				date: { type: DateSchema, default: () => ({}) },
			},
		],
	},
	educationSection: {
		sectionTitle: {
			type: TitleSchema, default: () => ({
				text: "Mi Educación"
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
				text: "Mis Certificados"
			})
		},
		certificates: [
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
				text: "Mis Proyectos"
			})
		},
		projects: [
			{
				name: { type: String, default: "" },
				description: { type: String, default: "" },
				image: { type: ImageSchema, default: () => ({}) },
				demoLink: { type: String, default: "" },
				gitHubLink: { type: String, default: "" },
			},
		],
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
	},
});

const Portfolio = mongoose.model(
	"Portfolio",
	PortfolioSchema,
	"portfolio"
);

export default Portfolio;