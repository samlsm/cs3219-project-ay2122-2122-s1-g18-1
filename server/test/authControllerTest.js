process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const app = require('../index')
const expect = chai.expect

chai.use(chaiHttp)

describe('Auth', () => {
  before('Connect to MongoDB', function (done) {
    mongoose.connect(process.env.MONGO_URI_TEST)
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'Unable to connect to MongoDB'))
    db.once('open', function () {
      console.log('Connected to MongoDB')
      done()
    })
  })

  describe('Route POST /api/users/signup', () => {
    it('Should POST a new user', (done) => {
      const userToAdd = {
        username: 'shrekTechTest',
        password: 'shrekTech',
        email: 'peerPrep@gmail.com'
      }
      chai.request(app)
        .post('/api/users/signup')
        .send(userToAdd)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('A verification email has been sent to your account. ' +
            'Please verify your email before proceeding.')
          done()
        })
    })

    it('Should not POST user if there a missing fields', (done) => {
      const userToAdd = {
        username: '',
        password: 'shrekTech',
        email: 'peerPrep@gmail.com'
      }
      chai.request(app)
        .post('/api/users/signup')
        .send(userToAdd)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: All Fields are Compulsory!')
          done()
        })
    })

    it('Should not POST user if email format is invalid', (done) => {
      const userToAdd = {
        username: 'shrekTechTest',
        password: 'shrekTech',
        email: 'peerPrep'
      }
      chai.request(app)
        .post('/api/users/signup')
        .send(userToAdd)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: Invalid Email Format!')
          done()
        })
    })

    it('Should not POST a user if username already exists', (done) => {
      const userToAdd = {
        username: 'shrekTechTest',
        password: 'shrekTech',
        email: 'peerPrep1@gmail.com'
      }
      chai.request(app)
        .post('/api/users/signup')
        .send(userToAdd)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(409)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: Duplicate Username/Email!')
          done()
        })
    })

    it('Should not POST a user if email already exists', (done) => {
      const userToAdd = {
        username: 'shrekTechTest2',
        password: 'shrekTech',
        email: 'peerPrep@gmail.com'
      }
      chai.request(app)
        .post('/api/users/signup')
        .send(userToAdd)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(409)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: Duplicate Username/Email!')
          done()
        })
    })
  })

  describe('Route /api/users', () => {
    it('Should login if credentials are right', (done) => {
      const userToLogin = {
        username: 'shrekTech',
        password: 'shrekTech'
      }
      chai.request(app)
        .post('/api/users')
        .send(userToLogin)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication successful')
          done()
        })
    })

    it('Should not login if credentials are wrong', (done) => {
      const userToLogin = {
        username: 'shrekTech',
        password: 'shrekTech2'
      }
      chai.request(app)
        .post('/api/users')
        .send(userToLogin)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication Failed: Wrong Username or Password!')
          done()
        })
    })

    it('Should not login if not verified', (done) => {
      const userToLogin = {
        username: 'shrekTechTest',
        password: 'shrekTech'
      }
      chai.request(app)
        .post('/api/users')
        .send(userToLogin)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication Failed: Please verify account before continuing.')
          done()
        })
    })
  })

  describe('Route /api/users/reset', () => {
    it('Should generate reset email', (done) => {
      const userToUpdate = {
        email: 'peerPrep@gmail.com'
      }
      chai.request(app)
        .post('/api/users/reset')
        .send(userToUpdate)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('A reset email has been sent to your account.')
          done()
        })
    })

    it('Should not generate reset email if email format is invalid', (done) => {
      const userToUpdate = {
        email: 'peerPrep'
      }
      chai.request(app)
        .post('/api/users/reset')
        .send(userToUpdate)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: Invalid Email Format!')
          done()
        })
    })

    it('Should not generate reset email if email does not exists', (done) => {
      const userToUpdate = {
        email: 'peerPrep1@gmail.com'
      }
      chai.request(app)
        .post('/api/users/reset')
        .send(userToUpdate)
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Failure: User not found.')
          done()
        })
    })
  })

  describe('Route /api/users/', () => {
    it('Should PUT new password', (done) => {
      const userToUpdate = {
        username: 'shrekTechTest',
        oldPassword: 'shrekTech',
        newPassword: 'shrekTechNew'
      }
      chai.request(app)
        .put('/api/users')
        .send(userToUpdate)
        .auth(process.env.JWT_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Success: Password Updated')
          done()
        })
    })

    it('Should not PUT if credentials are wrong', (done) => {
      const userToUpdate = {
        username: 'shrekTechTest',
        oldPassword: 'shrekTech',
        newPassword: 'shrekTechNew'
      }
      chai.request(app)
        .put('/api/users')
        .send(userToUpdate)
        .auth(process.env.JWT_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Wrong password. Unable to reset password')
          done()
        })
    })

    it('Should not DELETE user if credentials are wrong', (done) => {
      const userToDelete = {
        username: 'shrekTechTest',
        password: 'shrekTech'
      }
      chai.request(app)
        .delete('/api/users')
        .send(userToDelete)
        .auth(process.env.JWT_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Wrong password. Unable to delete account')
          done()
        })
    })

    it('Should DELETE user', (done) => {
      const userToDelete = {
        username: 'shrekTechTest',
        password: 'shrekTechNew'
      }
      chai.request(app)
        .delete('/api/users')
        .send(userToDelete)
        .auth(process.env.JWT_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Success: Account Deleted')
          done()
        })
    })
  })

  describe('Route /users/verify/checkAuth', () => {
    it('Should authenticate user if session token is valid', (done) => {
      chai.request(app)
        .get('/api/users/verify/checkAuth')
        .send()
        .auth(process.env.JWT_BLACKLIST_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication Success')
          done()
        })
    })

    it('Should blacklist the token if user logs out', (done) => {
      chai.request(app)
        .post('/api/users/verify/checkAuth')
        .auth(process.env.JWT_BLACKLIST_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Success')
          done()
        })
    })

    it('Should not authenticate user if session token is blacklisted', (done) => {
      chai.request(app)
        .get('/api/users/verify/checkAuth')
        .auth(process.env.JWT_BLACKLIST_TEST, { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication Failed')
          done()
        })
    })

    it('Should not authenticate user if session token is invalid', (done) => {
      chai.request(app)
        .get('/api/users/verify/checkAuth')
        .auth('wrongsessiontoken', { type: 'bearer' })
        // eslint-disable-next-line node/handle-callback-err
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.be.a('object')
          expect(res.body.message).to.equal('Authentication Failed')
          done()
        })
    })
  })

  after('Disconnect from MongoDB', (done) => {
    const db = mongoose.connection
    db.close()
    db.once('close', () => {
      console.log('Disconnected from MongoDB')
      done()
    })
  })
})
