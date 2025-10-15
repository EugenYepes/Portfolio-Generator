import React, { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus, Trash2, FilePenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EducationSection = ({ userName }) => {
  const {
    educationSection,
    fetchSection,
    deleteItem,
    isLoading,
    error,
  } = usePortfolioStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  const handleDeleteEducation = educationId => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta educación?"
      )
    ) {
      deleteItem(userName, educationId, "/delete/education", "educationSection", "educations");
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "educationSection", "/education");
    }
  }, [userName]);

  if (isLoading) return <p>Cargando Educación...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div>
        <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-4">
          {educationSection
            ? educationSection.sectionTitle.text
            : "Education Section"}
          {isOwner && (
            <>
              <Pencil
                onClick={() =>
                  navigate(`/portfolio/${userName}/edit-education`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={24}
              />
              <Plus
                onClick={() =>
                  navigate(`/portfolio/${userName}/add-education`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={40}
              />
            </>
          )}
        </h2>
      </div>

      {educationSection?.educations?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationSection.educations.map((edu, index) => (
            <div key={index} className="relative p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="text-2xl font-bold dark:text-white">
                {edu.name.text}
                {isOwner && (
                  <>
                    <FilePenLine 
                      onClick={() => navigate(`/portfolio/${userName}/edit-education/${edu._id}`)}
                      className="absolute bottom-2 right-7 cursor-pointer text-green-400 hover:text-green-900"
                      size={20}
                    />
                    <Trash2
                      onClick={() => handleDeleteEducation(edu._id)}
                      className="absolute bottom-2 right-2 cursor-pointer text-red-600 hover:text-red-900"
                      size={20}
                    />
                  </>
                )}
              </h4>
              <span className="italic text-gray-400">
                {edu.date.from || "Fecha inicio"} -{" "}
                {edu.date.to || "Fecha fin"}
              </span>
              <p className="text-left text-lg font-medium text-gray-900 dark:text-white">
                {edu.description.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 col-span-full">
          No hay registros de educación disponibles.
        </p>
      )}
    </section>
  );
};

export default EducationSection;
