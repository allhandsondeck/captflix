import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MovieItem from '@/components/MovieItem.vue';

describe('MovieItem.vue', () => {
  it('renders without errors', () => {
    // Arrange
    const movieProp = { name: 'Test Movie', image: null };

    // Act
    const wrapper = mount(MovieItem, {
      props: { movie: movieProp }
    });

    // Assert
    expect(wrapper.exists()).toBeTruthy();
  });

  it('displays movie name', () => {
    // Arrange
    const movieName = 'Test Movie';
    const movieProp = { name: movieName, image: null };

    // Act
    const wrapper = mount(MovieItem, {
      props: { movie: movieProp }
    });

    // Assert
    expect(wrapper.text()).toContain(movieName);
  });

  it('conditionally renders image tag', () => {
    // Arrange
    const movieWithImage = {
      name: 'Movie With Image',
      image: { medium: 'http://example.com/image.jpg' }
    };
    const movieWithoutImage = { name: 'Movie Without Image', image: null };

    // Act
    const wrapperWithImage = mount(MovieItem, {
      props: { movie: movieWithImage }
    });
    const wrapperWithoutImage = mount(MovieItem, {
      props: { movie: movieWithoutImage }
    });

    // Assert
    expect(wrapperWithImage.find('img').exists()).toBeTruthy();
    expect(wrapperWithoutImage.find('img').exists()).toBeFalsy();
  });
});
