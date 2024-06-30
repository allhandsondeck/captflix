import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardView from '@/views/DashboardView.vue';
import { fetchMovies, searchMovies } from '@/services/dataService';
import { debounce } from '@/utils/helpers';

// Mock the external modules
vi.mock('@/services/dataService', () => ({
  fetchMovies: vi.fn(),
  searchMovies: vi.fn()
}));

vi.mock('@/utils/helpers', () => ({
  debounce: vi.fn((fn) => fn),
  getGroupedAndSortedMovies: vi.fn((fn) => fn)
}));

describe('DashboardView', () => {
  beforeEach(() => {
    // Arrange: Reset mocks before each test
    fetchMovies.mockClear();
    searchMovies.mockClear();
    debounce.mockClear();
  });

  it('renders without errors', async () => {
    // Arrange
    fetchMovies.mockResolvedValueOnce([]);

    // Act
    const wrapper = mount(DashboardView);
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches movies on mount', async () => {
    // Arrange
    fetchMovies.mockResolvedValueOnce([]);

    // Act
    mount(DashboardView);

    // Assert
    expect(fetchMovies).toHaveBeenCalled();
  });

  it('searches movies based on input', async () => {
    // Arrange
    const searchTerm = 'Inception';
    searchMovies.mockResolvedValueOnce([]);

    // Act
    const wrapper = mount(DashboardView);
    await wrapper.find('input').setValue(searchTerm);
    await wrapper.vm.$nextTick();

    // Assert
    expect(searchMovies).toHaveBeenCalledWith(searchTerm);
  });
});
