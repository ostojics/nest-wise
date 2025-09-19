import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from '../src/app.module';

describe('API Endpoints Structure (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should have the new household-scoped user endpoints', async () => {
    const server = app.getHttpServer();

    // Test that routes are registered (this verifies the structure, not functionality)
    const routes = app
      .getHttpAdapter()
      .getInstance()
      ._router.stack.filter((layer: any) => layer.route)
      .map((layer: any) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    const householdUserRoutes = routes.filter(
      (route: any) => route.path.includes('/v1/households') && route.path.includes('/users'),
    );

    const householdInviteRoutes = routes.filter(
      (route: any) => route.path.includes('/v1/households') && route.path.includes('/invites'),
    );

    const globalInviteRoutes = routes.filter((route: any) => route.path.includes('/v1/invites/accept'));

    // Verify new endpoints exist
    expect(householdUserRoutes.length).toBeGreaterThan(0);
    expect(householdInviteRoutes.length).toBeGreaterThan(0);
    expect(globalInviteRoutes.length).toBeGreaterThan(0);
  });
});
