uniform float time;
uniform float progress;
uniform sampler2D textures;
varying vec3 vNormal;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
float PI = 3.141592653589793238;

void main(){
    gl_FragColor = vec4(vNormal, 1.0);
     
     #include <colorspace_fragment>
}
