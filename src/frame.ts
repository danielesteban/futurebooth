import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

class Frame {
  public readonly container: HTMLDivElement;
  private hasLoaded: boolean = false;
  private readonly image: HTMLImageElement;
  private readonly spinner: Spinner;

  constructor(generate: () => Promise<{ preview: Blob, generated: Promise<Blob> }>) {
    this.container = document.createElement('div');
    this.container.addEventListener('click', () => {
      if (this.hasLoaded) {
        this.download();
      } else {
        generate()
          .then(({ preview, generated }) => {
            this.setImage(preview, true);
            return generated;
          })
          .then((generated) => (
            this.setImage(generated)
          ));
      }
    });
    this.image = document.createElement('img');
    this.spinner = new Spinner({ color: '#eee' });
  }

  private download() {
    const { image } = this;
    const downloader = document.createElement('a');
    downloader.href = image.src;
    downloader.download = 'futurebooth.png';
    downloader.click();
  }

  private setImage(blob: Blob, loading: boolean = false) {
    const { container, image, spinner } = this;
    this.hasLoaded = !loading;
    URL.revokeObjectURL(image.src);
    image.src = URL.createObjectURL(blob);
    if (image.parentNode !== container) {
      container.appendChild(image);
    }
    if (loading) {
      container.classList.add('loading');
      spinner.spin(container);
    } else {
      container.classList.remove('loading');
      spinner.stop();
    }
  }
}

export default Frame;
