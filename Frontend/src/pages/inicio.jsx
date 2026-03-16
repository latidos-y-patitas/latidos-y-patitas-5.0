import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';
import '../styles/Inicio.css'; 

export default function Inicio() {
  return (
    <div className="inicio">
      <Header />
      
      <Hero full>
        <div className="hero-container">
          <div className="hero-card">
            <span className="hero-badge">🐾 Bienvenido a Latidos & Patitas</span>

            <h2 className="hero-title">
              Cuidamos a tus mascotas <br />
              <span>como si fueran nuestras</span>
            </h2>

            <p className="hero-description">
              En Latidos & Patitas ofrecemos atención veterinaria de calidad 
              y promovemos la adopción responsable. Tu mascota merece lo mejor.
            </p>

            <div className="hero-buttons">
              <a href="#citas">
                <Button size="large">Agendar Cita 🩺</Button>
              </a>
              <a href="#adopcion">
                <Button variant="secondary" size="large">Adoptar 🐕</Button>
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">+500</div>
                <div className="stat-label">Mascotas felices</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">+10</div>
                <div className="stat-label">Años de experiencia</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Emergencias</div>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <span className="services-badge">NUESTROS SERVICIOS</span>
            <h3>Todo lo que tu mascota necesita</h3>
            <p>
              Ofrecemos una amplia gama de servicios profesionales para el bienestar de tu compañero fiel
            </p>
          </div>

          <div className="services-grid">
            {[
              { icon: '🩺', title: 'Servicios Médicos', desc: 'Consultas, cirugías y cuidados intensivos' },
              { icon: '💉', title: 'Vacunación', desc: 'Protege a tu mascota con nuestro plan de vacunación' },
              { icon: '🐾', title: 'Adopción', desc: 'Encuentra un nuevo amigo que espera por ti' },
              { icon: '✂️', title: 'Peluquería', desc: 'Cuidado estético y bienestar para tu mascota' },
              { icon: '🦷', title: 'Odontología', desc: 'Cuidado dental profesional' },
              { icon: '📋', title: 'Nutrición', desc: 'Asesoramiento alimenticio personalizado' }
            ].map((s, index) => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <div className="service-link">
                  Saber más →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}