import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/simulator');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge"></div>
          <h1 className="hero-title">
            Собери ПК своей мечты
            <span className="gradient-text"> виртуально</span>
          </h1>
          <p className="hero-description">
            Интерактивный симулятор для обучения сборке компьютера. 
            Проверка совместимости в реальном времени, 3D визуализация и более 35 комплектующих.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={handleStartBuilding}>
              <span>🚀 Начать сборку</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <button className="cta-button secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>📚 Узнать больше</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">35+</div>
              <div className="stat-label">Комплектующих</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Проверок совместимости</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Режима визуализации</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-gradient gradient-cpu"></div>
            <img 
              src="/images/cpu.png" 
              alt="AMD Ryzen Processor"
              className="card-image"
            />
            <div className="card-content">
              <div className="card-category">Процессор</div>
              <div className="card-text">AMD Ryzen 9 7950X</div>
              <div className="card-detail">16 ядер / 32 потока</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-gradient gradient-gpu"></div>
            <img 
              src="/images/—Pngtree—nvidia rtx 3080 rog strix_21021625.png" 
              alt="NVIDIA RTX Graphics Card"
              className="card-image"
            />
            <div className="card-content">
              <div className="card-category">Видеокарта</div>
              <div className="card-text">NVIDIA RTX 4090</div>
              <div className="card-detail">24GB GDDR6X</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-gradient gradient-ram"></div>
            <img 
              src="/images/memory ram.png" 
              alt="DDR5 RAM Memory"
              className="card-image"
            />
            <div className="card-content">
              <div className="card-category">Оперативная память</div>
              <div className="card-text">64GB DDR5 RAM</div>
              <div className="card-detail">6000MHz</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Возможности симулятора</h2>
          <p className="section-subtitle">
            Все что нужно для изучения сборки ПК в одном месте
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🖱️</div>
            <h3 className="feature-title">Drag & Drop интерфейс</h3>
            <p className="feature-description">
              Перетаскивайте компоненты прямо в слоты. Интуитивно понятный интерфейс с визуальными подсказками.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Проверка совместимости</h3>
            <p className="feature-description">
              Автоматическая проверка сокетов, TDP, типов памяти и мощности. Подробные сообщения об ошибках.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3 className="feature-title">3D Визуализация</h3>
            <p className="feature-description">
              Переключайтесь между 2D схемой и реалистичной 3D моделью. Вращайте, масштабируйте, исследуйте.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Обучающий режим</h3>
            <p className="feature-description">
              4 готовых задания с разными бюджетами. От офисного ПК до мощной рабочей станции.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">Расчет стоимости</h3>
            <p className="feature-description">
              Автоматический подсчет общей стоимости сборки и энергопотребления всех компонентов.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3 className="feature-title">База комплектующих</h3>
            <p className="feature-description">
              Более 35 реальных компонентов: процессоры AMD и Intel, видеокарты NVIDIA и AMD, и многое другое.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Components Section */}
      <section className="popular-components-section">
        <div className="section-header">
          <h2 className="section-title">Популярные компоненты</h2>
          <p className="section-subtitle">
            Реальные комплектующие из нашей базы данных
          </p>
        </div>

        <div className="components-showcase">
          <div className="component-showcase-card">
            <div className="showcase-visual">
              <div className="showcase-badge">TOP</div>
              <img 
                src="/images/cpu.png" 
                alt="AMD Ryzen 9 7950X"
                className="showcase-image"
              />
            </div>
            <div className="showcase-content">
              <div className="showcase-category">Процессор</div>
              <h3 className="showcase-title">AMD Ryzen 9 7950X</h3>
              <div className="showcase-specs">
                <span>16 ядер / 32 потока</span>
                <span>5.7 GHz Boost</span>
                <span>170W TDP</span>
              </div>
              <div className="showcase-price">280,000₸</div>
            </div>
          </div>

          <div className="component-showcase-card">
            <div className="showcase-visual">
              <div className="showcase-badge badge-new">NEW</div>
              <img 
                src="/images/—Pngtree—nvidia rtx 3080 rog strix_21021625.png" 
                alt="NVIDIA GeForce RTX"
                className="showcase-image"
              />
            </div>
            <div className="showcase-content">
              <div className="showcase-category">Видеокарта</div>
              <h3 className="showcase-title">NVIDIA GeForce RTX 4090</h3>
              <div className="showcase-specs">
                <span>24GB GDDR6X</span>
                <span>2520 MHz Boost</span>
                <span>450W TDP</span>
              </div>
              <div className="showcase-price">850,000₸</div>
            </div>
          </div>

          <div className="component-showcase-card">
            <div className="showcase-visual">
              <div className="showcase-badge badge-hot">HOT</div>
              <img 
                src="/images/memory ram.png" 
                alt="G.Skill Trident Z5 RGB"
                className="showcase-image"
              />
            </div>
            <div className="showcase-content">
              <div className="showcase-category">Оперативная память</div>
              <h3 className="showcase-title">G.Skill Trident Z5 RGB</h3>
              <div className="showcase-specs">
                <span>64GB (2x32GB)</span>
                <span>DDR5-6000</span>
                <span>CL30</span>
              </div>
              <div className="showcase-price">145,000₸</div>
            </div>
          </div>

          <div className="component-showcase-card">
            <div className="showcase-visual">
              <img 
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80" 
                alt="ASUS ROG STRIX X670E"
                className="showcase-image"
              />
            </div>
            <div className="showcase-content">
              <div className="showcase-category">Игровой сетап</div>
              <h3 className="showcase-title">ASUS ROG STRIX</h3>
              <div className="showcase-specs">
                <span>Socket AM5</span>
                <span>DDR5 Support</span>
                <span>PCIe 5.0</span>
              </div>
              <div className="showcase-price">990,000₸</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">Как это работает</h2>
          <p className="section-subtitle">
            Простой процесс сборки в 3 шага
          </p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3 className="step-title">Выберите компоненты</h3>
              <p className="step-description">
                Откройте категории и выберите нужные комплектующие. Несовместимые компоненты подсвечиваются красным.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3 className="step-title">Перетащите в слоты</h3>
              <p className="step-description">
                Используйте Drag & Drop для установки компонентов. Система автоматически проверит совместимость.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3 className="step-title">Проверьте результат</h3>
              <p className="step-description">
                Посмотрите на собранный ПК в 2D или 3D режиме. Получите подробную информацию о стоимости и мощности.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Готовы собрать свой первый ПК?</h2>
          <p className="cta-description">
            Начните прямо сейчас - это бесплатно и не требует регистрации
          </p>
          <button className="cta-button primary large" onClick={handleStartBuilding}>
            <span>🚀 Запустить симулятор</span>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">🖥️ Симулятор Сборки ПК</h3>
            <p className="footer-description">
              Интерактивный обучающий инструмент для всех, кто хочет научиться собирать компьютеры.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Возможности</h4>
            <ul className="footer-links">
              <li>Drag & Drop интерфейс</li>
              <li>3D визуализация</li>
              <li>Проверка совместимости</li>
              <li>Обучающие задания</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Технологии</h4>
            <ul className="footer-links">
              <li>React 18</li>
              <li>TypeScript</li>
              <li>Three.js</li>
              <li>Vite</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 PC Simulator. Создано с ❤️ для изучения сборки ПК</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
