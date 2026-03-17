import { useEffect } from "react";
import { trackPageView } from "./lib/analytics";
import About from "./component/About/About";
import Hero from "./component/Hero/Hero";
import ProfitCalculator from "./component/ProfitCalculator/ProfitCalculator";
import Guarantee from "./component/Guarantee/Guarantee";
import CoffeeCatalog from "./component/CoffeeCatalog/CoffeeCatalog";
import LocationSection from "./component/LocationSection/LocationSection";
import FeaturesSection from "./component/FeaturesSection/FeaturesSection";
import ReviewsSection from "./component/ReviewsSection/ReviewsSection";
import Footer from "./component/Footer/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="container">
        <Hero />
        <About />
        <Guarantee />
        <CoffeeCatalog />
        <LocationSection />
        <FeaturesSection />
        <ProfitCalculator />
        <ReviewsSection />
        <Footer />
      </div>
  );
}

export default App;
