import { useResource } from '../../../hooks/useResource';
import { useLanguage } from '../../../i18n/useLanguage';
import { contactInfoService } from '../../../services';
import { SectionShell } from '../../ui/SectionShell';
import { PANEL } from '../../ui/styles';
import { ContactForm } from './ContactForm';

function ContactMap({ url })
{
  return (
    <div className="mt-10 max-w-3xl mx-auto rounded-xs overflow-hidden border border-ink-400 shadow-glow-ember-sm">
      <iframe src={url} className="block w-full h-[380px] border-0 invert-[0.92] hue-rotate-180" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
    </div>
  );
}

/** The CMS's closing words, the studio on the map and its public e-mail address. */
function ContactDetails({ info })
{
  const { pick } = useLanguage();
  return (
    <>
      <p className="text-center max-w-2xl mx-auto text-parchment/80 italic mt-10 font-accent text-xl">{pick(info.outro)}</p>{info.mapEmbedUrl && <ContactMap url={info.mapEmbedUrl} />}
      {info.email && <div className="text-center mt-6"><a href={`mailto:${info.email}`} className="text-phoenix hover:text-phoenix-light font-heading tracking-widest">{info.email}</a></div>}
    </>
  );
}

export function ContactSection()
{
  const info = useResource(contactInfoService, null), { t, pick } = useLanguage();
  return (
    <SectionShell id="contact" title={t('Contact', 'İletişim')}><div className={`${PANEL} p-6 sm:p-10`}>
      <h3 className="font-deco text-3xl text-parchment text-center mb-6">{t('Contact Us', 'Bize Ulaşın')}</h3>{info && <p className="text-center max-w-2xl mx-auto text-parchment/85 leading-relaxed mb-10 italic">{pick(info.intro)}</p>}
      <ContactForm />{info && <ContactDetails info={info} />}
    </div></SectionShell>
  );
}
