import React, { useState, useEffect, useRef } from 'react';
import { companyAPI, roadmapAPI, teamAPI, analyticsAPI, inquiriesAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ContactForm from './ContactForm';
import WebsiteView from './WebsiteView';
import './Terminal.css';

const Terminal = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [showWebsite, setShowWebsite] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Load initial data and welcome message
  useEffect(() => {
    const initializeTerminal = async () => {
      try {
        // Load company data
        const company = await companyAPI.getInfo();
        setCompanyData(company);
        
        // Load roadmap data
        const roadmap = await roadmapAPI.getMilestones();
        setRoadmapData(roadmap);
        
        // Load team data
        const team = await teamAPI.getMembers();
        setTeamData(team);
        
        // Set initial welcome messages
        const initialMessages = [
          { type: 'system', content: `Initializing CAID v${company.system.version}... Connection secure.` },
          { type: 'system', content: company.system.welcome_message },
          { type: 'system', content: "Type 'help' to see available commands." },
          { type: 'system', content: "Type 'website' to view traditional website layout." },
          { type: 'prompt', content: '' }
        ];
        setHistory(initialMessages);
      } catch (error) {
        console.error('Error initializing terminal:', error);
        // Fallback to basic initialization
        const fallbackMessages = [
          { type: 'system', content: 'Initializing CAID v1.0... Connection secure.' },
          { type: 'system', content: 'Welcome to the frontline against synthetic media.' },
          { type: 'system', content: "Type 'help' to see available commands." },
          { type: 'system', content: "Type 'website' to view traditional website layout." },
          { type: 'error', content: 'Warning: Some features may be limited due to connection issues.' },
          { type: 'prompt', content: '' }
        ];
        setHistory(fallbackMessages);
      }
    };

    initializeTerminal();
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Auto focus input
  useEffect(() => {
    if (inputRef.current && !isExecuting && !showWebsite) {
      inputRef.current.focus();
    }
  }, [isExecuting, showWebsite]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const trackCommand = async (command) => {
    try {
      await analyticsAPI.trackCommand({
        command: command,
        session_id: sessionId,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      // Analytics failure shouldn't break the terminal
      console.warn('Failed to track command:', error);
    }
  };

  const generateCommandResponse = (command, data) => {
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case 'help':
        return [
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help     - Show this help message' },
          { type: 'output', content: '  about    - Learn about CAID' },
          { type: 'output', content: '  roadmap  - View development timeline' },
          { type: 'output', content: '  team     - Meet the founders' },
          { type: 'output', content: '  funding  - Investment opportunities' },
          { type: 'output', content: '  contact  - Get in touch with investment form' },
          { type: 'output', content: '  website  - View traditional website layout' },
          { type: 'output', content: '  clear    - Clear terminal' },
        ];
        
      case 'about':
        if (companyData) {
          return [
            { type: 'output', content: companyData.about.name },
            { type: 'output', content: '' },
            { type: 'output', content: companyData.about.mission },
            { type: 'output', content: companyData.about.description },
            { type: 'output', content: '' },
            { type: 'output', content: companyData.about.urgency },
          ];
        }
        return [{ type: 'error', content: 'Company information not available.' }];
        
      case 'roadmap':
        if (roadmapData && roadmapData.milestones) {
          const response = [
            { type: 'command', content: 'Executing command: roadmap... Accessing development timeline...' },
            { type: 'output', content: '' }
          ];
          
          roadmapData.milestones.forEach((milestone, index) => {
            response.push(
              { type: 'milestone', content: `[MILESTONE ${index + 1}: TARGET ${milestone.target}]` },
              { type: 'output', content: `> Product:  ${milestone.product}` },
              { type: 'output', content: `> Function: ${milestone.function}` },
              { type: 'output', content: `> Status:   ${milestone.status}` },
              { type: 'output', content: '' }
            );
          });
          
          return response;
        }
        return [{ type: 'error', content: 'Roadmap data not available.' }];
        
      case 'team':
        if (teamData && teamData.founders) {
          const response = [
            { type: 'output', content: 'CAID Leadership Team:' },
            { type: 'output', content: '' }
          ];
          
          teamData.founders.forEach(member => {
            response.push(
              { type: 'output', content: `> ${member.name}` },
              { type: 'output', content: `  Role: ${member.role}` },
              { type: 'output', content: `  Focus: ${member.focus}` }
            );
            if (member.bio) {
              response.push({ type: 'output', content: `  Bio: ${member.bio}` });
            }
            response.push({ type: 'output', content: '' });
          });
          
          return response;
        }
        return [{ type: 'error', content: 'Team information not available.' }];
        
      case 'funding':
        return [
          { type: 'output', content: 'Investment Opportunity:' },
          { type: 'output', content: '' },
          { type: 'output', content: '> Stage: Seed funding round' },
          { type: 'output', content: '> Target: Building R&D team' },
          { type: 'output', content: '> Focus: Accelerating product development' },
          { type: 'output', content: '> Market: $5.7T synthetic media detection by 2030' },
          { type: 'output', content: '' },
          { type: 'output', content: 'We are actively seeking partnerships with:' },
          { type: 'output', content: '- Seed-level accelerators' },
          { type: 'output', content: '- Technology investors' },
          { type: 'output', content: '- Strategic partners' },
          { type: 'output', content: '' },
          { type: 'output', content: "Use the 'contact' command to submit an investment inquiry." },
        ];
        
      case 'contact':
        return [
          { type: 'output', content: 'Contact Information:' },
          { type: 'output', content: '' },
          { type: 'output', content: `> Email: ${companyData?.contact?.email || 'team@caid.io'}` },
          { type: 'output', content: `> Demo: ${companyData?.contact?.demo || 'Schedule demo video call'}` },
          { type: 'output', content: `> Pitch: ${companyData?.contact?.pitch || 'Request pitch deck'}` },
          { type: 'output', content: '' },
          { type: 'form', content: 'contact_form' }
        ];

      case 'website':
        return 'WEBSITE';
        
      default:
        return [
          { type: 'error', content: `Command not found: ${command}` },
          { type: 'error', content: "Type 'help' to see available commands." }
        ];
    }
  };

  const executeCommand = async (command) => {
    const cmd = command.toLowerCase().trim();
    setIsExecuting(true);

    // Track command usage
    await trackCommand(cmd);

    // Add the command to history
    const newHistory = [...history, { type: 'input', content: `user@caid:~$ ${command}` }];
    
    if (cmd === 'clear') {
      const welcomeMessage = companyData?.system?.welcome_message || 'Welcome to the frontline against synthetic media.';
      const version = companyData?.system?.version || '1.0';
      
      setHistory([
        { type: 'system', content: `Initializing CAID v${version}... Connection secure.` },
        { type: 'system', content: welcomeMessage },
        { type: 'system', content: "Type 'help' to see available commands." },
        { type: 'system', content: "Type 'website' to view traditional website layout." },
        { type: 'prompt', content: '' }
      ]);
    } else if (cmd === 'website') {
      // Switch to website view
      setHistory(prev => [...newHistory, 
        { type: 'system', content: 'Loading website interface...' },
        { type: 'system', content: 'Website loaded. Use terminal commands or scroll to navigate.' },
        { type: 'system', content: "Type 'terminal' to return to terminal-only mode." }
      ]);
      setTimeout(() => {
        setShowWebsite(true);
      }, 500);
    } else {
      const output = generateCommandResponse(command);
      setHistory(prev => [...newHistory, ...output, { type: 'prompt', content: '' }]);
    }

    setCurrentInput('');
    
    // Simulate command execution delay
    setTimeout(() => {
      setIsExecuting(false);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentInput.trim() && !isExecuting && !showWebsite) {
      executeCommand(currentInput);
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current && !isExecuting && !showWebsite) {
      inputRef.current.focus();
    }
  };

  const handleContactFormSuccess = (response) => {
    // Add success message to terminal
    setHistory(prev => [
      ...prev.slice(0, -1), // Remove last prompt
      { type: 'output', content: '' },
      { type: 'output', content: '✓ Investment inquiry submitted successfully!' },
      { type: 'output', content: `  Inquiry ID: ${response.id}` },
      { type: 'output', content: '  Our team will review your inquiry and respond within 48 hours.' },
      { type: 'output', content: '' },
      { type: 'output', content: 'Thank you for your interest in CAID.' },
      { type: 'prompt', content: '' }
    ]);
  };

  const handleContactFormError = (error) => {
    // Add error message to terminal
    setHistory(prev => [
      ...prev.slice(0, -1), // Remove last prompt
      { type: 'output', content: '' },
      { type: 'error', content: '✗ Failed to submit inquiry. Please try again.' },
      { type: 'error', content: `  Error: ${error.message || 'Unknown error'}` },
      { type: 'output', content: '' },
      { type: 'prompt', content: '' }
    ]);
  };

  const handleTerminalCommand = (command) => {
    if (command.toLowerCase() === 'terminal') {
      setShowWebsite(false);
      setHistory(prev => [
        ...prev,
        { type: 'input', content: `user@caid:~$ ${command}` },
        { type: 'system', content: 'Returning to terminal mode...' },
        { type: 'prompt', content: '' }
      ]);
    } else {
      // Execute regular terminal commands while in website view
      executeCommand(command);
    }
  };

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      <div className="terminal-header">
        <div className="terminal-logo">
          <img src="https://customer-assets.emergentagent.com/job_deepfake-guard-1/artifacts/gnpp68oo_caid.jpg" alt="CAID Logo" className="logo-image" />
          CAID // CONTENT AUTHENTICITY INITIATIVE
        </div>
        {showWebsite && (
          <div className="website-mode-indicator">
            <span>Website Mode - Type 'terminal' to return</span>
          </div>
        )}
      </div>
      
      <div className="terminal-body" ref={terminalRef}>
        {showWebsite ? (
          <WebsiteView 
            companyData={companyData}
            roadmapData={roadmapData}
            teamData={teamData}
            onTerminalCommand={handleTerminalCommand}
          />
        ) : (
          <>
            {history.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                {item.type === 'prompt' ? (
                  <div className="input-line">
                    <span className="prompt">user@caid:~$ </span>
                    {index === history.length - 1 && !isExecuting ? (
                      <>
                        <input
                          ref={inputRef}
                          type="text"
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="terminal-input"
                          disabled={isExecuting}
                        />
                        <span className={`cursor ${showCursor ? 'visible' : ''}`}>█</span>
                      </>
                    ) : null}
                  </div>
                ) : item.type === 'form' && item.content === 'contact_form' ? (
                  <ContactForm
                    onSubmitSuccess={handleContactFormSuccess}
                    onSubmitError={handleContactFormError}
                  />
                ) : (
                  <pre>{item.content}</pre>
                )}
              </div>
            ))}
            
            {isExecuting && (
              <div className="terminal-line processing">
                <LoadingSpinner message="Processing command" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Terminal;