// TextAlchemy Text Formatting Utilities
export interface TextStyle {
  name: string;
  category: 'top10' | 'more';
  convert: (text: string) => string;
}

export interface TextFormatterType {
  formatters: Record<string, TextStyle>;
  getTop10(): TextStyle[];
  getMoreStyles(): TextStyle[];
  getAllStyles(): TextStyle[];
  format(text: string, styleKey: string): string;
  getStyleInfo(styleKey: string): TextStyle | null;
  hasStyle(styleKey: string): boolean;
  getStylesByCategory(category: 'top10' | 'more'): TextStyle[];
  batchFormat(text: string, styleKeys: string[]): Record<string, string>;
  getRandomStyle(category?: 'top10' | 'more' | null): TextStyle | null;
  searchStyles(query: string): TextStyle[];
  getStyleCount(): number;
  validateText(text: string, maxLength?: number): { isValid: boolean; message?: string };
  getStylePreview(styleKey: string, sampleText?: string): string;
}

class TextFormatter implements TextFormatterType {
  formatters: Record<string, TextStyle> = {
    // Top 10 most popular styles
    bold: {
      name: "Bold",
      category: "top10",
      convert: (text: string) => {
        const bold: Record<string, string> = {
          'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
          'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
          '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
        };
        return text.split('').map(char => bold[char] || char).join('');
      }
    },
    italic: {
      name: "Italic",
      category: "top10",
      convert: (text: string) => {
        const italic: Record<string, string> = {
          'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
          'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
        };
        return text.split('').map(char => italic[char] || char).join('');
      }
    },
    cursive: {
      name: "Cursive",
      category: "top10",
      convert: (text: string) => {
        const cursive: Record<string, string> = {
          'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
          'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
        };
        return text.split('').map(char => cursive[char] || char).join('');
      }
    },
    strikethrough: {
      name: "Strikethrough",
      category: "top10",
      convert: (text: string) => text.split('').map(char => `${char}\u0336`).join(''),
    },
    monospace: {
      name: "Monospace",
      category: "top10",
      convert: (text: string) => {
        const mono: Record<string, string> = {
          'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
          'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
          '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
        };
        return text.split('').map(char => mono[char] || char).join('');
      }
    },
    bubble: {
      name: "Bubble Text",
      category: "top10",
      convert: (text: string) => {
        const bubble: Record<string, string> = {
          'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
          'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
          '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
        };
        return text.split('').map(char => bubble[char] || char).join('');
      }
    },
    square: {
      name: "Square Text",
      category: "top10",
      convert: (text: string) => {
        const square: Record<string, string> = {
          'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
          'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
        };
        return text.split('').map(char => square[char] || char).join('');
      }
    },
    upsideDown: {
      name: "Upside Down",
      category: "top10",
      convert: (text: string) => {
        const flipped: Record<string, string> = {
          'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
          'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
          '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
          '?': '¿', '!': '¡', '.': '˙', ',': "'", "'": ',', '"': '„', '(': ')', ')': '('
        };
        return text.split('').map(char => flipped[char] || char).reverse().join('');
      }
    },
    smallCaps: {
      name: "Small Caps",
      category: "top10",
      convert: (text: string) => {
        const smallCaps: Record<string, string> = {
          'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
        };
        return text.split('').map(char => smallCaps[char.toLowerCase()] || char).join('');
      }
    },
    tinyText: {
      name: "Tiny Text",
      category: "top10",
      convert: (text: string) => {
        const tiny: Record<string, string> = {
          'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
          'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
          '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
        };
        return text.split('').map(char => tiny[char] || char).join('');
      }
    },

    // Extended styles for "More" section
    fraktur: {
      name: "Fraktur",
      category: "more",
      convert: (text: string) => {
        const fraktur: Record<string, string> = {
          'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
          'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
        };
        return text.split('').map(char => fraktur[char] || char).join('');
      }
    },
    doubleStruck: {
      name: "Double Struck",
      category: "more",
      convert: (text: string) => {
        const double: Record<string, string> = {
          'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
          'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
          '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
        };
        return text.split('').map(char => double[char] || char).join('');
      }
    },
    underline: {
      name: "Underline",
      category: "more",
      convert: (text: string) => text.split('').map(char => `${char}\u0332`).join(''),
    },
    slashthrough: {
      name: "Slashthrough",
      category: "more",
      convert: (text: string) => text.split('').map(char => `${char}\u0338`).join(''),
    },
    sansSerif: {
      name: "Sans Serif",
      category: "more",
      convert: (text: string) => {
        const sans: Record<string, string> = {
          'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
          'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹',
          '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
        };
        return text.split('').map(char => sans[char] || char).join('');
      }
    },
    fullwidth: {
      name: "Fullwidth",
      category: "more",
      convert: (text: string) => {
        return text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(code + 65248);
          }
          return char;
        }).join('');
      }
    },
    squiggles: {
      name: "Squiggles",
      category: "more",
      convert: (text: string) => {
        const squiggles: Record<string, string> = {
          'a': 'ą', 'b': 'ҍ', 'c': 'ç', 'd': 'ժ', 'e': 'ҽ', 'f': 'ƒ', 'g': 'ց', 'h': 'հ', 'i': 'ì', 'j': 'ʝ', 'k': 'ҟ', 'l': 'Ӏ', 'm': 'ʍ', 'n': 'ղ', 'o': 'օ', 'p': 'ք', 'q': 'զ', 'r': 'ɾ', 's': 'ʂ', 't': 'է', 'u': 'մ', 'v': 'ѵ', 'w': 'ա', 'x': '×', 'y': 'վ', 'z': 'Հ',
          'A': 'Ⱥ', 'B': 'Ɓ', 'C': 'Ȼ', 'D': 'Đ', 'E': 'Ɇ', 'F': 'Ƒ', 'G': 'Ɠ', 'H': 'Ħ', 'I': 'Ɨ', 'J': 'Ɉ', 'K': 'Ҟ', 'L': 'Ł', 'M': 'Ɱ', 'N': 'Ň', 'O': 'Ø', 'P': 'Ᵽ', 'Q': 'Ɋ', 'R': 'Ɍ', 'S': 'Ş', 'T': 'Ŧ', 'U': 'Ʉ', 'V': 'V', 'W': 'Ⱳ', 'X': 'Ж', 'Y': 'Ɏ', 'Z': 'Ƶ'
        };
        return text.split('').map(char => squiggles[char] || char).join('');
      }
    },
    hearts: {
      name: "Hearts",
      category: "more",
      convert: (text: string) => text.split('').map(char => char === ' ' ? ' ' : `${char}♡`).join(''),
    },
    lightning: {
      name: "Lightning",
      category: "more",
      convert: (text: string) => text.split('').map(char => char === ' ' ? ' ' : `${char}⚡`).join(''),
    },
    diamonds: {
      name: "Diamonds",
      category: "more",
      convert: (text: string) => text.split('').map(char => char === ' ' ? ' ' : `${char}💎`).join(''),
    },
    clapback: {
      name: "Clapback",
      category: "more",
      convert: (text: string) => text.split(' ').join(' 👏 '),
    },
    airQuotes: {
      name: "Air Quotes",
      category: "more",
      convert: (text: string) => `"${text}"`,
    },
    ransom: {
      name: "Ransom Note",
      category: "more",
      convert: (text: string) => text.split('').map((char, index) => {
        if (char.match(/[a-zA-Z]/)) {
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }
        return char;
      }).join(''),
    },
    waves: {
      name: "Waves",
      category: "more",
      convert: (text: string) => text.split('').map(char => char === ' ' ? ' ' : `${char}~`).join(''),
    },
    stars: {
      name: "Stars",
      category: "more",
      convert: (text: string) => text.split('').map(char => char === ' ' ? ' ' : `${char}⭐`).join(''),
    }
  };

  getTop10(): TextStyle[] {
    return Object.values(this.formatters).filter(style => style.category === 'top10');
  }

  getMoreStyles(): TextStyle[] {
    return Object.values(this.formatters).filter(style => style.category === 'more');
  }

  getAllStyles(): TextStyle[] {
    return Object.values(this.formatters);
  }

  format(text: string, styleKey: string): string {
    const formatter = this.formatters[styleKey];
    if (!formatter) {
      throw new Error(`Unknown style: ${styleKey}`);
    }
    return formatter.convert(text);
  }

  getStyleInfo(styleKey: string): TextStyle | null {
    return this.formatters[styleKey] || null;
  }

  hasStyle(styleKey: string): boolean {
    return styleKey in this.formatters;
  }

  getStylesByCategory(category: 'top10' | 'more'): TextStyle[] {
    return Object.values(this.formatters).filter(style => style.category === category);
  }

  batchFormat(text: string, styleKeys: string[]): Record<string, string> {
    const results: Record<string, string> = {};
    styleKeys.forEach(key => {
      if (this.hasStyle(key)) {
        results[key] = this.format(text, key);
      }
    });
    return results;
  }

  getRandomStyle(category: 'top10' | 'more' | null = null): TextStyle | null {
    const styles = category ? this.getStylesByCategory(category) : this.getAllStyles();
    if (styles.length === 0) return null;
    return styles[Math.floor(Math.random() * styles.length)];
  }

  searchStyles(query: string): TextStyle[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.formatters).filter(style => 
      style.name.toLowerCase().includes(lowerQuery)
    );
  }

  getStyleCount(): number {
    return Object.keys(this.formatters).length;
  }

  validateText(text: string, maxLength: number = 500): { isValid: boolean; message?: string } {
    if (!text || text.trim().length === 0) {
      return { isValid: false, message: 'Text cannot be empty' };
    }
    if (text.length > maxLength) {
      return { isValid: false, message: `Text must be ${maxLength} characters or less` };
    }
    return { isValid: true };
  }

  getStylePreview(styleKey: string, sampleText: string = 'Sample'): string {
    if (!this.hasStyle(styleKey)) {
      return sampleText;
    }
    return this.format(sampleText, styleKey);
  }
}

// Export singleton instance
export const textFormatter = new TextFormatter();
export default textFormatter; 