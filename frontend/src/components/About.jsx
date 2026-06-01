import { useEffect, useState } from 'react';
import client, { resolveMedia, preloadImages } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import RichText from './RichText';
import MediaViewer from './MediaViewer';
import ThumbImage from './ThumbImage';
import Separator from './Separator';

export default function About() {
    const { t, lang } = useLanguage();
    const [about, setAbout] = useState(null);
    const [viewerIndex, setViewerIndex] = useState(null);

    useEffect(() => {
        client.get('/public/about').then(({ data }) => {
            if (data.success) setAbout(data.data);
        }).catch(() => {});
    }, []);

    // Warm the cache with full-resolution images so the lightbox opens instantly.
    useEffect(() => {
        if (about && about.images) {
            preloadImages(about.images.map(i => resolveMedia(i.image_url)));
        }
    }, [about]);

    if (!about) return null;

    const body = lang === 'tr' ? about.body_tr : about.body_en;
    const images = (about.images || []).map(i => resolveMedia(i.image_url));

    return (
        <>
            <Separator />
            <section id="about" className="relative scroll-mt-24">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
                    <div className="section-title-wrap">
                        <h2 className="section-title text-3xl sm:text-4xl text-gradient-phoenix">
                            {t('About', 'Hakkımızda')}
                        </h2>
                    </div>

                    <div className="card-panel p-6 sm:p-10">
                        <h3 className="font-deco text-3xl sm:text-4xl text-parchment text-center mb-8">
                            {about.title || 'AnkA Interactive'}
                        </h3>

                        {/* Image strip */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                {about.images.map((img, i) => (
                                    <button
                                        key={img.id ?? i}
                                        onClick={() => setViewerIndex(i)}
                                        className="relative group w-32 sm:w-40 md:w-48 aspect-[4/3] rounded-sm overflow-hidden border border-ink-400 hover:border-ember transition-all duration-300 hover:shadow-ember-sm hover:scale-[1.03]"
                                    >
                                        <ThumbImage image={img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                                        <span className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                            <RichText text={body} />
                        </div>
                    </div>
                </div>
            </section>

            {viewerIndex !== null && (
                <MediaViewer
                    images={images}
                    currentIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                    onNavigate={(i) => setViewerIndex(i)}
                />
            )}
        </>
    );
}
