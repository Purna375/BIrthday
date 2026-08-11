export type MemoryItemType =
    | 'image'
    | 'video'
    | 'voiceNote'
    | 'letter'
    | 'object3D'
    | 'floatingText';

export interface BaseMemoryItem {
    id: string;
    type: MemoryItemType;
    title: string;
    description?: string;
    backgroundMusic?: string;
    triggerConfetti?: boolean;
    typewriterSpeed?: number;
}

export interface ImageMemoryItem extends BaseMemoryItem {
    type: 'image';
    imageUrl: string;
    caption?: string;
}

export interface VideoMemoryItem extends BaseMemoryItem {
    type: 'video';
    videoUrl: string;
    posterUrl?: string;
}

export interface VoiceNoteMemoryItem extends BaseMemoryItem {
    type: 'voiceNote';
    audioUrl: string;
    duration?: string;
}

export interface LetterMemoryItem extends BaseMemoryItem {
    type: 'letter';
    content: string;
    author?: string;
}

export interface Object3DMemoryItem extends BaseMemoryItem {
    type: 'object3D';
    modelType?: 'heart' | 'crystal' | 'star' | 'ring' | 'giftBox';
    color?: string;
    rotateSpeed?: number;
}

export interface FloatingTextMemoryItem extends BaseMemoryItem {
    type: 'floatingText';
    messages: string[];
}

export type MemoryItem =
    | ImageMemoryItem
    | VideoMemoryItem
    | VoiceNoteMemoryItem
    | LetterMemoryItem
    | Object3DMemoryItem
    | FloatingTextMemoryItem;

export interface PlanetMemoryPayload {
    planetId: string;
    title: string;
    items: MemoryItem[];
}
