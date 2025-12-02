import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('cadown user worker', () => {
	describe('request for /', () => {
		it('/ responds with crt (unit style)', async () => {
			const request = new Request<unknown, IncomingRequestCfProperties>('http://example.com/');
			// Create an empty context to pass to `worker.fetch()`.
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
			await waitOnExecutionContext(ctx);
			expect(response.headers.get('Content-Type')).toBe('application/x-x509-ca-cert');
			expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="rootCA.crt"');
			expect(await response.text()).toBe(env.CRT);
		});

		it('responds with crt (integration style)', async () => {
			const request = new Request('http://example.com/');
			const response = await SELF.fetch(request);
			expect(response.headers.get('Content-Type')).toBe('application/x-x509-ca-cert');
			expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="rootCA.crt"');
			expect(await response.text()).toBe(env.CRT);
		});
	});

});
