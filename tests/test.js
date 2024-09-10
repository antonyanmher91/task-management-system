const request = require('supertest');
const app = require('../app'); 

test('Create a new task', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: new Date(),
            priority: 'high',
            assignedMember: 'John Doe'
        });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Task');
});

test('Get a tasks', async () => {
    const response = await request(app)
        .get(`/tasks`);
    expect(response.status).toBe(200);
});

{
    "title": "Test Task",
    "description": "This is a test task",
    "dueDate": 435345345345,
    "priority": "high",
    "assignedMember": "John Doe"
}