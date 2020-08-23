
import { Badge, BadgeStyle, BadgeColor } from './data.ts';

export class BadgeService {
  constructor() {}

  async badge(badge: Badge): Promise<string> {
    switch(badge.style) {
      case BadgeStyle.Flat:
        return await this.flat(badge);
      default:
        return await this.plastic(badge);
    }
  }

  async plastic(badge: Badge): Promise<string> {
    // Map badge colors
    const keyCString = this.colorMap(badge.titleColor);
    const valCString = this.colorMap(badge.valueColor);
    // Map badge widths
    const keyW = badge.titleWidth;
    let valW = badge.valueWidth;

    // Plastic style gradient
    const gradientDef = `
    <linearGradient id="a" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    `;

    // Return different styles for mono badges
    if (badge.isMono)
      return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${keyW}" height="20">
        ${gradientDef}
        <rect rx="3" width="${keyW}" height="20" fill="${keyCString}"/>
        <rect rx="3" width="${keyW}" height="20" fill="url(#a)"/>
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="${keyW / 2}" y="15" fill="#010101" fill-opacity=".3">${badge.title}</text>
          <text x="${keyW / 2}" y="14">${badge.title}</text>
        </g>
      </svg>`;
    else {
      const dvs = badge.valueSource ? await this.dvsFetch(badge.valueSource ?? "") : null;
      valW = dvs ? dvs.length * 5.2 + 30 : badge.valueWidth;
      return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${keyW + valW}" height="20">
        ${gradientDef}
        <rect rx="3" width="${keyW + valW}" height="20" fill="${keyCString}"/>
        <rect rx="3" x="${keyW}" width="${valW}" height="20" fill="${valCString}"/>
        <rect rx="3" width="${keyW + valW}" height="20" fill="url(#a)"/>
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="${keyW / 2}" y="15" fill="#010101" fill-opacity=".3">${badge.title}</text>
          <text x="${keyW / 2}" y="14">${badge.title}</text>
          <text x="${keyW + (valW / 2)}" y="15" fill="#010101" fill-opacity=".3">${dvs ?? badge.value}</text>
          <text x="${keyW + (valW / 2)}" y="14">${dvs ?? badge.value}</text>
        </g>
      </svg>`;
    }
  }

  async flat(badge: Badge): Promise<string> {
    // Map badge colors
    const keyCString = this.colorMap(badge.titleColor);
    const valCString = this.colorMap(badge.valueColor);
    // Map badge widths
    const keyW = badge.titleWidth;
    let valW = badge.valueWidth;

    if (badge.isMono)
      return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${keyW}" height="20">
        <rect width="${keyW}" height="20" fill="${keyCString}"/>
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="${keyW / 2}" y="15" fill="#010101" fill-opacity=".3">${badge.title}</text>
          <text x="${keyW / 2}" y="14">${badge.title}</text>
        </g>
      </svg>`;
    else {
      const dvs = badge.valueSource ? await this.dvsFetch(badge.valueSource ?? "") : null;
      valW = dvs ? dvs.length * 5.2 + 30 : badge.valueWidth;
      return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${keyW + valW}" height="20">
        <rect width="${keyW + valW}" height="20" fill="${keyCString}"/>
        <rect x="${keyW}" width="${valW}" height="20" fill="${valCString}"/>
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="${keyW / 2}" y="15" fill="#010101" fill-opacity=".3">${badge.title}</text>
          <text x="${keyW / 2}" y="14">${badge.title}</text>
          <text x="${keyW + (valW / 2)}" y="15" fill="#010101" fill-opacity=".3">${dvs ?? badge.value}</text>
          <text x="${keyW + (valW / 2)}" y="14">${dvs ?? badge.value}</text>
        </g>
      </svg>`;
    }
  }

  private colorMap(color: BadgeColor): string {
    switch(color) {
      case BadgeColor.Simple:
        return "#555";
      case BadgeColor.Slate:
        return "#556";
      case BadgeColor.Seabed:
        return "#013";
      case BadgeColor.Subterranean:
        return "#111";
      case BadgeColor.Savannah:
        return "#AB2";
      case BadgeColor.Sahara:
        return "#F80";
      case BadgeColor.Sunset:
        return "#F20";
    }
  }

  private async dvsFetch(url: string): Promise<string | undefined> {
    return await fetch(url)
    .then(res => res.text())
    .catch(() => undefined);
  }
}