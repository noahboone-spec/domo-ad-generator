/**
 * Domo Banner Importer — Figma Plugin
 *
 * Creates a new page with banner frames, each filled with an imported image.
 * Fetches banner images from a local server (scripts/serve-for-figma.ts).
 *
 * Flow:
 * 1. Plugin UI fetches manifest from localhost:8765
 * 2. Downloads each banner PNG
 * 3. Sends image bytes to this code via postMessage
 * 4. This code creates frames and applies image fills
 */

figma.showUI(__html__, { width: 450, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-banners") {
    const { pageName, banners } = msg;

    // Create a new page for the banners
    const page = figma.createPage();
    page.name = pageName || "Generated Banners";
    figma.currentPage = page;

    let xOffset = 0;
    const SPACING = 60;
    const created = [];

    for (const banner of banners) {
      try {
        // Create the frame at exact banner dimensions
        const frame = figma.createFrame();
        frame.name = banner.slug;
        frame.resize(banner.width, banner.height);
        frame.x = xOffset;
        frame.y = 0;

        // Convert the byte array to Uint8Array and create a Figma image
        const imageBytes = new Uint8Array(banner.imageBytes);
        const image = figma.createImage(imageBytes);

        // Apply the image as a fill on the frame
        frame.fills = [
          {
            type: "IMAGE",
            scaleMode: "FILL",
            imageHash: image.hash,
          },
        ];

        xOffset += banner.width + SPACING;
        created.push(banner.slug);

        // Notify UI of progress
        figma.ui.postMessage({
          type: "progress",
          slug: banner.slug,
          done: created.length,
          total: banners.length,
        });
      } catch (err) {
        figma.ui.postMessage({
          type: "error",
          slug: banner.slug,
          message: String(err),
        });
      }
    }

    // Zoom to fit all frames
    if (page.children.length > 0) {
      figma.viewport.scrollAndZoomIntoView(page.children);
    }

    figma.ui.postMessage({
      type: "complete",
      count: created.length,
      pageName: page.name,
    });
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};
