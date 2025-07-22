/**
 * NetworkMonitor - Real-time network activity visualization and statistics
 */
export class NetworkMonitor {
  constructor() {
    this.window = document.getElementById('network-window');
    this.activeConnectionsEl = document.getElementById('active-connections');
    this.dataCapturedEl = document.getElementById('data-captured');
    this.vulnerabilitiesEl = document.getElementById('vulnerabilities');
    this.chartCanvas = document.getElementById('network-chart');
    
    // Statistics
    this.stats = {
      activeConnections: 0,
      dataCaptured: 0, // in MB
      vulnerabilities: 0,
      packetsPerSecond: 0,
      bytesPerSecond: 0
    };
    
    // Chart data
    this.chartData = {
      labels: [],
      datasets: [{
        label: 'Network Traffic (KB/s)',
        data: [],
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
    
    this.chart = null;
    this.updateInterval = null;
  }

  async initialize() {
    this.initializeChart();
    this.startMonitoring();
    this.setupEventListeners();
  }

  initializeChart() {
    if (typeof Chart === 'undefined') {
      // Fallback if Chart.js is not loaded
      this.createFallbackChart();
      return;
    }
    
    const ctx = this.chartCanvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: '#333333'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'KB/s',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: '#333333'
            }
          }
        },
        elements: {
          point: {
            radius: 2
          }
        }
      }
    });
  }

  createFallbackChart() {
    // Simple fallback visualization without Chart.js
    this.chartCanvas.style.background = 'var(--bg-secondary)';
    this.chartCanvas.style.border = '1px solid var(--border-color)';
    
    const ctx = this.chartCanvas.getContext('2d');
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText('Network Monitor Active', 10, 30);
    ctx.fillText('Real-time traffic analysis enabled', 10, 50);
  }

  startMonitoring() {
    this.updateInterval = setInterval(() => {
      this.updateStats();
      this.updateChart();
      this.updateDisplay();
    }, 1000);
  }

  updateStats(packet = null) {
    // Simulate network activity
    this.stats.packetsPerSecond = Math.floor(Math.random() * 50) + 10;
    this.stats.bytesPerSecond = this.stats.packetsPerSecond * (Math.random() * 800 + 200);
    
    // Update data captured
    this.stats.dataCaptured += this.stats.bytesPerSecond / (1024 * 1024); // Convert to MB
    
    // Simulate connection changes
    if (Math.random() < 0.1) {
      this.stats.activeConnections += Math.random() < 0.5 ? 1 : -1;
      this.stats.activeConnections = Math.max(0, this.stats.activeConnections);
    }
    
    // If specific packet provided, analyze it
    if (packet) {
      this.analyzePacket(packet);
    }
  }

  analyzePacket(packet) {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      { pattern: /password/i, type: 'credential_exposure' },
      { pattern: /admin/i, type: 'admin_access' },
      { pattern: /login/i, type: 'authentication' },
      { pattern: /bank/i, type: 'financial_data' },
      { pattern: /credit/i, type: 'financial_data' },
      { pattern: /ssh/i, type: 'remote_access' },
      { pattern: /ftp/i, type: 'file_transfer' }
    ];
    
    suspiciousPatterns.forEach(({ pattern, type }) => {
      if (pattern.test(packet.info) || pattern.test(packet.src) || pattern.test(packet.dst)) {
        this.detectedActivity(type, packet);
      }
    });
  }

  detectedActivity(type, packet) {
    // Log detected activity
    console.log(`🚨 Detected ${type} activity:`, packet);
    
    // Add to game state
    if (window.gameEngine) {
      window.gameEngine.addVulnerability({
        type,
        packet: packet,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show alert in interface
    this.showSecurityAlert(type, packet);
  }

  showSecurityAlert(type, packet) {
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: alertPulse 2s ease-in-out;
    `;
    
    alert.innerHTML = `
      <strong>SECURITY ALERT:</strong> ${type.replace('_', ' ').toUpperCase()}<br>
      <small>${packet.src} → ${packet.dst} | ${packet.info}</small>
    `;
    
    this.window.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => alert.remove(), 5000);
  }

  updateChart() {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-US', { 
      hour12: false,
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Add new data point
    this.chartData.labels.push(timeLabel);
    this.chartData.datasets[0].data.push(Math.round(this.stats.bytesPerSecond / 1024)); // KB/s
    
    // Keep only last 20 data points
    if (this.chartData.labels.length > 20) {
      this.chartData.labels.shift();
      this.chartData.datasets[0].data.shift();
    }
    
    // Update chart if available
    if (this.chart) {
      this.chart.update('none'); // No animation for real-time updates
    } else {
      this.updateFallbackChart();
    }
  }

  updateFallbackChart() {
    const ctx = this.chartCanvas.getContext('2d');
    const width = this.chartCanvas.width;
    const height = this.chartCanvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'var(--bg-secondary)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw simple line graph
    const data = this.chartData.datasets[0].data;
    if (data.length > 1) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const maxValue = Math.max(...data) || 1;
      const stepX = width / (data.length - 1);
      
      data.forEach((value, index) => {
        const x = index * stepX;
        const y = height - (value / maxValue) * height * 0.8 - 20;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Traffic: ${Math.round(this.stats.bytesPerSecond / 1024)} KB/s`, 10, 20);
    ctx.fillText(`Packets: ${this.stats.packetsPerSecond}/s`, 10, 35);
  }

  updateDisplay() {
    // Update stat cards
    this.activeConnectionsEl.textContent = this.stats.activeConnections;
    this.dataCapturedEl.textContent = `${this.stats.dataCaptured.toFixed(2)} MB`;
    this.vulnerabilitiesEl.textContent = this.stats.vulnerabilities;
    
    // Color coding based on activity levels
    if (this.stats.bytesPerSecond > 50000) { // High activity
      this.activeConnectionsEl.style.color = 'var(--text-warning)';
    } else if (this.stats.bytesPerSecond > 20000) { // Medium activity
      this.activeConnectionsEl.style.color = 'var(--text-accent)';
    } else { // Low activity
      this.activeConnectionsEl.style.color = 'var(--text-primary)';
    }
  }

  setupEventListeners() {
    // Add click handlers for interactive elements
    const statCards = this.window.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('click', () => {
        this.showDetailedStats(card);
      });
    });
  }

  showDetailedStats(card) {
    const cardTitle = card.querySelector('h3').textContent;
    let details = '';
    
    switch (cardTitle) {
      case 'Active Connections':
        details = this.generateConnectionDetails();
        break;
      case 'Data Captured':
        details = this.generateDataDetails();
        break;
      case 'Vulnerabilities':
        details = this.generateVulnerabilityDetails();
        break;
    }
    
    // Show modal or detailed view
    this.showDetailsModal(cardTitle, details);
  }

  generateConnectionDetails() {
    const connections = [
      '192.168.1.100:4444 ← ESTABLISHED',
      '192.168.1.101:22 ← SSH_SESSION',
      '192.168.1.102:80 ← HTTP_MONITORING',
      '192.168.1.103:443 ← HTTPS_INTERCEPT',
      '192.168.1.104:3389 ← RDP_BACKDOOR'
    ];
    
    return connections.join('\\n');
  }

  generateDataDetails() {
    return `
Protocol Distribution:
• HTTP: ${(this.stats.dataCaptured * 0.4).toFixed(2)} MB
• HTTPS: ${(this.stats.dataCaptured * 0.3).toFixed(2)} MB
• TCP: ${(this.stats.dataCaptured * 0.2).toFixed(2)} MB
• Other: ${(this.stats.dataCaptured * 0.1).toFixed(2)} MB

Sensitive Data Found:
• Credentials: 12 pairs
• Email content: 8 messages
• Banking info: 3 sessions
`;
  }

  generateVulnerabilityDetails() {
    return `
Detected Vulnerabilities:
• Weak passwords: 5
• Unencrypted traffic: 8
• Open ports: 15
• Default credentials: 3
• SQL injection points: 2

Risk Level: HIGH
Recommendation: Immediate exploitation
`;
  }

  showDetailsModal(title, details) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: var(--window-bg);
      border: var(--window-border);
      border-radius: 8px;
      padding: 20px;
      max-width: 500px;
      max-height: 400px;
      overflow-y: auto;
      color: var(--text-secondary);
    `;
    
    content.innerHTML = `
      <h3 style="color: var(--text-primary); margin-bottom: 10px;">${title}</h3>
      <pre style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 12px;">${details}</pre>
      <button onclick="this.closest('.modal').remove()" style="
        margin-top: 15px;
        background: var(--text-accent);
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Close</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Public methods for game integration
  updateVulnerabilities(count) {
    this.stats.vulnerabilities = count;
  }

  addTrafficBurst() {
    // Simulate a traffic burst (for story events)
    this.stats.bytesPerSecond += 50000;
    setTimeout(() => {
      this.stats.bytesPerSecond = Math.max(1000, this.stats.bytesPerSecond - 50000);
    }, 5000);
  }

  simulateAttack(attackType) {
    // Simulate different attack patterns
    switch (attackType) {
      case 'ddos':
        this.stats.packetsPerSecond += 200;
        break;
      case 'port_scan':
        this.stats.activeConnections += 10;
        break;
      case 'data_exfiltration':
        this.stats.bytesPerSecond += 100000;
        break;
    }
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
