class TableScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.setup();
        this.createVisualizations();
    }

    setup() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x34495e);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 20;
        this.camera.position.y = 10;
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // Create groups
        this.barChartGroup = new THREE.Group();
        this.pieChartGroup = new THREE.Group();
        this.scene.add(this.barChartGroup);
        this.scene.add(this.pieChartGroup);

        // Start animation
        this.animate();
    }

    createVisualizations() {
        const data = [
            { department: 'Electronics', sales: 50000, color: 0xe74c3c },
            { department: 'Clothing', sales: 35000, color: 0x3498db },
            { department: 'Books', sales: 25000, color: 0x2ecc71 },
            { department: 'Sports', sales: 40000, color: 0xf1c40f },
            { department: 'Home', sales: 45000, color: 0x9b59b6 },
            { department: 'Beauty', sales: 30000, color: 0xe67e22 }
        ];

        this.createBarChart(data);
        this.createPieChart(data);
    }

    createBarChart(data) {
        const maxSales = Math.max(...data.map(d => d.sales));
        const barWidth = 1;
        const spacing = 1.5;
        
        data.forEach((item, index) => {
            const height = (item.sales / maxSales) * 15;
            const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
            const material = new THREE.MeshPhongMaterial({
                color: item.color,
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(geometry, material);
            bar.position.x = (index - data.length/2) * spacing;
            bar.position.y = height/2;
            bar.castShadow = true;
            bar.receiveShadow = true;
            
            // Add label
            const textGeometry = new THREE.TextGeometry(item.department, {
                size: 0.3,
                height: 0.1
            });
            const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const label = new THREE.Mesh(textGeometry, textMaterial);
            label.rotation.x = -Math.PI/2;
            label.position.set(bar.position.x - 0.5, 0, 1);
            
            this.barChartGroup.add(bar);
        });

        this.barChartGroup.position.set(-8, -2, 0);
    }

    createPieChart(data) {
        const radius = 5;
        const thickness = 1;
        const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
        let startAngle = 0;

        data.forEach(item => {
            const angle = (item.sales / totalSales) * Math.PI * 2;
            const arcShape = new THREE.Shape();
            
            arcShape.moveTo(0, 0);
            arcShape.arc(0, 0, radius, startAngle, startAngle + angle, false);
            arcShape.lineTo(0, 0);
            
            const extrudeSettings = {
                steps: 1,
                depth: thickness,
                bevelEnabled: false
            };
            
            const geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
            const material = new THREE.MeshPhongMaterial({
                color: item.color,
                transparent: true,
                opacity: 0.8
            });
            
            const wedge = new THREE.Mesh(geometry, material);
            wedge.rotation.x = -Math.PI/2;
            wedge.castShadow = true;
            wedge.receiveShadow = true;
            
            this.pieChartGroup.add(wedge);
            startAngle += angle;
        });

        this.pieChartGroup.position.set(8, 0, 0);
    }

    rotateTable() {
        const duration = 1;
        
        // Rotate bar chart
        gsap.to(this.barChartGroup.rotation, {
            y: this.barChartGroup.rotation.y + Math.PI * 2,
            duration: duration,
            ease: "power1.inOut"
        });

        // Rotate pie chart
        gsap.to(this.pieChartGroup.rotation, {
            y: this.pieChartGroup.rotation.y + Math.PI * 2,
            duration: duration,
            ease: "power1.inOut"
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Gentle continuous rotation
        this.barChartGroup.rotation.y += 0.002;
        this.pieChartGroup.rotation.y -= 0.002;
        
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
    if (typeof tableScene !== 'undefined') {
        tableScene.handleResize();
    }
});