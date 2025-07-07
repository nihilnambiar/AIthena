const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';
const COOKIE_NAME = 'dreamdive_session';
const COOKIE_OPTIONS = 'HttpOnly; Path=/; SameSite=Lax; Secure';

function signSession(user) {
  return jwt.sign({
    uid: user.uid,
    email: user.email,
    name: user.name,
    photo: user.photo || '',
    premium: !!user.premium
  }, JWT_SECRET, { expiresIn: '7d' });
}

function verifySession(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Max-Age=604800; ${COOKIE_OPTIONS}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; ${COOKIE_OPTIONS}`);
}

function getSessionFromRequest(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

module.exports = {
  signSession,
  verifySession,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromRequest
}; 