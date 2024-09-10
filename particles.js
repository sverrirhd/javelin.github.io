const particleCount = 2000;
const particleSize = 0.02;

let scene, camera, renderer, particles;
let direction = 1; // 1 for inward, -1 for outward
let isPaused = false; // New variable to track pause state
let lastAnimationTime = 0; // New variable to store the last animation time

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particles-container').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 2 + 1;
        const theta = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(theta) * radius;
        positions[i3 + 1] = Math.sin(theta) * radius;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;
        scales[i] = Math.random() * 0.5 + 0.5;
        randomness[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('randomness', new THREE.BufferAttribute(randomness, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: particleSize },
            direction: { value: direction },
        },
        vertexShader: `
            uniform float time;
            uniform float size;
            uniform float direction;
            attribute float scale;
            attribute float randomness;
            varying float vScale;
            
            void main() {
                vScale = scale;
                vec3 pos = position;
                
                float angle = atan(pos.y, pos.x);
                float radius = length(pos.xy);
                
                // Calculate the total time for this particle
                float particleTime = time + randomness * 10.0;
                
                // Spiral movement
                angle += particleTime * (2.0 - radius * 0.5);
                radius = mod(radius - particleTime * 0.2, 2.0) + 0.1;
                
                pos.x = cos(angle) * radius;
                pos.y = sin(angle) * radius;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * scale * (300.0 / -mvPosition.z);
            }
        `,
        fragmentShader: `
            varying float vScale;
            
            void main() {
                if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
                gl_FragColor = vec4(1.0, 0.8, 0.3, 0.6 * vScale);
            }
        `,
        transparent: true,
        depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Update the click event listener for the logo
    const logo = document.querySelector('.logo-container');
    logo.addEventListener('click', togglePauseAndDirection);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function togglePauseAndDirection() {
    isPaused = !isPaused; // Toggle pause state
    
    if (!isPaused) {
        // Resume animation
        animate(lastAnimationTime);
    }
    
    // Toggle direction as before
    direction *= -1;
    particles.material.uniforms.direction.value = direction;
}

function animate(time) {
    if (!isPaused) {
        requestAnimationFrame(animate);
        lastAnimationTime = time;
        particles.material.uniforms.time.value = time * 0.001;
        renderer.render(scene, camera);
    }
}

init();
animate();