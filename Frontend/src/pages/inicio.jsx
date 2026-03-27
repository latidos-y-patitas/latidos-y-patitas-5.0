import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';

export default function Inicio() {
  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section - Rediseñado con más personalidad */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-white/30">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              🐾 Bienvenido a Latidos & Patitas
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Cuidamos a tus mascotas{' '}
              <span className="text-emerald-600">como si fueran nuestras</span>
            </h2>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              En Latidos & Patitas ofrecemos atención veterinaria de calidad y promovemos la adopción responsable.
              Tu mascota merece lo mejor.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#citas">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                  Agendar Cita 🩺
                </button>
              </a>
              <a href="#adopcion">
                <button className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold transition-all transform hover:-translate-y-1 text-lg">
                  Adoptar 🐕
                </button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">+500</div>
                <div className="text-gray-600 text-sm">Mascotas felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">+10</div>
                <div className="text-gray-600 text-sm">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">24/7</div>
                <div className="text-gray-600 text-sm">Emergencias</div>
              </div>
            </div>
          </div>
        </div>
      </Hero>
      {/* Servicios - Con diseño más moderno */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              NUESTROS SERVICIOS
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
              Todo lo que tu mascota necesita
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para el bienestar de tu compañero fiel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🩺', title: 'Servicios Médicos', desc: 'Consultas, cirugías y cuidados intensivos', color: 'from-emerald-500 to-emerald-400' },
              { icon: '💉', title: 'Vacunación', desc: 'Protege a tu mascota con nuestro plan de vacunación', color: 'from-teal-500 to-teal-400' },
              { icon: '🐾', title: 'Adopción', desc: 'Encuentra un nuevo amigo que espera por ti', color: 'from-amber-500 to-amber-400' },
              { icon: '✂️', title: 'Peluquería', desc: 'Cuidado estético y bienestar para tu mascota', color: 'from-rose-500 to-rose-400' },
              { icon: '🦷', title: 'Odontología', desc: 'Cuidado dental profesional', color: 'from-indigo-500 to-indigo-400' },
              { icon: '📋', title: 'Nutrición', desc: 'Asesoramiento alimenticio personalizado', color: 'from-purple-500 to-purple-400' }
            ].map((s) => (
              <div
                key={s.title}
                className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{s.desc}</p>
                <div className="text-emerald-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                  Saber más
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: Mascotas en adopción */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              ADOPCIÓN RESPONSABLE
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
              Ellos te están esperando
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce a algunos de nuestros peludos que buscan un hogar lleno de amor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Luna', age: '2 años', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Max', age: '3 años', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Simba', age: '1 año', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
            ].map((pet) => (
              <div key={pet.name} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img
                    src={pet.img}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-gray-900">{pet.name}</h4>
                  <p className="text-gray-600 mb-4">{pet.age}</p>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors">
                    Conocer a {pet.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#adopcion">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                Ver todos en adopción 🐾
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: Testimonios */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              TESTIMONIOS
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
              Lo que dicen nuestros clientes
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Familias felices con sus compañeros de vida
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'María González', text: 'Excelente atención, mi perro fue tratado con mucho cariño. ¡Totalmente recomendados!', img: 'https://i.pravatar.cc/150?img=1' },
              { name: 'Carlos Rodríguez', text: 'Adopté a mi gato aquí y el proceso fue muy transparente y amoroso. Gracias por todo.', img: 'https://i.pravatar.cc/150?img=2' }
            ].map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-3xl shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <div className="flex text-amber-400">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada a la acción - Con nuevo estilo */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para dar el primer paso?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y dale a tu mascota la vida que se merece
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              Agendar cita ahora
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-all transform hover:-translate-y-1">
              Conocer más
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}