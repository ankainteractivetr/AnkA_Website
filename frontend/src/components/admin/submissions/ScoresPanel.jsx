import { DateText } from '../../../domain/DateText';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { EmptyState, Loading } from '../ui/Notice';
import { chipClass } from '../ui/styles';

const HEAD = 'p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70';

function ScoreRow({ score, rank, onRemove })
{
  const { t, lang } = useLanguage();
  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/5">
      <td className="p-3 text-ash/60 font-mono text-sm">{rank}</td><td className="p-3 text-parchment font-medium">{score.playerName}</td><td className="p-3 text-ash/70 text-sm">#{score.gameId}</td><td className="p-3 text-right text-phoenix font-display tracking-wider text-lg">{score.score.toLocaleString()}</td>
      <td className="p-3 text-ash/50 text-xs">{DateText.date(score.updatedAt ?? score.createdAt, lang)}</td><td className="p-3 text-right"><button type="button" onClick={onRemove} className={chipClass('danger')} aria-label={t('Delete', 'Sil')}>✕</button></td>
    </tr>
  );
}

function ScoreTable({ scores, onRemove })
{
  const { t } = useLanguage();
  return (
    <div className={`${PANEL} overflow-x-auto`}><table className="w-full"><thead className="bg-white/5 border-b border-white/10"><tr><th className={`${HEAD} text-left`}>#</th><th className={`${HEAD} text-left`}>{t('Player', 'Oyuncu')}</th><th className={`${HEAD} text-left`}>{t('Game', 'Oyun')}</th><th className={`${HEAD} text-right`}>{t('Score', 'Skor')}</th><th className={`${HEAD} text-left`}>{t('Date', 'Tarih')}</th><th className={HEAD} /></tr></thead>
      <tbody>{scores.map((score, index) => <ScoreRow key={score.id} score={score} rank={index + 1} onRemove={() => onRemove(score)} />)}</tbody></table></div>
  );
}

/** Every game's high scores, grouped by game, best first. */
export function ScoresPanel({ list, actions })
{
  const { t } = useLanguage();
  if (list.items === null) return <Loading />;
  if (list.items.length === 0) return <EmptyState>{t('No high scores yet.', 'Henüz yüksek skor yok.')}</EmptyState>;
  return <ScoreTable scores={list.items} onRemove={(score) => window.confirm(t('Delete this score?', 'Bu skor silinsin mi?')) && actions.remove(score)} />;
}
