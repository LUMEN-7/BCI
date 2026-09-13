import { FiLock, FiShield } from "react-icons/fi";
import {QRCodeSVG } from "qrcode.react";

export default function TwoFactorSection({ doisFatores }) {
  const { ativo, qrCodeUri, chaveManual, codigo, erro, carregando, setCodigo, iniciar, confirmar, desativar, cancelar } = doisFatores;

  return (
    <section className="edit-profile-card two-factor-section">
      <div className="section-heading">
        <div className="section-heading-title"><h2>Autenticação em duas etapas</h2></div>
        <p>Adicione uma camada extra de segurança usando um app autenticador (Google Authenticator, Microsoft Authenticator).</p>
      </div>

      {ativo ? (
        <div className="two-factor-status two-factor-active">
          <FiShield />
          <div>
            <strong>2FA ativado</strong>
            <span>Sua conta está protegida por autenticação em duas etapas.</span>
          </div>
          <button type="button" className="button button-secondary" onClick={desativar} disabled={carregando}>Desativar</button>
        </div>
      ) : qrCodeUri ? (
        <div className="two-factor-setup">
          <div className="two-factor-qr"><QRCodeSVG  value={qrCodeUri} size={180} /></div>
          <p>Escaneie o QR Code com seu app autenticador, ou digite a chave manualmente:</p>
          <code className="two-factor-key">{chaveManual}</code>

          <form onSubmit={confirmar} className="two-factor-confirm-form">
            <input type="text" inputMode="numeric" maxLength={6} placeholder="Código de 6 dígitos" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            {erro && <span className="field-error">{erro}</span>}
            <div className="two-factor-actions">
              <button type="button" className="button button-secondary" onClick={cancelar}>Cancelar</button>
              <button type="submit" className="button button-primary" disabled={carregando || codigo.length !== 6}>Confirmar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="two-factor-status">
          <FiLock />
          <div>
            <strong>2FA desativado</strong>
            <span>Sua conta usa apenas e-mail e senha para entrar.</span>
          </div>
          <button type="button" className="button button-primary" onClick={iniciar} disabled={carregando}>Ativar</button>
        </div>
      )}
    </section>
  );
}