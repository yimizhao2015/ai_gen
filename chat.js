class ChatScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.setup();
    }

    setup() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2c3e50);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        // Start animation
        this.animate();
    }

    addMessage(text) {
        const geometry = new THREE.BoxGeometry(2, 0.5, 0.1);
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const message = new THREE.Mesh(geometry, material);

        // Position the message
        const yOffset = this.messages.length * 0.6;
        message.position.y = -yOffset;
        
        this.scene.add(message);
        this.messages.push(message);

        // Animate other messages up
        this.messages.forEach((msg, index) => {
            if (msg !== message) {
                gsap.to(msg.position, {
                    y: -index * 0.6 + 0.6,
                    duration: 0.5
                });
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate messages slightly
        this.messages.forEach(message => {
            message.rotation.x += 0.001;
            message.rotation.y += 0.001;
        });

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    chatScene.handleResize();
});