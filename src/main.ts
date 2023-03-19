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
        const frame = new Frame();
        group.appendChild(frame.container);
        frame.container.addEventListener('click', () => (
          viewport.getBlob()
            .then((blob) => {
              frame.setImage(blob);
              frame.setLoading(true);
              diffusion
                .generate(frame, blob)
                .then((blob) => {
                  frame.setImage(blob);
                  frame.setLoading(false);
                });
            })
        ));
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
