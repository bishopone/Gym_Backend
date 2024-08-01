const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Make sure this points to your main express app file
const { expect } = chai;

chai.use(chaiHttp);

describe('Analytics API', () => {
  describe('GET /api/analytics/members-per-day', () => {
    it('should return the number of members per day', (done) => {
      chai.request(app)
        .get('/api/analytics/members-per-day')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(item => {
            expect(item).to.have.property('date');
            expect(item).to.have.property('count');
          });
          done();
        });
    });
  });

  describe('GET /api/analytics/total-members', () => {
    it('should return the total number of active members', (done) => {
      chai.request(app)
        .get('/api/analytics/total-members')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.have.property('totalMembers');
          done();
        });
    });
  });

  describe('GET /api/analytics/active-members', () => {
    it('should return the number of active members', (done) => {
      chai.request(app)
        .get('/api/analytics/active-members')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.have.property('activeMembers');
          done();
        });
    });
  });

  describe('GET /api/analytics/membership-expirations-per-day', () => {
    it('should return the number of membership expirations per day', (done) => {
      chai.request(app)
        .get('/api/analytics/membership-expirations-per-day')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(item => {
            expect(item).to.have.property('date');
            expect(item).to.have.property('count');
          });
          done();
        });
    });
  });

  describe('GET /api/analytics/membership-renewals-per-day', () => {
    it('should return the number of membership renewals per day', (done) => {
      chai.request(app)
        .get('/api/analytics/membership-renewals-per-day')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(item => {
            expect(item).to.have.property('date');
            expect(item).to.have.property('renewals');
          });
          done();
        });
    });
  });

  describe('GET /api/analytics/revenue-per-month', () => {
    it('should return the revenue per month', (done) => {
      chai.request(app)
        .get('/api/analytics/revenue-per-month')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.have.property('groupedPayments');
          expect(res.body.groupedPayments).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/analytics/popular-classes', () => {
    it('should return the popular classes', (done) => {
      chai.request(app)
        .get('/api/analytics/popular-classes')
        .end((err, res) => {
          expect(res). to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(item => {
            expect(item).to.have.property('subscriptionType');
            expect(item).to.have.property('numberOfSubscriptions');
            expect(item).to.have.property('totalAmountPaid');
          });
          done();
        });
    });
  });
});
