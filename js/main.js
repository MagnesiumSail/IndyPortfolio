// Main JavaScript file for Indy Portfolio
// This file provides the basic structure and functionality
// Three.js integration will be added here later

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Portfolio App initializing...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        console.log('DOM is ready');
        
        // Initialize components
        this.setupNavigation();
        this.setupThreeContainer();
        this.addEventListeners();
        
        // Add fade-in animation to content
        this.animateContent();
        
        console.log('Portfolio App initialized successfully');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.handleNavigation(target);
            });
        });
    }

    handleNavigation(target) {
        console.log(`Navigating to: ${target}`);
        
        // Smooth scroll behavior (if we had sections to scroll to)
        // For now, just log the navigation
        
        // Remove active class from all links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        document.querySelector(`nav a[href="${target}"]`).classList.add('active');
    }

    setupThreeContainer() {
        const container = document.getElementById('three-container');
        
        if (!container) {
            console.error('Three.js container not found');
            return;
        }

        // Prepare container for Three.js
        container.style.position = 'relative';
        
        // Add a placeholder message
        console.log('Three.js container ready for scene initialization');
        
        // TODO: Initialize Three.js scene here
        // This is where the Three.js scene, camera, renderer, and objects will be set up
        
        this.initPlaceholderContent(container);
    }

    initPlaceholderContent(container) {
        // Create a placeholder element until Three.js is added
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 2;
            background: rgba(0, 0, 0, 0.7);
            padding: 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        `;
        
        placeholder.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #64ffda;">Three.js Scene</h3>
            <p style="color: #cccccc; margin-bottom: 1rem;">Ready for 3D content</p>
            <div style="width: 200px; height: 200px; border: 2px dashed #64ffda; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 10px;">
                <span style="color: #64ffda;">3D Canvas</span>
            </div>
        `;
        
        container.appendChild(placeholder);
    }

    addEventListeners() {
        // Window resize handler for responsive Three.js canvas
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse movement for potential Three.js interactions
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onWindowResize() {
        // This will be important for Three.js camera and renderer updates
        console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
        
        // TODO: Update Three.js camera aspect ratio and renderer size
    }

    onMouseMove(event) {
        // Store mouse position for potential Three.js interactions
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // TODO: Use for Three.js camera controls or object interactions
    }

    onKeyDown(event) {
        // Handle keyboard shortcuts
        switch(event.code) {
            case 'KeyF':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.toggleFullscreen();
                }
                break;
            default:
                break;
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('three-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    animateContent() {
        // Add fade-in animation to content sections
        const contentSection = document.getElementById('content');
        if (contentSection) {
            contentSection.classList.add('fade-in');
        }
    }

    // Utility method for future Three.js integration
    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!(window.WebGLRenderingContext && context);
        } catch (e) {
            return false;
        }
    }

    // Method to initialize Three.js (to be implemented later)
    initThreeJS() {
        if (!this.isWebGLAvailable()) {
            console.warn('WebGL is not available in this browser');
            return false;
        }

        console.log('WebGL is available - ready for Three.js');
        
        // TODO: Initialize Three.js scene
        // - Create scene
        // - Create camera
        // - Create renderer
        // - Add lights
        // - Add objects
        // - Start animation loop
        
        return true;
    }
}

// Initialize the application
const app = new PortfolioApp();