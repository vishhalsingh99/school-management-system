/**
 * Standard success response
 * @param {object} res - express response
 * @param {any} data - response data / message
 * @param {number} status - http status code (default 200)
 */
export function success(res, data = null, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

/**
 * Standard error response
 * @param {object} res - express response
 * @param {string} message - error message
 * @param {number} status - http status code (default 500)
 * @param {any} errors - optional detailed errors
 */
export function error(res, message = "Something went wrong", status = 500, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}
