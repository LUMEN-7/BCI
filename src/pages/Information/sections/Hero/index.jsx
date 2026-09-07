import { IoOpenOutline } from 'react-icons/io5';
import './style.css';

export default function Hero({ car, onCompare }) {
    return (
        <section className="information-hero">
            <div className="car-preview"><img src={car.image} alt={car.name} /></div>
            <div className="car-info">
                <span>{car.brand}</span>
                <h1>{car.name}</h1>
                <p>{car.description}</p>
                <button className="compare-button" onClick={onCompare}>Comparar Modelo<IoOpenOutline /></button>
            </div>
        </section>
    );
}
