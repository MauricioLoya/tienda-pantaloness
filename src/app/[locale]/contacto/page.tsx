import React from 'react'

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">Contáctanos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Ponte en contacto con nosotros y te
          responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">
              Información de Contacto
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Dirección</h3>
                  <p className="text-gray-600">
                    Av. Principal 123, Colonia Centro
                  </p>
                  <p className="text-gray-600">Ciudad de México, CP 12345</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Teléfono</h3>
                  <p className="text-gray-600">+52 (55) 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">contacto@tiendapantalones.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Horario de Atención</h3>
                  <p className="text-gray-600">
                    Lunes a Viernes: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600">Sábados: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Envíanos un Mensaje</h2>

            <form>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nombre completo</span>
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Asunto</span>
                </label>
                <select className="select select-bordered w-full">
                  <option disabled selected>
                    Selecciona un asunto
                  </option>
                  <option>Información de productos</option>
                  <option>Pedidos y entregas</option>
                  <option>Devoluciones</option>
                  <option>Atención al cliente</option>
                  <option>Otros</option>
                </select>
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Mensaje</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Encuéntranos</h2>
        <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
          {/* Replace the iframe with your actual Google Maps embed code */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Mapa de ubicación aquí</p>
            {/* 
            Example:
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!..." 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
            */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
