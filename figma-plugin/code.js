/**
 * Domo Banner Importer — Figma Plugin
 *
 * Imports SVG banners as fully editable vector layers in Figma.
 * Each SVG's named groups (Background, Logo, Headline, CTA, Illustration)
 * become separate editable layers.
 *
 * Uses figma.createNodeFromSvg() to preserve vector structure and text.
 *
 * Flow:
 * 1. Plugin UI fetches manifest + SVGs from localhost:8765
 * 2. Sends SVG strings to this code via postMessage
 * 3. This code creates editable Figma nodes from each SVG
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
        let node;

        if (banner.svgContent) {
          // SVG import — creates fully editable vector nodes
          node = figma.createNodeFromSvg(banner.svgContent);
          node.name = banner.slug;
          node.x = xOffset;
          node.y = 0;
        } else if (banner.imageBytes) {
          // PNG fallback — creates frame with image fill
          const frame = figma.createFrame();
          frame.name = banner.slug;
          frame.resize(banner.width, banner.height);
          frame.x = xOffset;
          frame.y = 0;

          const imageBytes = new Uint8Array(banner.imageBytes);
          const image = figma.createImage(imageBytes);
          frame.fills = [
            {
              type: "IMAGE",
              scaleMode: "FILL",
              imageHash: image.hash,
            },
          ];
          node = frame;
        }

        if (node) {
          xOffset += (node.width || banner.width) + SPACING;
          created.push(banner.slug);
        }

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
