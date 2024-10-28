"use client"

export default function Education({ education }) {

    return (
        <div>
            <h1>Experiencia</h1>
            <ul>
                {experiences.map(experience => 
                    <li>
                        <div>
                            <h1>{experience.workName.text}</h1>
                            <h2>{experience.description.text}</h2>
                            <h2>{education.date.from} - {education.date.to}</h2>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}