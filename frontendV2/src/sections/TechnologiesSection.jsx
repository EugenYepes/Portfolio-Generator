import React, { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnologiesSection = ({ userName }) => {
  const {
    technologySection,
    fetchSection,
    deleteItem,
    isLoading,
    error,
  } = usePortfolioStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  const handleDeleteTechnology = technologyId => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta tecnología?"
      )
    ) {
      deleteItem(userName, technologyId, "/delete/technology", "technologySection", "technologies");
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "technologySection", "/technologies");
    }
  }, [userName]);

  if (isLoading) return <p>Cargando tecnologías...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div>
        <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-4">
          {technologySection
            ? technologySection.sectionTitle.text
            : "Technology Section"}
          {isOwner && (
            <>
              <Pencil
                onClick={() =>
                  navigate(`/portfolio/${userName}/edit-skills`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={24}
              />
              <Plus
                onClick={() =>
                  navigate(`/portfolio/${userName}/add-technology`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={40}
              />
            </>
          )}
        </h2>
      </div>

      {technologySection?.technologies?.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-8 max-w-screen-lg">
            {technologySection.technologies.map((tech, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-lg transform transition-transform hover:scale-105"
              >
                <div className="w-20 h-20 dark:bg-gray-800 flex items-center justify-center rounded-md">
                  <img
                    src={
                      technologySection
                        ? tech.image?.url
                        : "/public/assets/default/technology.jpg"
                    }
                    className="h-16 w-16 object-contain transition-all duration-300 rounded-lg filter grayscale hover:grayscale-0"
                    alt={tech.name.text}
                  />
                </div>
                <p className="text-lg font-bold text-white dark:text-white mt-4">
                  {tech.name.text}
                </p>
                {isOwner && (
                  <Trash2
                    onClick={() => handleDeleteTechnology(tech._id)}
                    className="absolute bottom-2 right-2 cursor-pointer text-red-600 hover:text-blue-600"
                    size={14}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-300 col-span-full">
          No hay tecnologías disponibles.
        </p>
      )}
    </section>
  );
};

export default TechnologiesSection;
