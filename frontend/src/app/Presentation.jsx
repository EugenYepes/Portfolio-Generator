"use client"

export default function Presentation({ presentation }) {
    const bodyTextStyle = {
        fontWeight: presentation.bodyText?.isBold ? "bold" : "normal", // Asegura que bodyText existe
        fontSize: presentation.bodyText?.size + "px",
        color: presentation.bodyText?.color,
        fontFamily: presentation.bodyText?.font,
        fontStyle: presentation.bodyText?.isItalic ? "italic" : "normal"
      };

    return (
        <div>
            <h1>Presentación</h1>
            <p style={bodyTextStyle}>
                {presentation.text.text}
            </p>
            <img src={presentation.image.image}/>
        </div>
    );
}