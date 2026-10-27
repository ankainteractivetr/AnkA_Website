import { useResource } from '../../../hooks/useResource';
import { useLanguage } from '../../../i18n/useLanguage';
import { clientWorksService } from '../../../services';
import { SectionShell } from '../../ui/SectionShell';
import { WorkShowcase } from './WorkShowcase';

const NO_WORKS = Object.freeze([]);

/** The works AnkA has done for clients, each shown live; hidden, with its separator, when there are none. */
export function ServicesSection()
{
  const works = useResource(clientWorksService, NO_WORKS), { t } = useLanguage();
  if (works.length === 0) return null;
  return <SectionShell id="services" title={t('Services', 'Hizmetler')} wide><WorkShowcase works={works} /></SectionShell>;
}
