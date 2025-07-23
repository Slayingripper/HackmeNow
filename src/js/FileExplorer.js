/**
 * FileExplorer - File system browser with hacking context
 */
class FileExplorer {
  constructor() {
    this.window = document.getElementById('explorer-window');
    this.sidebar = this.window.querySelector('.explorer-sidebar');
    this.mainContent = document.getElementById('explorer-content');
    this.targetList = document.getElementById('target-list');
    
    this.currentTarget = null;
    this.discoveredDevices = [
      {
        id: 'johns-laptop',
        name: "John's Laptop",
        ip: '192.168.1.100',
        os: 'Windows 10',
        status: 'online',
        access: 'full',
        icon: 'fas fa-laptop',
        files: [
          { name: 'Documents', type: 'folder', size: null, modified: '2024-01-15' },
          { name: 'Downloads', type: 'folder', size: null, modified: '2024-01-20' },
          { name: 'bank_statements.pdf', type: 'file', size: '2.3 MB', modified: '2024-01-18', sensitive: true },
          { name: 'passwords.txt', type: 'file', size: '1.2 KB', modified: '2024-01-10', sensitive: true },
          { name: 'family_photos.zip', type: 'file', size: '156 MB', modified: '2024-01-12' },
          { name: 'work_presentation.pptx', type: 'file', size: '4.5 MB', modified: '2024-01-17' }
        ]
      },
      {
        id: 'sarahs-phone',
        name: "Sarah's Phone",
        ip: '192.168.1.101',
        os: 'Android 13',
        status: 'online',
        access: 'limited',
        icon: 'fas fa-mobile-alt',
        files: [
          { name: 'DCIM', type: 'folder', size: null, modified: '2024-01-19' },
          { name: 'WhatsApp', type: 'folder', size: null, modified: '2024-01-20' },
          { name: 'Banking App Data', type: 'folder', size: null, modified: '2024-01-18', sensitive: true },
          { name: 'contacts.vcf', type: 'file', size: '45 KB', modified: '2024-01-15', sensitive: true },
          { name: 'call_logs.db', type: 'file', size: '234 KB', modified: '2024-01-20', sensitive: true }
        ]
      },
      {
        id: 'smart-tv',
        name: 'Smart TV',
        ip: '192.168.1.102',
        os: 'Android TV',
        status: 'online',
        access: 'camera',
        icon: 'fas fa-tv',
        files: [
          { name: 'apps', type: 'folder', size: null, modified: '2024-01-10' },
          { name: 'media', type: 'folder', size: null, modified: '2024-01-19' },
          { name: 'netflix_cookies.dat', type: 'file', size: '12 KB', modified: '2024-01-18' },
          { name: 'viewing_history.log', type: 'file', size: '89 KB', modified: '2024-01-20' }
        ]
      },
      {
        id: 'security-camera',
        name: 'Security Camera',
        ip: '192.168.1.103',
        os: 'Embedded Linux',
        status: 'online',
        access: 'video_stream',
        icon: 'fas fa-camera',
        files: [
          { name: 'recordings', type: 'folder', size: null, modified: '2024-01-20' },
          { name: 'config.xml', type: 'file', size: '2 KB', modified: '2024-01-05', sensitive: true },
          { name: 'motion_events.log', type: 'file', size: '156 KB', modified: '2024-01-20' },
          { name: 'live_stream.m3u8', type: 'file', size: '1 KB', modified: '2024-01-20', sensitive: true }
        ]
      }
    ];
  }

  async initialize() {
    this.setupEventListeners();
    this.updateDeviceList();
    this.selectDevice(this.discoveredDevices[0]);
  }

  setupEventListeners() {
    this.targetList.addEventListener('click', (e) => {
      const listItem = e.target.closest('li');
      if (listItem) {
        const deviceId = listItem.dataset.deviceId;
        const device = this.discoveredDevices.find(d => d.id === deviceId);
        if (device) {
          this.selectDevice(device);
        }
      }
    });
  }

  updateDeviceList() {
    this.targetList.innerHTML = '';
    
    this.discoveredDevices.forEach(device => {
      const listItem = document.createElement('li');
      listItem.dataset.deviceId = device.id;
      listItem.innerHTML = `
        <i class="${device.icon}"></i>
        <span>${device.name}</span>
        <div class="device-status ${device.status}" style="
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${device.status === 'online' ? '#00ff00' : '#ff0000'};
          margin-left: auto;
          margin-right: 8px;
        "></div>
      `;
      
      this.targetList.appendChild(listItem);
    });
  }

  selectDevice(device) {
    // Update sidebar selection
    const listItems = this.targetList.querySelectorAll('li');
    listItems.forEach(item => {
      item.style.background = item.dataset.deviceId === device.id ? 'var(--bg-tertiary)' : '';
    });
    
    this.currentTarget = device;
    this.displayDeviceContent(device);
  }

  displayDeviceContent(device) {
    this.mainContent.innerHTML = `
      <div class="device-header" style="
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
      ">
        <div class="device-info">
          <h3 style="color: var(--text-primary); margin-bottom: 8px;">
            <i class="${device.icon}"></i> ${device.name}
          </h3>
          <div class="device-details" style="font-size: 12px; color: var(--text-secondary);">
            <div>IP: ${device.ip}</div>
            <div>OS: ${device.os}</div>
            <div>Access Level: <span style="color: ${this.getAccessColor(device.access)}">${device.access.toUpperCase()}</span></div>
            <div>Status: <span style="color: ${device.status === 'online' ? '#00ff00' : '#ff0000'}">${device.status.toUpperCase()}</span></div>
          </div>
        </div>
        <div class="device-actions" style="margin-top: 12px;">
          ${this.generateActionButtons(device)}
        </div>
      </div>
      <div class="file-listing">
        ${this.generateFileList(device.files)}
      </div>
    `;
    
    this.setupFileInteractions(device);
  }

  getAccessColor(access) {
    switch (access) {
      case 'full': return '#00ff00';
      case 'limited': return '#ffaa00';
      case 'camera': return '#ff0080';
      case 'video_stream': return '#00aaff';
      default: return '#ffffff';
    }
  }

  generateActionButtons(device) {
    const buttons = [];
    
    switch (device.access) {
      case 'full':
        buttons.push(
          '<button class="action-btn" data-action="download-all">📥 Download All</button>',
          '<button class="action-btn" data-action="install-keylogger">⌨️ Install Keylogger</button>',
          '<button class="action-btn" data-action="remote-shell">💻 Remote Shell</button>'
        );
        break;
      case 'limited':
        buttons.push(
          '<button class="action-btn" data-action="escalate">⚡ Escalate Privileges</button>',
          '<button class="action-btn" data-action="extract-data">📱 Extract Data</button>'
        );
        break;
      case 'camera':
        buttons.push(
          '<button class="action-btn" data-action="live-view">📺 Live View</button>',
          '<button class="action-btn" data-action="recording">🔴 Start Recording</button>'
        );
        break;
      case 'video_stream':
        buttons.push(
          '<button class="action-btn" data-action="camera-feed">📹 Camera Feed</button>',
          '<button class="action-btn" data-action="motion-alerts">🚨 Motion Alerts</button>'
        );
        break;
    }
    
    return buttons.join(' ');
  }

  generateFileList(files) {
    let html = `
      <div class="file-header" style="
        display: grid;
        grid-template-columns: 300px 100px 120px auto;
        gap: 16px;
        padding: 12px 16px;
        background: var(--bg-tertiary);
        border-bottom: 1px solid var(--border-color);
        font-weight: bold;
        font-size: 12px;
        color: var(--text-secondary);
      ">
        <div>Name</div>
        <div>Size</div>
        <div>Modified</div>
        <div>Actions</div>
      </div>
    `;
    
    files.forEach(file => {
      const sensitiveClass = file.sensitive ? 'sensitive-file' : '';
      const icon = file.type === 'folder' ? 'fas fa-folder' : 'fas fa-file';
      const iconColor = file.sensitive ? 'var(--text-accent)' : (file.type === 'folder' ? 'var(--text-primary)' : 'var(--text-secondary)');
      
      html += `
        <div class="file-item ${sensitiveClass}" style="
          display: grid;
          grid-template-columns: 300px 100px 120px auto;
          gap: 16px;
          padding: 8px 16px;
          border-bottom: 1px solid var(--border-color);
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        " data-file-name="${file.name}" data-file-type="${file.type}">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="${icon}" style="color: ${iconColor};"></i>
            <span>${file.name}</span>
            ${file.sensitive ? '<i class="fas fa-exclamation-triangle" style="color: var(--text-warning); margin-left: 8px;" title="Sensitive Data"></i>' : ''}
          </div>
          <div>${file.size || '-'}</div>
          <div>${file.modified}</div>
          <div class="file-actions">
            ${file.type === 'file' ? '<button class="mini-btn" data-action="download">📥</button>' : ''}
            ${file.type === 'file' ? '<button class="mini-btn" data-action="view">👁️</button>' : ''}
            ${file.type === 'folder' ? '<button class="mini-btn" data-action="open">📂</button>' : ''}
          </div>
        </div>
      `;
    });
    
    return html;
  }

  setupFileInteractions(device) {
    // Action buttons
    const actionButtons = this.mainContent.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleDeviceAction(device, action);
      });
    });
    
    // File interactions
    const fileItems = this.mainContent.querySelectorAll('.file-item');
    fileItems.forEach(item => {
      // Hover effect
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-secondary)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
      });
      
      // File action buttons
      const miniButtons = item.querySelectorAll('.mini-btn');
      miniButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = e.target.dataset.action;
          const fileName = item.dataset.fileName;
          const fileType = item.dataset.fileType;
          this.handleFileAction(device, fileName, fileType, action);
        });
      });
    });
  }

  handleDeviceAction(device, action) {
    switch (action) {
      case 'download-all':
        this.downloadAllFiles(device);
        break;
      case 'install-keylogger':
        this.installKeylogger(device);
        break;
      case 'remote-shell':
        this.openRemoteShell(device);
        break;
      case 'escalate':
        this.escalatePrivileges(device);
        break;
      case 'extract-data':
        this.extractMobileData(device);
        break;
      case 'live-view':
        this.startLiveView(device);
        break;
      case 'recording':
        this.startRecording(device);
        break;
      case 'camera-feed':
        this.viewCameraFeed(device);
        break;
      case 'motion-alerts':
        this.setupMotionAlerts(device);
        break;
    }
  }

  handleFileAction(device, fileName, fileType, action) {
    switch (action) {
      case 'download':
        this.downloadFile(device, fileName);
        break;
      case 'view':
        this.viewFile(device, fileName);
        break;
      case 'open':
        this.openFolder(device, fileName);
        break;
    }
  }

  downloadFile(device, fileName) {
    this.showNotification(`Downloading ${fileName} from ${device.name}...`);
    
    // Simulate download progress
    setTimeout(() => {
      this.showNotification(`✅ Downloaded ${fileName}`, 'success');
      
      // Check if it's sensitive data
      const file = device.files.find(f => f.name === fileName);
      if (file && file.sensitive) {
        this.handleSensitiveFileDownload(device, file);
      }
    }, 2000);
  }

  viewFile(device, fileName) {
    const file = device.files.find(f => f.name === fileName);
    if (!file) return;
    
    let content = '';
    switch (fileName) {
      case 'passwords.txt':
        content = 'bank_website: mySecurePass123\\nwork_email: companyPass456\\nwifi_network: homeWiFi789';
        break;
      case 'bank_statements.pdf':
        content = 'BANK STATEMENT\\nAccount: ****1234\\nBalance: $15,847.32\\nRecent Transactions:\\n- Transfer to John Smith: $2,500\\n- ATM Withdrawal: $200';
        break;
      case 'contacts.vcf':
        content = 'John Doe: +1-555-0123\\nSarah Smith: +1-555-0456\\nBank Manager: +1-555-BANK';
        break;
      case 'config.xml':
        content = '<config>\\n  <admin_user>admin</admin_user>\\n  <admin_pass>default123</admin_pass>\\n  <rtsp_port>554</rtsp_port>\\n</config>';
        break;
      default:
        content = `Content of ${fileName}\\n\\n[Binary/encrypted data]`;
    }
    
    this.showFileViewer(fileName, content, file.sensitive);
  }

  showFileViewer(fileName, content, isSensitive) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    const viewer = document.createElement('div');
    viewer.style.cssText = `
      background: var(--window-bg);
      border: var(--window-border);
      border-radius: 8px;
      width: 80%;
      height: 80%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
    `;
    
    viewer.innerHTML = `
      <div style="
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-secondary);
      ">
        <h3 style="color: ${isSensitive ? 'var(--text-accent)' : 'var(--text-primary)'};">
          📄 ${fileName}
          ${isSensitive ? '<i class="fas fa-exclamation-triangle" style="color: var(--text-warning); margin-left: 8px;"></i>' : ''}
        </h3>
        <button onclick="this.closest('.file-modal').remove()" style="
          background: var(--text-error);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        ">✕ Close</button>
      </div>
      <div style="
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        font-family: var(--font-mono);
        font-size: 12px;
        white-space: pre-wrap;
        background: var(--terminal-bg);
        color: var(--text-primary);
      ">${content}</div>
    `;
    
    modal.className = 'file-modal';
    modal.appendChild(viewer);
    document.body.appendChild(modal);
    
    // Handle sensitive file viewing
    if (isSensitive) {
      this.handleSensitiveFileView(fileName, content);
    }
  }

  handleSensitiveFileDownload(device, file) {
    // Update game state with captured sensitive data
    if (window.gameEngine) {
      window.gameEngine.captureCredentials({
        type: 'file',
        filename: file.name,
        device: device.name,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show special notification for sensitive files
    this.showNotification(`🚨 SENSITIVE DATA ACQUIRED: ${file.name}`, 'warning');
  }

  handleSensitiveFileView(fileName, content) {
    // Extract credentials from viewed files
    if (fileName.includes('password')) {
      const lines = content.split('\\n');
      lines.forEach(line => {
        if (line.includes(':')) {
          const [service, password] = line.split(':').map(s => s.trim());
          if (service && password) {
            window.gameEngine?.captureCredentials({
              username: service,
              password: password,
              source: fileName
            });
          }
        }
      });
    }
  }

  downloadAllFiles(device) {
    this.showNotification(`Starting bulk download from ${device.name}...`);
    
    let downloaded = 0;
    const total = device.files.filter(f => f.type === 'file').length;
    
    const downloadNext = () => {
      if (downloaded < total) {
        const file = device.files.filter(f => f.type === 'file')[downloaded];
        this.showNotification(`Downloading ${file.name}... (${downloaded + 1}/${total})`);
        
        downloaded++;
        setTimeout(downloadNext, 1000);
      } else {
        this.showNotification(`✅ Downloaded ${total} files from ${device.name}`, 'success');
      }
    };
    
    downloadNext();
  }

  installKeylogger(device) {
    this.showNotification(`Installing keylogger on ${device.name}...`);
    
    setTimeout(() => {
      this.showNotification(`✅ Keylogger installed on ${device.name}`, 'success');
      
      // Start showing captured keystrokes periodically
      setInterval(() => {
        if (Math.random() < 0.3) {
          const captures = [
            'User typed: "bankingpassword123"',
            'User typed: "creditcard4532"',
            'User typed: "socialsecurity987654321"',
            'User typed: "workemailpass"'
          ];
          
          const capture = captures[Math.floor(Math.random() * captures.length)];
          this.showNotification(`🔑 ${capture}`, 'info');
        }
      }, 10000);
    }, 3000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const colors = {
      info: 'var(--text-primary)',
      success: '#00ff00',
      warning: 'var(--text-warning)',
      error: 'var(--text-error)'
    };
    
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: var(--window-bg);
      border: 1px solid ${colors[type]};
      color: ${colors[type]};
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      animation: slideInLeft 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutLeft 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  updateHostList(hosts) {
    // Add newly discovered hosts to the device list
    hosts.forEach(host => {
      if (!this.discoveredDevices.find(d => d.ip === host.ip)) {
        this.discoveredDevices.push({
          id: `device-${Date.now()}`,
          name: `Unknown Device (${host.ip})`,
          ip: host.ip,
          os: 'Unknown',
          status: 'online',
          access: 'scanning',
          icon: 'fas fa-question-circle',
          files: []
        });
      }
    });
    
    this.updateDeviceList();
  }
}
