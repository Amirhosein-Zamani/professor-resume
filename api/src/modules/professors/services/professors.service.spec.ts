import { describe, expect, it, jest } from '@jest/globals';
import { ProfessorsService } from './professors.service';

function createService() {
  const professorStore = {
    findMany: jest.fn<() => Promise<never[]>>().mockResolvedValue([]),
  };

  return {
    service: new ProfessorsService(
      { professor: professorStore } as never,
      {} as never,
      {} as never,
    ),
    professorStore,
  };
}

describe('ProfessorsService list visibility', () => {
  it('excludes unassigned faculties from the public list', async () => {
    const { service, professorStore } = createService();

    await service.listProfessors();

    expect(professorStore.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              facultyRecord: {
                is: {
                  name: {
                    notIn: ['تخصیص‌نیافته', 'تخصیص نیافته'],
                  },
                },
              },
            },
          ],
        },
      }),
    );
  });

  it('includes unassigned faculties in the dashboard list', async () => {
    const { service, professorStore } = createService();

    await service.listDashboardProfessors();

    expect(professorStore.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined }),
    );
  });
});
