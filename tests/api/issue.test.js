const request = require('supertest');
const app = require('../../app');

describe('Issue', () => {
    describe('GET /api/issues', () => {
        it('should return all issues', async () => {
            const res = await request(app).get('/api/issues');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/issues?issueID=:id', () => {
        it('should return an issue', async () => {
            const res = await request(app).get('/api/issues?issueID=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.id).toEqual(1);
        });
    });

    describe('GET /api/issues?userID=:id', () => {
        it('should return an issue', async () => {
            const res = await request(app).get('/api/issues?userID=5c4eaa1a-f6f0-11ed-b67e-0242ac120002');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/issues?technicianID=:id', () => {
        it('should return an issue', async () => {
            const res = await request(app).get('/api/issues?technicianID=11350cb5-3e81-4396-aeca-8b3ef6d31a7a');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/issues', () => {
        it('should create an issue', async () => {
            const res = await request(app).post('/api/issues').send({
                userID: '5c4eaa1a-f6f0-11ed-b67e-0242ac120002',
                title: 'Test',
                description: 'Test',
                location: 'Test',
                type: 0,
                criticity: 3,
                anonymous: false,
            });
            expect(res.statusCode).toEqual(201);
        });

        it('should return an error', async () => {
            const res = await request(app).post('/api/issues').send({
                userID: '',
                title: '',
                description: '',
                location: '',
                type: '',
            });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/issues/:issue_id/handle', () => {
        it('should handle an issue', async () => {
            const res = await request(app).post('/api/issues/1/handle').send({
                technicianID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
            });
            expect(res.statusCode).toEqual(204);
        });

        it('should return an error technicianID empty', async () => {
            const res = await request(app).post('/api/issues/1/handle').send({
                technicianID: '',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error issue does not exist', async () => {
            const res = await request(app).post('/api/issues/10000/handle').send({
                technicianID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
            });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/issues/:issue_id/close', () => {
        it('should close an issue', async () => {
            const res = await request(app).post('/api/issues/1/close');
            expect(res.statusCode).toEqual(204);
        });

        it('should return an error issue does not exist', async () => {
            const res = await request(app).post('/api/issues/10000/close');
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('GET /api/issues/:issue_id/messages', () => {
        it('should return messages', async () => {
            const res = await request(app).get('/api/issues/1/messages');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return an error issue does not exist', async () => {
            const res = await request(app).get('/api/issues/10000/messages');
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/issues/:issue_id/messages', () => {
        it('should create a message', async () => {
            const res = await request(app).post('/api/issues/2/messages').send({
                authorID: '5c4eaa1a-f6f0-11ed-b67e-0242ac120002',
                content: 'Test',
            });
            expect(res.statusCode).toEqual(201);
        });

        it('should return an error issue does not exist', async () => {
            const res = await request(app).post('/api/issues/10000/messages').send({
                authorID: '5c4eaa1a-f6f0-11ed-b67e-0242ac120002',
                content: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error if user is not the owner', async () => {
            const res = await request(app).post('/api/issues/1/messages').send({
                authorID: '5c4eaa1a-f6f0-11ed-b67e-0242ac120002',
                content: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error if user is not the technician associate to the issue', async () => {
            const res = await request(app).post('/api/issues/1/messages').send({
                authorID: '5c4eaa1a-f6f0-11ed-b67e-0242ac120002',
                content: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error empty body', async () => {
            const res = await request(app).post('/api/issues/1/messages').send({
                authorID: '',
                content: '',
            });
            expect(res.statusCode).toEqual(400);
        });
    });
});