import { AdminModule } from './AdminModule.js';
import { LegacyModule } from './LegacyModule.js';
import { PublicModule } from './PublicModule.js';
import { AuthenticateTokenUseCase } from './application/use-cases/auth/AuthenticateTokenUseCase.js';
import { EnsureAdminUseCase } from './application/use-cases/auth/EnsureAdminUseCase.js';
import { LoginUseCase } from './application/use-cases/auth/LoginUseCase.js';
import { CheckHealthUseCase } from './application/use-cases/health/CheckHealthUseCase.js';
import { MySqlDatabase } from './infrastructure/database/MySqlDatabase.js';
import { JimpThumbnailGenerator } from './infrastructure/images/JimpThumbnailGenerator.js';
import { LogMailer } from './infrastructure/mail/LogMailer.js';
import { SmtpMailer } from './infrastructure/mail/SmtpMailer.js';
import { ABOUT_IMAGES, PROJECT_IMAGES } from './infrastructure/repositories/galleryTables.js';
import { MySqlAboutRepository } from './infrastructure/repositories/MySqlAboutRepository.js';
import { MySqlAdminUserRepository } from './infrastructure/repositories/MySqlAdminUserRepository.js';
import { MySqlClientWorkRepository } from './infrastructure/repositories/MySqlClientWorkRepository.js';
import { MySqlContactInfoRepository } from './infrastructure/repositories/MySqlContactInfoRepository.js';
import { MySqlContactMessageRepository } from './infrastructure/repositories/MySqlContactMessageRepository.js';
import { MySqlGalleryRepository } from './infrastructure/repositories/MySqlGalleryRepository.js';
import { MySqlGameFeedbackRepository } from './infrastructure/repositories/MySqlGameFeedbackRepository.js';
import { MySqlHighScoreRepository } from './infrastructure/repositories/MySqlHighScoreRepository.js';
import { MySqlProjectRepository } from './infrastructure/repositories/MySqlProjectRepository.js';
import { MySqlSocialLinkRepository } from './infrastructure/repositories/MySqlSocialLinkRepository.js';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher.js';
import { JwtTokenService } from './infrastructure/security/JwtTokenService.js';
import { LocalFileStorage } from './infrastructure/storage/LocalFileStorage.js';
import { ThumbnailingFileStorage } from './infrastructure/storage/ThumbnailingFileStorage.js';
import { AuthCookie } from './presentation/http/AuthCookie.js';
import { HttpServer } from './presentation/http/HttpServer.js';
import { AuthController } from './presentation/http/controllers/AuthController.js';
import { HealthController } from './presentation/http/controllers/HealthController.js';
import { AuthMiddleware } from './presentation/http/middleware/AuthMiddleware.js';
import { ErrorMiddleware } from './presentation/http/middleware/ErrorMiddleware.js';
import { AuthRoutes } from './presentation/http/routes/AuthRoutes.js';
import { Endpoint } from './presentation/http/routes/Endpoint.js';
import { EndpointRoutes } from './presentation/http/routes/EndpointRoutes.js';
import { FrontendRoutes } from './presentation/http/routes/FrontendRoutes.js';

/** Composition root: the only place that knows which concrete class implements each port. */
export class Container
{
  #config;

  constructor(config)
  {
    this.#config = config;
    this.database = new MySqlDatabase(config.db);
    Object.assign(this, this.#contentRepositories(), this.#submissionRepositories(), this.#services());
  }

  get config()
  {
    return this.#config;
  }

  createHttpServer()
  {
    const authCookie = new AuthCookie(this.#config);
    const authMiddleware = new AuthMiddleware(new AuthenticateTokenUseCase(this.tokenService, this.adminUsers), authCookie);
    const modules = [this.#healthRoutes(), this.#authRoutes(authCookie, authMiddleware), new PublicModule(this).routes(), new AdminModule(this).routes(authMiddleware), ...new LegacyModule(this).routes()];
    const siteRoutes = this.#config.frontendDir ? [new FrontendRoutes(this.#config.frontendDir)] : [];
    return new HttpServer(this.#config, modules, new ErrorMiddleware(this.#config), siteRoutes);
  }

  ensureAdminUseCase()
  {
    return new EnsureAdminUseCase(this.adminUsers, this.passwordHasher);
  }

  dispose()
  {
    return this.database.close();
  }

  #contentRepositories()
  {
    const db = this.database;
    return {
      adminUsers: new MySqlAdminUserRepository(db), about: new MySqlAboutRepository(db), aboutImages: new MySqlGalleryRepository(db, ABOUT_IMAGES),
      projects: new MySqlProjectRepository(db), projectImages: new MySqlGalleryRepository(db, PROJECT_IMAGES), clientWorks: new MySqlClientWorkRepository(db),
      contactInfo: new MySqlContactInfoRepository(db), socialLinks: new MySqlSocialLinkRepository(db),
    };
  }

  #submissionRepositories()
  {
    const db = this.database;
    return { contactMessages: new MySqlContactMessageRepository(db), gameFeedbacks: new MySqlGameFeedbackRepository(db), highScores: new MySqlHighScoreRepository(db) };
  }

  #services()
  {
    const fileStorage = new ThumbnailingFileStorage(new LocalFileStorage(this.#config.uploadsDir), new JimpThumbnailGenerator(this.#config.uploads.thumbnail));
    return { passwordHasher: new BcryptPasswordHasher(), tokenService: new JwtTokenService(this.#config.jwt), fileStorage, mailer: this.#mailer() };
  }

  /** Factory method: real SMTP when configured, otherwise the logging null object. */
  #mailer()
  {
    const { mail } = this.#config;
    return mail.smtp ? new SmtpMailer(mail) : new LogMailer();
  }

  #healthRoutes()
  {
    const controller = new HealthController(new CheckHealthUseCase(this.database));
    return new EndpointRoutes('/health', [Endpoint.of('get', '/', controller.check)]);
  }

  #authRoutes(authCookie, authMiddleware)
  {
    const login = new LoginUseCase(this.adminUsers, this.passwordHasher, this.tokenService);
    return new AuthRoutes(new AuthController(login, authCookie), authMiddleware);
  }
}
