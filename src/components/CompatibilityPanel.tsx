import { CompatibilityResult } from '../types/components';

interface CompatibilityPanelProps {
  compatibility: CompatibilityResult;
}

function CompatibilityPanel({ compatibility }: CompatibilityPanelProps) {
  if (compatibility.errors.length === 0 && !compatibility.warnings) {
    return null;
  }

  return (
    <div className="compatibility-panel">
      {compatibility.errors.length > 0 && (
        <>
          <h3 style={{ color: '#fca5a5', marginBottom: '1rem' }}>❌ Проблемы совместимости</h3>
          {compatibility.errors.map((error, index) => (
            <div key={index} className="error-message">
              <div className="error-title">{error.component}</div>
              <div className="error-reason">{error.reason}</div>
              {error.recommendations && error.recommendations.length > 0 && (
                <div className="error-recommendations">
                  <strong>Рекомендации:</strong>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem' }}>
                    {error.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {compatibility.warnings && compatibility.warnings.length > 0 && (
        <>
          <h3 style={{ color: '#fde68a', marginBottom: '1rem', marginTop: '1rem' }}>
            ⚠️ Предупреждения
          </h3>
          {compatibility.warnings.map((warning, index) => (
            <div key={index} className="warning-message">
              {warning}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default CompatibilityPanel;

