/**
 * Terminal - Simulates a hacker terminal with various commands
 */
class Terminal {
  constructor() {
    this.terminalElement = document.getElementById('terminal');
    this.currentLine = '';
    this.commandHistory = [];
    this.historyIndex = -1;
    this.isTyping = false;
    
    // Available commands
    this.commands = {
      help: this.helpCommand.bind(this),
      ls: this.lsCommand.bind(this),
      cd: this.cdCommand.bind(this),
      cat: this.catCommand.bind(this),
      pwd: this.pwdCommand.bind(this),
      whoami: this.whoamiCommand.bind(this),
      ps: this.psCommand.bind(this),
      netstat: this.netstatCommand.bind(this),
      ifconfig: this.ifconfigCommand.bind(this),
      nmap: this.nmapCommand.bind(this),
      hydra: this.hydraCommand.bind(this),
      metasploit: this.metasploitCommand.bind(this),
      msfconsole: this.msfconsoleCommand.bind(this),
      john: this.johnCommand.bind(this),
      hashcat: this.hashcatCommand.bind(this),
      sqlmap: this.sqlmapCommand.bind(this),
      wireshark: this.wiresharkCommand.bind(this),
      aircrack: this.aircrackCommand.bind(this),
      ssh: this.sshCommand.bind(this),
      nc: this.ncCommand.bind(this),
      curl: this.curlCommand.bind(this),
      wget: this.wgetCommand.bind(this),
      python3: this.pythonCommand.bind(this),
      clear: this.clearCommand.bind(this),
      exit: this.exitCommand.bind(this),
      exploit: this.exploitCommand.bind(this),
      payload: this.payloadCommand.bind(this),
      backdoor: this.backdoorCommand.bind(this),
      keylogger: this.keyloggerCommand.bind(this),
      steganography: this.steganographyCommand.bind(this),
      social: this.socialCommand.bind(this),
      'demo-autoplay': this.autoplayCommand.bind(this), // Hidden autoplay function
      transfer: this.transferCommand.bind(this),
      clearlogs: this.clearlogsCommand.bind(this),
      phishing: this.phishingCommand.bind(this),
      rootkit: this.rootkitCommand.bind(this),
      cryptominer: this.cryptominerCommand.bind(this)
    };
    
    this.currentDirectory = '/home/blackhat';
    this.username = 'blackhat';
    this.hostname = 'kali';
    
    // File system simulation
    this.fileSystem = {
      '/': {
        type: 'directory',
        contents: ['home', 'etc', 'var', 'usr', 'tmp']
      },
      '/home': {
        type: 'directory',
        contents: ['blackhat']
      },
      '/home/blackhat': {
        type: 'directory',
        contents: ['tools', 'exploits', 'logs', 'capture.pcap', 'passwords.txt', 'backdoor.py']
      },
      '/home/blackhat/tools': {
        type: 'directory',
        contents: ['nmap_scan.txt', 'hydra_results.txt', 'sql_injection.py']
      },
      '/home/blackhat/exploits': {
        type: 'directory',
        contents: ['rce_exploit.py', 'privilege_escalation.sh', 'reverse_shell.c']
      },
      '/home/blackhat/logs': {
        type: 'directory',
        contents: ['access.log', 'keylogger.log', 'network_traffic.log']
      },
      '/home/blackhat/capture.pcap': {
        type: 'file',
        content: 'Binary packet capture file containing network traffic...'
      },
      '/home/blackhat/passwords.txt': {
        type: 'file',
        content: 'john_doe:password123\\nsarah_smith:letmein\\nadmin:admin\\nroot:toor'
      },
      '/home/blackhat/backdoor.py': {
        type: 'file',
        content: '#!/usr/bin/env python3\\n# Remote access backdoor\\nimport socket, subprocess\\n...'
      }
    };
  }

  async initialize() {
    this.createPrompt();
    this.setupEventListeners();
    
    // Display welcome message
    await this.typeMessage('Welcome to HackmeNow Terminal v2.4.7');
    await this.typeMessage('Type "help" for available commands');
    await this.typeMessage('');
    
    this.createPrompt();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (!this.terminalElement.closest('.window').classList.contains('hidden')) {
        this.handleKeyPress(e);
      }
    });
    
    // Focus terminal when clicked
    this.terminalElement.addEventListener('click', () => {
      this.terminalElement.focus();
    });
  }

  handleKeyPress(e) {
    if (this.isTyping) return;
    
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.executeCommand();
        break;
      case 'Backspace':
        e.preventDefault();
        this.handleBackspace();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateHistory(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateHistory(1);
        break;
      case 'Tab':
        e.preventDefault();
        this.handleTabCompletion();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.addCharacter(e.key);
        }
        break;
    }
  }

  addCharacter(char) {
    this.currentLine += char;
    this.updateCurrentLine();
  }

  handleBackspace() {
    if (this.currentLine.length > 0) {
      this.currentLine = this.currentLine.slice(0, -1);
      this.updateCurrentLine();
    }
  }

  updateCurrentLine() {
    const promptLine = this.terminalElement.lastElementChild;
    if (promptLine && promptLine.classList.contains('terminal-line')) {
      const promptText = `${this.username}@${this.hostname}:${this.currentDirectory}$ `;
      promptLine.innerHTML = `<span class="terminal-prompt">${promptText}</span>${this.currentLine}<span class="terminal-cursor">█</span>`;
    }
  }

  createPrompt() {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const promptText = `${this.username}@${this.hostname}:${this.currentDirectory}$ `;
    line.innerHTML = `<span class="terminal-prompt">${promptText}</span><span class="terminal-cursor">█</span>`;
    this.terminalElement.appendChild(line);
    this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
  }

  async executeCommand() {
    const command = this.currentLine.trim();
    if (command) {
      this.commandHistory.unshift(command);
      this.historyIndex = -1;
    }
    
    // Remove cursor from current line
    const promptLine = this.terminalElement.lastElementChild;
    promptLine.innerHTML = promptLine.innerHTML.replace('<span class="terminal-cursor">█</span>', '');
    
    this.currentLine = '';
    
    if (command) {
      await this.processCommand(command);
    }
    
    this.createPrompt();
  }

  async processCommand(commandLine) {
    const parts = commandLine.split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    if (this.commands[command]) {
      await this.commands[command](args);
    } else {
      await this.typeMessage(`bash: ${command}: command not found`);
    }
  }

  navigateHistory(direction) {
    if (direction === -1 && this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      this.currentLine = this.commandHistory[this.historyIndex];
    } else if (direction === 1 && this.historyIndex > -1) {
      this.historyIndex--;
      this.currentLine = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
    }
    this.updateCurrentLine();
  }

  handleTabCompletion() {
    const availableCommands = Object.keys(this.commands);
    const matches = availableCommands.filter(cmd => cmd.startsWith(this.currentLine));
    
    if (matches.length === 1) {
      this.currentLine = matches[0];
      this.updateCurrentLine();
    } else if (matches.length > 1) {
      this.addLine('');
      this.addLine(matches.join('  '));
    }
  }

  async typeMessage(message, className = '') {
    return new Promise((resolve) => {
      this.isTyping = true;
      const line = document.createElement('div');
      line.className = `terminal-line ${className}`;
      this.terminalElement.appendChild(line);
      
      let index = 0;
      const typeChar = () => {
        if (index < message.length) {
          line.textContent += message[index];
          index++;
          setTimeout(typeChar, Math.random() * 30 + 10);
        } else {
          this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
          this.isTyping = false;
          resolve();
        }
      };
      
      typeChar();
    });
  }

  addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.terminalElement.appendChild(line);
    this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
  }

  // Command implementations
  async helpCommand(args) {
    if (args.includes('--all') || args.includes('--hidden')) {
      // Show hidden commands
      const hiddenHelpText = [
        '🕵️  HIDDEN COMMANDS REVEALED:',
        '',
        'Demo Mode:',
        '  demo-autoplay    - Automated walkthrough demonstration',
        '',
        'Financial:',
        '  transfer         - Simulate unauthorized bank transfers',
        '',
        'Stealth:',
        '  clearlogs        - Clear system traces and logs',
        '  phishing         - Generate phishing attacks',
        '  rootkit          - Advanced persistent access',
        '  cryptominer      - Cryptocurrency mining bot',
        '',
        '🎮 Use "demo-autoplay" to watch the complete hacking demo!',
        ''
      ];
      
      for (const line of hiddenHelpText) {
        await this.typeMessage(line);
      }
      return;
    }

    const helpText = [
      'Available commands:',
      '',
      'System:',
      '  ls, cd, pwd, cat, ps, whoami, clear, exit',
      '',
      'Network:',
      '  ifconfig, netstat, nmap, wireshark, nc, curl, wget',
      '',
      'Exploitation:',
      '  metasploit, msfconsole, hydra, john, hashcat, sqlmap',
      '  exploit, payload, backdoor, ssh',
      '',
      'Advanced:',
      '  keylogger, steganography, social, aircrack, python3',
      '',
      '💡 Tip: Type "help --hidden" to reveal secret commands',
      'Use Ctrl+Shift+[T/W/N/E] for quick window access'
    ];
    
    for (const line of helpText) {
      await this.typeMessage(line);
    }
  }

  async lsCommand(args) {
    const path = this.currentDirectory;
    const dir = this.fileSystem[path];
    
    if (dir && dir.type === 'directory') {
      const items = dir.contents.map(item => {
        const itemPath = `${path}/${item}`.replace('//', '/');
        const itemData = this.fileSystem[itemPath];
        return itemData && itemData.type === 'directory' ? `\\033[34m${item}/\\033[0m` : item;
      }).join('  ');
      
      await this.typeMessage(items);
    } else {
      await this.typeMessage('ls: cannot access directory');
    }
  }

  async cdCommand(args) {
    if (args.length === 0) {
      this.currentDirectory = '/home/blackhat';
    } else {
      const targetPath = args[0].startsWith('/') ? args[0] : `${this.currentDirectory}/${args[0]}`.replace('//', '/');
      if (this.fileSystem[targetPath] && this.fileSystem[targetPath].type === 'directory') {
        this.currentDirectory = targetPath;
      } else {
        await this.typeMessage(`cd: ${args[0]}: No such file or directory`);
      }
    }
  }

  async catCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('cat: missing file operand');
      return;
    }
    
    const filePath = args[0].startsWith('/') ? args[0] : `${this.currentDirectory}/${args[0]}`.replace('//', '/');
    const file = this.fileSystem[filePath];
    
    if (file && file.type === 'file') {
      await this.typeMessage(file.content.replace(/\\n/g, '\\n'));
    } else {
      await this.typeMessage(`cat: ${args[0]}: No such file or directory`);
    }
  }

  async pwdCommand(args) {
    await this.typeMessage(this.currentDirectory);
  }

  async whoamiCommand(args) {
    await this.typeMessage(this.username);
  }

  async psCommand(args) {
    const processes = [
      'PID  USER     COMMAND',
      '1    root     /sbin/init',
      '123  root     [kthreadd]',
      '456  blackhat /bin/bash',
      '789  blackhat wireshark',
      '1011 blackhat python3 keylogger.py',
      '1213 blackhat nc -l 4444',
      '1415 blackhat metasploit'
    ];
    
    for (const line of processes) {
      await this.typeMessage(line);
    }
  }

  async netstatCommand(args) {
    const connections = [
      'Active Internet connections:',
      'Proto Recv-Q Send-Q Local Address      Foreign Address    State',
      'tcp        0      0 127.0.0.1:4444     0.0.0.0:*          LISTEN',
      'tcp        0      0 192.168.1.100:22   192.168.1.1:52341  ESTABLISHED',
      'tcp        0      0 192.168.1.100:443  74.125.224.72:443  ESTABLISHED',
      'udp        0      0 0.0.0.0:53         0.0.0.0:*          '
    ];
    
    for (const line of connections) {
      await this.typeMessage(line);
    }
  }

  async ifconfigCommand(args) {
    const interfaceInfo = [
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      '        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255',
      '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>',
      '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)',
      '',
      'wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      '        inet 192.168.1.101  netmask 255.255.255.0  broadcast 192.168.1.255',
      '        ether 00:1f:3f:12:34:56  txqueuelen 1000  (IEEE 802.11)'
    ];
    
    for (const line of interfaceInfo) {
      await this.typeMessage(line);
    }
  }

  async nmapCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('Usage: nmap [target]');
      return;
    }
    
    const target = args[0];
    await this.typeMessage(`Starting Nmap scan on ${target}`);
    await this.typeMessage('');
    
    const scanResults = [
      `Nmap scan report for ${target}`,
      'Host is up (0.00050s latency).',
      '',
      'PORT     STATE SERVICE',
      '22/tcp   open  ssh',
      '80/tcp   open  http',
      '443/tcp  open  https',
      '3389/tcp open  ms-wbt-server',
      '5900/tcp open  vnc',
      '',
      'Nmap done: 1 IP address (1 host up) scanned'
    ];
    
    for (const line of scanResults) {
      await this.typeMessage(line);
    }
    
    // Update game state
    window.gameEngine?.addDiscoveredHost({ ip: target, ports: [22, 80, 443, 3389, 5900] });
  }

  async wiresharkCommand(args) {
    await this.typeMessage('Opening Wireshark packet analyzer...');
    document.getElementById('wireshark-window').classList.remove('hidden');
  }

  async msfconsoleCommand(args) {
    await this.typeMessage('Starting Metasploit Framework...');
    await this.typeMessage('');
    const metasploitBanner = [
      '       =[ metasploit v6.3.25-dev                          ]',
      '+ -- --=[ 2328 exploits - 1218 auxiliary - 413 post       ]',
      '+ -- --=[ 864 payloads - 45 encoders - 11 nops            ]',
      '+ -- --=[ 9 evasion                                       ]',
      '',
      'msf6 > '
    ];
    
    for (const line of metasploitBanner) {
      await this.typeMessage(line);
    }
  }

  async exploitCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('Available exploits: rce, privilege_escalation, sql_injection');
      return;
    }
    
    const exploit = args[0];
    await this.typeMessage(`Executing exploit: ${exploit}`);
    await this.typeMessage('[+] Exploit successful!');
    await this.typeMessage('[+] Shell obtained on target system');
    
    // Update game state
    window.gameEngine?.executeExploit({ name: exploit, target: 'target_host' });
  }

  async clearCommand(args) {
    this.terminalElement.innerHTML = '';
  }

  async exitCommand(args) {
    await this.typeMessage('Goodbye!');
    document.getElementById('terminal-window').classList.add('hidden');
  }

  // Add more command implementations...
  async hydraCommand(args) {
    await this.typeMessage('Hydra password cracker started...');
    await this.typeMessage('[+] Found valid credentials: admin:password123');
    
    window.gameEngine?.captureCredentials({ username: 'admin', password: 'password123' });
  }

  async metasploitCommand(args) {
    await this.typeMessage('Starting Metasploit Framework Console...');
    await this.typeMessage('Please use "msfconsole" for full interface');
  }

  async johnCommand(args) {
    await this.typeMessage('John the Ripper password cracker');
    await this.typeMessage('Loaded 1 password hash (NT [MD4 128/128 AVX 4x3])');
    await this.typeMessage('Will run 4 OpenMP threads');
    await this.typeMessage('Proceeding with single, rules:Single');
    await this.typeMessage('Press Ctrl-C to abort, or send SIGUSR1 to john process for status');
    await this.typeMessage('Warning: Only 2 candidates buffered for the current salt, minimum 12 needed for performance.');
    await this.typeMessage('Done. Now run "john --show" to see cracked passwords');
  }

  async hashcatCommand(args) {
    await this.typeMessage('hashcat (v6.2.6) starting...');
    await this.typeMessage('');
    await this.typeMessage('* Device #1: WARNING! Kernel exec timeout is not disabled.');
    await this.typeMessage('             This may cause "CL_OUT_OF_RESOURCES" or related errors.');
    await this.typeMessage('             To disable the timeout, see: https://hashcat.net/q/timeoutpatch');
    await this.typeMessage('');
    await this.typeMessage('Session..........: hashcat');
    await this.typeMessage('Status...........: Cracked');
    await this.typeMessage('Hash.Name........: NTLM');
    await this.typeMessage('Hash.Target......: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
    await this.typeMessage('');
    await this.typeMessage('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8:password');
    await this.typeMessage('');
    await this.typeMessage('Session..........: hashcat');
    await this.typeMessage('Status...........: Cracked');
  }

  async sqlmapCommand(args) {
    await this.typeMessage('        ___');
    await this.typeMessage('       __H__');
    await this.typeMessage(' ___ ___[)]_____ ___ ___  {1.7.2#stable}');
    await this.typeMessage('|_ -| . ["]     | .|_ -|');
    await this.typeMessage('|___|_  [)]_|_|_|__,|___|');
    await this.typeMessage('      |_|V...       |_|   https://sqlmap.org');
    await this.typeMessage('');
    await this.typeMessage('[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user\'s responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program');
    await this.typeMessage('');
    await this.typeMessage('[*] starting @ 21:30:45 /2024-01-20/');
    await this.typeMessage('[21:30:45] [INFO] testing connection to the target URL');
    await this.typeMessage('[21:30:45] [INFO] checking if the target is protected by some kind of WAF/IPS');
    await this.typeMessage('[21:30:46] [INFO] testing if the target URL content is stable');
    await this.typeMessage('[21:30:46] [INFO] target URL content is stable');
    await this.typeMessage('[21:30:46] [INFO] testing if GET parameter \'id\' is dynamic');
    await this.typeMessage('[21:30:46] [WARNING] GET parameter \'id\' does not appear to be dynamic');
    await this.typeMessage('[21:30:46] [WARNING] heuristic (basic) test shows that GET parameter \'id\' might not be injectable');
    await this.typeMessage('[21:30:46] [INFO] testing for SQL injection on GET parameter \'id\'');
    await this.typeMessage('[21:30:46] [INFO] testing \'AND boolean-based blind - WHERE or HAVING clause\'');
    await this.typeMessage('[21:30:47] [INFO] GET parameter \'id\' appears to be \'AND boolean-based blind - WHERE or HAVING clause\' injectable');
    await this.typeMessage('[21:30:47] [INFO] testing \'Generic UNION query (NULL) - 1 to 20 columns\'');
    await this.typeMessage('[21:30:48] [INFO] automatically extending ranges to optimize the number of requests');
    await this.typeMessage('[21:30:48] [INFO] \'ORDER BY\' technique appears to be usable. This should reduce the time needed to find the right number of query columns. Automatically extending the range to find the number of query columns');
    await this.typeMessage('[21:30:48] [CRITICAL] unable to connect to the target URL. sqlmap is going to retry the request(s)');
  }

  async aircrackCommand(args) {
    await this.typeMessage('Aircrack-ng 1.7  - (C) 2006-2022 Thomas d\'Otreppe');
    await this.typeMessage('      https://www.aircrack-ng.org');
    await this.typeMessage('');
    await this.typeMessage('      [00:00:05] 2840/14344392 keys tested (548.23 k/s) ');
    await this.typeMessage('');
    await this.typeMessage('      Time left: 7 hours, 14 minutes, 18 seconds                  0.02%');
    await this.typeMessage('');
    await this.typeMessage('                           KEY FOUND! [ WPA2Password123 ]');
    await this.typeMessage('');
    await this.typeMessage('      Master Key     : CD 69 0D 11 8E 24 58 9C 66 B8 89 78 AE 8C 32 7B ');
    await this.typeMessage('                       1B 99 DE 96 70 EB 3C 90 A4 24 52 B3 B4 4F B0 B3 ');
    await this.typeMessage('');
    await this.typeMessage('      Transient Key  : 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ');
    await this.typeMessage('                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ');
    await this.typeMessage('                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ');
    await this.typeMessage('                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ');
    await this.typeMessage('');
    await this.typeMessage('      EAPOL HMAC     : 4E 44 B7 19 E6 9C F9 66 51 22 10 33 99 F8 7A ED ');
    
    window.gameEngine?.captureCredentials({ network: 'HomeWiFi', password: 'WPA2Password123', type: 'wifi' });
  }

  async sshCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]');
      await this.typeMessage('           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]');
      await this.typeMessage('           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]');
      await this.typeMessage('           [-i identity_file] [-J [user@]host[:port]] [-L address]');
      await this.typeMessage('           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]');
      await this.typeMessage('           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]');
      await this.typeMessage('           [-w local_tun[:remote_tun]] destination [command]');
      return;
    }
    
    const target = args[0];
    await this.typeMessage(`Connecting to ${target}...`);
    await this.typeMessage('The authenticity of host \'192.168.1.100 (192.168.1.100)\' can\'t be established.');
    await this.typeMessage('ED25519 key fingerprint is SHA256:YGQ3GJN8sB0k0LDaD3GjW3aQO7R3Kz1lF+/NvVU2kBw.');
    await this.typeMessage('Are you sure you want to continue connecting (yes/no/[fingerprint])? yes');
    await this.typeMessage('Warning: Permanently added \'192.168.1.100\' (ED25519) to the list of known hosts.');
    await this.typeMessage(`root@${target}'s password: `);
    
    setTimeout(async () => {
      await this.typeMessage('');
      await this.typeMessage('Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.4.0-91-generic x86_64)');
      await this.typeMessage('');
      await this.typeMessage(' * Documentation:  https://help.ubuntu.com');
      await this.typeMessage(' * Management:     https://landscape.canonical.com');
      await this.typeMessage(' * Support:        https://ubuntu.com/advantage');
      await this.typeMessage('');
      await this.typeMessage('  System information as of Sat Jan 20 21:30:45 UTC 2024');
      await this.typeMessage('');
      await this.typeMessage('  System load:  0.08              Processes:               98');
      await this.typeMessage('  Usage of /:   42.8% of 9.78GB   Users logged in:         0');
      await this.typeMessage('  Memory usage: 18%               IPv4 address for enp0s3: 192.168.1.100');
      await this.typeMessage('  Swap usage:   0%');
      await this.typeMessage('');
      await this.typeMessage('0 updates can be applied immediately.');
      await this.typeMessage('');
      await this.typeMessage('Last login: Sat Jan 20 20:15:32 2024 from 192.168.1.1');
      await this.typeMessage(`root@${target.split('@')[1] || target}:~# `);
    }, 2000);
  }

  async ncCommand(args) {
    if (args.includes('-l')) {
      const port = args[args.indexOf('-l') + 1] || '4444';
      await this.typeMessage(`Listening on [0.0.0.0] (family 0, port ${port})`);
      await this.typeMessage('Connection received on localhost 127.0.0.1 59842');
      await this.typeMessage('Microsoft Windows [Version 10.0.19042.1415]');
      await this.typeMessage('(c) Microsoft Corporation. All rights reserved.');
      await this.typeMessage('');
      await this.typeMessage('C:\\Users\\john>');
    } else {
      const target = args[0] || 'localhost';
      const port = args[1] || '4444';
      await this.typeMessage(`Connecting to ${target}:${port}...`);
      await this.typeMessage('Connection established');
    }
  }

  async curlCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('curl: try \'curl --help\' or \'curl --manual\' for more information');
      return;
    }
    
    const url = args[0];
    await this.typeMessage(`Downloading ${url}...`);
    await this.typeMessage('  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current');
    await this.typeMessage('                                 Dload  Upload   Total   Spent    Left  Speed');
    await this.typeMessage('100  1256  100  1256    0     0   2847      0 --:--:-- --:--:-- --:--:--  2847');
    
    if (url.includes('exploit') || url.includes('payload')) {
      await this.typeMessage('');
      await this.typeMessage('Exploit downloaded successfully');
      await this.typeMessage('File saved as: exploit.py');
    }
  }

  async wgetCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('wget: missing URL');
      await this.typeMessage('Usage: wget [OPTION]... [URL]...');
      return;
    }
    
    const url = args[0];
    await this.typeMessage(`--2024-01-20 21:30:45--  ${url}`);
    await this.typeMessage(`Resolving ${new URL(url).hostname}... 203.0.113.1`);
    await this.typeMessage(`Connecting to ${new URL(url).hostname}|203.0.113.1|:80... connected.`);
    await this.typeMessage('HTTP request sent, awaiting response... 200 OK');
    await this.typeMessage('Length: 1234567 (1.2M) [application/octet-stream]');
    await this.typeMessage(`Saving to: '${url.split('/').pop()}'`);
    await this.typeMessage('');
    await this.typeMessage('100%[===================>] 1.18M  2.45MB/s    in 0.5s');
    await this.typeMessage('');
    await this.typeMessage(`2024-01-20 21:30:46 (2.45 MB/s) - '${url.split('/').pop()}' saved [1234567/1234567]`);
  }

  async pythonCommand(args) {
    if (args.length === 0) {
      await this.typeMessage('Python 3.9.2 (default, Feb 28 2021, 17:03:44)');
      await this.typeMessage('[GCC 10.2.1 20210110] on linux');
      await this.typeMessage('Type "help", "copyright", "credits" or "license" for more information.');
      await this.typeMessage('>>> ');
      return;
    }
    
    const script = args[0];
    await this.typeMessage(`Executing ${script}...`);
    
    if (script.includes('exploit') || script.includes('payload')) {
      await this.typeMessage('[+] Exploit loaded successfully');
      await this.typeMessage('[+] Target: 192.168.1.100:445');
      await this.typeMessage('[+] Sending payload...');
      await this.typeMessage('[+] Payload executed successfully');
      await this.typeMessage('[+] Reverse shell established');
      
      window.gameEngine?.executeExploit({ name: 'Python RCE', target: '192.168.1.100' });
    }
  }

  async payloadCommand(args) {
    await this.typeMessage('Available payloads:');
    await this.typeMessage('  1. windows/meterpreter/reverse_tcp');
    await this.typeMessage('  2. linux/x86/shell_reverse_tcp');
    await this.typeMessage('  3. android/meterpreter/reverse_tcp');
    await this.typeMessage('  4. php/meterpreter_reverse_tcp');
    await this.typeMessage('');
    await this.typeMessage('Use: payload generate <number>');
  }

  async steganographyCommand(args) {
    await this.typeMessage('Steganography tools available:');
    await this.typeMessage('');
    await this.typeMessage('Image Analysis:');
    await this.typeMessage('  - Checking family_photos.zip for hidden data...');
    await this.typeMessage('  - Found embedded text in IMG_2034.jpg');
    await this.typeMessage('  - Hidden message: "Bank account PIN: 4729"');
    await this.typeMessage('');
    await this.typeMessage('Audio Analysis:');
    await this.typeMessage('  - No audio files found');
    await this.typeMessage('');
    await this.typeMessage('File Metadata:');
    await this.typeMessage('  - Extracting EXIF data...');
    await this.typeMessage('  - GPS coordinates found: 40.7589° N, 73.9851° W');
    
    window.gameEngine?.captureCredentials({ type: 'steganography', data: 'Bank PIN: 4729' });
  }

  async socialCommand(args) {
    await this.typeMessage('Social Engineering Toolkit (SET) v8.0.3');
    await this.typeMessage('Created by: David Kennedy (ReL1K)');
    await this.typeMessage('');
    await this.typeMessage('Available attack vectors:');
    await this.typeMessage('');
    await this.typeMessage('1) Spear-Phishing Attack Vectors');
    await this.typeMessage('2) Website Attack Vectors');
    await this.typeMessage('3) Infectious Media Generator');
    await this.typeMessage('4) Create a Payload and Listener');
    await this.typeMessage('5) Mass Mailer Attack');
    await this.typeMessage('6) Arduino-Based Attack Vector');
    await this.typeMessage('7) Wireless Access Point Attack Vector');
    await this.typeMessage('8) QRCode Generator Attack Vector');
    await this.typeMessage('9) Powershell Attack Vectors');
    await this.typeMessage('10) SMS Spoofing Attack Vector');
    await this.typeMessage('');
    await this.typeMessage('99) Return back to the main menu.');
    await this.typeMessage('');
    await this.typeMessage('set> ');
  }

  async keyloggerCommand(args) {
    await this.typeMessage('Keylogger activated on target system');
    await this.typeMessage('[+] Capturing keystrokes...');
    await this.typeMessage('[LOG] john_doe typed: "mypassword123"');
    await this.typeMessage('[LOG] sarah_smith typed: "banking_login"');
  }

  async backdoorCommand(args) {
    await this.typeMessage('Installing persistent backdoor...');
    await this.typeMessage('[+] Backdoor installed successfully');
    await this.typeMessage('[+] Listening on port 4444');
  }

  // Hidden autoplay function for demonstrating the game
  async autoplayCommand(args) {
    await this.typeMessage('🎮 DEMO MODE ACTIVATED - Automated Walkthrough');
    await this.typeMessage('='.repeat(50));
    await this.typeMessage('Starting complete hacking simulation demonstration...');
    await this.typeMessage('');
    
    // Start the autoplay sequence
    this.startAutoplayDemo();
  }

  async startAutoplayDemo() {
    const demoSteps = [
      {
        phase: '🔍 Phase 1: Network Reconnaissance',
        commands: [
          'clear',
          'nmap 192.168.1.0/24',
          'nmap -sV 192.168.1.110',
          'nmap -sV 192.168.1.105'
        ],
        delay: 3000
      },
      {
        phase: '📡 Phase 2: Traffic Monitoring',
        commands: [
          'wireshark',
          'clear'
        ],
        delay: 2000,
        action: () => {
          // Open Wireshark window and start capture
          const wiresharkWindow = document.getElementById('wireshark-window');
          if (wiresharkWindow) {
            wiresharkWindow.classList.remove('hidden');
            // Simulate starting packet capture
            setTimeout(() => {
              const startBtn = wiresharkWindow.querySelector('.start-capture');
              if (startBtn) startBtn.click();
            }, 1000);
          }
        }
      },
      {
        phase: '🎯 Phase 3: System Exploitation',
        commands: [
          'aircrack-ng --wordlist rockyou.txt capture.cap',
          'ssh admin@192.168.1.1',
          'exploit --type router --target 192.168.1.1',
          'exploit --type smart-tv --target 192.168.1.105'
        ],
        delay: 2500
      },
      {
        phase: '💻 Phase 4: Computer Access',
        commands: [
          'metasploit',
          'exploit --type windows --target 192.168.1.110',
          'ls /home/',
          'cat /Documents/passwords.txt',
          'john --wordlist=rockyou.txt shadow.txt'
        ],
        delay: 3000
      },
      {
        phase: '💰 Phase 5: Financial Exploitation',
        commands: [
          'exploit --type banking --credentials john.doe:Password123',
          'transfer --from 123456789 --to 987654321 --amount 5000'
        ],
        delay: 4000
      },
      {
        phase: '🕵️ Phase 6: Stealth & Persistence',
        commands: [
          'backdoor --install --target 192.168.1.110',
          'clearlogs --system --network',
          'rootkit --install --target 192.168.1.110',
          'clear'
        ],
        delay: 2500
      }
    ];

    await this.executeAutoplaySequence(demoSteps);
  }

  async executeAutoplaySequence(demoSteps) {
    for (const step of demoSteps) {
      // Display phase header
      await this.typeMessage('');
      await this.typeMessage('='.repeat(60));
      await this.typeMessage(`🎯 ${step.phase}`);
      await this.typeMessage('='.repeat(60));
      await this.typeMessage('');
      
      // Execute any special actions
      if (step.action) {
        step.action();
      }
      
      // Execute commands in sequence
      for (const command of step.commands) {
        await this.sleep(1500); // Pause before each command
        
        // Type command with realistic typing effect
        await this.simulateTyping(command);
        
        // Execute the command
        await this.processCommand(command);
        
        await this.sleep(step.delay);
      }
    }
    
    // Final completion message
    await this.sleep(2000);
    await this.typeMessage('');
    await this.typeMessage('🎉 DEMO COMPLETE! 🎉');
    await this.typeMessage('All hacking objectives demonstrated successfully.');
    await this.typeMessage('Network compromised, data exfiltrated, tracks covered.');
    await this.typeMessage('');
    await this.typeMessage('💡 Type "help" to try commands manually');
    await this.typeMessage('🎮 Demo mode complete - you can now play yourself!');
  }

  async simulateTyping(command) {
    // Clear current input
    const input = document.getElementById('terminal-input');
    if (input) {
      input.value = '';
      input.focus();
    }

    // Type each character with delay
    for (const char of command) {
      if (input) {
        input.value += char;
        // Trigger input event to update display
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await this.sleep(100 + Math.random() * 100); // Realistic typing speed
    }
    
    await this.sleep(500); // Pause before "pressing enter"
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Additional commands for the autoplay demo
  async transferCommand(args) {
    const from = args.find(arg => arg.startsWith('--from'))?.split('=')[1];
    const to = args.find(arg => arg.startsWith('--to'))?.split('=')[1];
    const amount = args.find(arg => arg.startsWith('--amount'))?.split('=')[1];
    
    await this.typeMessage('🏦 Initiating unauthorized bank transfer...');
    await this.typeMessage('');
    await this.typeMessage('[+] Connecting to banking portal...');
    await this.typeMessage('[+] Authentication bypassed');
    await this.typeMessage('[+] Session token hijacked');
    await this.typeMessage('');
    await this.typeMessage(`[TRANSFER] From: ${from || '123456789'}`);
    await this.typeMessage(`[TRANSFER] To: ${to || '987654321'}`);
    await this.typeMessage(`[TRANSFER] Amount: $${amount || '5000'}`);
    await this.typeMessage('');
    await this.typeMessage('⚠️  WARNING: This is a simulation - no real money involved!');
    await this.typeMessage('[+] Transfer completed successfully');
    await this.typeMessage('[+] Transaction logged and hidden');
  }

  async clearlogsCommand(args) {
    await this.typeMessage('🧹 Clearing system traces...');
    await this.typeMessage('');
    if (args.includes('--system')) {
      await this.typeMessage('[+] Clearing system logs...');
      await this.typeMessage('[+] /var/log/auth.log cleared');
      await this.typeMessage('[+] /var/log/syslog cleared');
    }
    if (args.includes('--network')) {
      await this.typeMessage('[+] Clearing network logs...');
      await this.typeMessage('[+] Router logs cleared');
      await this.typeMessage('[+] Firewall logs cleared');
    }
    if (args.includes('--application')) {
      await this.typeMessage('[+] Clearing application logs...');
      await this.typeMessage('[+] Browser history cleared');
      await this.typeMessage('[+] Application traces removed');
    }
    await this.typeMessage('');
    await this.typeMessage('✅ All specified logs cleared successfully');
  }

  async phishingCommand(args) {
    await this.typeMessage('🎣 Phishing Attack Generator');
    await this.typeMessage('');
    if (args.includes('--generate-email')) {
      await this.typeMessage('[+] Generating phishing email...');
      await this.typeMessage('[+] Spoofing sender: security@bankportal.com');
      await this.typeMessage('[+] Subject: Urgent Account Verification Required');
      await this.typeMessage('[+] Email template generated');
    }
    if (args.includes('--clone-site')) {
      await this.typeMessage('[+] Cloning target website...');
      await this.typeMessage('[+] Downloaded 156 files');
      await this.typeMessage('[+] Injected credential harvester');
      await this.typeMessage('[+] Fake site deployed');
    }
  }

  async rootkitCommand(args) {
    await this.typeMessage('👻 Advanced Rootkit Manager');
    await this.typeMessage('');
    if (args.includes('--install')) {
      await this.typeMessage('[+] Installing kernel-level rootkit...');
      await this.typeMessage('[+] Modifying system calls...');
      await this.typeMessage('[+] Rootkit installed successfully');
      await this.typeMessage('[+] System backdoor established');
    }
    if (args.includes('--hide-process')) {
      await this.typeMessage('[+] Hiding process from system monitoring...');
      await this.typeMessage('[+] Process masked successfully');
    }
    if (args.includes('--hide-network-connection')) {
      await this.typeMessage('[+] Hiding network connections...');
      await this.typeMessage('[+] Connections masked from netstat');
    }
  }

  async cryptominerCommand(args) {
    await this.typeMessage('⛏️  Cryptocurrency Mining Bot');
    await this.typeMessage('');
    if (args.includes('--install')) {
      await this.typeMessage('[+] Installing cryptominer on compromised system...');
      await this.typeMessage('[+] Miner binary deployed');
      await this.typeMessage('[+] Persistence mechanism installed');
    }
    if (args.includes('--configure')) {
      await this.typeMessage('[+] Configuring mining parameters...');
      await this.typeMessage('[+] Pool: mining.pool.com:4444');
      await this.typeMessage('[+] Algorithm: RandomX (Monero)');
      await this.typeMessage('[+] Mining started in background');
    }
  }
}
