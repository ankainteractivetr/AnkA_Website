import { useEffect, useState } from 'react';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from './ProjectCard';
import Separator from './Separator';

export default function ProjectsSection({ type, sectionId, titleEn, titleTr }) {
    const { t } = useLanguage();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        client.get('/public/projects', { params: { type } }).then(({ data }) => {
            if (data.success) setProjects(data.data);
        }).catch(() => {});
    }, [type]);

    if (projects.length === 0) return null;

    return (
        <>
            <Separator />
            <section id={sectionId} className="relative scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
                    <div className="section-title-wrap">
                        <h2 className="section-title text-3xl sm:text-4xl text-gradient-phoenix">
                            {t(titleEn, titleTr)}
                        </h2>
                    </div>

                    {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
            </section>
        </>
    );
}
