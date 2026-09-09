/**
 * Express 5 Compatible NoSQL Injection Sanitization Middleware
 *
 * In Express 5, `req.query` is implemented via a read-only getter on the Request prototype.
 * Standard third-party mongo-sanitize packages attempt to reassign `req.query = sanitize(...)`,
 * resulting in `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`.
 *
 * This middleware mutates the objects recursively in-place, stripping any key starting with '$'
 * (prohibiting operator injection like $gt, $ne, $where, $regex) or containing '.' (prohibiting
 * nested path injection).
 */

const sanitize = (target) => {
  if (!target || typeof target !== "object") return target;

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (typeof target[i] === "object" && target[i] !== null) {
        sanitize(target[i]);
      }
    }
    return target;
  }

  for (const key of Object.keys(target)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete target[key];
    } else if (typeof target[key] === "object" && target[key] !== null) {
      sanitize(target[key]);
    }
  }

  return target;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
};

module.exports = mongoSanitize;
