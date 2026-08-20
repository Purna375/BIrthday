'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Music, Sparkles, Play, Pause, X, Disc, Volume2, Gift } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

interface Props {
    onOpenStoryBook: () => void;
}

export default function Day10GrandHub({ onOpenStoryBook }: Props) {
    const { playSuccessSFX } = useAudioStore();
    const [activeModal, setActiveModal] = useState<'wishes' | 'song' | null>(null);

    // Audio player state for Custom Song surprise (Nee Pilupe Naa Paata.mp3)
    const [isPlayingSong, setIsPlayingSong] = useState(false);
    const songAudioRef = useRef<HTMLAudioElement | null>(null);
    const letterBgmRef = useRef<HTMLAudioElement | null>(null);

    // Handle Thiru Bgm.mp3 when Day 10 Letter (Special Birthday Wishes) is displayed
    useEffect(() => {
        if (activeModal === 'wishes') {
            const audio = new Audio('/audio/Thiru_Bgm.mp3');
            audio.loop = true; // auto restart / loop enabled
            audio.volume = 0.7;
            audio.play().catch(() => {});
            letterBgmRef.current = audio;

            return () => {
                audio.pause();
                audio.currentTime = 0;
                letterBgmRef.current = null;
            };
        }
    }, [activeModal]);

    // Cleanup song audio if activeModal changes away from 'song'
    useEffect(() => {
        if (activeModal !== 'song' && songAudioRef.current && isPlayingSong) {
            songAudioRef.current.pause();
            setIsPlayingSong(false);
        }
    }, [activeModal, isPlayingSong]);

    const toggleSong = () => {
        if (songAudioRef.current) {
            if (isPlayingSong) {
                songAudioRef.current.pause();
                setIsPlayingSong(false);
            } else {
                songAudioRef.current.play().then(() => {
                    setIsPlayingSong(true);
                }).catch((err) => {
                    console.error("Audio playback error:", err);
                    setIsPlayingSong(false);
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 bg-[#fce7f3] text-pink-950 overflow-y-auto pointer-events-auto select-none">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-200/60 via-pink-100 to-[#fce7f3] pointer-events-none" />

            {/* Custom Song Hidden Audio Element: Nee Pilupe Naa Paata.mp3 */}
            <audio
                ref={songAudioRef}
                src="/audio/Nee%20Pilupe%20Naa%20Paata.mp3"
                preload="auto"
                onEnded={() => setIsPlayingSong(false)}
            />

            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 py-6 z-10">
                {/* Header Title Banner */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center flex flex-col items-center gap-3"
                >
                    <span className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-widest bg-white/90 text-rose-600 border border-pink-300 shadow-md font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                        Day 10 Grand Birthday Singularity • Unlocked
                        <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                    </span>

                    <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-pink-950 tracking-tight drop-shadow-sm">
                        Happy Birthday, My Dearest Sirivalli Purna! 🎂💖
                    </h1>

                    <p className="text-xs md:text-sm font-sans font-medium text-pink-800 max-w-lg leading-relaxed">
                        You have unlocked the 3 grandest secrets hidden in the heart of our celestial universe. Choose a surprise below to explore!
                    </p>
                </motion.div>

                {/* 3 DIFFERENT SURPRISES IN THE MIDDLE OF THE SCREEN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-2">
                    {/* SURPRISE 1: OUR STORY (STORY BOOK) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => {
                            playSuccessSFX();
                            onOpenStoryBook();
                        }}
                        className="group relative cursor-pointer p-6 md:p-8 rounded-3xl bg-white/90 border-4 border-pink-300 shadow-[0_0_50px_rgba(244,114,182,0.4)] hover:shadow-[0_0_80px_rgba(244,114,182,0.7)] hover:border-rose-400 transform hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"
                    >
                        <div className="p-5 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-white shadow-xl group-hover:scale-110 transition-transform">
                            <BookOpen className="w-10 h-10 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold block mb-1">
                                Surprise #1
                            </span>
                            <h3 className="text-xl font-bold font-serif text-pink-950 tracking-wide">
                                1. Our Story
                            </h3>
                        </div>
                        <p className="text-xs text-pink-800 font-sans leading-relaxed">
                            Open our ultimate interactive presentation storybook detailing our full journey across the stars.
                        </p>
                        <span className="mt-2 px-4 py-2 rounded-full bg-pink-100 text-rose-700 font-mono text-xs font-bold border border-pink-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            📖 Read Story Book ➔
                        </span>
                    </motion.div>

                    {/* SURPRISE 2: BIRTHDAY WISHES */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => {
                            playSuccessSFX();
                            setActiveModal('wishes');
                        }}
                        className="group relative cursor-pointer p-6 md:p-8 rounded-3xl bg-white/90 border-4 border-pink-300 shadow-[0_0_50px_rgba(244,114,182,0.4)] hover:shadow-[0_0_80px_rgba(244,114,182,0.7)] hover:border-rose-400 transform hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"
                    >
                        <div className="p-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                            <Heart className="w-10 h-10 fill-current animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold block mb-1">
                                Surprise #2
                            </span>
                            <h3 className="text-xl font-bold font-serif text-pink-950 tracking-wide">
                                2. Special Wishes
                            </h3>
                        </div>
                        <p className="text-xs text-pink-800 font-sans leading-relaxed">
                            Read heartfelt birthday wishes and personal letters written especially for your special day.
                        </p>
                        <span className="mt-2 px-4 py-2 rounded-full bg-pink-100 text-rose-700 font-mono text-xs font-bold border border-pink-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            💌 View Birthday Wishes ➔
                        </span>
                    </motion.div>

                    {/* SURPRISE 3: CUSTOM SONG */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => {
                            playSuccessSFX();
                            setActiveModal('song');
                        }}
                        className="group relative cursor-pointer p-6 md:p-8 rounded-3xl bg-white/90 border-4 border-pink-300 shadow-[0_0_50px_rgba(244,114,182,0.4)] hover:shadow-[0_0_80px_rgba(244,114,182,0.7)] hover:border-rose-400 transform hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"
                    >
                        <div className="p-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                            <Music className="w-10 h-10 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold block mb-1">
                                Surprise #3
                            </span>
                            <h3 className="text-xl font-bold font-serif text-pink-950 tracking-wide">
                                3. Custom Song
                            </h3>
                        </div>
                        <p className="text-xs text-pink-800 font-sans leading-relaxed">
                            Listen to your custom dedicated birthday song created with love and celestial harmony.
                        </p>
                        <span className="mt-2 px-4 py-2 rounded-full bg-pink-100 text-rose-700 font-mono text-xs font-bold border border-pink-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            🎵 Play Custom Song ➔
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* MODAL SURPRISE 2: BIRTHDAY WISHES CARD (Plays Thiru Bgm.mp3) */}
            <AnimatePresence>
                {activeModal === 'wishes' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-white border-4 border-pink-400 shadow-2xl flex flex-col gap-5 text-pink-950 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-pink-200 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-rose-500 text-white">
                                        <Heart className="w-6 h-6 fill-current" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-pink-950">
                                        Special Birthday Wishes
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="font-serif leading-relaxed text-sm md:text-base text-pink-950 space-y-3 whitespace-pre-line overflow-y-auto max-h-[60vh] pr-2">
                                <p className="font-bold text-rose-600 text-lg">Naa Potti... 🎂🌌❤️</p>

                                <p>Ippativaraku nuvvu chusindhi oka universe anukunnaav kadha...</p>
                                <p>Kaani nijam enti ante...</p>
                                <p className="font-bold text-rose-700">adhi universe kaadhu.<br />Ninnu chusthu naa heart lo perigina konni feelings ki oka shape ichina place. 🥹❤️</p>

                                <p>Prathi planet oka memory...</p>
                                <p>Prathi star oka moment...</p>
                                <p>Prathi heartbeat lo oka feeling...</p>
                                <p>Ivi anni kalipi chivariki ninnu teesukochindhi ikkade...</p>
                                <p className="font-bold text-rose-700">naa heart daggariki. 🫀</p>

                                <p>Ee roju nee birthday.</p>
                                <p>Kaani naaku idi nee puttina roju maatrame kaadhu...</p>
                                <p className="font-bold text-rose-700">Naa life lo oka roju,<br />oka ammayi undadam entha beautiful ga untundo celebrate cheskune roju. ❤️</p>

                                <p>Nuvvu eppudu notice cheyyakapovachu...</p>
                                <p>Kaani konni chinna chinna moments lo nuvvu naaku entha special oo naaku telusthu untundi.</p>
                                <p>Nuvvu random ga navvinappudu...</p>
                                <p>Nuvvu reason lekunda childish ga behave chesinappudu...</p>
                                <p>Nuvvu edho cheppadaniki mundhu konchem hesitate ayinappudu...</p>
                                <p>Nuvvu naatho comfortable ga silent ga unna kuda...</p>
                                <p>Aa moments anni naaku chala precious.</p>
                                <p>Endhukante avi staged moments kaadhu.</p>
                                <p className="font-bold text-rose-700">Avi nee original moments.<br />Avi naaku dorikina nee real versions. 🤍</p>

                                <p>Anduke ee roju nenu neeku oka promise, oka wish, oka big dialogue ivvalanukovatledu.</p>
                                <p>Just oka korika...</p>
                                <p className="font-bold text-rose-700">Nee life lo nuvvu nee meeda doubt padina prathi sari,<br />nee value ni gurthu chese oka reason dorakali.</p>

                                <p>Nuvvu odipoyina roju...</p>
                                <p>malli try cheyyadaniki oka chinna hope undali.</p>
                                <p>Nuvvu tired ayina roju...</p>
                                <p>konchem peaceful ga breathing space dorakali.</p>
                                <p>Nuvvu happy ga unna roju...</p>
                                <p>aa happiness ni double chese people nee chuttu undali.</p>
                                <p>Nuvvu edchina roju...</p>
                                <p>nee tears ni hide cheyyalsina avasaram raakudadhu.</p>
                                <p>And most importantly...</p>
                                <p className="font-bold text-rose-700">nee heart eppudu heavy ga undakudadhu. 🥺🤍</p>

                                <p>Nuvvu entha pedda ammayi ayina...</p>
                                <p>naaku maatram konni moments lo aa chinna Potti laane kanipisthav.</p>
                                <p>Konchem stubborn...</p>
                                <p>Konchem crazy...</p>
                                <p>Konchem overthinking...</p>
                                <p>Chala cute...</p>
                                <p>And somehow...</p>
                                <p className="font-bold text-rose-700">naa heart ki perfect ga familiar. ❤️</p>

                                <p>Ee birthday nunchi nee life lo oka beautiful chapter start avvali.</p>
                                <p>Nuvvu dream chesina things okkokkati nijam avvali.</p>
                                <p>Nuvvu imagine cheyyani happiness kuda nee door knock cheyyali.</p>
                                <p>Nee eyes lo tears vachina...</p>
                                <p>avi mostly happiness valle raavali.</p>
                                <p>Nee face meeda smile vachina...</p>
                                <p>daaniki reason nuvvu kaavali, vere evaru kaadhu.</p>

                                <p>And years later...</p>
                                <p>Nuvvu ee message chadivina appudu...</p>
                                <p>ee roju gurthu raavali.</p>
                                <p>Ee universe gurthu raavali.</p>
                                <p>Ee little journey gurthu raavali.</p>
                                <p>And...</p>
                                <p className="font-bold text-rose-700">oka pichodu ninnu entha pure ga love chesado gurthu raavali. 🥹❤️</p>

                                <p className="font-bold text-rose-600 text-lg">Happy Birthday naa Potti... 🎂💗</p>
                                <p>Nee birthday ki nenu world lo unna beautiful things anni wish cheyyalenu...</p>
                                <p>Endhukante avi anni already nee kosam chaala chinnavi.</p>
                                <p>So...</p>
                                <p className="font-bold text-rose-700">Nee life nee heart kanna beautiful ga undalani korukuntunna.</p>

                                <p>Ee roju nunchi...</p>
                                <p>Nee calendar lo oka new year start avuthundi.</p>
                                <p>Kaani naa kosam...</p>
                                <p className="font-bold text-rose-700">nee meeda inka konchem ekkuva prema tho oka new chapter start avuthundi. ❤️</p>

                                <p>Close your eyes...</p>
                                <p>Oka deep breath teesko...</p>
                                <p>Ee universe lo chivari ga migilina light ni choodu...</p>
                                <p className="font-bold text-rose-700">adhi gift kaadhu Potti...<br />adhi naa heart lo nee kosam eppatiki velige oka chinna light. ✨🫀</p>

                                <p className="font-bold text-rose-600 text-base">Happy Birthday, my Potti. 🎂❤️</p>
                                <p className="font-semibold text-rose-700">Be happy.<br />Be crazy.<br />Be yourself.<br />And keep that beautiful smile safe.</p>

                                <p>Because somewhere in this huge universe...</p>
                                <p className="font-bold text-rose-700">oka heart ki aa smile ante chaala ishtam. 🥹❤️🩹</p>

                                <p className="font-bold text-rose-600 text-lg">Happy Birthday, Potti.<br />Today is your day.<br />And this little universe...<br />was always meant to end with you. 🌌❤️♾️</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL SURPRISE 3: CUSTOM SONG PLAYER (Nee Pilupe Naa Paata.mp3) */}
            <AnimatePresence>
                {activeModal === 'song' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-white border-4 border-pink-400 shadow-2xl flex flex-col items-center gap-6 text-pink-950"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <motion.div
                                animate={{ rotate: isPlayingSong ? 360 : 0 }}
                                transition={{ duration: 4, repeat: isPlayingSong ? Infinity : 0, ease: 'linear' }}
                                className="w-36 h-36 rounded-full bg-zinc-950 border-4 border-pink-400 flex items-center justify-center shadow-2xl mt-2"
                            >
                                <Disc className="w-12 h-12 text-pink-300" />
                            </motion.div>

                            <div className="text-center">
                                <span className="text-xs font-mono uppercase tracking-widest text-rose-500 font-bold block mb-1">
                                    Custom Birthday Song
                                </span>
                                <h3 className="text-xl font-serif font-bold text-pink-950">
                                    Nee Pilupe Naa Paata 🎶❤️
                                </h3>
                                <p className="text-xs text-pink-700 font-sans mt-1">
                                    Dedicated to Sirivalli • Lyrics written with love ✍️❤️
                                </p>
                            </div>

                            <button
                                onClick={toggleSong}
                                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                            >
                                {isPlayingSong ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                <span>{isPlayingSong ? 'Pause Song' : 'Play Song'}</span>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
