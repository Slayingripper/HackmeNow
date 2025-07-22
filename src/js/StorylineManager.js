/**
 * StorylineManager - Handles game progression and narrative elements
 */
export class StorylineManager {
  constructor() {
    this.currentMission = 0;
    this.currentScene = 0;
    this.missionPanel = document.getElementById('mission-panel');
    this.objectives = [
      document.getElementById('obj-1'),
      document.getElementById('obj-2'),
      document.getElementById('obj-3'),
      document.getElementById('obj-4')
    ];
    
    this.missions = [
      {
        id: 0,
        title: 'Initial Infiltration',
        description: 'Establish foothold in target network',
        scenes: [
          {
            trigger: 'start',
            action: this.scene_initialAccess.bind(this),
            description: 'Trojan activated, establishing connection'
          },
          {
            trigger: 'terminal_ready',
            action: this.scene_firstCommands.bind(this),
            description: 'Begin network reconnaissance'
          },
          {
            trigger: 'network_scan',
            action: this.scene_hostDiscovery.bind(this),
            description: 'Discover network hosts'
          }
        ]
      },
      {
        id: 1,
        title: 'Data Harvesting',
        description: 'Monitor traffic and collect credentials',
        scenes: [
          {
            trigger: 'wireshark_start',
            action: this.scene_packetCapture.bind(this),
            description: 'Begin packet analysis'
          },
          {
            trigger: 'credentials_found',
            action: this.scene_credentialsHarvest.bind(this),
            description: 'Extract login credentials'
          }
        ]
      },
      {
        id: 2,
        title: 'System Compromise',
        description: 'Gain deeper access to target systems',
        scenes: [
          {
            trigger: 'privilege_escalation',
            action: this.scene_systemAccess.bind(this),
            description: 'Escalate privileges'
          },
          {
            trigger: 'backdoor_install',
            action: this.scene_persistence.bind(this),
            description: 'Install persistent access'
          }
        ]
      },
      {
        id: 3,
        title: 'Financial Extraction',
        description: 'Access banking systems and extract funds',
        scenes: [
          {
            trigger: 'banking_access',
            action: this.scene_bankingAccess.bind(this),
            description: 'Access banking credentials'
          },
          {
            trigger: 'fund_transfer',
            action: this.scene_moneyTransfer.bind(this),
            description: 'Execute fraudulent transfer'
          },
          {
            trigger: 'mission_complete',
            action: this.scene_missionComplete.bind(this),
            description: 'Mission accomplished'
          }
        ]
      }
    ];
    
    this.gameEvents = [];
    this.storyFlags = new Set();
  }

  async initialize() {
    this.setupEventListeners();
    console.log('📖 Storyline Manager initialized');
  }

  setupEventListeners() {
    // Listen for game events that trigger story progression
    document.addEventListener('story-trigger', (e) => {
      this.handleStoryTrigger(e.detail.trigger, e.detail.data);
    });
  }

  async startMission(missionId) {
    this.currentMission = missionId;
    this.currentScene = 0;
    
    const mission = this.missions[missionId];
    if (!mission) return;
    
    console.log(`🎯 Starting mission: ${mission.title}`);
    
    // Trigger first scene
    if (mission.scenes.length > 0) {
      await this.playScene(mission.scenes[0]);
    }
  }

  async playScene(scene) {
    console.log(`🎬 Playing scene: ${scene.description}`);
    
    try {
      await scene.action();
      this.currentScene++;
    } catch (error) {
      console.error('Error playing scene:', error);
    }
  }

  handleStoryTrigger(trigger, data = null) {
    const currentMission = this.missions[this.currentMission];
    if (!currentMission) return;
    
    // Find matching scene in current mission
    const scene = currentMission.scenes.find(s => s.trigger === trigger);
    if (scene) {
      this.playScene(scene);
    }
    
    // Check for mission progression
    this.checkMissionProgress(trigger, data);
  }

  checkMissionProgress(trigger, data) {
    switch (trigger) {
      case 'network_scan':
        this.completeObjective(0);
        this.activateObjective(1);
        break;
      case 'credentials_found':
        this.completeObjective(1);
        this.activateObjective(2);
        break;
      case 'system_access':
        this.completeObjective(2);
        this.activateObjective(3);
        break;
      case 'banking_access':
        this.completeObjective(3);
        break;
    }
  }

  completeObjective(index) {
    if (this.objectives[index]) {
      this.objectives[index].classList.remove('active');
      this.objectives[index].classList.add('completed');
      this.objectives[index].querySelector('i').className = 'fas fa-check-circle';
      
      this.showStoryMessage(`✅ Objective completed: ${this.objectives[index].querySelector('span').textContent}`);
    }
  }

  activateObjective(index) {
    if (this.objectives[index]) {
      this.objectives[index].classList.add('active');
      this.objectives[index].querySelector('i').className = 'fas fa-circle-notch';
      
      this.showStoryMessage(`🎯 New objective: ${this.objectives[index].querySelector('span').textContent}`);
    }
  }

  // Scene implementations
  async scene_initialAccess() {
    await this.showStoryMessage('🔗 Trojan successfully executed on target network');
    await this.showStoryMessage('📡 Establishing secure command channel...');
    await this.showStoryMessage('✅ Connection established - Welcome to the home network');
    
    // Activate first objective
    this.activateObjective(0);
    
    // Give hint about terminal
    setTimeout(() => {
      this.showStoryMessage('💡 Hint: Use the terminal to scan the network (try "nmap 192.168.1.0/24")');
    }, 3000);
  }

  async scene_firstCommands() {
    await this.showStoryMessage('🖥️ Terminal access confirmed');
    await this.showStoryMessage('📋 Available tools: nmap, wireshark, metasploit, hydra, and more');
    await this.showStoryMessage('🔍 Begin reconnaissance to map the network topology');
  }

  async scene_hostDiscovery() {
    await this.showStoryMessage('🏠 Multiple devices discovered on home network:');
    await this.showStoryMessage('💻 Personal computers, mobile devices, IoT equipment detected');
    await this.showStoryMessage('🎯 Proceed to monitor network traffic for credentials');
    
    // Trigger story event
    document.dispatchEvent(new CustomEvent('story-trigger', {
      detail: { trigger: 'wireshark_start' }
    }));
  }

  async scene_packetCapture() {
    await this.showStoryMessage('📊 Packet capture initiated - monitoring all network traffic');
    await this.showStoryMessage('👀 Watching for unencrypted login attempts...');
    await this.showStoryMessage('🔐 Banking sessions, email logins, and IoT communications under surveillance');
    
    // Start automated credential discovery
    setTimeout(() => {
      this.simulateCredentialDiscovery();
    }, 10000);
  }

  async scene_credentialsHarvest() {
    await this.showStoryMessage('🎉 SUCCESS! Banking credentials intercepted');
    await this.showStoryMessage('💳 Account details extracted from HTTPS session');
    await this.showStoryMessage('🏦 Target: First National Bank - Account: ****4892');
    await this.showStoryMessage('⚡ Preparing for system access escalation...');
    
    this.storyFlags.add('has_banking_creds');
  }

  async scene_systemAccess() {
    await this.showStoryMessage('🚀 Privilege escalation successful!');
    await this.showStoryMessage('🖥️ Administrative access gained to primary workstation');
    await this.showStoryMessage('📱 Mobile device access established');
    await this.showStoryMessage('📹 IoT camera feeds compromised');
    
    // Show file explorer
    setTimeout(() => {
      document.getElementById('explorer-window').classList.remove('hidden');
      this.showStoryMessage('💡 File explorer opened - search for sensitive documents');
    }, 2000);
  }

  async scene_persistence() {
    await this.showStoryMessage('🎭 Installing covert backdoors...');
    await this.showStoryMessage('⌨️ Keylogger deployed on all compromised systems');
    await this.showStoryMessage('📷 Camera access established for continuous monitoring');
    await this.showStoryMessage('🔄 Persistent access confirmed - maintaining stealth mode');
  }

  async scene_bankingAccess() {
    await this.showStoryMessage('🏛️ Banking portal access confirmed');
    await this.showStoryMessage('💰 Account balance: $47,832.19');
    await this.showStoryMessage('🔢 Two-factor authentication bypassed via SIM swapping');
    await this.showStoryMessage('💸 Initiating fund transfer sequence...');
  }

  async scene_moneyTransfer() {
    await this.showStoryMessage('💵 Transfer initiated: $15,000 to offshore account');
    await this.showStoryMessage('🌐 Routing through multiple international banks...');
    await this.showStoryMessage('🔒 Transaction masked as legitimate business payment');
    await this.showStoryMessage('✅ Transfer completed successfully');
    
    this.storyFlags.add('money_transferred');
    
    // Trigger mission complete
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('story-trigger', {
        detail: { trigger: 'mission_complete' }
      }));
    }, 3000);
  }

  async scene_missionComplete() {
    await this.showStoryMessage('🎊 MISSION ACCOMPLISHED!');
    await this.showStoryMessage('💰 $15,000 successfully extracted');
    await this.showStoryMessage('🕵️ Maintaining persistent access for future operations');
    await this.showStoryMessage('🚫 Covering tracks - logs cleaned, evidence destroyed');
    await this.showStoryMessage('👻 Returning to stealth mode...');
    
    // Show completion stats
    setTimeout(() => {
      this.showMissionSummary();
    }, 5000);
  }

  simulateCredentialDiscovery() {
    // Simulate finding credentials over time
    const discoveries = [
      { delay: 2000, type: 'email', creds: 'john.doe@email.com:password123' },
      { delay: 5000, type: 'wifi', creds: 'HomeWiFi:familypassword' },
      { delay: 8000, type: 'banking', creds: 'johndoe:SecureBank789!' },
      { delay: 12000, type: 'social', creds: 'johnnyboy:socialpass456' }
    ];
    
    discoveries.forEach(({ delay, type, creds }) => {
      setTimeout(() => {
        this.showStoryMessage(`🔑 ${type.toUpperCase()} credentials found: ${creds}`);
        
        if (type === 'banking') {
          document.dispatchEvent(new CustomEvent('story-trigger', {
            detail: { trigger: 'credentials_found', data: { type, creds } }
          }));
        }
      }, delay);
    });
  }

  showStoryMessage(message, duration = 5000) {
    return new Promise((resolve) => {
      // Create message element
      const messageEl = document.createElement('div');
      messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid var(--text-accent);
        color: var(--text-primary);
        padding: 20px 30px;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: 16px;
        z-index: 10000;
        max-width: 80%;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 0, 128, 0.3);
        animation: storyMessageIn 0.5s ease-out;
      `;
      
      messageEl.textContent = message;
      document.body.appendChild(messageEl);
      
      // Remove after duration
      setTimeout(() => {
        messageEl.style.animation = 'storyMessageOut 0.5s ease-in';
        setTimeout(() => {
          messageEl.remove();
          resolve();
        }, 500);
      }, duration);
    });
  }

  showMissionSummary() {
    const summary = document.createElement('div');
    summary.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--window-bg);
      border: var(--window-border);
      border-radius: 12px;
      padding: 30px;
      z-index: 10000;
      max-width: 500px;
      width: 90%;
      color: var(--text-secondary);
      box-shadow: 0 0 50px rgba(0, 255, 0, 0.2);
    `;
    
    const stats = this.calculateMissionStats();
    
    summary.innerHTML = `
      <h2 style="color: var(--text-primary); text-align: center; margin-bottom: 20px;">
        🏆 Mission Complete
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: var(--text-accent); margin-bottom: 10px;">📊 Statistics</h3>
        <div>💰 Funds Extracted: $15,000</div>
        <div>🔐 Credentials Captured: ${stats.credentials}</div>
        <div>💻 Systems Compromised: ${stats.systems}</div>
        <div>📱 Devices Accessed: ${stats.devices}</div>
        <div>⏱️ Mission Duration: ${stats.duration}</div>
        <div>🎯 Stealth Rating: ${stats.stealth}/10</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: var(--text-accent); margin-bottom: 10px;">🏅 Achievements</h3>
        <div>✅ Ghost in the Shell - Remained undetected</div>
        <div>✅ Data Hunter - Extracted sensitive files</div>
        <div>✅ Money Heist - Successful fund transfer</div>
        <div>✅ IoT Infiltrator - Compromised smart devices</div>
      </div>
      
      <div style="text-align: center;">
        <button onclick="this.parentElement.remove(); location.reload();" style="
          background: var(--text-accent);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 10px;
        ">🔄 Play Again</button>
        
        <button onclick="this.parentElement.remove();" style="
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Continue Exploring</button>
      </div>
    `;
    
    document.body.appendChild(summary);
  }

  calculateMissionStats() {
    // Calculate mission statistics
    const endTime = new Date();
    const startTime = this.missionStartTime || new Date(endTime - 15 * 60 * 1000); // Default 15 min
    const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes
    
    return {
      credentials: Math.floor(Math.random() * 10) + 15, // 15-25
      systems: Math.floor(Math.random() * 3) + 4, // 4-7
      devices: Math.floor(Math.random() * 5) + 6, // 6-11
      duration: `${duration} minutes`,
      stealth: Math.floor(Math.random() * 2) + 9 // 9-10
    };
  }

  nextScene() {
    const currentMission = this.missions[this.currentMission];
    if (!currentMission) return;
    
    if (this.currentScene < currentMission.scenes.length) {
      this.playScene(currentMission.scenes[this.currentScene]);
    }
  }

  // Public API for triggering story events
  triggerEvent(eventType, data = null) {
    document.dispatchEvent(new CustomEvent('story-trigger', {
      detail: { trigger: eventType, data }
    }));
  }
}
