import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <header id="top" className="relative overflow-hidden">
            {/* Atmosphere layers */}
            <div className="absolute inset-0 bg-ember-glow opacity-90 pointer-events-none" />
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(1px 1px at 20px 30px, rgba(245,165,36,0.6), transparent),' +
                        'radial-gradient(1px 1px at 90px 80px, rgba(255,255,255,0.4), transparent),' +
                        'radial-gradient(1px 1px at 160px 40px, rgba(192,45,0,0.6), transparent),' +
                        'radial-gradient(1px 1px at 230px 120px, rgba(245,165,36,0.4), transparent),' +
                        'radial-gradient(1px 1px at 280px 60px, rgba(255,255,255,0.3), transparent)',
                    backgroundSize: '320px 160px',
                }}
            />

            {/* Diagonal ember streak */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(192,45,0,0.18) 0%, transparent 65%)' }} />
            <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(245,165,36,0.12) 0%, transparent 65%)' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
                <div className="grid lg:grid-cols-[auto_1fr] items-center gap-8 lg:gap-14">
                    {/* Logo */}
                    <div className="flex justify-center lg:justify-start animate-fade-up">
                        <div className="relative w-56 h-56 sm:w-72 sm:h-72">
                            <div className="absolute inset-0 -m-6 rounded-full animate-glow-pulse" />
                            <img
                                src="/AnkA-Interactive-Logo.png"
                                alt="AnkA Interactive"
                                className="relative w-full h-full object-contain drop-shadow-[0_0_45px_rgba(192,45,0,0.6)]"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center lg:text-left animate-fade-up" style={{ animationDelay: '120ms' }}>
                        <div className="font-heading text-ember text-sm sm:text-base tracking-[0.5em] mb-3">
                            EST. 2023 · ANKARA, TÜRKİYE
                        </div>
                        <h1 className="font-deco font-black text-5xl sm:text-7xl lg:text-8xl text-gradient-phoenix leading-[0.95] mb-4">
                            AnkA<br /><span className="font-display font-bold">Interactive</span>
                        </h1>
                        <p className="font-display text-xl sm:text-2xl lg:text-3xl text-parchment/85 tracking-wide max-w-2xl mx-auto lg:mx-0">
                            {t(
                                'A Video Game Development Company',
                                'Bir Video Oyun Geliştirme Şirketi'
                            )}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                            <a href="#games" className="btn-primary">
                                {t('Explore Games', 'Oyunları Keşfet')}
                            </a>
                            <a href="#about" className="btn-ghost">
                                {t('Our Story', 'Hikayemiz')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
