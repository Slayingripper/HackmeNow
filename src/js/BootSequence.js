/**
 * BootSequence - Handles the initial boot screen with ASCII art and loading
 */
export class BootSequence {
  constructor() {
    this.bootScreen = document.getElementById('boot-screen');
    this.asciiText = document.getElementById('ascii-text');
    this.bootProgress = document.getElementById('boot-progress');
    this.bootMessagesContainer = document.getElementById('boot-messages');
    
    this.asciiArt = `
██╗  ██╗ █████╗  ██████╗██╗  ██╗███╗   ███╗███████╗███╗   ██╗ ██████╗ ██╗    ██╗
██║  ██║██╔══██╗██╔════╝██║ ██╔╝████╗ ████║██╔════╝████╗  ██║██╔═══██╗██║    ██║
███████║███████║██║     █████╔╝ ██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║██║ █╗ ██║
██╔══██║██╔══██║██║     ██╔═██╗ ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║██║███╗██║
██║  ██║██║  ██║╚██████╗██║  ██╗██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝╚███╔███╔╝
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝ 
                                                                                 
                    Advanced Penetration Testing Framework v2.4.7
                          [UNAUTHORIZED ACCESS DETECTED]
    `;
    
    this.bootMessages = [
      'Initializing kernel modules...',
      'Loading network drivers...',
      'Establishing secure connection...',
      'Bypassing firewall restrictions...',
      'Injecting stealth payload...',
      'Monitoring target network traffic...',
      'Decrypting network protocols...',
      'Establishing backdoor access...',
      'Loading exploitation frameworks...',
      'Activating surveillance modules...',
      'Preparing infiltration tools...',
      'System ready for operation...'
    ];
  }

  async start() {
    return new Promise((resolve) => {
      // Display ASCII art with typing effect
      this.typeAsciiArt().then(() => {
        // Start loading messages and progress
        this.runBootSequence().then(resolve);
      });
    });
  }

  async typeAsciiArt() {
    return new Promise((resolve) => {
      this.asciiText.textContent = this.asciiArt;
      setTimeout(resolve, 1000);
    });
  }

  async runBootSequence() {
    return new Promise((resolve) => {
      let messageIndex = 0;
      let progress = 0;
      
      const interval = setInterval(() => {
        // Add boot message
        if (messageIndex < this.bootMessages.length) {
          const messageDiv = document.createElement('div');
          messageDiv.textContent = `[${String(messageIndex + 1).padStart(2, '0')}] ${this.bootMessages[messageIndex]}`;
          messageDiv.style.color = messageIndex === this.bootMessages.length - 1 ? '#00ff00' : '#ffffff';
          this.bootMessagesContainer.appendChild(messageDiv);
          
          // Scroll to bottom
          this.bootMessagesContainer.scrollTop = this.bootMessagesContainer.scrollHeight;
          
          messageIndex++;
        }
        
        // Update progress
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        this.bootProgress.style.width = `${progress}%`;
        
        // Complete when progress reaches 100% and all messages shown
        if (progress >= 100 && messageIndex >= this.bootMessages.length) {
          clearInterval(interval);
          setTimeout(() => {
            this.bootScreen.style.opacity = '0';
            this.bootScreen.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
              this.bootScreen.classList.add('hidden');
              resolve();
            }, 1000);
          }, 1000);
        }
      }, 300);
    });
  }
}
