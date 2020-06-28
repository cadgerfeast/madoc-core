import { render } from '@testing-library/svelte';
import Sitemap from '../../../src/routes/sitemap.svelte';

describe('Sitemap', () => {
  it('should render', () => {
    const { container } = render(Sitemap, {
      props: {
        sitemap: ['dummy-1', 'dumy2']
      }
    });
    expect(container.querySelector('a[href=dummy-1')).toBeDefined();
  });
});
