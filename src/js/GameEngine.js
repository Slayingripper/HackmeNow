/**
 * GameEngine - Main game controller and state management
 */
class GameEngine {
  constructor() {
    this.gameInterface = document.getElementById('game-interface');
    this.missionPanel = document.getElementById('mission-panel');
    this.systemTime = document.getElementById('system-time');
    this.connectionStatus = document.getElementById('connection-status');
    
    // Game state
    this.gameState = {
      currentMission: 0,
      objectives: [],
      discoveredHosts: [],
      capturedData: [],
      vulnerabilities: [],
      exploits: []
    };
    
    // Initialize components
    this.windowManager = new WindowManager();
    this.terminal = new Terminal();
    this.wireshark = new WiresharkSimulator();
    this.networkMonitor = new NetworkMonitor();
    this.fileExplorer = new FileExplorer();
    this.storyline = new StorylineManager();
    
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Show game interface
    this.gameInterface.classList.remove('hidden');
    this.gameInterface.classList.add('fade-in');
    
    // Initialize all components
    await this.initializeComponents();
    
    // Start game systems
    this.startSystemClock();
    this.startNetworkSimulation();
    this.setupEventListeners();
    
    // Begin storyline
    await this.storyline.startMission(0);
    
    this.isInitialized = true;
    
    console.log('🎮 HackmeNow initialized successfully');
  }

  async initializeComponents() {
    // Initialize window management
    this.windowManager.initialize();
    
    // Initialize terminal
    await this.terminal.initialize();
    
    // Initialize network simulator
    await this.wireshark.initialize();
    
    // Initialize network monitor
    await this.networkMonitor.initialize();
    
    // Initialize file explorer
    await this.fileExplorer.initialize();
    
    // Initialize storyline
    await this.storyline.initialize();
  }

  startSystemClock() {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      this.systemTime.textContent = timeString;
    };
    
    updateTime();
    setInterval(updateTime, 1000);
  }

  startNetworkSimulation() {
    // Simulate network activity
    this.networkActivity = setInterval(() => {
      this.simulateNetworkTraffic();
    }, 2000);
  }

  simulateNetworkTraffic() {
    // Generate random network packets
    const packetTypes = [
      { protocol: 'HTTP', src: '192.168.1.100', dst: '74.125.224.72', info: 'GET /search?q=vacation' },
      { protocol: 'HTTPS', src: '192.168.1.101', dst: '151.101.193.140', info: 'TLS Application Data' },
      { protocol: 'DNS', src: '192.168.1.102', dst: '8.8.8.8', info: 'Standard query A banking.example.com' },
      { protocol: 'TCP', src: '192.168.1.103', dst: '23.21.227.169', info: '[PSH, ACK] Seq=1 Ack=1' },
      { protocol: 'SSH', src: '192.168.1.104', dst: '134.195.101.26', info: 'Server Protocol: SSH-2.0' }
    ];
    
    const packet = packetTypes[Math.floor(Math.random() * packetTypes.length)];
    packet.timestamp = new Date().toISOString();
    packet.length = Math.floor(Math.random() * 1500) + 64;
    
    // Add to wireshark if capturing
    if (this.wireshark.isCapturing) {
      this.wireshark.addPacket(packet);
    }
    
    // Update network monitor
    this.networkMonitor.updateStats(packet);
  }

  setupEventListeners() {
    // Mission panel minimize
    document.getElementById('minimize-mission').addEventListener('click', () => {
      const content = document.getElementById('mission-content');
      content.classList.toggle('hidden');
    });
    
    // Window controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('control')) {
        this.handleWindowControl(e.target);
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  handleWindowControl(control) {
    const window = control.closest('.window');
    
    if (control.classList.contains('close')) {
      window.classList.add('hidden');
    } else if (control.classList.contains('minimize')) {
      window.style.transform = 'scale(0.1)';
      window.style.opacity = '0.5';
      setTimeout(() => {
        window.classList.add('hidden');
        window.style.transform = '';
        window.style.opacity = '';
      }, 300);
    } else if (control.classList.contains('maximize')) {
      if (window.dataset.maximized === 'true') {
        // Restore
        window.style.width = window.dataset.originalWidth;
        window.style.height = window.dataset.originalHeight;
        window.style.top = window.dataset.originalTop;
        window.style.left = window.dataset.originalLeft;
        window.dataset.maximized = 'false';
      } else {
        // Maximize
        window.dataset.originalWidth = window.style.width;
        window.dataset.originalHeight = window.style.height;
        window.dataset.originalTop = window.style.top;
        window.dataset.originalLeft = window.style.left;
        
        window.style.width = 'calc(100vw - 40px)';
        window.style.height = 'calc(100vh - 80px)';
        window.style.top = '20px';
        window.style.left = '20px';
        window.dataset.maximized = 'true';
      }
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl+Shift combinations for quick window access
    if (e.ctrlKey && e.shiftKey) {
      switch (e.code) {
        case 'KeyT':
          e.preventDefault();
          this.showWindow('terminal-window');
          break;
        case 'KeyW':
          e.preventDefault();
          this.showWindow('wireshark-window');
          break;
        case 'KeyN':
          e.preventDefault();
          this.showWindow('network-window');
          break;
        case 'KeyE':
          e.preventDefault();
          this.showWindow('explorer-window');
          break;
      }
    }
    
    // Escape to close active window
    if (e.code === 'Escape') {
      const activeWindow = document.querySelector('.window:not(.hidden)');
      if (activeWindow) {
        activeWindow.classList.add('hidden');
      }
    }
  }

  showWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
      window.classList.remove('hidden');
      window.classList.add('fade-in');
      
      // Bring to front
      const windows = document.querySelectorAll('.window');
      let maxZ = 100;
      windows.forEach(w => {
        const z = parseInt(w.style.zIndex) || 100;
        if (z > maxZ) maxZ = z;
      });
      window.style.zIndex = maxZ + 1;
    }
  }

  updateObjective(objectiveId, completed = true) {
    const objective = document.getElementById(objectiveId);
    if (objective) {
      if (completed) {
        objective.classList.remove('active');
        objective.classList.add('completed');
        objective.querySelector('i').className = 'fas fa-check-circle';
      } else {
        objective.classList.add('active');
        objective.querySelector('i').className = 'fas fa-circle-notch';
      }
    }
  }

  addDiscoveredHost(host) {
    this.gameState.discoveredHosts.push(host);
    this.fileExplorer.updateHostList(this.gameState.discoveredHosts);
  }

  addVulnerability(vuln) {
    this.gameState.vulnerabilities.push(vuln);
    this.networkMonitor.updateVulnerabilities(this.gameState.vulnerabilities.length);
  }

  captureCredentials(credentials) {
    this.gameState.capturedData.push({
      type: 'credentials',
      data: credentials,
      timestamp: new Date().toISOString()
    });
    
    // Notify user
    this.terminal.addLine(`[+] Credentials captured: ${credentials.username}:${credentials.password}`, 'success');
  }

  executeExploit(exploit) {
    this.gameState.exploits.push(exploit);
    this.terminal.addLine(`[+] Exploit executed: ${exploit.name}`, 'success');
    
    // Update objectives based on exploit
    if (exploit.name.includes('RCE')) {
      this.updateObjective('obj-3');
    }
  }

  // Public API for storyline progression
  progressStory() {
    this.storyline.nextScene();
  }

  getGameState() {
    return { ...this.gameState };
  }

  cleanup() {
    if (this.networkActivity) {
      clearInterval(this.networkActivity);
    }
  }
}
