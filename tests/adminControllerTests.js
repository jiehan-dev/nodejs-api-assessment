require('should');
const sinon = require('sinon');
const adminController = require('../controllers/adminController');

describe('Admin Controller Tests:', () => {
  describe('Register', () => {
    it('should return status 204 is success', async () => {
      const models = {
        Teacher: {
          findOrCreate({ where }) {
            return new Promise((resolve) => {
              resolve([
                {
                  email: where.email,
                  addStudents() {}
                }
              ]);
            });
          }
        },
        Student: {
          findOrCreate({ where }) {
            return new Promise((resolve) => {
              resolve([
                {
                  email: where.email
                }
              ]);
            });
          }
        }
      };

      const req = {
        body: {
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com', 'studenthon@gmail.com']
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        end: sinon.spy()
      };

      const controller = adminController(models);

      await controller.register(req, res);

      res.status
        .calledOnceWithExactly(204)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.end.calledOnce.should.equal(true);
    });

    it('should return status 500 with message if error', async () => {
      const models = {
        Teacher: {
          findOrCreate() {
            return new Promise(() => {
              throw new Error('Failed to connect with database');
            });
          }
        }
      };

      const req = {
        body: {
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com', 'studenthon@gmail.com']
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.register(req, res);

      const expectedError = {
        message: 'Failed to connect with database'
      };

      res.status
        .calledOnceWithExactly(500)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.json
        .calledOnceWithExactly(expectedError)
        .should.equal(true, `Invalid Error ${JSON.stringify(res.json.args[0][0])}`);
    });
  });

  describe('Common Students', () => {
    const models = {
      Teacher: {
        findOne({ where }) {
          return new Promise((resolve) => {
            switch (where.email) {
              case 'teacherken@gmail.com':
                return resolve({
                  email: 'teacherken@gmail.com',
                  students: [
                    { email: 'commonstudent1@gmail.com' },
                    { email: 'commonstudent2@gmail.com' },
                    { email: 'student_only_under_teacher_ken@gmail.com' }
                  ]
                });

              case 'teacherjoe@gmail.com':
                return resolve({
                  email: 'teacherjoe@gmail.com',
                  students: [
                    { email: 'commonstudent1@gmail.com' },
                    { email: 'commonstudent2@gmail.com' }
                  ]
                });

              default:
                return resolve(null);
            }
          });
        }
      }
    };

    it('should return students registered to teacherken@gmail.com if success', async () => {
      const req = {
        query: { teacher: ['teacherken@gmail.com'] }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.commonStudents(req, res);

      const expectedResult = {
        students: [
          'commonstudent1@gmail.com',
          'commonstudent2@gmail.com',
          'student_only_under_teacher_ken@gmail.com'
        ]
      };
      res.status
        .calledOnceWithExactly(200)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return students registered to teacherken@gmail.com and teacherjoe@gmail.com if success', async () => {
      const req = {
        query: { teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'] }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.commonStudents(req, res);

      const expectedResult = {
        students: ['commonstudent1@gmail.com', 'commonstudent2@gmail.com']
      };

      res.status
        .calledOnceWithExactly(200)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return status 404 with message if teacher not found', async () => {
      const req = {
        query: {
          teacher: ['jiehan092@gmail.com']
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.commonStudents(req, res);

      const expectedResult = { message: "Specified teacher 'jiehan092@gmail.com' not found" };

      res.status
        .calledOnceWithExactly(404)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return status 500 with message if error', async () => {
      const errorModels = {
        Teacher: {
          findOne() {
            return new Promise(() => {
              throw new Error('Failed to connect with database');
            });
          }
        }
      };

      const req = {
        query: { teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'] }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(errorModels);

      await controller.commonStudents(req, res);

      const expectedError = {
        message: 'Failed to connect with database'
      };

      res.status
        .calledOnceWithExactly(500)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.json
        .calledOnceWithExactly(expectedError)
        .should.equal(true, `Invalid Error ${JSON.stringify(res.json.args[0][0])}`);
    });
  });

  describe('Suspend', () => {
    it('should return status 204 if success', async () => {
      const models = {
        Student: {
          findOne({ where }) {
            return new Promise((resolve) => {
              resolve({
                email: where.email,
                suspend: false,
                update() {
                  return new Promise((res) => res());
                }
              });
            });
          }
        }
      };

      const req = {
        body: {
          student: 'studentmary@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        end: sinon.spy()
      };

      const controller = adminController(models);

      await controller.suspend(req, res);

      res.status
        .calledOnceWithExactly(204)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.end.calledOnce.should.equal(true);
    });

    it('should return status 404 with message if student not found', async () => {
      const models = {
        Student: {
          findOne() {
            return new Promise((resolve) => {
              resolve(null);
            });
          }
        }
      };

      const req = {
        body: {
          student: 'studentmary@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        end: sinon.spy()
      };

      const controller = adminController(models);

      await controller.suspend(req, res);

      const expectedResult = { message: "Specified student 'studentmary@gmail.com' not found" };

      res.status
        .calledOnceWithExactly(404)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return status 500 with message if error', async () => {
      const models = {
        Student: {
          findOne() {
            return new Promise(() => {
              throw new Error('Failed to connect with database');
            });
          }
        }
      };

      const req = {
        body: {
          student: 'studentmary@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
        end: sinon.spy()
      };

      const controller = adminController(models);

      await controller.suspend(req, res);

      const expectedResult = { message: 'Failed to connect with database' };

      res.status
        .calledOnceWithExactly(500)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });
  });

  describe('RetrieveForNotifications', () => {
    const models = {
      Teacher: {
        findOrCreate({ where }) {
          return new Promise((resolve) => {
            switch (where.email) {
              case 'teacherken@gmail.com':
                return resolve([
                  {
                    email: 'teacherken@gmail.com',
                    students: [
                      { email: 'studentbob@gmail.com', suspend: false },
                      { email: 'studentjane@gmail.com', suspend: true }
                    ]
                  }
                ]);

              default:
                return resolve([
                  {
                    email: where.email,
                    students: undefined
                  }
                ]);
            }
          });
        }
      },
      Student: {
        findOrCreate({ where }) {
          return new Promise((resolve) => {
            switch (where.email) {
              case 'studentjane@gmail.com':
                return resolve([{ email: 'studentjane@gmail.com', suspend: true }]);

              default:
                return resolve([{ email: where.email, suspend: false }]);
            }
          });
        }
      }
    };

    it('should return students who can receive notification without being @mentioned', async () => {
      const req = {
        body: {
          teacher: 'teacherken@gmail.com',
          notification: 'Hey everybody'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.retrieveForNotifications(req, res);

      const expectedResult = {
        recipients: ['studentbob@gmail.com']
      };

      res.status
        .calledOnceWithExactly(200)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return students who can receive notification without being registered', async () => {
      const req = {
        body: {
          teacher: 'teachernew@gmail.com',
          notification: 'Hey everybody @studentagnes@gmail.com @studentmiche@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.retrieveForNotifications(req, res);

      const expectedResult = {
        recipients: ['studentagnes@gmail.com', 'studentmiche@gmail.com']
      };

      res.status
        .calledOnceWithExactly(200)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return students who can receive notification without repetitions', async () => {
      const req = {
        body: {
          teacher: 'teacherken@gmail.com',
          notification:
            'Hey everybody Hello students! @studentbob@gmail.com @studentagnes@gmail.com @studentmiche@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(models);

      await controller.retrieveForNotifications(req, res);

      const expectedResult = {
        recipients: ['studentbob@gmail.com', 'studentagnes@gmail.com', 'studentmiche@gmail.com']
      };

      res.status
        .calledOnceWithExactly(200)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });

    it('should return status 500 with message if error', async () => {
      const errorModels = {
        Teacher: {
          findOrCreate() {
            return new Promise(() => {
              throw new Error('Failed to connect with database');
            });
          }
        }
      };

      const req = {
        body: {
          teacher: 'teacherken@gmail.com',
          notification:
            'Hey everybody Hello students! @studentbob@gmail.com @studentagnes@gmail.com @studentmiche@gmail.com'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = adminController(errorModels);

      await controller.retrieveForNotifications(req, res);

      const expectedResult = { message: 'Failed to connect with database' };

      res.status
        .calledOnceWithExactly(500)
        .should.equal(true, `Bad Status ${res.status.args[0][0]}`);

      res.json
        .calledOnceWithExactly(expectedResult)
        .should.equal(true, `Unexpected Result ${JSON.stringify(res.json.args[0][0])}`);
    });
  });
});
