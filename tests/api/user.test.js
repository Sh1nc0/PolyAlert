const request = require('supertest');
const app = require('../../app');

describe('User', () => {
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return a user', async () => {
            const res = await request(app).get('/api/users/11350cb5-3e81-4396-aeca-8b3ef6d31a7a');
            expect(res.statusCode).toEqual(200);
            expect(res.body.id).toEqual('11350cb5-3e81-4396-aeca-8b3ef6d31a7a');
        });
    });

    describe('PATCH /api/users/:id', () => {
        it('should update a user', async () => {
            const res = await request(app).patch('/api/users/11350cb5-3e81-4396-aeca-8b3ef6d31a7a').send({
                firstname: 'Technicien',
                lastname: 'Test',
            });
            expect(res.statusCode).toEqual(204);
        });
    });

    describe('PATCH /api/users/:id', () => {
        it('should return an error', async () => {
            const res = await request(app).patch('/api/users/11350cb5-3e81-4396-aeca-8b3ef6d31a7a').send({
                firstname: '',
                lastname: '',
            });
            expect(res.statusCode).toEqual(400);
        });
    });
});