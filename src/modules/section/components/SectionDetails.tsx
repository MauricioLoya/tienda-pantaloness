import React from "react";
import DisplayInfo from "@/lib/components/DisplayInfo";
import { SectionItem } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";

type Props = {
  section: SectionItem;
  region?: RegionItem;
};

const SectionDetails: React.FC<Props> = ({ section, region }) => {
  return (
    <div className="container mx-auto p-4">

      {section.type === "banner" && section.backgroundUrl && (
        <div
          className="hero h-96 bg-cover bg-center rounded-lg mb-6 relative overflow-hidden"
          style={{
            backgroundImage: `url(${section.backgroundUrl})`,
            backgroundColor: section.backgroundColor,
          }}
        >
          <div className="hero-overlay bg-opacity-50"></div>
          <div className="hero-content text-neutral-content">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold">{section.title}</h2>
              <p className="mt-4">{section.description}</p>
              {section.actionUrl && (
                <a href={section.actionUrl} className="btn btn-primary mt-4">
                  {section.buttonText || "Ir a la sección"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vista tipo Highlight */}
      {section.type === "highlight" && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            {section.title}
          </h2>
          <p className="text-white mb-4">{section.description}</p>
          {section.actionUrl && (
            <a href={section.actionUrl} className="btn btn-secondary">
              {section.buttonText || "Ver más"}
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Información General */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <DisplayInfo
            info={[
              { label: "Título", value: section.title },
              { label: "Descripción", value: section.description },
              { label: "Tipo", value: section.type },
              { label: "Orden", value: section.order },
              {
                label: "Región",
                value: region ? `${region.flag} ${region.name}` : "No asignada",
              },
            ]}
          />
        </div>

        {/* Apariencia y Acción */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Apariencia y Acción</h2>
          <DisplayInfo
            info={[
              {
                label: "Fondo",
                value: section.backgroundUrl ? (
                  <img
                    src={section.backgroundUrl}
                    alt="Fondo"
                    className="w-24 h-24 object-cover rounded border"
                  />
                ) : (
                  "No asignado"
                ),
              },
              {
                label: "Color de Fondo",
                value: (
                  <span
                    style={{ backgroundColor: section.backgroundColor }}
                    className="px-3 py-1 rounded text-white"
                  >
                    {section.backgroundColor}
                  </span>
                ),
              },
              {
                label: "URL de Acción",
                value: section.actionUrl || "No asignada",
              },
              {
                label: "Texto del Botón",
                value: section.buttonText || "No asignado",
              },
              {
                label: "Color del Botón",
                value: section.buttonColor || "No asignado",
              },
            ]}
          />
        </div>
      </div>

      {section.type === "highlight" &&
        section.highlightProducts &&
        section.highlightProducts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.highlightProducts.map((prod) => (
                <div
                  key={prod.slug}
                  className="card bg-base-100 shadow-xl rounded-lg overflow-hidden"
                >
                  <figure>
                    <img
                      src={prod.imageUrl || "/placeholder.jpg"}
                      alt={prod.name}
                      className="w-full h-40 object-cover"
                    />
                  </figure>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{prod.name}</h3>
                    <p className="text-sm text-gray-600">{prod.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Información Adicional</h2>
      </div>
    </div>
  );
};

export default SectionDetails;
