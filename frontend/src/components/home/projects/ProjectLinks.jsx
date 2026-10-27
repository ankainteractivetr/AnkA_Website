import { useLanguage } from '../../../i18n/useLanguage';
import { Icon } from '../../ui/Icon';
import { buttonClass } from '../../ui/styles';
import { MicrosoftStoreBadge, SourceForgeBadge, SteamWidget } from './StoreBadges';

const EXTERNAL = Object.freeze({ target: '_blank', rel: 'noopener noreferrer' });

function TrailerLink({ url })
{
  const { t } = useLanguage();
  return <div className="text-center mt-6"><a href={url} {...EXTERNAL} className={buttonClass('ghost')}><Icon name="play" size={18} />{t('Watch Trailer', 'Fragmanı İzle')}</a></div>;
}

function DownloadLink({ url })
{
  const { t } = useLanguage();
  return <div className="text-center mt-6"><a href={url} className={buttonClass('primary')}><Icon name="download" size={18} strokeWidth={2.5} />{t('Download', 'İndir')}</a></div>;
}

/** A project's calls to action, each shown only when its link is set in the CMS. */
export function ProjectLinks({ links, title })
{
  const { trailer, download, microsoftStore, sourceforgeName, sourceforgeGroupId, steamWidget } = links;
  return (
    <>
      {trailer && <TrailerLink url={trailer} />}{download && <DownloadLink url={download} />}{microsoftStore && <MicrosoftStoreBadge url={microsoftStore} />}
      {sourceforgeName && sourceforgeGroupId && <SourceForgeBadge name={sourceforgeName} groupId={sourceforgeGroupId} title={title} />}{steamWidget && <SteamWidget url={steamWidget} />}
    </>
  );
}
