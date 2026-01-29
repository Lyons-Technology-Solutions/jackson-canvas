
import * as THREE from 'three';

export class CanvasWeave {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private points!: THREE.Points;
    private material!: THREE.ShaderMaterial;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
        
        this.init();
        this.animate();
        this.handleResize();
    }
    
    private init() {
        const count = 15000;
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
            randoms[i] = Math.random();
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 1.5 },
                uProgress: { value: 0 },
                uColor: { value: new THREE.Color('#78716c') } // stone-500
            },
            vertexShader: `
                uniform float uTime;
                uniform float uSize;
                uniform float uProgress;
                attribute float aRandom;
                varying float vAlpha;
                
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    
                    // The "Unraveling" effect: points spread out and move towards camera as progress increases
                    modelPosition.z += uProgress * 5.0 * aRandom;
                    modelPosition.x += sin(uTime * 0.2 + modelPosition.y) * uProgress * 2.0;
                    
                    // Subtle wave animation
                    modelPosition.y += sin(uTime * 0.1 + modelPosition.x) * 0.1;
                    
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectionPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectionPosition;
                    gl_PointSize = uSize * (1.0 / -viewPosition.z);
                    
                    // Fade based on progress and random factor
                    vAlpha = (1.0 - uProgress) * (0.5 + 0.5 * sin(uTime + aRandom * 10.0));
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vAlpha;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;
                    
                    gl_FragColor = vec4(uColor, strength * vAlpha);
                }
            `
        });
        
        this.points = new THREE.Points(geometry, this.material);
        this.scene.add(this.points);
    }
    
    public updateProgress(progress: number) {
        if (this.material) {
            this.material.uniforms.uProgress.value = progress;
        }
    }
    
    private handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (this.material) {
            this.material.uniforms.uTime.value += 0.05;
        }
        this.renderer.render(this.scene, this.camera);
    }
}
