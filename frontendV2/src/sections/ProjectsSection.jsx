"use client";
import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Github,
  Trash2,
  Pencil,
  Plus,
  FilePenLine,
} from "lucide-react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const ProjectsSection = ({ userName }) => {
  const {
    projectSection,
    fetchSection,
    deleteItem,
    isLoading,
    error,
  } = usePortfolioStore();
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  const handleDeleteProject = projectId => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este proyecto?"
      )
    ) {
      deleteItem(userName, projectId, "/delete/project", "projectSection", "projects");
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "projectSection", "/projects");
    }
  }, [userName]);

  if (isLoading)
    return <p className="text-center">Cargando Proyectos...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full pb-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-4">
          {projectSection?.sectionTitle?.text || "Projects Section"}
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
                {isOwner && (
                  <>
                    <FilePenLine
                      onClick={() =>
                        navigate(
                          `/portfolio/${userName}/edit-project/${project._id}`
                        )
                      }
                      className="absolute top-2 right-7 cursor-pointer text-green-400 hover:text-green-900 z-50"
                      size={20}
                    />
                    <Trash2
                      onClick={() => handleDeleteProject(project._id)}
                      className="absolute top-2 right-2 cursor-pointer text-red-600 hover:text-red-900 z-50"
                      size={20}
                    />
                  </>
                )}
                <img
                  src={
                    projectSection
                      ? project.image.url
                      : "/public/assets/default/project.jpg"
                  }
                  alt={project.name?.text || "Nombre del proyecto"}
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
                    {project.name?.text || "Nombre del proyecto"}
                  </h3>
                  <p className="text-gray-300 text-sm text-center mb-4">
                    {project.description?.text || "Descripción del proyecto"}
                  </p>
                  <div className="flex space-x-4">
                    {project.demoLink?.link && (
                      <a
                        href={project.demoLink.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {project.demoLink.text || "Ver Proyecto"}
                      </a>
                    )}
                    {project.gitHubLink?.link && (
                      <a
                        href={project.gitHubLink.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-full flex items-center"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        {project.gitHubLink.text || "Código Fuente"}
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
