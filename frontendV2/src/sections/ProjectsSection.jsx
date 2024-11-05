"use client";
import React, { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectsSection = ({ userName }) => {
  const { projectSection, fetchProjectSection, isLoading, error } = usePortfolioStore();
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  useEffect(() => {
    if (userName) {
      fetchProjectSection(userName);
    }
  }, [userName, fetchProjectSection]);

  if (isLoading)
    return <p className="text-center">Cargando Proyectos...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full pb-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-4">
          {projectSection
            ? projectSection.sectionTitle.text
            : "Projects Section"}
          {isOwner && (
            <>
              <Pencil
                onClick={() =>
                  navigate(`/portfolio/${userName}/edit-projects`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={24}
              />
              <Plus
                onClick={() =>
                  navigate(`/portfolio/${userName}/add-project`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={40}
              />
            </>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projectSection &&
          projectSection.projects &&
          projectSection.projects.length > 0 ? (
            projectSection.projects.map((project, index) => (
              <div
                key={project._id || index}
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ height: "400px", width: "100%" }}
              >
                <img
                  src={
                    project.image?.image ||
                    "/placeholder.svg?height=400&width=600"
                  }
                  alt={project.name || "Nombre del proyecto"}
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-6 transition-opacity duration-300 ${
                    hoveredProject === index
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {project.name || "Nombre del proyecto"}
                  </h3>
                  <p className="text-gray-300 text-sm text-center mb-4">
                    {project.description ||
                      "Descripción del proyecto"}
                  </p>
                  <div className="flex space-x-4">
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Proyecto
                      </a>
                    )}
                    {project.gitHubLink && (
                      <a
                        href={project.gitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-full flex items-center"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Código Fuente
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300 col-span-full">
              No hay proyectos disponibles.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
