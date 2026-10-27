// Row mappings (strategies) for MySqlGalleryRepository: the about gallery has no owner, screenshots belong to a project.
export const ABOUT_IMAGES = Object.freeze({ name: 'about_images', ownerColumn: null });
export const PROJECT_IMAGES = Object.freeze({ name: 'project_images', ownerColumn: 'project_id' });
