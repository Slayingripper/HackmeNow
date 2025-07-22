/**
 * WindowManager - Handles window dragging, resizing, and z-index management
 */
export class WindowManager {
  constructor() {
    this.windows = [];
    this.draggedWindow = null;
    this.dragOffset = { x: 0, y: 0 };
    this.highestZIndex = 100;
  }

  initialize() {
    this.setupGlobalEventListeners();
    this.registerWindows();
  }

  registerWindows() {
    const windowElements = document.querySelectorAll('.window');
    windowElements.forEach(windowEl => {
      this.registerWindow(windowEl);
    });
  }

  registerWindow(windowElement) {
    const windowData = {
      element: windowElement,
      id: windowElement.id,
      isDragging: false,
      isResizing: false
    };
    
    this.windows.push(windowData);
    this.setupWindowEventListeners(windowData);
  }

  setupWindowEventListeners(windowData) {
    const { element } = windowData;
    const header = element.querySelector('.window-header');
    
    if (header) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return; // Don't drag when clicking controls
        this.startDragging(windowData, e);
      });
    }
    
    // Bring window to front when clicked
    element.addEventListener('mousedown', () => {
      this.bringToFront(windowData);
    });
    
    // Setup resize handles if needed
    this.setupResizeHandles(windowData);
  }

  setupResizeHandles(windowData) {
    const { element } = windowData;
    
    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: absolute;
      bottom: 0;
      right: 0;
      width: 15px;
      height: 15px;
      cursor: nw-resize;
      background: linear-gradient(-45deg, transparent 40%, var(--border-color) 40%, var(--border-color) 60%, transparent 60%);
      z-index: 10;
    `;
    
    element.appendChild(resizeHandle);
    
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startResizing(windowData, e);
    });
  }

  setupGlobalEventListeners() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
    // Prevent text selection while dragging
    document.addEventListener('selectstart', (e) => {
      if (this.draggedWindow) {
        e.preventDefault();
      }
    });
  }

  startDragging(windowData, e) {
    this.draggedWindow = windowData;
    windowData.isDragging = true;
    
    const rect = windowData.element.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Add dragging class for visual feedback
    windowData.element.classList.add('dragging');
    document.body.style.cursor = 'move';
    
    this.bringToFront(windowData);
  }

  startResizing(windowData, e) {
    this.draggedWindow = windowData;
    windowData.isResizing = true;
    
    const rect = windowData.element.getBoundingClientRect();
    this.resizeStart = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    };
    
    document.body.style.cursor = 'nw-resize';
    this.bringToFront(windowData);
  }

  handleMouseMove(e) {
    if (!this.draggedWindow) return;
    
    if (this.draggedWindow.isDragging) {
      this.updateWindowPosition(e);
    } else if (this.draggedWindow.isResizing) {
      this.updateWindowSize(e);
    }
  }

  updateWindowPosition(e) {
    const { element } = this.draggedWindow;
    const desktop = document.querySelector('.desktop-workspace');
    const desktopRect = desktop.getBoundingClientRect();
    
    let newX = e.clientX - this.dragOffset.x - desktopRect.left;
    let newY = e.clientY - this.dragOffset.y - desktopRect.top;
    
    // Constrain to desktop bounds
    const elementRect = element.getBoundingClientRect();
    const maxX = desktopRect.width - elementRect.width;
    const maxY = desktopRect.height - elementRect.height;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
  }

  updateWindowSize(e) {
    const { element } = this.draggedWindow;
    
    const deltaX = e.clientX - this.resizeStart.x;
    const deltaY = e.clientY - this.resizeStart.y;
    
    let newWidth = this.resizeStart.width + deltaX;
    let newHeight = this.resizeStart.height + deltaY;
    
    // Enforce minimum sizes
    const minWidth = parseInt(element.style.minWidth) || 400;
    const minHeight = parseInt(element.style.minHeight) || 300;
    
    newWidth = Math.max(minWidth, newWidth);
    newHeight = Math.max(minHeight, newHeight);
    
    // Enforce maximum sizes (desktop bounds)
    const desktop = document.querySelector('.desktop-workspace');
    const desktopRect = desktop.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const maxWidth = desktopRect.width - (elementRect.left - desktopRect.left);
    const maxHeight = desktopRect.height - (elementRect.top - desktopRect.top);
    
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);
    
    element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;
  }

  handleMouseUp(e) {
    if (this.draggedWindow) {
      if (this.draggedWindow.isDragging) {
        this.draggedWindow.element.classList.remove('dragging');
      }
      
      this.draggedWindow.isDragging = false;
      this.draggedWindow.isResizing = false;
      this.draggedWindow = null;
      
      document.body.style.cursor = '';
    }
  }

  bringToFront(windowData) {
    this.highestZIndex++;
    windowData.element.style.zIndex = this.highestZIndex;
    
    // Update active window styling
    this.windows.forEach(w => {
      w.element.classList.remove('active-window');
    });
    windowData.element.classList.add('active-window');
  }

  // Window management methods
  showWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData) {
      windowData.element.classList.remove('hidden');
      windowData.element.classList.add('fade-in');
      this.bringToFront(windowData);
      
      // Animate window appearance
      windowData.element.style.transform = 'scale(0.8)';
      windowData.element.style.opacity = '0';
      
      requestAnimationFrame(() => {
        windowData.element.style.transition = 'all 0.3s ease-out';
        windowData.element.style.transform = 'scale(1)';
        windowData.element.style.opacity = '1';
        
        setTimeout(() => {
          windowData.element.style.transition = '';
        }, 300);
      });
    }
  }

  hideWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData) {
      windowData.element.style.transition = 'all 0.3s ease-in';
      windowData.element.style.transform = 'scale(0.8)';
      windowData.element.style.opacity = '0';
      
      setTimeout(() => {
        windowData.element.classList.add('hidden');
        windowData.element.style.transition = '';
        windowData.element.style.transform = '';
        windowData.element.style.opacity = '';
      }, 300);
    }
  }

  minimizeWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData) {
      // Store current position and size
      const element = windowData.element;
      element.dataset.restoreLeft = element.style.left;
      element.dataset.restoreTop = element.style.top;
      element.dataset.restoreWidth = element.style.width;
      element.dataset.restoreHeight = element.style.height;
      element.dataset.minimized = 'true';
      
      // Animate to taskbar (bottom of screen)
      element.style.transition = 'all 0.4s ease-in-out';
      element.style.transform = 'scale(0.1)';
      element.style.opacity = '0.3';
      element.style.left = '20px';
      element.style.top = 'calc(100vh - 60px)';
      
      setTimeout(() => {
        element.classList.add('hidden');
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
      }, 400);
    }
  }

  restoreWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData && windowData.element.dataset.minimized === 'true') {
      const element = windowData.element;
      
      // Restore position and size
      element.style.left = element.dataset.restoreLeft;
      element.style.top = element.dataset.restoreTop;
      element.style.width = element.dataset.restoreWidth;
      element.style.height = element.dataset.restoreHeight;
      
      element.classList.remove('hidden');
      element.style.transition = 'all 0.4s ease-out';
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      
      setTimeout(() => {
        element.style.transition = '';
        element.dataset.minimized = 'false';
      }, 400);
      
      this.bringToFront(windowData);
    }
  }

  maximizeWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData) {
      const element = windowData.element;
      
      if (element.dataset.maximized === 'true') {
        // Restore from maximized
        element.style.width = element.dataset.restoreWidth;
        element.style.height = element.dataset.restoreHeight;
        element.style.left = element.dataset.restoreLeft;
        element.style.top = element.dataset.restoreTop;
        element.dataset.maximized = 'false';
      } else {
        // Maximize
        element.dataset.restoreWidth = element.style.width;
        element.dataset.restoreHeight = element.style.height;
        element.dataset.restoreLeft = element.style.left;
        element.dataset.restoreTop = element.style.top;
        
        const desktop = document.querySelector('.desktop-workspace');
        const padding = 20;
        
        element.style.width = `${desktop.clientWidth - padding * 2}px`;
        element.style.height = `${desktop.clientHeight - padding * 2}px`;
        element.style.left = `${padding}px`;
        element.style.top = `${padding}px`;
        element.dataset.maximized = 'true';
      }
    }
  }

  closeWindow(windowId) {
    const windowData = this.windows.find(w => w.id === windowId);
    if (windowData) {
      // Animate close
      windowData.element.style.transition = 'all 0.3s ease-in';
      windowData.element.style.transform = 'scale(0.5)';
      windowData.element.style.opacity = '0';
      
      setTimeout(() => {
        windowData.element.classList.add('hidden');
        windowData.element.style.transition = '';
        windowData.element.style.transform = '';
        windowData.element.style.opacity = '';
      }, 300);
    }
  }

  // Utility methods
  getActiveWindow() {
    return this.windows.find(w => w.element.classList.contains('active-window'));
  }

  getVisibleWindows() {
    return this.windows.filter(w => !w.element.classList.contains('hidden'));
  }

  arrangeWindows(arrangement = 'cascade') {
    const visibleWindows = this.getVisibleWindows();
    const desktop = document.querySelector('.desktop-workspace');
    
    switch (arrangement) {
      case 'cascade':
        this.cascadeWindows(visibleWindows, desktop);
        break;
      case 'tile':
        this.tileWindows(visibleWindows, desktop);
        break;
      case 'minimize-all':
        visibleWindows.forEach(w => this.minimizeWindow(w.id));
        break;
    }
  }

  cascadeWindows(windows, desktop) {
    const offset = 30;
    windows.forEach((windowData, index) => {
      const element = windowData.element;
      element.style.left = `${20 + index * offset}px`;
      element.style.top = `${20 + index * offset}px`;
      element.style.width = '600px';
      element.style.height = '400px';
      this.bringToFront(windowData);
    });
  }

  tileWindows(windows, desktop) {
    const count = windows.length;
    if (count === 0) return;
    
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    const windowWidth = (desktop.clientWidth - 40) / cols;
    const windowHeight = (desktop.clientHeight - 40) / rows;
    
    windows.forEach((windowData, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const element = windowData.element;
      element.style.left = `${20 + col * windowWidth}px`;
      element.style.top = `${20 + row * windowHeight}px`;
      element.style.width = `${windowWidth - 10}px`;
      element.style.height = `${windowHeight - 10}px`;
    });
  }
}
