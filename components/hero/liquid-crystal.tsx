"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_hue;
  uniform float u_speed;
  uniform float u_zoom;
  uniform float u_brightness;
  uniform float u_noise;
  uniform float u_warp;

  vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c * 0.5;
    vec3 rgb;
    float hh = h * 6.0;
    if (hh < 1.0) rgb = vec3(c, x, 0.0);
    else if (hh < 2.0) rgb = vec3(x, c, 0.0);
    else if (hh < 3.0) rgb = vec3(0.0, c, x);
    else if (hh < 4.0) rgb = vec3(0.0, x, c);
    else if (hh < 5.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);
    return rgb + m;
  }

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // 3 octaves for smooth but visible flowing shapes (not 5 = smoky)
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    float detail = 0.3 + u_noise * 0.7;
    for (int i = 0; i < 3; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= detail;
    }
    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 p = (uv - 0.5) * 2.0 * u_zoom;
    p.x *= u_resolution.x / u_resolution.y;

    float t = u_time * u_speed;

    // Layered noise with moderate warping for organic flow
    float warpAmt = 0.4 + u_warp * 0.6;
    float n1 = fbm(p + vec2(t * 0.3, t * 0.2));
    float n2 = fbm(p + vec2(n1 * warpAmt, t * 0.15) + 3.0);
    float n3 = fbm(p + vec2(n2 * 0.3 * warpAmt, n1 * 0.2 * warpAmt) + 7.0);

    float baseHue = u_hue / 360.0;
    float hueVar = n3 * 0.35;
    float h = baseHue + hueVar;
    float s = 0.75 + n2 * 0.2;
    float l = 0.25 + n3 * 0.30;

    vec3 color = hsl2rgb(fract(h), s, l) * u_brightness;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function LiquidCrystal({ onError }: { onError?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      onError?.();
      return;
    }

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      onError?.();
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      onError?.();
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uHue = gl.getUniformLocation(program, "u_hue");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uZoom = gl.getUniformLocation(program, "u_zoom");
    const uBright = gl.getUniformLocation(program, "u_brightness");
    const uNoise = gl.getUniformLocation(program, "u_noise");
    const uWarp = gl.getUniformLocation(program, "u_warp");

    // Hyros-style multicolor: purple base, wide hue spread, vibrant blobs
    gl.uniform1f(uHue, 270); // Purple/indigo base
    gl.uniform1f(uSpeed, 0.45); // Smooth organic movement
    gl.uniform1f(uZoom, 0.45); // Slightly zoomed out
    gl.uniform1f(uBright, 1.6); // Very bright — vibrant colors
    gl.uniform1f(uNoise, 0.5); // More detail for blob definition
    gl.uniform1f(uWarp, 0.6); // Strong warping for distinct color regions

    let animId: number;
    let paused = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    function render() {
      if (!paused) {
        gl!.uniform1f(uTime, (performance.now() - start) / 1000);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      }
      animId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [onError]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
