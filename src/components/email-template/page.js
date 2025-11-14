import * as React from 'react';

export function EmailTemplate({
  firstName,
  massageType,
  duration,
  slot,
  price,
  orderId,
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f8f8', padding: '20px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: '#4F3921', color: '#fff', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>lamoonThaispa</h1>
        </div>

        {/* Body */}
        <div style={{ padding: '30px', color: '#333', }}>
          <h2 style={{ color: '#4F3921' }}>Bonjour, {firstName} !</h2>
          <p>
            Merci d'avoir choisi les services de lamoonThaispa. Nous espérons que vous aurez une expérience relaxante et bénéfique pour votre santé.
          </p>
          <div style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
            backgroundColor: '#F6F1EA'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Détails de la réservation</h3>
            <table style={{ width: '100%', fontSize: 14, color: '#333' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', width: 160, color: '#666' }}>Numéro de commande</td>
                  <td style={{ padding: '6px 0' }}><strong>{orderId || '-'}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Service</td>
                  <td style={{ padding: '6px 0' }}>{massageType || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Durée</td>
                  <td style={{ padding: '6px 0' }}>{duration ? `${duration} minutes` : '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Date et heure</td>
                  <td style={{ padding: '6px 0' }}>{slot || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#666' }}>Prix</td>
                  <td style={{ padding: '6px 0' }}><strong style={{ color: '#0a7f2e' }}>{price ? `${price} THB` : '-'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <a
            href="https://your-spa-website.com"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#4F3921',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            Visiter le site web
          </a>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
          © 2025 lamoonThaispa. All rights reserved.
        </div>
      </div>
    </div>
  );
}
