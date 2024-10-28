"use client"
import Link from "next/link"

export default function Contact({ contact }) {
    return (
        <div>
            <h1 style={{ fontWeight: contact.sectionTitle.isBold ? 'bold' : 'normal', fontSize: contact.sectionTitle.size }}>
                {contact.sectionTitle.text}
            </h1>
            <ul>
                <li>
                    <p style={{ fontWeight: contact.mailTitle.isBold ? 'bold' : 'normal', fontSize: contact.mailTitle.size }}>
                        {contact.mailTitle.text}:
                    </p>
                    <p>{contact.mail.text}</p>
                </li>
                <li>
                    <p style={{ fontWeight: contact.linkdinTitle.isBold ? 'bold' : 'normal', fontSize: contact.linkdinTitle.size }}>
                        {contact.linkdinTitle.text}:
                    </p>
                    <Link href={contact.linkedin.link}>
                        {contact.linkedin.text}
                    </Link>
                </li>
                <li>
                    <p style={{ fontWeight: contact.githubTitle.isBold ? 'bold' : 'normal', fontSize: contact.githubTitle.size }}>
                        {contact.githubTitle.text}:
                    </p>
                    <Link href={contact.github.link}>
                        {contact.github.text}
                    </Link>
                </li>
                <li>
                    <p style={{ fontWeight: contact.phoneTitle.isBold ? 'bold' : 'normal', fontSize: contact.phoneTitle.size }}>
                        {contact.phoneTitle.text}:
                    </p>
                    <p>{contact.phone.text}</p>
                </li>
                <li>
                    <p style={{ fontWeight: contact.locationTitle.isBold ? 'bold' : 'normal', fontSize: contact.locationTitle.size }}>
                        {contact.locationTitle.text}:
                    </p>
                    <p>{contact.location.text}</p>                        
                </li>
            </ul>
        </div>
    )
}