import multer from 'multer';
import path from 'path';
import Portfolio from "../models/portfolio.model.js";

const presentationImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/presentation";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			const { userName } = req.params;
			const sectionId = await Portfolio.findOne(
				{ "user.userName": userName },
				{ "presentationSection._id": 1 } // Only includes presentationSection._id in the result
			).lean();

			const id = sectionId?.presentationSection?._id;

			// Generate the filename: "userId-sectionId.extension"
			const ext = path.extname(file.originalname); // Get the file extension
			const filename = `${userName}-${id}${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const addProjectImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/projects";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			// Generate temp file name
			const ext = path.extname(file.originalname);
			const filename = `temp${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const editProjectImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/projects";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			const { id, userName } = req.params;


			// Generate the filename: "userId-sectionId.extension"
			const ext = path.extname(file.originalname); // Get the file extension
			const filename = `${userName}-${id}${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const addCertificateImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/certificates";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			// Generate temp file name
			const ext = path.extname(file.originalname);
			const filename = `temp${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const editCertificateImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/certificates";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			const { id, userName } = req.params;


			// Generate the filename: "userId-sectionId.extension"
			const ext = path.extname(file.originalname); // Get the file extension
			const filename = `${userName}-${id}${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const addTechnologyImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/technologies";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			// Generate temp file name
			const ext = path.extname(file.originalname);
			const filename = `temp${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

const editTechnologyImage = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			req.imageBasePath = "storage/technologies";
			cb(null, req.imageBasePath);
		},
		filename: async (req, file, cb) => {
			const { id, userName } = req.params;


			// Generate the filename: "userId-sectionId.extension"
			const ext = path.extname(file.originalname); // Get the file extension
			const filename = `${userName}-${id}${ext}`;

			req.imagePath = `${req.imageBasePath}/${filename}`;
			cb(null, filename);
		}
	})
});

export { presentationImage, addProjectImage, editProjectImage, addCertificateImage, editCertificateImage, addTechnologyImage, editTechnologyImage };