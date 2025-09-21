import React, { useEffect, useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const presentationSectionSection = ({ userName }) => {
  const {
    presentationSection,
    fetchSection,
    isLoading,
    error,
  } = usePortfolioStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = isAuthenticated && user?.userName === userName;

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "presentationSection", "/presentation");
    }
  }, [userName]);

  if (isLoading) return <p>Cargando Proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      <div className="text-center md:text-left">
        <h1 className="text-5xl text-white font-extrabold dark:text-white">
          Hola, soy{" "}
          {presentationSection
            ? presentationSection.name.text
            : "Nombre completo"}
          <small className="text-3xl ms-2 font-semibold text-gray-500 dark:text-gray-400">
            {presentationSection
              ? presentationSection.rol.text
              : "Rol por defecto!"}
            {isOwner && (
              <Pencil
                onClick={() =>
                  navigate(`/portfolio/${userName}/edit-presentation`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={24}
              />
            )}
          </small>
        </h1>
      </div>
      <img
        src={
          presentationSection
            ? presentationSection.image.url
            : "/assets/default/presentation.jpg"
        }
        alt={`${presentationSection ? presentationSection.name.text : "User"
          } Avatar`}
        className="w-64 h-64 rounded-full object-cover"
      />
    </div>
  );
};

export default presentationSectionSection;
