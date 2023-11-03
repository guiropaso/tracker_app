import {RateLimiter} from 'limiter'

export const limiter = new RateLimiter({
    tokensPerInterval: 100,
    interval: 'min',
    fireImmediately: true
})