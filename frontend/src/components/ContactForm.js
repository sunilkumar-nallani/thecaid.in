import React, { useState } from 'react';
import { inquiriesAPI } from '../services/api';
import './ContactForm.css';

const ContactForm = ({ onSubmitSuccess, onSubmitError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    inquiry_type: 'funding'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await inquiriesAPI.create(formData);
      onSubmitSuccess(response);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        inquiry_type: 'funding'
      });
    } catch (error) {
      onSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="form-header">
        <pre className="form-title">Investment Inquiry Form:</pre>
      </div>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label className="form-label">
            > Name: <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            > Email: <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email address"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            > Company/Organization:
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your company name (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            > Inquiry Type:
          </label>
          <select
            name="inquiry_type"
            value={formData.inquiry_type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="funding">Seed Funding</option>
            <option value="demo">Product Demo</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            > Message: <span className="required">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`form-textarea ${errors.message ? 'error' : ''}`}
            rows="4"
            placeholder="Tell us about your interest in CAID..."
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;