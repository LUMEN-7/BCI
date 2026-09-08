import { useEffect, useState } from "react";
import {
  IoArrowForward,
  IoGitCompareOutline,
  IoSearchOutline,
} from "react-icons/io5";

import "./style.css";

export default function Hero({
  cars,
  firstName,
  greeting,
  onSearch,
  onCompare,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === cars.length - 1 ? 0 : previousIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [cars.length]);

  return (
    <section className="home-hero">
      <div className="hero-content">
        <span className="eyebrow">BUSINESS COMPETITIVE INTELLIGENCE</span>

        <h1>
          {greeting}
          <br />
          {firstName}.
        </h1>

        <p className="hero-description">
          Explore o mercado, compare modelos e transforme dados em decisões
          estratégicas para a Ford.
        </p>

        <div className="hero-actions">
          <button
            className="hero-button hero-button-primary"
            onClick={onSearch}
          >
            <IoSearchOutline />
            <span>PESQUISAR</span>
            <IoArrowForward className="button-arrow" />
          </button>

          <button
            className="hero-button hero-button-secondary"
            onClick={onCompare}
          >
            <IoGitCompareOutline />
            <span>COMPARAR</span>
            <IoArrowForward className="button-arrow" />
          </button>
        </div>
      </div>

      <div className="hero-car">
        <img src={cars[currentIndex].image} alt="Veículo Ford" />
        <div className="hero-car-info">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(cars.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
