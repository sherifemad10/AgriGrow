import Footer from '../components/Footer';
import AboutUs from '../components/Home/AboutUs';
import Hero from '../components/Home/Hero';
import Major from '../components/Home/Major';
import Research from '../components/Home/Research';

const Home = ({ onNavigate, onSelectSpecialty }) => {
  return (
    <main>
      <Hero onSelectSpecialty={onSelectSpecialty} />
      <Major onSelectSpecialty={onSelectSpecialty} />
      <Research />
      <AboutUs />
      <Footer onNavigate={onNavigate} />
    </main>
  );
};

export default Home;
