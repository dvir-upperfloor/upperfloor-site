import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const AboutPage = ({ onNavigateBack }) => {
  // FIXED: Stable particle data that doesn't change on re-render
  const particleData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
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

  return (
    <div className="page-container about-page-container">
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
        <h1 className="page-title">אודות Upper Floor</h1>
      </header>
      
      {/* Main Content - FIXED: Properly constrained scrollable area */}
      <main className="page-content">
        <div className="about-content-wrapper">
          <section className="about-intro">
            <h2 className="section-title">מי אנחנו?</h2>
            <p className="intro-text">
              אנחנו צוות של מומחים בתחום הבינה המלאכותית, מחויבים לעזור לעסקים לממש את הפוטנציאל המלא של טכנולוגיות AI מתקדמות.
            </p>
          </section>
          
          <section className="team-section">
            <h3 className="team-section-title">הצוות שלנו</h3>
            
            <div className="team-grid">
              {/* Amir Kahana */}
              <article className="team-member-card">
                <div className="member-image-container">
                  <img src="amir.jpg" alt="אמיר כהנא, מייסד שותף של Upper Floor" className="member-photo" />
                </div>
                <div className="member-info">
                  <h4 className="member-name">אמיר כהנא</h4>
                  <p className="member-title">Co-Founder</p>
                  <p className="member-subtitle">מ"פ משוחרר | מפתח מערכות AI</p>
                  
                  <div className="member-bio">
                    <p>
                      אני מגיע מרקע פיקודי בצה"ל, שם ניהלתי מערכות מורכבות והתמודדתי עם אתגרים תחת לחץ גבוה. את הגישה הזו, של חשיבה מערכתית, ביצוע מדויק והתמקדות בתוצאה, אני מביא איתי לעולם העסקי.
                    </p>
                    <p>
                    בשנה האחרונה הובלתי הקמה של פתרונות AI מתקדמים לעשרות עסקים בישראל.
                    סיימתי לימודי מהנדסי AI באוניברסיטה העברית, ומתמקד בפיתוח עובדי בינה חכמים – מערכות אוטונומיות שמשולבות בעסקים ומייעלות תהליכים באופן מדיד ואפקטיבי.
                    </p>
                  </div>
                </div>
              </article>
              
              {/* Dvir Mizrachi */}
              <article className="team-member-card">
                <div className="member-image-container">
                  <img src="dvir.jpg" alt="דביר מזרחי, מייסד שותף של Upper Floor" className="member-photo" />
                </div>
                <div className="member-info">
                  <h4 className="member-name">דביר מזרחי</h4>
                  <p className="member-title">Co-Founder</p>
                  <p className="member-subtitle">סרן משוחרר | מפתח מערכות AI</p>
                  
                  <div className="member-bio">
                    <p>
                      עם 7 שנות ניסיון בפיתוח Full-Stack מתקדם ורקע פיקודי מהצבא, אני מתמחה בבניית עובדי AI חכמים ומערכות אוטונומיות מותאמות אישית. הניסיון הטכני העמוק שלי בשפות JAVA, JavaScript, C#, Python מאפשר לי לבנות פתרונות מדויקים עד הפרט האחרון.
                    </p>
                    <p>
                      בשילוב הרקע הפיקודי שלי ויכולת החשיבה המערכתית שרכשתי, אני מוביל פיתוח של מערכות AI מתקדמות בטכנולוגיות LangChain ומודלים מקומיים. המטרה שלי היא להתאים כל פתרון כמו כפפה ליד לעסקים קטנים ובינוניים, תוך אופטימיזציה מלאה של תהליכים עסקיים קריטיים.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
          
          <section className="company-mission">
            <div className="mission-card">
              <h3 className="mission-title">המשימה שלנו</h3>
              <blockquote className="mission-quote">
                "השאלה היא לא אם תטמיעו בינה מלאכותית, אלא מתי ובאיזו איכות."
              </blockquote>
              <p className="mission-description">
                אנחנו מאמינים שהעתיד השייך לעסקים שיודעים לנצל את כוח הבינה המלאכותית בצורה חכמה ויעילה. 
                המטרה שלנו היא לעזור לכל עסק למצוא את הפתרון המושלם שמתאים בדיוק לצרכים שלו.
              </p>
            </div>
          </section>
          
          <section className="company-values">
            <h3 className="values-title">הערכים שלנו</h3>
            <div className="values-grid">
              <div className="value-item">
                <h4 className="value-name">מיקוד בתוצאות</h4>
                <p className="value-description">כל פתרון שאנו מפתחים מיועד להביא תוצאות מדידות ומשמעותיות לעסק שלכם.</p>
              </div>
              <div className="value-item">
                <h4 className="value-name">התאמה אישית</h4>
                <p className="value-description">אין פתרון אחד שמתאים לכולם. כל עסק מקבל פתרון מותאם במיוחד עבורו.</p>
              </div>
              <div className="value-item">
                <h4 className="value-name">חדשנות מתמדת</h4>
                <p className="value-description">אנחנו תמיד בחזית הטכנולוגיה, מביאים לכם את הפתרונות המתקדמים ביותר.</p>
              </div>
              <div className="value-item">
                <h4 className="value-name">שותפות אמיתית</h4>
                <p className="value-description">אנחנו לא רק ספקי שירות - אנחנו שותפים לדרך לצמיחה והצלחה של העסק שלכם.</p>
              </div>
            </div>
          </section>
          
          {/* Footer moved inside scrollable content */}
          <footer className="page-footer">
            <div className="footer-content">
              <p>&copy; 2024 Upper Floor AI. כל הזכויות שמורות.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;