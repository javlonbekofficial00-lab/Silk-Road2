// HTML5 Canvas Particles Constellation Background
const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const maxParticles = 90; // Density
const connectionDistance = 120; // Distance to draw connection line

// Mouse coordinates
const mouse = {
    x: null,
    y: null,
    radius: 150 // Radius of interaction
};

// Listen for mouse moves
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Clear mouse coordinates when leaving viewport
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Set full-screen canvas dimensions
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Particle size (1px to 3px)
        
        // Random velocities
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        
        // Colors from palette
        const colors = [
            'rgba(0, 242, 254, 0.45)', // Cyan
            'rgba(138, 43, 226, 0.35)', // Violet
            'rgba(225, 0, 255, 0.35)'  // Magenta
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    // Update position and check mouse interactions
    update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Mouse attraction effect
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Accelerate slightly toward mouse
                const force = (mouse.radius - distance) / mouse.radius;
                this.x += (dx / distance) * force * 0.6;
                this.y += (dy / distance) * force * 0.6;
            }
        }
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for line draws
    }
}

// Populate particles list
function init() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Draw connection lines between nearby particles
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                // Fade line based on distance
                const alpha = (1 - (distance / connectionDistance)) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                
                // Color gradient style
                ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Process particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
}

// Run particle simulation
init();
animate();
