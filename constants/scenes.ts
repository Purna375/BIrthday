import { SceneConfig, SceneId } from '@/types/scene';

export const SCENE_CONFIGS: Record<SceneId, SceneConfig> = {
    [SceneId.INTRO]: {
        id: SceneId.INTRO,
        title: 'Singularity of Eternal Love',
        description: 'Black Hole Gateway',
        hasAudioTrack: true,
    },
    [SceneId.SPACE]: {
        id: SceneId.SPACE,
        title: 'Starlight Exploration',
        description: 'Traverse the cosmic stellar space',
        hasAudioTrack: true,
    },
    [SceneId.SOLAR_SYSTEM]: {
        id: SceneId.SOLAR_SYSTEM,
        title: 'Eternal Love Solar System',
        description: 'Explore the 9 cosmic memory planets',
        hasAudioTrack: true,
    },
    [SceneId.BIRTHDAY]: {
        id: SceneId.BIRTHDAY,
        title: 'The Birthday Wish',
        description: 'A special message unfolds',
        hasAudioTrack: true,
    },
    [SceneId.CELEBRATION]: {
        id: SceneId.CELEBRATION,
        title: 'Grand Finale',
        description: 'Fireworks & celebration moments',
        hasAudioTrack: true,
    },
    [SceneId.OUTRO]: {
        id: SceneId.OUTRO,
        title: 'End of Journey',
        description: 'Thank you for celebrating with us',
        hasAudioTrack: true,
    },
};

export const SCENE_ORDER: SceneId[] = [
    SceneId.INTRO,
    SceneId.SOLAR_SYSTEM,
    SceneId.CELEBRATION,
    SceneId.OUTRO,
];

export const INITIAL_SCENE: SceneId = SceneId.INTRO;