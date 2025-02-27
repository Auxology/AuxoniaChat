import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
	// Rate limiter configuration
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const signUpLimiter = rateLimit({
	// Rate limiter configuration
	windowMs: 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})