const request = require('supertest');
const app = require('../../app');

describe('Report', () => {
    describe('GET /api/reports', () => {
        it('should return all reports', async () => {
            const res = await request(app).get('/api/reports');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/reports?reporterID=:id', () => {
        it('should return all reports of a reporter', async () => {
            const res = await request(app).get('/api/reports?reporterID=38f7054e-f6f0-11ed-b67e-0242ac120002');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/reports?issueID=:id', () => {
        it('should return all reports on a issue', async () => {
            const res = await request(app).get('/api/reports?issueID=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/reports?reportedID=:id', () => {
        it('should return all reports about a user', async () => {
            const res = await request(app).get('/api/reports?reportedID=11350cb5-3e81-4396-aeca-8b3ef6d31a7a');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/reports', () => {
        it('should create a report', async () => {
            const res = await request(app).post('/api/reports').send({
                reportedID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                issueID: 1,
                reporterID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
                reason: 'Test',
            });
            expect(res.statusCode).toEqual(201);
        });

        it('should return an error', async () => {
            const res = await request(app).post('/api/reports').send({
                reporterID: '',
                issueID: '',
                reportedID: '',
                reason: '',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error issue doesn\'t exist ', async () => {
            const res = await request(app).post('/api/reports').send({
                reportedID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                issueID: 0,
                reporterID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
                reason: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error if reporter user doesn\'t exist ', async () => {
            const res = await request(app).post('/api/reports').send({
                reporterID: '11350cb5',
                issueID: 1,
                reportedID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                reason: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });

        it('should return an error if reported user is not the issue owner ', async () => {
            const res = await request(app).post('/api/reports').send({
                reporterID: '38f7054e-f6f0-11ed-b67e-0242ac120002',
                issueID: 1,
                reportedID: '11350cb5-3e81-4396-aeca-8b3ef6d31a7a',
                reason: 'Test',
            });
            expect(res.statusCode).toEqual(400);
        });
    });

});