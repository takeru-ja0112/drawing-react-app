import { setStatusRoom, getInfoRoom, resetRoomSettings } from './action';

// supabaseのモック化（本番ではjest.mockやmswを推奨）
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('room actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setStatusRoom: 正常に更新できる', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'room1', status: 'WAITING' }, error: null });
    const result = await setStatusRoom('room1', 'FINISHED');
    expect(result.success).toBe(true);
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'FINISHED' });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'room1');
  });

  test('setStatusRoom: エラー時', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'error' } });
    const result = await setStatusRoom('room1', 'FINISHED');
    expect(result.success).toBe(false);
    expect(result.error).toBe('error');
  });

  test('getInfoRoom: 正常取得', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'room1', status: 'WAITING' }, error: null });
    const result = await getInfoRoom('room1');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'room1', status: 'WAITING' });
  });

  test('getInfoRoom: エラー時', async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'fetch error' } });
    const result = await getInfoRoom('room1');
    expect(result.success).toBe(false);
    expect(result.error).toBe('fetch error');
  });

  test('resetRoomSettings: 正常リセット', async () => {
    // getRandomThemeのモック
    jest.spyOn(require('./action'), 'getRandomTheme').mockResolvedValueOnce({ success: true, data: { id: 1, theme: 'test' } });
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'room1', status: 'WAITING' }, error: null });
    const result = await resetRoomSettings('room1');
    expect(result.success).toBe(true);
    expect(mockSupabase.update).toHaveBeenCalled();
  });
});
