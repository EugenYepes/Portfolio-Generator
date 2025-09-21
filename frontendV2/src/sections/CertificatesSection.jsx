import React, { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { useAuthStore } from "../store/authStore";
import { Pencil, Plus, Trash2, FilePenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CertificatesSection = ({ userName }) => {
  const {
    certificateSection,
    fetchSection,
    deleteItem,
    isLoading,
    error,
  } = usePortfolioStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?.userName === userName;

  const handleDeleteCertificate = certificateId => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este certificado?"
      )
    ) {
      deleteItem(userName, certificateId, "/delete/certificate", "certificateSection", "certificates");
    }
  };

  useEffect(() => {
    if (userName) {
      fetchSection(userName, "certificateSection", "/certificates");
    }
  }, [userName]);

  if (isLoading) return <p>Cargando Certificados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div>
        <h2 className="text-4xl text-white font-bold text-left dark:text-white mt-8 mb-4">
          {certificateSection
            ? certificateSection.sectionTitle.text
            : "Certificates Section"}
          {isOwner && (
            <>
              <Pencil
                onClick={() =>
                  navigate(`/portfolio/${userName}/edit-certificates`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={24}
              />
              <Plus
                onClick={() =>
                  navigate(`/portfolio/${userName}/add-certificate`)
                }
                className="ml-4 inline-block cursor-pointer text-white hover:text-blue-600"
                size={40}
              />
            </>
          )}
        </h2>
      </div>

      {certificateSection?.certificates?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificateSection.certificates.map((cert, index) => (
            <div
              key={index}
              className="relative p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <img
                className="rounded-t-lg"
                src={
                  certificateSection
                    ? cert.image.url
                    : "/public/assets/default/certificate.jpg"
                }
                alt={cert.name.text}
              />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {cert.name.text}
                  {isOwner && (
                    <>
                    <FilePenLine 
                      onClick={() => navigate(`/portfolio/${userName}/edit-certificate/${cert._id}`)}
                      className="absolute bottom-2 right-7 cursor-pointer text-green-400 hover:text-green-900"
                      size={20}
                    />
                    <Trash2
                      onClick={() => handleDeleteCertificate(cert._id)}
                      className="absolute bottom-2 right-2 cursor-pointer text-red-600 hover:text-red-900"
                      size={20}
                    />
                  </>
                  )}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {cert.description.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 col-span-full">
          No hay certificados disponibles.
        </p>
      )}
    </section>
  );
};

export default CertificatesSection;