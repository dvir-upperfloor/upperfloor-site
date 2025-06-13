import React, { useState } from 'react';

const ContactDrawer = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    website: '',
    companySize: '',
    revenue: '',
    service: '',
    message: '',
    budget: '',
  });
  
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא נדרש';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל נדרשת';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setShowThankYou(true);
      
      // Announce success to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'הטופס נשלח בהצלחה';
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      company: '',
      website: '',
      companySize: '',
      revenue: '',
      service: '',
      message: '',
      budget: '',
    });
    setShowThankYou(false);
    setErrors({});
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };
  
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 999,
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
    },
    drawer: {
      position: 'fixed',
      top: '50%',
      left: open ? '20px' : '-100%',
      transform: 'translateY(-50%)',
      width: '90%',
      maxWidth: '570px',
      height: '65%',
      maxHeight: '825px',
      background: '#f2f2ea',
      zIndex: 1000,
      transition: 'left 0.3s ease',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'transparent',
      border: 'none',
      fontSize: '22px',
      fontWeight: '300',
      color: '#000',
      cursor: 'pointer',
      padding: '8px', // Increased for better target size
      zIndex: 5,
      minWidth: '32px', // WCAG 2.2 minimum target size
      minHeight: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: 1,
      borderRadius: '4px',
    },
    contentWrapper: {
      flex: 1,
      padding: '40px',
      overflowY: 'auto',
      direction: 'rtl',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
    },
    title: {
      fontSize: '24px',
      fontWeight: '400',
      color: '#000',
      marginBottom: '35px',
      textAlign: 'right',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
    },
    formRow: {
      display: 'flex',
      gap: '30px',
      width: '100%',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      position: 'relative',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#000',
      textAlign: 'right',
    },
    requiredLabel: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#000',
      textAlign: 'right',
    },
    required: {
      color: '#dc3545',
      marginLeft: '4px',
    },
    input: {
      background: 'transparent',
      border: 'none',
      borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
      padding: '8px 0',
      fontSize: '15px',
      width: '100%',
      color: '#000',
      outline: 'none',
      textAlign: 'right',
      fontFamily: 'inherit',
      minHeight: '20px',
    },
    inputError: {
      borderBottomColor: '#dc3545',
    },
    select: {
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
      padding: '8px 0',
      fontSize: '15px',
      width: '100%',
      color: '#000',
      outline: 'none',
      textAlign: 'right',
      cursor: 'pointer',
      fontFamily: 'inherit',
      borderRadius: '0',
      minHeight: '20px',
    },
    selectError: {
      borderBottomColor: '#dc3545',
    },
    selectWrapper: {
      position: 'relative',
      width: '100%',
    },
    arrow: {
      position: 'absolute',
      left: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      fontSize: '10px',
      color: '#000',
    },
    textarea: {
      background: 'transparent',
      border: 'none',
      borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
      minHeight: '80px',
      maxHeight: '80px',
      padding: '8px 0',
      resize: 'none',
      fontSize: '15px',
      width: '100%',
      color: '#000',
      outline: 'none',
      textAlign: 'right',
      fontFamily: 'inherit',
    },
    textareaError: {
      borderBottomColor: '#dc3545',
    },
    submitButton: {
      width: 'auto',
      background: 'transparent',
      color: '#000',
      border: '2px solid rgba(0, 0, 0, 0.3)',
      borderRadius: '25px',
      padding: '12px 30px', // Increased for better target size
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '20px',
      alignSelf: 'flex-start',
      textAlign: 'center',
      transition: 'all 0.2s',
      fontFamily: 'inherit',
      minHeight: '44px', // WCAG minimum target size
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px',
      textAlign: 'right',
    },
    thankYouContainer: {
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 40px',
    },
  };

  return (
    <>
      <div 
        style={styles.overlay} 
        onClick={handleClose}
        aria-hidden="true"
      />
      
      <div 
        style={styles.drawer} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
      >
        <button 
          style={styles.closeButton} 
          onClick={handleClose}
          aria-label="סגור טופס יצירת קשר"
        >
          ×
        </button>
        
        <div 
          style={styles.contentWrapper} 
          className="no-scrollbar"
        >
          {!showThankYou ? (
            <>
              <h1 id="contact-form-title" style={styles.title}>ספר לנו על הצרכים שלך</h1>
              
              <form onSubmit={handleSubmit} style={styles.form} noValidate>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.requiredLabel}>
                      מה השם שלך? <span style={styles.required} aria-label="שדה חובה">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(errors.name ? styles.inputError : {})
                      }}
                      placeholder="שם מלא" 
                      required 
                      aria-required="true"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <div id="name-error" style={styles.errorMessage} role="alert">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.requiredLabel}>
                      מה האימייל שלך? <span style={styles.required} aria-label="שדה חובה">*</span>
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(errors.email ? styles.inputError : {})
                      }}
                      placeholder="כתובת אימייל" 
                      required 
                      aria-required="true"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <div id="email-error" style={styles.errorMessage} role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                
                {/*  <div style={styles.formGroup}>
                  <label htmlFor="role" style={styles.label}>מה התפקיד שלך בחברה?</label>
                  <input 
                    type="text" 
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={styles.input} 
                    placeholder="הזן תפקיד" 
                  />
                </div> */}

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="company" style={styles.label}>שם החברה</label>
                    <input 
                      type="text" 
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      style={styles.input} 
                      placeholder="הזן שם חברה" 
                    />
                  </div>
                  {/* <div style={styles.formGroup}>
                    <label htmlFor="website" style={styles.label}>אתר החברה</label>
                    <input 
                      type="url" 
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      style={styles.input} 
                      placeholder="הזן אתר חברה" 
                    />
                  </div>*/}
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="companySize" style={styles.label}>גודל החברה</label>
                    <div style={styles.selectWrapper}>
                      <select 
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        style={styles.select}
                        aria-label="בחר גודל חברה"
                      >
                        <option value="">בחר גודל חברה</option>
                        <option value="1-10">1-10 עובדים</option>
                        <option value="11-50">11-50 עובדים</option>
                        <option value="51-200">51-200 עובדים</option>
                        <option value="201-500">201-500 עובדים</option>
                        <option value="501+">501+ עובדים</option>
                      </select>
                      <span style={styles.arrow} aria-hidden="true">▼</span>
                    </div>
                  </div>
                 {/* <div style={styles.formGroup}>
                    <label htmlFor="revenue" style={styles.label}>הכנסה שנתית של החברה</label>
                    <div style={styles.selectWrapper}>
                      <select 
                        id="revenue"
                        name="revenue"
                        value={formData.revenue}
                        onChange={handleChange}
                        style={styles.select}
                        aria-label="בחר טווח הכנסה"
                      >
                        <option value="">בחר טווח הכנסה</option>
                        <option value="0-1M">עד 1 מיליון ₪</option>
                        <option value="1M-10M">1-10 מיליון ₪</option>
                        <option value="10M-50M">10-50 מיליון ₪</option>
                        <option value="50M-100M">50-100 מיליון ₪</option>
                        <option value="100M+">מעל 100 מיליון ₪</option>
                      </select>
                      <span style={styles.arrow} aria-hidden="true">▼</span>
                    </div>
                  </div> */}
                </div>

              {/* <div style={styles.formGroup}>
                  <label htmlFor="budget" style={styles.label}>תקציב הפרויקט</label>
                  <div style={styles.selectWrapper}>
                    <select 
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      style={styles.select}
                      aria-label="בחר טווח תקציב"
                    >
                      <option value="">בחר טווח תקציב</option>
                      <option value="0-50K">עד 50 אלף ₪</option>
                      <option value="50K-100K">50-100 אלף ₪</option>
                      <option value="100K-250K">100-250 אלף ₪</option>
                      <option value="250K-500K">250-500 אלף ₪</option>
                      <option value="500K+">מעל 500 אלף ₪</option>
                    </select>
                    <span style={styles.arrow} aria-hidden="true">▼</span>
                  </div> 
                </div> */}

                {/* <div style={styles.formGroup}>
                  <label htmlFor="service" style={styles.label}>באילו שירותים אתה מתעניין?</label>
                  <div style={styles.selectWrapper}>
                    <select 
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      style={styles.select}
                      aria-label="בחר שירות"
                    >
                      <option value="">בחר שירות</option>
                      <option value="identify">זיהוי הזדמנויות AI</option>
                      <option value="education">חינוך והכשרה</option>
                      <option value="development">פיתוח פתרונות AI</option>
                      <option value="consulting">ייעוץ אסטרטגי</option>
                      <option value="implementation">יישום מערכות AI</option>
                      <option value="other">אחר</option>
                    </select>
                    <span style={styles.arrow} aria-hidden="true">▼</span>
                  </div>
                </div> */}

                <div style={styles.formGroup}>
                  <label htmlFor="message" style={styles.label}>הודעה</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    style={styles.textarea} 
                    placeholder="ספר לנו עוד על הפרויקט"
                    aria-label="ספר לנו עוד על הפרויקט"
                  ></textarea>
                </div>

                <button type="submit" style={styles.submitButton}>שלח פנייה</button>
              </form>
            </>
          ) : (
            <div style={styles.thankYouContainer}>
              <p style={{fontSize: '20px', fontWeight: '500', color: '#000'}}>
                <span style={{color: '#38bdf8'}}>תודה על הודעתך!</span> אנחנו ניצור איתך קשר בהקדם.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </>
  );
};

export default ContactDrawer;