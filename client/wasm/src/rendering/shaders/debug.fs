R"(#version 300 es
precision mediump float;

layout (location = 0) out vec4 gColor;
layout (location = 1) out vec4 gNormal;

in vec3 u_color;

void main() {
    gColor = vec4(u_color, 1.0);
    gNormal = vec4(0., 0., 0., 1.0);
}
)"