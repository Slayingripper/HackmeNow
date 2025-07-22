/**
 * WiresharkSimulator - Network packet capture and analysis interface
 */
export class WiresharkSimulator {
  constructor() {
    this.window = document.getElementById('wireshark-window');
    this.startButton = document.getElementById('start-capture');
    this.stopButton = document.getElementById('stop-capture');
    this.interfaceSelect = document.getElementById('interface-select');
    this.packetList = document.getElementById('packet-list');
    this.packetDetails = document.getElementById('packet-details');
    
    this.isCapturing = false;
    this.packets = [];
    this.selectedPacket = null;
    this.packetId = 1;
    
    // Predefined interesting packets that might contain sensitive info
    this.interestingPackets = [
      {
        protocol: 'HTTP',
        src: '192.168.1.105',
        dst: '151.101.193.140',
        info: 'POST /login.php',
        sensitive: true,
        details: {
          method: 'POST',
          uri: '/login.php',
          headers: {
            'Host': 'banking.example.com',
            'User-Agent': 'Mozilla/5.0...',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'username=john_doe&password=mySecretPass123&submit=Login'
        }
      },
      {
        protocol: 'SMTP',
        src: '192.168.1.106',
        dst: '74.125.224.72',
        info: 'MAIL FROM: <sarah@example.com>',
        sensitive: true,
        details: {
          command: 'MAIL FROM',
          sender: 'sarah@example.com',
          content: 'Meeting tomorrow at the bank, PIN is 4729'
        }
      },
      {
        protocol: 'FTP',
        src: '192.168.1.107',
        dst: '203.0.113.1',
        info: 'USER: admin PASS: secretFTP2023',
        sensitive: true,
        details: {
          username: 'admin',
          password: 'secretFTP2023',
          command: 'STOR confidential_docs.zip'
        }
      }
    ];
  }

  async initialize() {
    this.setupEventListeners();
    this.createPacketListHeader();
  }

  setupEventListeners() {
    this.startButton.addEventListener('click', () => this.startCapture());
    this.stopButton.addEventListener('click', () => this.stopCapture());
    
    this.packetList.addEventListener('click', (e) => {
      const packetItem = e.target.closest('.packet-item');
      if (packetItem) {
        this.selectPacket(packetItem);
      }
    });
  }

  createPacketListHeader() {
    const header = document.createElement('div');
    header.className = 'packet-item packet-header';
    header.style.background = 'var(--bg-tertiary)';
    header.style.fontWeight = 'bold';
    header.innerHTML = `
      <span>No.</span>
      <span>Time</span>
      <span>Source</span>
      <span>Destination</span>
      <span>Protocol</span>
      <span>Length</span>
      <span>Info</span>
    `;
    this.packetList.appendChild(header);
  }

  startCapture() {
    this.isCapturing = true;
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    
    // Clear previous packets
    this.packets = [];
    this.packetList.innerHTML = '';
    this.createPacketListHeader();
    
    // Start generating packets
    this.captureInterval = setInterval(() => {
      this.generateRandomPacket();
      
      // Occasionally add interesting packets
      if (Math.random() < 0.1) {
        this.addInterestingPacket();
      }
    }, 500);
    
    console.log('📡 Packet capture started');
  }

  stopCapture() {
    this.isCapturing = false;
    this.startButton.disabled = false;
    this.stopButton.disabled = true;
    
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }
    
    console.log('📡 Packet capture stopped');
  }

  generateRandomPacket() {
    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ARP', 'ICMP'];
    const sourceIps = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '192.168.1.103'];
    const destIps = ['8.8.8.8', '74.125.224.72', '151.101.193.140', '172.217.12.142'];
    
    const packet = {
      id: this.packetId++,
      timestamp: new Date(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      src: sourceIps[Math.floor(Math.random() * sourceIps.length)],
      dst: destIps[Math.floor(Math.random() * destIps.length)],
      length: Math.floor(Math.random() * 1500) + 64,
      info: this.generatePacketInfo(),
      sensitive: false
    };
    
    this.addPacket(packet);
  }

  generatePacketInfo() {
    const infos = [
      'Standard query A www.google.com',
      '[TCP] [PSH, ACK] Seq=1 Ack=1',
      'TLS Application Data',
      'HTTP GET /index.html',
      'Who has 192.168.1.1? Tell 192.168.1.100',
      'Echo (ping) request',
      'Standard query response A 74.125.224.72'
    ];
    
    return infos[Math.floor(Math.random() * infos.length)];
  }

  addInterestingPacket() {
    const interestingPacket = this.interestingPackets[Math.floor(Math.random() * this.interestingPackets.length)];
    const packet = {
      id: this.packetId++,
      timestamp: new Date(),
      ...interestingPacket,
      length: Math.floor(Math.random() * 800) + 200
    };
    
    this.addPacket(packet);
    
    // Highlight sensitive packets
    setTimeout(() => {
      const packetElements = this.packetList.querySelectorAll('.packet-item');
      const lastPacket = packetElements[packetElements.length - 1];
      if (lastPacket && packet.sensitive) {
        lastPacket.style.background = 'rgba(255, 0, 128, 0.1)';
        lastPacket.style.border = '1px solid var(--text-accent)';
      }
    }, 100);
  }

  addPacket(packet) {
    this.packets.push(packet);
    
    const packetElement = document.createElement('div');
    packetElement.className = 'packet-item';
    packetElement.dataset.packetId = packet.id;
    
    const timeString = packet.timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      fractionalSecondDigits: 3 
    });
    
    packetElement.innerHTML = `
      <span>${packet.id}</span>
      <span>${timeString}</span>
      <span>${packet.src}</span>
      <span>${packet.dst}</span>
      <span>${packet.protocol}</span>
      <span>${packet.length}</span>
      <span>${packet.info}</span>
    `;
    
    this.packetList.appendChild(packetElement);
    
    // Auto-scroll to bottom
    this.packetList.scrollTop = this.packetList.scrollHeight;
    
    // Limit packet display to prevent memory issues
    if (this.packets.length > 1000) {
      this.packets.shift();
      const firstPacketElement = this.packetList.querySelector('.packet-item:not(.packet-header)');
      if (firstPacketElement) {
        firstPacketElement.remove();
      }
    }
  }

  selectPacket(packetElement) {
    // Remove previous selection
    const previousSelected = this.packetList.querySelector('.packet-item.selected');
    if (previousSelected) {
      previousSelected.classList.remove('selected');
    }
    
    // Select new packet
    packetElement.classList.add('selected');
    
    const packetId = parseInt(packetElement.dataset.packetId);
    this.selectedPacket = this.packets.find(p => p.id === packetId);
    
    if (this.selectedPacket) {
      this.displayPacketDetails(this.selectedPacket);
      
      // If sensitive packet, update game state
      if (this.selectedPacket.sensitive) {
        this.handleSensitivePacket(this.selectedPacket);
      }
    }
  }

  displayPacketDetails(packet) {
    let detailsHtml = `
      <div class="packet-detail-section">
        <h4>Frame ${packet.id}: ${packet.length} bytes on wire</h4>
        <div>Arrival Time: ${packet.timestamp.toISOString()}</div>
        <div>Frame Length: ${packet.length} bytes</div>
      </div>
      
      <div class="packet-detail-section">
        <h4>Internet Protocol Version 4</h4>
        <div>Source: ${packet.src}</div>
        <div>Destination: ${packet.dst}</div>
        <div>Protocol: ${packet.protocol}</div>
      </div>
    `;
    
    // Add protocol-specific details
    if (packet.details) {
      detailsHtml += this.formatProtocolDetails(packet);
    }
    
    this.packetDetails.innerHTML = detailsHtml;
  }

  formatProtocolDetails(packet) {
    let html = `<div class="packet-detail-section"><h4>${packet.protocol} Details</h4>`;
    
    switch (packet.protocol) {
      case 'HTTP':
        html += `
          <div>Method: ${packet.details.method}</div>
          <div>URI: ${packet.details.uri}</div>
          <div>Host: ${packet.details.headers?.Host || 'Unknown'}</div>
        `;
        
        if (packet.details.body) {
          html += `
            <div style="margin-top: 10px; padding: 8px; background: var(--bg-secondary); border-radius: 4px;">
              <strong>Form Data:</strong><br>
              <span style="color: var(--text-accent);">${packet.details.body}</span>
            </div>
          `;
        }
        break;
        
      case 'SMTP':
        html += `
          <div>Command: ${packet.details.command}</div>
          <div>Sender: ${packet.details.sender}</div>
          <div style="margin-top: 10px; padding: 8px; background: var(--bg-secondary); border-radius: 4px;">
            <strong>Message Content:</strong><br>
            <span style="color: var(--text-warning);">${packet.details.content}</span>
          </div>
        `;
        break;
        
      case 'FTP':
        html += `
          <div>Username: <span style="color: var(--text-accent);">${packet.details.username}</span></div>
          <div>Password: <span style="color: var(--text-accent);">${packet.details.password}</span></div>
          <div>Command: ${packet.details.command}</div>
        `;
        break;
    }
    
    html += '</div>';
    return html;
  }

  handleSensitivePacket(packet) {
    switch (packet.protocol) {
      case 'HTTP':
        if (packet.details.body && packet.details.body.includes('password=')) {
          const match = packet.details.body.match(/username=([^&]+)&password=([^&]+)/);
          if (match) {
            const credentials = { username: match[1], password: match[2] };
            window.gameEngine?.captureCredentials(credentials);
            
            // Show notification
            this.showNotification('Credentials Captured!', `${credentials.username}:${credentials.password}`);
          }
        }
        break;
        
      case 'FTP':
        if (packet.details.username && packet.details.password) {
          const credentials = { 
            username: packet.details.username, 
            password: packet.details.password,
            service: 'FTP'
          };
          window.gameEngine?.captureCredentials(credentials);
          this.showNotification('FTP Credentials Found!', `${credentials.username}:${credentials.password}`);
        }
        break;
        
      case 'SMTP':
        if (packet.details.content && packet.details.content.includes('PIN')) {
          const pinMatch = packet.details.content.match(/PIN is (\\d+)/);
          if (pinMatch) {
            this.showNotification('Banking PIN Intercepted!', `PIN: ${pinMatch[1]}`);
            window.gameEngine?.captureCredentials({ type: 'PIN', value: pinMatch[1] });
          }
        }
        break;
    }
  }

  showNotification(title, message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: var(--text-accent);
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 12px; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Public method to add packets from external sources
  addExternalPacket(packet) {
    if (this.isCapturing) {
      packet.id = this.packetId++;
      packet.timestamp = new Date();
      this.addPacket(packet);
    }
  }

  // Get captured packets for analysis
  getCapturedPackets() {
    return [...this.packets];
  }

  // Export packets (simulated)
  exportPackets() {
    const packetData = this.packets.map(p => ({
      id: p.id,
      timestamp: p.timestamp.toISOString(),
      src: p.src,
      dst: p.dst,
      protocol: p.protocol,
      length: p.length,
      info: p.info
    }));
    
    console.log('📁 Exporting packets:', packetData);
    return packetData;
  }
}
