export interface VFXConfig {
    spaceDust: {
        enabled: boolean;
        count: number;
        size: number;
        color: string;
        opacity: number;
    };
    meteorShower: {
        enabled: boolean;
        count: number;
        speed: number;
        color: string;
    };
    shootingStars: {
        enabled: boolean;
        count: number;
        speed: number;
    };
    energyWaves: {
        enabled: boolean;
        speed: number;
        color: string;
        radiusMax: number;
    };
    sparkles: {
        enabled: boolean;
        count: number;
        size: number;
    };
    floatingHearts: {
        enabled: boolean;
        count: number;
        speed: number;
    };
    volumetricFog: {
        enabled: boolean;
        color: string;
        density: number;
    };
    bloom: {
        enabled: boolean;
        intensity: number;
        luminanceThreshold: number;
    };
}

export const DEFAULT_VFX_CONFIG: VFXConfig = {
    spaceDust: {
        enabled: true,
        count: 400,
        size: 0.06,
        color: '#ffffff',
        opacity: 0.5,
    },
    meteorShower: {
        enabled: true,
        count: 20,
        speed: 1.5,
        color: '#e2e8f0',
    },
    shootingStars: {
        enabled: true,
        count: 6,
        speed: 2.0,
    },
    energyWaves: {
        enabled: false,
        speed: 1.0,
        color: '#ffffff',
        radiusMax: 50,
    },
    sparkles: {
        enabled: true,
        count: 150,
        size: 0.05,
    },
    floatingHearts: {
        enabled: false,
        count: 20,
        speed: 0.3,
    },
    volumetricFog: {
        enabled: false,
        color: '#000000',
        density: 0.0,
    },
    bloom: {
        enabled: true,
        intensity: 0.2,
        luminanceThreshold: 0.9,
    },
};
