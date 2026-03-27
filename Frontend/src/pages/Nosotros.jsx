import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              🐾 Quiénes somos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nosotros
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Cuidamos de tus mascotas con dedicación y amor. Promovemos la adopción responsable y el bienestar animal.
            </p>
          </div>
        </div>
      </Hero>

      {/* Misión y Visión */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Misión */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Brindar servicios veterinarios de calidad, impulsar el bienestar animal y conectar familias con sus futuras mascotas a través de la adopción responsable.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser un referente en atención veterinaria, protección animal y adopción responsable en nuestra comunidad, creando un mundo donde cada mascota tenga un hogar lleno de amor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro equipo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              EQUIPO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Profesionales apasionados
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Detrás de Latidos & Patitas hay un equipo de personas comprometidas con el bienestar animal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Miembro 1 */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
                alt="Veterinaria"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Dra. Ana Martínez</h3>
                <p className="text-emerald-600 font-medium mb-3">Veterinaria principal</p>
                <p className="text-gray-600 text-sm">
                  Especialista en pequeñas especies con más de 10 años de experiencia.
                </p>
              </div>
            </div>

            {/* Miembro 2 */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80"
                alt="Veterinario"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Dr. Carlos Reyes</h3>
                <p className="text-emerald-600 font-medium mb-3">Cirujano veterinario</p>
                <p className="text-gray-600 text-sm">
                  Experto en procedimientos quirúrgicos y cuidados intensivos.
                </p>
              </div>
            </div>

            {/* Miembro 3 */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80"
                alt="Cuidadora"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Laura Gómez</h3>
                <p className="text-emerald-600 font-medium mb-3">Coordinadora de adopciones</p>
                <p className="text-gray-600 text-sm">
                  Encargada de encontrar el hogar perfecto para cada mascota.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              VALORES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Lo que nos define
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '❤️', title: 'Amor', desc: 'Tratamos a cada mascota como si fuera nuestra.' },
              { icon: '🤝', title: 'Compromiso', desc: 'Responsabilidad y dedicación en cada acción.' },
              { icon: '🌟', title: 'Excelencia', desc: 'Buscamos siempre la mejor atención.' },
              { icon: '🏡', title: 'Hogar', desc: 'Trabajamos por una familia para cada animal.' },
            ].map((v) => (
              <div key={v.title} className="bg-emerald-50 p-6 rounded-2xl text-center hover:shadow-md transition-shadow">
                <span className="text-4xl mb-3 block">{v.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="py-16 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Quieres saber más?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a dar el siguiente paso.
          </p>
          <a href="#contacto">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform hover:-translate-y-1">
              Contáctanos
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}