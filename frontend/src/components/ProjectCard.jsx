import { useState } from 'react';
import { resolveMedia } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import RichText from './RichText';
import MediaViewer from './MediaViewer';

export default function ProjectCard({ project }) {
    const { t, lang } = useLanguage();
    const [viewerIndex, setViewerIndex] = useState(null);

    const tagline = lang === 'tr' ? project.tagline_tr : project.tagline_en;
    const description = lang === 'tr' ? project.description_tr : project.description_en;
    const features = lang === 'tr' ? project.features_tr : project.features_en;
    const status = lang === 'tr' ? project.status_tr : project.status_en;

    const images = (project.images || []).map(i => resolveMedia(i.image_url));

    return (
        <>
            <article id={project.slug} className="card-panel p-6 sm:p-10 mb-10 scroll-mt-24 animate-fade-up">
                {/* Title + status ribbon */}
                <header className="mb-6 text-center">
                    <h3 className="font-deco font-black text-3xl sm:text-5xl text-gradient-ember mb-2 leading-tight">
                        {project.title}
                    </h3>
                    {tagline && (
                        <p className="font-accent text-xl sm:text-2xl text-phoenix">{tagline}</p>
                    )}
                    {status && (
                        <div className="inline-block mt-3 px-4 py-1 border border-ember/40 bg-ember/5 rounded-sm">
                            <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-phoenix-light">
                                {status}
                            </span>
                        </div>
                    )}
                </header>

                {/* Screenshot gallery */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
                        {images.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setViewerIndex(i)}
                                className="relative group aspect-video rounded-sm overflow-hidden border border-ink-400 hover:border-ember transition-all duration-300 hover:shadow-ember-sm hover:z-10 hover:scale-[1.05]"
                            >
                                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                                <span className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Description */}
                {description && (
                    <div className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
                        <RichText text={description} />
                    </div>
                )}

                {/* Features */}
                {features && (
                    <div className="max-w-3xl mx-auto mt-6 mb-8">
                        <h4 className="font-heading text-2xl tracking-[0.2em] text-ember mb-4 text-center">
                            {t('Key Features', 'Öne Çıkan Özellikler')}
                        </h4>
                        <div className="border-l-2 border-ember/40 pl-5 text-parchment/90 italic">
                            <RichText text={features} />
                        </div>
                    </div>
                )}

                {/* Trailer */}
                {project.trailer_url && (
                    <div className="text-center mt-6">
                        <a href={project.trailer_url} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            {t('Watch Trailer', 'Fragmanı İzle')}
                        </a>
                    </div>
                )}

                {/* Download */}
                {project.download_url && (
                    <div className="text-center mt-6">
                        <a href={project.download_url} className="btn-primary inline-flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {t('Download', 'İndir')}
                        </a>
                    </div>
                )}

                {/* Microsoft Store badge */}
                {project.microsoft_store_url && (
                    <div className="text-center mt-6">
                        <a
                            href={project.microsoft_store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-ink-800 border border-ink-400 hover:border-ember hover:shadow-ember-sm transition-all duration-300"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                            </svg>
                            <span className="text-left leading-tight">
                                <span className="block text-[10px] uppercase tracking-[0.2em] text-ash/70">
                                    {t('Get it from', 'Şuradan edinin')}
                                </span>
                                <span className="block font-heading text-base tracking-wide text-parchment">
                                    Microsoft Store
                                </span>
                            </span>
                        </a>
                    </div>
                )}

                {/* Steam widget */}
                {project.steam_widget_url && (
                    <div className="mt-10">
                        <p className="text-center font-heading tracking-[0.2em] text-ash mb-4">
                            {t('AVAILABLE ON', 'ŞURADA MEVCUT')}
                        </p>
                        <div className="max-w-3xl mx-auto">
                            <iframe
                                src={project.steam_widget_url}
                                frameBorder="0"
                                width="100%"
                                height="190"
                                title="Steam"
                                className="rounded-sm"
                            />
                        </div>
                    </div>
                )}
            </article>

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
