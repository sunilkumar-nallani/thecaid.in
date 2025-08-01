import React, { useState } from 'react';
import { Shield, Zap, Users, Target, Mail, Linkedin, Terminal as TerminalIcon } from 'lucide-react';
import './WebsiteView.css';

const WebsiteView = ({ companyData, roadmapData, teamData, onTerminalCommand }) => {
  const [terminalInput, setTerminalInput] = useState('');

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      onTerminalCommand(terminalInput);
      setTerminalInput('');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="website-view">
      {/* Terminal Command Bar */}
      <div className="terminal-command-bar">
        <form onSubmit={handleTerminalSubmit} className="terminal-command-form">
          <span className="command-prompt">user@caid:~$ </span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type commands here (try 'terminal', 'help', 'about'...)"
            className="command-input"
          />
        </form>
      </div>

      {/* Hero Section */}
      <section className="website-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Combat the <span className="highlight">$5.7T</span> Synthetic Media Problem
            </h1>
            <p className="hero-subtitle">
              {companyData?.about?.mission || "A deep-tech initiative solving the synthetic media crisis with cutting-edge detection technology."}
            </p>
            <div className="hero-actions">
              <button className="cta-primary" onClick={() => scrollToSection('contact')}>
                Get Investment Info
              </button>
              <button className="cta-secondary" onClick={() => onTerminalCommand('terminal')}>
                <TerminalIcon size={20} />
                Return to Terminal
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="detection-demo">
              <div className="scan-lines"></div>
              <div className="detection-result">
                <Shield className="shield-icon" />
                <span>AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="website-about">
        <div className="section-header">
          <h2>The Crisis is Real</h2>
          <p>{companyData?.about?.urgency || "The problem is critical. The market is massive. The action is now."}</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">$5.7T</div>
            <div className="stat-label">Market Impact by 2030</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">90%</div>
            <div className="stat-label">Detection Accuracy Target</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Media Files Analyzed</div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3>Blockchain Trust</h3>
            <p>Distributed ledger system for community-verified authenticity</p>
          </div>
          <div className="feature-card">
            <Zap className="feature-icon" />
            <h3>AI Detection</h3>
            <p>Advanced algorithms powered by extensive R&D</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Community-Driven</h3>
            <p>Crowdsourced validation from trusted users</p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="website-roadmap">
        <div className="section-header">
          <h2>Development Roadmap</h2>
          <p>Our path to solving synthetic media detection</p>
        </div>
        
        <div className="timeline">
          {roadmapData?.milestones?.map((milestone, index) => (
            <div key={milestone.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <div className="timeline-badge">
                  <Target size={20} />
                </div>
                <div className="timeline-card">
                  <div className="timeline-date">{milestone.target}</div>
                  <h3>{milestone.product}</h3>
                  <p>{milestone.function}</p>
                  <div className={`status-badge ${milestone.status.toLowerCase().replace(' ', '-')}`}>
                    {milestone.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="website-team">
        <div className="section-header">
          <h2>Leadership Team</h2>
          <p>Experienced founders driving innovation in synthetic media detection</p>
        </div>
        
        <div className="team-grid">
          {teamData?.founders?.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">
                {member.image ? (
                  <img src={member.image} alt={member.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-focus">{member.focus}</p>
                {member.bio && <p className="team-bio">{member.bio}</p>}
                <div className="team-social">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="website-contact">
        <div className="section-header">
          <h2>Investment Opportunity</h2>
          <p>Join us in solving the synthetic media crisis</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="investment-details">
              <h3>Seed Funding Round</h3>
              <ul>
                <li>Building world-class R&D team</li>
                <li>Accelerating product development</li>
                <li>$5.7T market opportunity by 2030</li>
                <li>Partnership with leading accelerators</li>
              </ul>
            </div>
            
            <div className="contact-methods">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>{companyData?.contact?.email || "team@caid.io"}</span>
              </div>
              <div className="contact-item">
                <TerminalIcon className="contact-icon" />
                <button onClick={() => onTerminalCommand('contact')} className="terminal-link">
                  Use Terminal Contact Form
                </button>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Get in Touch</h3>
            <form className="investment-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Company/Organization" />
              </div>
              <div className="form-group">
                <select required>
                  <option value="">Inquiry Type</option>
                  <option value="funding">Seed Funding</option>
                  <option value="demo">Product Demo</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <textarea placeholder="Tell us about your interest in CAID..." rows="4" required></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="website-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_deepfake-guard-1/artifacts/gnpp68oo_caid.jpg" 
              alt="CAID Logo" 
              className="footer-logo-image"
            />
            <div className="footer-text">
              <span className="footer-name">CAID</span>
              <span className="footer-tagline">Content Authenticity Initiative</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button className="footer-terminal-btn" onClick={() => onTerminalCommand('terminal')}>
              <TerminalIcon size={16} />
              Return to Terminal
            </button>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 CAID. Fighting synthetic media with advanced detection technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteView;