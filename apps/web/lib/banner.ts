// Banner "NICO SKILLS" montado a partir de uma pixel-font 5x5.
// Vira uma grade de células para ser desenhada em SVG: o caractere "█" não existe
// no subset latin das fontes web e cairia numa fonte de fallback com largura errada.
const GLYPHS: Record<string, string[]> = {
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "#####"],
  C: ["#####", "#....", "#....", "#....", "#####"],
  O: ["#####", "#...#", "#...#", "#...#", "#####"],
  S: ["#####", "#....", "#####", "....#", "#####"],
  K: ["#...#", "#..#.", "###..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#####"],
  " ": ["..", "..", "..", "..", ".."],
};

export interface BannerGrid {
  width: number;
  height: number;
  cells: { x: number; y: number }[];
}

export function buildBanner(text: string): BannerGrid {
  const cells: { x: number; y: number }[] = [];
  let x = 0;
  for (const ch of text) {
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    glyph.forEach((row, y) => {
      [...row].forEach((c, dx) => {
        if (c === "#") cells.push({ x: x + dx, y });
      });
    });
    x += glyph[0].length + 1;
  }
  return { width: x - 1, height: 5, cells };
}

export const BANNER = buildBanner("NICO SKILLS");
