import { useAlertToastController } from './hooks/useAlertToastController';
import './style.css';

export default function AlertToast() {
    const { toast } = useAlertToastController();

    if (!toast) return null;

    return (
        <div className={`alert-toast ${toast.type}`} role="status">
            <span>{toast.message}</span>
        </div>
    );
}
