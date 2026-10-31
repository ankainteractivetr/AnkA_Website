import { useResource } from '../../../hooks/useResource';
import { useLanguage } from '../../../i18n/useLanguage';
import { clientWorksService } from '../../../services';
import { SectionShell } from '../../ui/SectionShell';
import { ServiceCards } from './ServiceCards';
import { WorkShowcase } from './WorkShowcase';

const NO_WORKS = Object.freeze([]);

/** What AnkA offers businesses (cards, restaurants first), then the works done for clients, each shown live — when there are any. */
export function ServicesSection()
{
  const works = useResource(clientWorksService, NO_WORKS), { t } = useLanguage();
  return <SectionShell id="services" title={t('Services', 'Hizmetler')} wide><ServiceCards />{works.length > 0 && <div className="mt-12"><WorkShowcase works={works} /></div>}</SectionShell>;
}
