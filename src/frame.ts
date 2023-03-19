import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

class Frame {
  public readonly container: HTMLDivElement;
  private hasLoaded: boolean = false;
  private readonly image: HTMLImageElement;
  private readonly spinner: Spinner;
  private readonly getBlob: () => Promise<Blob>;
  private readonly getGenerated: (blob: Blob, frame: Frame) => Promise<Blob>;

  constructor(
    getBlob: () => Promise<Blob>,
    getGenerated: (blob: Blob, frame: Frame) => Promise<Blob>
  ) {
    this.getBlob = getBlob;
    this.getGenerated = getGenerated;
    this.container = document.createElement('div');
    this.container.addEventListener('click', () => {
      if (this.hasLoaded) {
        this.download();
      } else {
        this.getBlob()
          .then((blob) => {
            this.setImage(blob, true);
            return this.getGenerated(blob, this);
          })
          .then((blob) => {
            this.setImage(blob);
          });
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
