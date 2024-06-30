import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { mount, flushPromises } from '@vue/test-utils';
import MovieDetailsView from '@/views/MovieDetailsView.vue';
import { fetchMovieDetails } from '@/services/dataService';

vi.mock('@/services/dataService', () => ({
  fetchMovieDetails: vi.fn()
}));

describe('MovieDetailsView.vue', () => {
  let router;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          component: { template: '' }
        }
      ]
    });

    router.push = vi.fn();
  });

  it('fetches movie details and displays them', async () => {
    // Arrange
    const movieDetailsMock = {
      name: 'Inception',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      averageRuntime: 148,
      rating: { average: 8.8 },
      summary:
        '<p>A thief who steals corporate secrets through the use of dream-sharing technology.</p>'
    };
    fetchMovieDetails.mockResolvedValue(movieDetailsMock);

    // Act
    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router],
        mocks: {}
      }
    });
    await flushPromises();

    // Assert
    expect(fetchMovieDetails).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Inception');
    expect(wrapper.text()).toContain('Action');
    expect(wrapper.text()).toContain('Adventure');
    expect(wrapper.text()).toContain('Sci-Fi');
    expect(wrapper.text()).toContain('148 minutes');
    expect(wrapper.text()).toContain('8.8');
    expect(wrapper.html()).toContain(
      'A thief who steals corporate secrets through the use of dream-sharing technology.'
    );
  });

  it('displays an error message if fetching movie details fails', async () => {
    // Arrange
    fetchMovieDetails.mockRejectedValue();

    // Act
    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router],
        mocks: {}
      }
    });
    await flushPromises();

    // Assert
    expect(wrapper.find('.details').exists()).toBeFalsy();
  });

  it('navigates back to the dashboard when the back button is clicked', async () => {
    // Arrange
    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router],
        mocks: {}
      }
    });

    // Act
    await wrapper.find('.back-button').trigger('click');

    // Assert
    expect(router.push).toHaveBeenCalledWith('/');
  });
});
