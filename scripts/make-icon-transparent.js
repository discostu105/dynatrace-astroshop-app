const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../docs/assets/astroshop-logo.png');
const outputPath = path.join(__dirname, '../docs/assets/astroshop-icon.png');

sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    // Process pixels to make white transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If pixel is white or very close to white, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    // Create new image with transparent background
    return sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
  })
  .then(() => {
    console.log('Icon created successfully with transparent background at:', outputPath);
  })
  .catch(err => {
    console.error('Error processing image:', err);
    process.exit(1);
  });
