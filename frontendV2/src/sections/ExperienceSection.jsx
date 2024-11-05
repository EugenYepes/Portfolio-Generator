import React, { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExperienceSection = ({ userName }) => {
  const {
    experienceSection,
    fetchExperienceSection,
    isLoading,
    error,
  } = usePortfolioStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  useEffect(() => {
    if (userName) {
      fetchExperienceSection(userName);
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
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <h4 className="text-2xl font-bold dark:text-white">
                {exp.workName.text || "Nombre de la experiencia"}
              </h4>
              <span className="italic">
                {exp.date.from || "Fecha inicio"} -{" "}
                {exp.date.to || "Fecha fin"}
              </span>
              <p className="text-left text-lg font-medium text-gray-900 dark:text-white">
                {exp.description.text ||
                  "Descripción de la experiencia"}
              </p>
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
};

export default ExperienceSection;
