"use client"

export default function AboutMe({ aboutMe }) {

	const bodyTextStyle = {
		fontWeight: aboutMe.bodyText?.isBold ? "bold" : "normal", // Asegura que bodyText existe
		fontSize: aboutMe.bodyText?.size + "px",
		color: aboutMe.bodyText?.color,
		fontFamily: aboutMe.bodyText?.font,
		fontStyle: aboutMe.bodyText?.isItalic ? "italic" : "normal"
	};

	return (
		<div>
			<h1>About Me</h1>
			<p style={bodyTextStyle}>
				{aboutMe.bodyText?.text}
			</p>
		</div>
	);
}
