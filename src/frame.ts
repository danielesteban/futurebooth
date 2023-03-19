import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

class Frame {
  public readonly container: HTMLDivElement;
  public readonly button: HTMLButtonElement;
  private readonly image: HTMLImageElement;
  private readonly spinner: Spinner;

  constructor() {
    this.button = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = '>';
    icon.style.display = 'block';
    icon.style.transform = 'rotate(90deg)';
    this.button.appendChild(icon);
    this.button.addEventListener('click', this.download.bind(this));
    this.container = document.createElement('div');
    this.image = document.createElement('img');
    this.spinner = new Spinner({ color: '#eee' });
  }

  private download(e: MouseEvent) {
    const { image } = this;
    e.stopPropagation();
    const downloader = document.createElement('a');
    downloader.href = image.src;
    downloader.download = 'futurebooth.png';
    downloader.click();
  }

  setImage(blob: Blob) {
    const { container, button, image } = this;
    URL.revokeObjectURL(image.src);
    image.src = URL.createObjectURL(blob);
    if (image.parentNode !== container) {
      container.appendChild(image);
      container.appendChild(button);
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
