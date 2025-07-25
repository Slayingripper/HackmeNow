# HackmeNow - Hacking Simulation Game

![HackmeNow Screenshot](Pics/main.png)

A realistic web-based hacking simulation game that follows the story of a cybercriminal who has gained access to a home network via trojan malware. Experience the thrill of ethical hacking through an immersive browser-based interface.

**Pure HTML/CSS/JavaScript version - No server required!**

## 🎮 Game Overview

HackmeNow is an educational cybersecurity simulation that teaches penetration testing concepts through an engaging storyline. Players take on the role of a hacker who has infiltrated a home network and must:

- Monitor network traffic for sensitive information
- Extract credentials from packet captures
- Exploit vulnerabilities in IoT devices
- Perform privilege escalation
- Access security cameras and smart devices
- Execute remote code execution (RCE) attacks
- Steal money from banking accounts
- Maintain stealth and cover tracks

## 🛡️ Educational Purpose

**IMPORTANT**: This is a simulation for educational purposes only. All hacking activities are simulated and do not involve real systems, networks, or data. The game is designed to teach cybersecurity concepts in a safe, controlled environment.

## 🚀 Quick Start

![HackmeNow Screenshot](Pics/screen2.png)

### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/Slayingripper/HackmeNow.git
cd HackmeNow

# Start a local web server (Python 3)
python3 -m http.server 8080

# Or use the npm script
npm run serve
```

Visit `http://localhost:8080` to play the game.

### Option 2: Deploy to Web Hosting
1. Run the deployment script:
   ```bash
   ./deploy-simple.sh
   ```
2. Upload the contents of `hackmenow-simple/` to your web hosting
3. Visit your domain to play!

## 🎯 Features

### Realistic Hacker Interface
- **Terminal Emulator**: Fully functional command-line interface with realistic hacking tools
- **Wireshark-like Packet Analyzer**: Monitor network traffic and extract sensitive data
- **Network Monitor**: Real-time visualization of network activity and vulnerabilities
- **File Explorer**: Browse compromised systems and extract sensitive files
- **Mission System**: Progressive storyline with objectives and achievements

### Authentic Tools & Commands
- `nmap` - Network scanning and host discovery
- `wireshark` - Packet capture and analysis
- `metasploit` - Exploitation framework
- `hydra` - Password cracking
- `john` - Password hash cracking
- `sqlmap` - SQL injection testing
- `ssh` - Remote shell access
- `nc` - Netcat for backdoors

### Storyline Progression
1. **Initial Infiltration**: Establish connection via trojan malware
2. **Network Reconnaissance**: Discover hosts and services
3. **Traffic Monitoring**: Capture packets and extract credentials
4. **System Compromise**: Gain deeper access to target systems
5. **Data Exfiltration**: Extract sensitive files and information
6. **Financial Exploitation**: Access banking systems and transfer funds

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (Python, Apache, Nginx) or any web hosting service

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HackmeNow
   ```

2. **Start a local web server**
   ```bash
   # Using Python 3 (recommended)
   python3 -m http.server 8080
   
   # Or using npm script
   npm run serve
   ```

3. **Open the game**
   - Navigate to `http://localhost:8080` in your browser
   - The game will start with a boot sequence
   - Follow the on-screen instructions to begin

### Web Hosting Deployment
1. **Prepare deployment package**
   ```bash
   ./deploy-simple.sh
   ```

2. **Upload to hosting**
   - Upload contents of `hackmenow-simple/` folder to your web hosting
   - Or extract `hackmenow-simple-deployment.zip` on your server
   - Works with any web hosting service (Namecheap, GoDaddy, etc.)

3. **Access your game**
   - Visit your domain to play
   - No server configuration required!

## 🎮 How to Play

### Getting Started
1. **Boot Sequence**: Watch the realistic hacker terminal boot up
2. **Initial Access**: The trojan has already been deployed - you have access!
3. **Read Objectives**: Check the mission panel on the right for current objectives
4. **Use the Terminal**: Start by typing `help` to see available commands

### Essential Commands
- `help` - Show all available commands
- `nmap 192.168.1.0/24` - Scan the home network
- `wireshark` - Open packet capture tool
- `ls` - List files in current directory
- `cat filename` - View file contents
- `exploit <type>` - Execute various exploits
- `clear` - Clear terminal screen

### Keyboard Shortcuts
- **Ctrl+Shift+T** - Open/focus Terminal
- **Ctrl+Shift+W** - Open/focus Wireshark
- **Ctrl+Shift+N** - Open/focus Network Monitor
- **Ctrl+Shift+E** - Open/focus File Explorer
- **Escape** - Close active window

### Window Management
- **Drag**: Click and drag window headers to move windows
- **Resize**: Drag the resize handle in the bottom-right corner
- **Controls**: Use the traffic light buttons to close/minimize/maximize

## 🎯 Mission Objectives

### Phase 1: Network Infiltration
- ✅ Establish persistent connection to target network
- 🎯 Monitor network traffic for credentials
- 📊 Gain access to IoT devices
- 💰 Extract banking information

### Key Milestones
- Discover network topology and connected devices
- Capture sensitive packets containing login credentials
- Compromise smart home devices (TV, cameras, phones)
- Install keyloggers and backdoors for persistence
- Access banking portals and execute fund transfers

## 🛠️ Technical Architecture

### Frontend Technologies
- **Vanilla JavaScript** - Core game logic and interactions
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Realistic hacker aesthetics and animations
- **Pure Client-Side** - No server dependencies required

### Game Components
- **GameEngine** - Main controller and state management
- **Terminal** - Command-line interface simulation
- **WiresharkSimulator** - Network packet capture analysis
- **NetworkMonitor** - Real-time traffic visualization
- **FileExplorer** - System file browser
- **StorylineManager** - Mission progression and narrative
- **WindowManager** - Draggable window system

### File Structure
```
HackmeNow/
├── index.html             # Main game interface
├── package.json           # Project metadata (minimal)
├── deploy-simple.sh       # Deployment script
├── src/
│   ├── main.js            # Game initialization
│   ├── style.css          # Hacker-themed styling
│   └── js/
│       ├── GameEngine.js      # Core game controller
│       ├── BootSequence.js    # Startup animation
│       ├── Terminal.js        # Command-line interface
│       ├── WiresharkSimulator.js  # Packet analysis
│       ├── NetworkMonitor.js  # Traffic monitoring
│       ├── FileExplorer.js    # File system browser
│       ├── StorylineManager.js # Mission progression
│       └── WindowManager.js   # Window management
└── public/
    └── vite.svg           # Icon assets

```

## 🔧 Development

### Adding New Commands
1. Open `src/js/Terminal.js`
2. Add command function to the `commands` object
3. Implement the command logic
4. Update help text

### Creating New Missions
1. Open `src/js/StorylineManager.js`
2. Add mission to the `missions` array
3. Define scenes and triggers
4. Implement scene action functions

### Customizing the Interface
1. Modify `src/style.css` for visual changes
2. Update `index.html` for structural changes
3. Edit component files for functionality changes

### Testing Locally
```bash
# Start local server
python3 -m http.server 8080

# Test in browser
open http://localhost:8080
```

## 🎨 Themes and Customization

The game features a realistic hacker aesthetic with:
- **Dark theme** with green terminal text
- **Monospace fonts** (Fira Code, Source Code Pro)
- **Matrix-style** animations and effects
- **Realistic terminal** colors and formatting
- **Professional security** tool interfaces

### Color Scheme
- Primary: `#00ff00` (Matrix green)
- Secondary: `#ffffff` (White text)
- Accent: `#ff0080` (Pink highlights)
- Warning: `#ffaa00` (Orange alerts)
- Error: `#ff0000` (Red errors)
- Background: `#0a0a0a` (Near black)

## 📚 Learning Outcomes

Players will gain understanding of:
- **Network reconnaissance** techniques
- **Packet analysis** and traffic monitoring
- **Vulnerability assessment** methodologies
- **Social engineering** concepts
- **Penetration testing** workflows
- **Cybersecurity defense** strategies
- **Ethical hacking** principles

## ⚖️ Ethical Guidelines

This simulation is designed for:
- **Educational purposes** only
- **Cybersecurity training** and awareness
- **Ethical hacking** skill development
- **Penetration testing** education

**Do NOT use these techniques on real systems without explicit permission.**

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by real penetration testing tools
- Educational content based on cybersecurity best practices
- Interface design inspired by popular hacking tools
- Community feedback and suggestions

## 🔗 Resources

### Learning More About Cybersecurity
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Penetration Testing Execution Standard](http://www.pentest-standard.org/)

### Real Tools (For Authorized Testing Only)
- [Wireshark](https://www.wireshark.org/) - Network protocol analyzer
- [Nmap](https://nmap.org/) - Network discovery and security auditing
- [Metasploit](https://www.metasploit.com/) - Penetration testing framework

---
