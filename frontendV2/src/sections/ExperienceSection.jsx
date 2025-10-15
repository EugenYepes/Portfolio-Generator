import React, { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus, Trash2, FilePenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExperienceSection = ({ userName }) => {
  const {
    experienceSection,
    fetchSection,
    deleteItem,
    isLoading,
    error,
  } = usePortfolioStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  const handleDeleteExperience = experienceId => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta experiencia?"
      )
    ) {
      deleteItem(userName, experienceId, "/delete/experience", "experienceSection", "experiences");
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "experienceSection", "/experience");
    }
  }, [userName]);

  if (isLoading) return <p>Cargando Experiencia...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-6">
        {experienceSection && experienceSection.sectionTitle
          ? experienceSection.sectionTitle.text
          : "Experience Section"}
        {isOwner && (
          <>
            <Pencil
              onClick={() =>
                navigate(`/portfolio/${userName}/edit-experience`)
              }
              className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
              size={24}
            />
            <Plus
              onClick={() =>
                navigate(`/portfolio/${userName}/add-experience`)
              }
              className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
              size={40}
            />
          </>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experienceSection &&
        experienceSection.experiences &&
        experienceSection.experiences.length > 0 ? (
          experienceSection.experiences.map((exp, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col justify-between"
            >
              <div>
                <h4 className="text-2xl font-bold dark:text-white">
                  {exp.workName.text || "Nombre de la experiencia"}
                </h4>
                <span className="italic text-gray-400">
                  {exp.date.from || "Fecha inicio"} -{" "}
                  {exp.date.to || "Fecha fin"}
                </span>
                <p className="text-left text-lg font-medium text-gray-900 dark:text-white">
                  {exp.description.text || "Descripción de la experiencia"}
                </p>
              </div>
              {isOwner && (
                <div className="flex justify-end gap-4 mt-4">
                  <FilePenLine 
                    onClick={() => navigate(`/portfolio/${userName}/edit-experience/${exp._id}`)}
                    className="cursor-pointer text-green-400 hover:text-green-900"
                    size={20}
                  />
                  <Trash2
                    onClick={() => handleDeleteExperience(exp._id)}
                    className="cursor-pointer text-red-600 hover:text-red-900"
                    size={20}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-300">
            No se ha agregado información de experiencia.
          </p>
        )}
      </div>
    </div>
  );
}  

export default ExperienceSection;
