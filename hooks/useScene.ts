import { useExperienceStore } from '@/store/useExperienceStore';
import { SCENE_CONFIGS, SCENE_ORDER } from '@/constants/scenes';
import { SceneId } from '@/types/scene';

export function useScene() {
    const currentScene = useExperienceStore((state) => state.currentScene);
    const setScene = useExperienceStore((state) => state.setScene);
    const nextScene = useExperienceStore((state) => state.nextScene);
    const prevScene = useExperienceStore((state) => state.prevScene);

    const sceneConfig = SCENE_CONFIGS[currentScene];
    const currentIndex = SCENE_ORDER.indexOf(currentScene);
    const isFirstScene = currentIndex === 0;
    const isLastScene = currentIndex === SCENE_ORDER.length - 1;

    return {
        currentScene,
        sceneConfig,
        currentIndex,
        isFirstScene,
        isLastScene,
        setScene,
        nextScene,
        prevScene,
    };
}
