import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

class Frame {
  public readonly container: HTMLDivElement;
  private readonly image: HTMLImageElement;
  private readonly spinner: Spinner;

  constructor() {
    this.container = document.createElement('div');
    this.image = document.createElement('img');
    this.spinner = new Spinner({ color: '#eee' });
    this.container.addEventListener('contextmenu', this.download.bind(this));
  }

  private download() {
    const { image } = this;
    if (!image.src) {
      return;
    }
    const downloader = document.createElement('a');
    downloader.href = image.src;
    downloader.download = 'futurebooth.png';
    downloader.click();
  }

  setImage(blob: Blob) {
    const { container, image } = this;
    URL.revokeObjectURL(image.src);
    image.src = URL.createObjectURL(blob);
    if (image.parentNode !== container) {
      container.appendChild(image);
    }
  }

  setLoading(enabled: boolean) {
    const { container, spinner } = this;
    if (enabled) {
      container.classList.add('loading');
      spinner.spin(container);
    } else {
      container.classList.remove('loading');
      spinner.stop();
    }
  }
}

export default Frame;
