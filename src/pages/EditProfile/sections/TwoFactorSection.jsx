import { FiCheck, FiLock, FiShield, FiSmartphone } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

export default function TwoFactorSection({ doisFatores }) {
  const { ativo, qrCodeUri, chaveManual, codigo, erro, carregando, setCodigo, iniciar, confirmar, desativar, cancelar } = doisFatores;

  return (
    <section className="edit-profile-card two-factor-section">
      <div className="two-factor-heading">
        <div className="two-factor-heading-icon"><FiShield /></div>
        <div className="section-heading">
          <div className="section-heading-title"><h2>Autenticação em duas etapas</h2></div>
          <p>Adicione uma camada extra de segurança usando um app autenticador.</p>
        </div>
        <span className={`two-factor-badge ${ativo ? "is-active" : ""}`}>
          <span className="two-factor-badge-dot" />
          {ativo ? "Proteção ativa" : "Não configurado"}
        </span>
      </div>

      {ativo ? (
        <div className="two-factor-status two-factor-active">
          <div className="two-factor-status-icon"><FiCheck /></div>
          <div>
            <strong>Conta protegida</strong>
            <span>Sua conta está protegida por autenticação em duas etapas.</span>
          </div>
          <button type="button" className="button button-secondary" onClick={desativar} disabled={carregando}>Desativar</button>
        </div>
      ) : qrCodeUri ? (
        <div className="two-factor-setup">
          <div className="two-factor-steps">
            <div className="two-factor-step">
              <span className="two-factor-step-number">01</span>
              <div>
                <strong>Escaneie o código</strong>
                <span>Abra seu app autenticador e aponte a câmera para o QR Code.</span>
              </div>
              <div className="two-factor-qr"><QRCodeSVG value={qrCodeUri} size={168} /></div>
              <div className="two-factor-manual-key">
                <FiSmartphone />
                <span>Não consegue escanear? Use esta chave:</span>
                <code className="two-factor-key">{chaveManual}</code>
              </div>
            </div>

            <div className="two-factor-step two-factor-code-step">
              <span className="two-factor-step-number">02</span>
              <div>
                <strong>Confirme a configuração</strong>
                <span>Digite o código de 6 dígitos exibido no aplicativo.</span>
              </div>
              <label htmlFor="two-factor-code">Código de verificação</label>
              <input id="two-factor-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>

          <div className="two-factor-confirm-form">
            {erro && <span className="field-error">{erro}</span>}
            <div className="two-factor-actions">
              <button type="button" className="button button-secondary" onClick={cancelar}>Cancelar</button>
              <button type="button" className="button button-primary" onClick={confirmar} disabled={carregando || codigo.length !== 6}>Confirmar ativação</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="two-factor-status">
          <div className="two-factor-status-icon"><FiLock /></div>
          <div>
            <strong>Proteção desativada</strong>
            <span>Sua conta usa apenas e-mail e senha para entrar.</span>
          </div>
          <button type="button" className="button button-primary" onClick={iniciar} disabled={carregando}>Começar ativação</button>
        </div>
      )}
    </section>
  );
}