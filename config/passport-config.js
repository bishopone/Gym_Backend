const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const RememberMeStrategy = require("passport-remember-me").Strategy;
const bcrypt = require("bcrypt");
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new LocalStrategy(
    { usernameField: "phoneNumber" },
    async (phoneNumber, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user) return done(null, false, { message: "Incorrect email." });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
          return done(null, false, { message: "Incorrect password." });
        const userRoles = await prisma.userRole.findMany({
          where: {
            userId: user.id,
          },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });
        const permissions = userRoles.map((role) =>
          role.role.permissions.map(
            (rolePermission) => rolePermission.permission.permissionName
          )
        );
        user.permissions = permissions[0] ?? [];
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        console.log(jwtPayload)
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.userId },
        });
        if (!user) return done(null, false);
        const userRoles = await prisma.userRole.findMany({
          where: {
            userId: user.id,
          },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });
        const permissions = userRoles.map((role) =>
          role.role.permissions.map(
            (rolePermission) => rolePermission.permission.permissionName
          )
        );
        user.permissions = permissions;
        user.fillters = {}
        if (user.gymId) {
          user.fillters = {gymId: user.gymId};
        }
        // console.log(user)
        return done(null, user);
      } catch (err) {
        console.log(err)
        return done(err);
      }
    }
  )
);

passport.use(
  new RememberMeStrategy(
    async (token, done) => {
      try {
        console.log("rememberMeToken");
        const tokenRecord = await prisma.rememberMeToken.findUnique({
          where: { token },
        });
        if (!tokenRecord) return done(null, false);

        const user = await prisma.user.findUnique({
          where: { id: tokenRecord.userId },
        });
        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
    async (user, done) => {
      try {
        const existingToken = await prisma.rememberMeToken.findUnique({
          where: { userId: user.id },
        });
        if (existingToken) {
          await prisma.rememberMeToken.delete({
            where: { id: existingToken.id },
          });
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );
        await prisma.rememberMeToken.create({
          data: {
            token,
            userId: user.id,
          },
        });

        done(null, token);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
