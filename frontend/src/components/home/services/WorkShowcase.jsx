import { useSelection } from '../../../hooks/useSelection';
import { PANEL } from '../../ui/styles';
import { WorkFrame } from './WorkFrame';
import { WorkList } from './WorkList';

/** One panel in two columns: the works by name on the left, the chosen one live on the right. `works` is never empty. */
export function WorkShowcase({ works })
{
  const [selected, select] = useSelection(works);
  return (
    <div className={`${PANEL} overflow-hidden grid lg:grid-cols-[18rem_minmax(0,1fr)] divide-y lg:divide-y-0 lg:divide-x divide-ink-400/60 animate-fade-up`}>
      <WorkList works={works} selectedId={selected.id} onSelect={select} /><WorkFrame work={selected} />
    </div>
  );
}
