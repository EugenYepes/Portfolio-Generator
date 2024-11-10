import React, { useState, useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useParams, useNavigate } from "react-router-dom";

const EditProjectForm = () => {
  const { userName, projectId } = useParams(); // Asegúrate de pasar 'projectId' desde la URL
  const { projectSection, editProject, fetchProjectSection } = usePortfolioStore();
  const navigate = useNavigate();

  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
    image: {
      image: "",
    },
    demoLink: "",
    gitHubLink: "",
  });

  // Cargar los datos del proyecto existente al montar el componente
  useEffect(() => {
    if (!projectSection) {
      fetchProjectSection(userName); // Carga los proyectos si no están en el estado global
    } else {
      // Encuentra el proyecto a editar
      const project = projectSection.projects.find(proj => proj._id === projectId);
      if (project) {
        setEditedProject({
          name: project.name || "",
          description: project.description || "",
          image: { image: project.image.image || "" },
          demoLink: project.demoLink || "",
          gitHubLink: project.gitHubLink || "",
        });
      }
    }
  }, [projectId, projectSection, userName, fetchProjectSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      setEditedProject((prevProject) => ({
        ...prevProject,
        image: { image: value },
      }));
    } else {
      setEditedProject((prevProject) => ({
        ...prevProject,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editProject(userName, projectId, editedProject); // Llama a la función para editar el proyecto
    navigate(`/portfolio/${userName}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl text-white font-bold mb-6">Editar Proyecto</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Nombre del Proyecto</label>
          <input
            type="text"
            name="name"
            value={editedProject.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Descripción</label>
          <textarea
            name="description"
            value={editedProject.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Enlace de Demo</label>
          <input
            type="text"
            name="demoLink"
            value={editedProject.demoLink}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Enlace de GitHub</label>
          <input
            type="text"
            name="gitHubLink"
            value={editedProject.gitHubLink}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Imagen del Proyecto</label>
          <input
            type="text"
            name="image"
            value={editedProject.image.image}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 text-white"
            placeholder="URL de la imagen"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditProjectForm;