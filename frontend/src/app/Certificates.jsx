"use client"

export default function Certificates({ certificates }) {
	return (
		<div>
			<h1>Certificados</h1>
			{certificates.map(certificado => {
				const textStyle = {
					fontWeight: certificado.description.isBold ? "bold" : "normal",
					fontSize: certificado.description.size + "px",
					color: certificado.description.color,
					fontFamily: certificado.description.font,
					fontStyle: certificado.description.isItalic ? "italic" : "normal"
				};

				// Estilos para la imagen
				const imageStyle = {
					width: "150px",  // Puedes cambiar el tamaño según tus necesidades
					height: "auto",  // Mantiene la proporción de la imagen
					borderRadius: "8px",  // Añade bordes redondeados
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"  // Añade una sombra para un mejor efecto visual
				};

				return (
					<div key={certificado._id}>
						<h3>{certificado.name}</h3>
						<img
							src={certificado.image.image}
							alt={`Certificate ${certificado.name}`}
							style={imageStyle}  // Aplica el estilo a la imagen
						/>
						<p style={textStyle}>{certificado.description.text}</p>
						<p>{certificado.image.image}</p>
					</div>
				);
			})}
		</div>
	);
}

