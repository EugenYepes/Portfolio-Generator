"use client"

export default function Experience({ experiences }) {

    return (
        <div>
            <h1>Experiencia</h1>
            {experiences.map(experience => 
                <li>
                    <div>
                        <h1>{experience.name}</h1>
                        <h2>{experience.description}</h2>
                        <h2>{experience.date.from} - {experience.date.to}</h2>
                    </div>
                </li>
            )}
        </div>
    );
}