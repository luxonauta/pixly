# [Pixly](https://pixly.art) 👾

Free and open tools for effortless pixel assets creation. [Try it now →](https://pixly.art)

## Chyp8 (Composer) [WIP]

Simple 8-bit step sequencer.

## Edyt (Editor)

Simple pixel-art tool for creating sprites.

- **Drawing tools**
  - ✅ Brush and bucket fill tools;
  - ✅ Custom color picker with saveable palette;

- **Layer system**
  - ✅ Create, toggle, reorder, and merge layers;
  - ✅ Flexible layer management;

- **Canvas**
  - ✅ Predefined sizes (`8x8`, `16x16`, `32x32`);
  - ✅ Custom sizes (`8-64` pixels);
  - ✅ Size persistence;

- **Additional features**
  - ✅ Undo/Redo with keyboard shortcuts;
  - 🚧 Export capabilities;
  - 🚧 Local storage;
  - 🔲 Color harmonies;
  - 🔲 Shading mode;
  - 🔲 RotSprite rotation;
  - 🔲 Custom brushes;
  - 🔲 Blend modes;

### Local setup

```bash
# Clone the repository:
git clone https://github.com/luxonauta/pixly
cd pixly

# Install the dependencies:
npm install

# Start the development server:
npm run dev
```

Then, visit: [http://localhost:3000](http://localhost:3000);

### Basic Controls

- **Canvas**: choose preset sizes or create custom (`8x8` to `64x64`);
- **Drawing**: click/drag for pixels, bucket for fills;
- **Layers**: create, toggle, reorder, delete (minimum: 1);

### Shortcuts

- Undo: `Ctrl/Cmd + Z`;
- Redo: `Ctrl/Cmd + Y`;
- Clear: `Delete`;

## Tech Stack

- React;
- Next.js;
- Tailwind CSS;
- Heroicons;

## Contributing

1. Fork repository;
2. Create feature branch (`git checkout -b feature/amazing-feature`);
3. Commit changes (`git commit -m 'Add amazing feature'`);
4. Push branch (`git push origin feature/amazing-feature`);
5. Open Pull Request!
