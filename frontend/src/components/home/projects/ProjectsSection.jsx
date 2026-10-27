import { useMemo } from 'react';
import { useResource } from '../../../hooks/useResource';
import { useLanguage } from '../../../i18n/useLanguage';
import { projectsService } from '../../../services';
import { SectionShell } from '../../ui/SectionShell';
import { ProjectCard } from './ProjectCard';

const NO_PROJECTS = Object.freeze([]);

/** The published projects of one `type` ('game' | 'software'); hidden, with its separator, when there are none. */
export function ProjectsSection({ type, sectionId, title })
{
  const projects = useResource(projectsService, NO_PROJECTS), { pick } = useLanguage();
  const ofType = useMemo(() => projects.filter((project) => project.type === type), [projects, type]);
  if (ofType.length === 0) return null;
  return <SectionShell id={sectionId} title={pick(title)} wide>{ofType.map((project) => <ProjectCard key={project.id} project={project} />)}</SectionShell>;
}
