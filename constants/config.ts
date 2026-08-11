export const APP_CONFIG = {
    name: 'Cosmic Love & Birthday Journey',
    description: 'An interactive 3D birthday celebration built with React Three Fiber and Next.js',
    debugMode: process.env.NODE_ENV === 'development',
    camera: {
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [0, 0, 10] as [number, number, number],
    },
    graphics: {
        shadows: true,
        postProcessing: true,
        dpr: [1, 2] as [number, number],
    },
};
