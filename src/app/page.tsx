export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BeautySaaS</h1>
              <p className="text-gray-600 mt-1">
                Plataforma de Gestión 360° para Salones y Bienestar
              </p>
            </div>
            <div className="flex gap-4">
              <button className="btn-outline">Iniciar Sesión</button>
              <button className="btn-primary">Comenzar Gratis</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Profesionaliza tu Salón
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Una plataforma integral SaaS diseñada para estéticas, barberías,
            spas y estudios de uñas. Garantiza rentabilidad, protege a tus
            clientes y escala tu negocio con IA.
          </p>
          <button className="btn-primary text-lg px-8 py-3">
            Solicitar Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Módulos Principales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="text-3xl mb-4">📅</div>
              <h4 className="text-xl font-bold mb-2">Tiempo y Staff</h4>
              <p className="text-gray-600">
                Calendario dinámico, gestión de niveles y disponibilidad en
                tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="text-3xl mb-4">💰</div>
              <h4 className="text-xl font-bold mb-2">Finanzas</h4>
              <p className="text-gray-600">
                Depósitos obligatorios, rastreo de pagos y cierre de caja
                automático.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="text-3xl mb-4">🏥</div>
              <h4 className="text-xl font-bold mb-2">CRM Médico</h4>
              <p className="text-gray-600">
                Expediente digital, historial médico y check-in por QR.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card">
              <div className="text-3xl mb-4">🎁</div>
              <h4 className="text-xl font-bold mb-2">Fidelización</h4>
              <p className="text-gray-600">
                Sistema de rewards configurable con IA de optimización.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tu negocio?
          </h3>
          <p className="text-xl text-purple-100 mb-8">
            Únete a cientos de salones que ya confían en BeautySaaS.
          </p>
          <button className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">BeautySaaS</h4>
              <p className="text-sm">
                Plataforma de gestión para salones y bienestar.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Producto</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Precios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 BeautySaaS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
