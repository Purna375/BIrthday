export enum SceneId {
  INTRO = 'INTRO',
  SPACE = 'SPACE',
  SOLAR_SYSTEM = 'SOLAR_SYSTEM',
  BIRTHDAY = 'BIRTHDAY',
  CELEBRATION = 'CELEBRATION',
  OUTRO = 'OUTRO',
}

export interface SceneConfig {
  id: SceneId;
  title: string;
  description?: string;
  duration?: number;
  hasAudioTrack?: boolean;
}
