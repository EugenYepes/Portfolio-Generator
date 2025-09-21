import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFromBuffer = (buffer, folder, publicId) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder, public_id: publicId },
			(error, result) => {
				if (error) return reject(error);
				resolve(result);
			}
		);
		stream.end(buffer);
	});
};

export const deleteImage = async (publicId) => {
	const result = await cloudinary.uploader.destroy(publicId);

	if (result.result !== "ok") {
		throw new PortfolioError(500, `Cloudinary failed to delete image: ${publicId}`);
	}
}
