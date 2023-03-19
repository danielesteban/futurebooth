import './main.css';
import Diffusion from './diffusion';
import Frame from './frame';
import Viewport from './viewport';

const diffusion = new Diffusion();
const viewport = new Viewport(512, 512);
const grid = document.getElementById('grid') as HTMLDivElement;
const images: Frame[] = [];
const prompt = document.createElement('textarea');
prompt.autocomplete = 'off';
prompt.value = [
  'closeup portrait',
  'concept art',
  'trending in artstation.',
].join(', ');
diffusion.setPrompt(prompt.value);
prompt.addEventListener('input', () => (
  diffusion.setPrompt(prompt.value)
));
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < 5; x++) {
    const group = document.createElement('div');
    if (y === 1 && x === 2) {
      group.appendChild(viewport.canvas);
      group.appendChild(prompt);
    } else {
      for (let i = 0; i < 4; i++) {
        const frame = new Frame(
          () => viewport.getBlob(),
          (blob: Blob, frame: Frame) => diffusion.generate(frame, blob)
        );
        group.appendChild(frame.container);
        images.push(frame);
      }
    }
    grid.appendChild(group);
  }
}
document.addEventListener('contextmenu', (e) => e.preventDefault());

const status: HTMLDivElement = document.getElementById('workers') as HTMLDivElement;
const refreshStatus = () => (
  diffusion.available()
    .then((workers) => {
      status.className = workers > 0 ? 'online' : 'offline';
      status.innerText = `${workers} available workers`;
    })
    .catch(() => {})
);
refreshStatus();
setInterval(refreshStatus, 60000);
