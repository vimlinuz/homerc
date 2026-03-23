// Modular Canvas Templates
window.CanvasTemplates = {
  blank: function(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  },

  lined: function(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#e3e3e3';
    ctx.lineWidth = 1;
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  },

  grid: function(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 1;
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  },

  dots: function(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#b0b0b0';
    for (let y = 20; y < height; y += 40) {
      for (let x = 20; x < width; x += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
};