import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, saveToken } from './api';

describe('API client', () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('sends JSON requests with the saved bearer token and returns the response body', async () => {
    saveToken('test-token');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { listings: [] } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await api<{ success: boolean; data: { listings: unknown[] } }>('/listings');

    expect(result).toEqual({ success: true, data: { listings: [] } });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/listings$/);
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer test-token');
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
  });

  it('surfaces API validation messages and status codes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, message: 'Title is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await expect(api('/listings')).rejects.toMatchObject<ApiError>({
      name: 'ApiError',
      message: 'Title is required',
      status: 400,
    });
  });

  it('uses an HTTP status message when an error response is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('unavailable', { status: 503 })));

    await expect(api('/health')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Request failed (503)',
      status: 503,
    });
  });
});
