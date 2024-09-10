const particleCount = 2000;
const particleSize = 0.02;

let scene, camera, renderer, particles;
let direction = 1; // 1 for inward, -1 for outward
let transitionTime = 0;
const transitionDuration = 2.0; // Duration of the transition in seconds

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particles-container').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount);
    const initialTimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 2 + 1;
        const theta = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(theta) * radius;
        positions[i3 + 1] = Math.sin(theta) * radius;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;
        scales[i] = Math.random() * 0.5 + 0.5;
        randomness[i] = Math.random();
        initialTimes[i] = Math.random() * 1000; // Random initial time for each particle
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('randomness', new THREE.BufferAttribute(randomness, 1));
    geometry.setAttribute('initialTime', new THREE.BufferAttribute(initialTimes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: particleSize },
            direction: { value: direction },
            transitionProgress: { value: 0 },
        },
        vertexShader: `
            uniform float time;
            uniform float size;
            uniform float direction;
            uniform float transitionProgress;
            attribute float scale;
            attribute float randomness;
            attribute float initialTime;
            varying float vScale;
            
            void main() {
                vScale = scale;
                vec3 pos = position;
                
                float angle = atan(pos.y, pos.x);
                float radius = length(pos.xy);
                
                float particleTime = time + initialTime + randomness * 10.0;
                
                // Calculate old and new directions
                float oldDirection = direction * sign(0.5 - transitionProgress);
                float newDirection = direction * sign(transitionProgress - 0.5);
                
                // Interpolate between old and new directions
                float currentDirection = mix(oldDirection, newDirection, smoothstep(0.0, 1.0, transitionProgress));
                
                // Spiral movement with smooth direction change
                float angleChange = particleTime * (2.0 - radius * 0.5);
                angle += angleChange * currentDirection;
                radius = mod(radius - angleChange * 0.1 * currentDirection, 2.0) + 0.1;
                
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

    window.addEventListener('resize', onWindowResize, false);

    // Add click event listener to the logo
    const logo = document.querySelector('.logo-container');
    logo.addEventListener('click', toggleDirection);
}

function toggleDirection() {
    direction *= -1; // Toggle between 1 and -1
    transitionTime = 0; // Reset transition time
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    requestAnimationFrame(animate);
    particles.material.uniforms.time.value = time * 0.001;
    
    // Update transition progress
    if (transitionTime < transitionDuration) {
        transitionTime += 0.016; // Assume 60fps
        const progress = Math.min(transitionTime / transitionDuration, 1.0);
        particles.material.uniforms.transitionProgress.value = progress;
    }
    
    particles.material.uniforms.direction.value = direction;
    renderer.render(scene, camera);
}

init();
animate();