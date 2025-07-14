import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const ArticlesPage = ({ onNavigateBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // FIXED: Stable particle data that doesn't change on re-render
  const particleData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 1920,
      y: 1180, // Start below screen
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5
    }));
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onNavigateBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigateBack]);

  // Sample articles data
  const articles = [
    {
      id: 1,
      title: "מהפכת הבינה המלאכותית בעסקים קטנים ובינוניים",
      excerpt: "איך עסקים קטנים ובינוניים יכולים לנצל את כוח הבינה המלאכותית כדי להתחרות עם הגדולים בשוק.",
      category: "ai-business",
      date: "2024-01-15",
      readTime: "5 דקות קריאה",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "5 דרכים שבהן AI יכול לשפר את שירות הלקוחות שלכם",
      excerpt: "גלו איך ניתן להשתמש בבינה מלאכותית כדי לספק שירות לקוחות מעולה 24/7 ולהגדיל את שביעות הרצון.",
      category: "customer-service",
      date: "2024-01-10",
      readTime: "7 דקות קריאה",
      image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "האם העסק שלכם מוכן לעובד AI? מדריך בדיקה עצמית",
      excerpt: "רשימת בדיקות פשוטה שתעזור לכם להבין אם העסק שלכם מוכן לשלב עובד בינה מלאכותית.",
      category: "implementation",
      date: "2024-01-05",
      readTime: "4 דקות קריאה",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "חישוב ROI של השקעה בבינה מלאכותית",
      excerpt: "כיצד למדוד את התשואה על השקעה בפתרונות בינה מלאכותית ומה הם המדדים החשובים לעקוב אחריהם.",
      category: "roi",
      date: "2023-12-28",
      readTime: "8 דקות קריאה",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "מקרי הצלחה: איך חברות ישראליות משתמשות ב-AI",
      excerpt: "סיפורי הצלחה אמיתיים של חברות ישראליות שהטמיעו בהצלחה פתרונות בינה מלאכותית בעסק שלהן.",
      category: "case-studies",
      date: "2023-12-20",
      readTime: "10 דקות קריאה",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "העתיד של AI בתעשיות השונות - תחזיות ל-2024",
      excerpt: "מבט על הטרנדים החשובים ביותר בבינה מלאכותית עבור תעשיות שונות בשנה הקרובה.",
      category: "trends",
      date: "2023-12-15",
      readTime: "6 דקות קריאה",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    { id: 'all', name: 'כל המאמרים', icon: '📄' },
    { id: 'ai-business', name: 'AI לעסקים', icon: '🏢' },
    { id: 'customer-service', name: 'שירות לקוחות', icon: '🤝' },
    { id: 'implementation', name: 'יישום והטמעה', icon: '⚙️' },
    { id: 'roi', name: 'ROI ותשואה', icon: '📈' },
    { id: 'case-studies', name: 'מקרי הצלחה', icon: '🏆' },
    { id: 'trends', name: 'טרנדים', icon: '🔮' }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page-container articles-page-container">
      {/* NEW: Modern Gradient Background with Animated Elements */}
      <div className="new-background">
        {/* Background Logo */}
        <div className="background-logo">
          <img
            src="/lovable-uploads/7c4edd67-efed-4534-af72-d6b32adca96e.png"
            alt="Background Logo"
          />
        </div>
       
        {/* Floating Particles - Fixed: Using stable data */}
        <div className="floating-particles">
          {particleData.map((particle) => (
            <motion.div
              key={particle.id}
              className="floating-particle"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear",
                delay: particle.delay
              }}
            />
          ))}
        </div>
        
        {/* Gradient Overlays */}
        <div className="gradient-overlay-1"></div>
        <div className="gradient-overlay-2"></div>
        <div className="gradient-overlay-3"></div>
      </div>
      
      {/* Header - REMOVED back button */}
      <header className="page-header">
        <h1 className="page-title">מאמרים ומדריכים</h1>
        <p className="page-subtitle">תובנות ומידע מעשי בתחום הבינה המלאכותית לעסקים</p>
      </header>
      
      {/* FIXED: All content inside scrollable main container */}
      <main className="page-content">
        {/* Categories Filter - moved inside page-content */}
        <section className="categories-section">
          <div className="categories-container">
            <h2 className="categories-title">קטגוריות</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  aria-label={`סינון לפי ${category.name}`}
                  type="button"
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Articles Grid */}
        <div className="articles-container">
          <div className="articles-header">
            <h2 className="articles-count">
              {filteredArticles.length} מאמרים נמצאו
            </h2>
          </div>
          
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <article key={article.id} className="article-card">
                <div className="article-image">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    loading="lazy"
                  />
                  <div className="article-category-badge">
                    {categories.find(cat => cat.id === article.category)?.name || 'כללי'}
                  </div>
                </div>
                
                <div className="article-content">
                  <header className="article-header">
                    <h3 className="article-title">{article.title}</h3>
                    <div className="article-meta">
                      <span className="article-date">{formatDate(article.date)}</span>
                      <span className="article-read-time">{article.readTime}</span>
                    </div>
                  </header>
                  
                  <p className="article-excerpt">{article.excerpt}</p>
                  
                  <footer className="article-footer">
                    <button 
                      className="read-more-btn" 
                      aria-label={`קרא עוד על ${article.title}`}
                      type="button"
                    >
                      קרא עוד ←
                    </button>
                  </footer>
                </div>
              </article>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="no-articles">
              <div className="no-articles-icon">📄</div>
              <h3 className="no-articles-title">לא נמצאו מאמרים</h3>
              <p className="no-articles-text">אין מאמרים בקטגוריה שנבחרה כרגע.</p>
            </div>
          )}
        </div>
        
        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="newsletter-card">
            <h3 className="newsletter-title">הישארו מעודכנים</h3>
            <p className="newsletter-description">
              קבלו את המאמרים החדשים ביותר והתובנות על בינה מלאכותית ישירות למייל
            </p>
            <form className="newsletter-form">
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="כתובת האימייל שלכם"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  הרשמה
                </button>
              </div>
            </form>
          </div>
        </section>
        
        {/* Footer moved inside scrollable content */}
        <footer className="page-footer">
          <div className="footer-content">
            <p>&copy; 2024 Upper Floor AI. כל הזכויות שמורות.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ArticlesPage;