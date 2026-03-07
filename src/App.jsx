import { LanguageProvider } from "./i18n/LanguageContext";
import About from "./component/About/About";
import Hero from "./component/Hero/Hero";
import coffe from "./assets/coffe.png";
import ProfitCalculator from "./component/ProfitCalculator/ProfitCalculator";
import Guarantee from "./component/Guarantee/Guarantee";
import CoffeeCatalog from "./component/CoffeeCatalog/CoffeeCatalog";
import LocationSection from "./component/LocationSection/LocationSection";
import FeaturesSection from "./component/FeaturesSection/FeaturesSection";
import ReviewsSection from "./component/ReviewsSection/ReviewsSection";
import Footer from "./component/Footer/Footer";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <div className="container">
        <Hero />
        <About />
        <img src={coffe} className="coffe" alt="" />
        <Guarantee />
        <CoffeeCatalog />
        <LocationSection />
        <FeaturesSection />
        <ProfitCalculator />
        <ReviewsSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
